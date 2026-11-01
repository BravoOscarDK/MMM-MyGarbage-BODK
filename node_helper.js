const NodeHelper = require("node_helper");
const fs = require("node:fs/promises");
const path = require("node:path");
const parse = require("csv-parse");
const moment = require("moment");

const wasteTypes = ["Farligt", "Glas", "Have", "Mad", "Drikke", "Metal", "Papir", "Pap", "Plast", "Rest", "Stor"];

module.exports = NodeHelper.create({
  start: function () {
    this.garbageScheduleCSVFile = path.join(this.path, "garbage_schedule.csv");
  },

  socketNotificationReceived: async function (notification, payload) {
    if (notification !== "MMM-MYGARBAGE-BODK-GET") return;
    try {
      // Read on each refresh so CSV edits do not require a restart.
      const rawData = await fs.readFile(this.garbageScheduleCSVFile, "utf8");
      const rows = await new Promise((resolve, reject) => {
        parse(rawData, { delimiter: ",", columns: true, trim: true, bom: true, skip_empty_lines: true }, (error, data) => {
          if (error) reject(error);
          else resolve(data);
        });
      });
      const schedule = rows.map((row) => {
        const date = moment(row.WeekStarting, "MM/DD/YY", true);
        if (!date.isValid()) throw new Error("Invalid WeekStarting date: " + row.WeekStarting);
        const pickup = { pickupDate: date.format("YYYY-MM-DD") };
        wasteTypes.forEach((type) => { pickup[type] = Boolean(row[type]) && row[type] !== "0"; });
        return pickup;
      }).sort((a, b) => a.pickupDate.localeCompare(b.pickupDate));
      const start = moment().startOf("day");
      const end = start.clone().add(payload.weeksToDisplay * 7, "days");
      const remaining = schedule.filter((pickup) => moment(pickup.pickupDate).isSameOrAfter(start));
      const next = remaining.filter((pickup) => moment(pickup.pickupDate).isBefore(end));
      this.sendSocketNotification("MMM-MYGARBAGE-BODK-RESPONSE" + payload.instanceId, next);
      if (payload.alert && remaining.length <= payload.alert) {
        this.sendSocketNotification("MMM-MYGARBAGE-BODK-NOENTRIES" + payload.instanceId, remaining.length);
      }
    } catch (error) {
      console.error("[MMM-MyGarbage-BODK] Cannot read schedule:", error.message);
      this.sendSocketNotification("MMM-MYGARBAGE-BODK-ERROR" + payload.instanceId);
    }
  }
});
