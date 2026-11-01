Module.register('MMM-MyGarbage-BODK', {

  // Default values
  defaults: {
    alert: false,
    weeksToDisplay: 2,
    limitTo: 99,
    dateFormat: "dddd D MMMM",
    fade: true,
    fadePoint: 0.25     // Start on 1/4th of the list.
  },

  // Define stylesheet
  getStyles: function () {
    return ["MMM-MyGarbage-BODK.css"];
  },

  // Define required scripts.
  getScripts: function () {
    return ["moment.js"];
  },

  // Define required translations.
  getTranslations: function () {
    return {
      en: "translations/en.json",
      nl: "translations/nl.json",
      de: "translations/de.json",
      sv: "translations/sv.json",
      da: "translations/da.json"
    }
  },

  capFirst: function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  start: function () {
    Log.info('Starting module: ' + this.name);

    this.nextPickups = [];
    this.loaded = false;
    this.loadError = false;
    this.timer = null;
    this.getPickups();
  },

  // Read garbage_schedule.csv file
  getPickups: function () {
    clearTimeout(this.timer);
    this.timer = null;
    this.sendSocketNotification("MMM-MYGARBAGE-BODK-GET", { weeksToDisplay: this.config.weeksToDisplay, instanceId: this.identifier, alert: this.config.alert });

    //Set check times
    var self = this;
    this.timer = setTimeout(function () {
      self.getPickups();
    }, 60 * 60 * 1000); //update once an hour
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification == "MMM-MYGARBAGE-BODK-RESPONSE" + this.identifier) {
      this.nextPickups = payload;
      this.loaded = true;
      this.loadError = false;
      this.updateDom(1000);
    } else if (notification == "MMM-MYGARBAGE-BODK-ERROR" + this.identifier) {
      this.loadError = true;
      this.updateDom(1000);
    } else if (notification == "MMM-MYGARBAGE-BODK-NOENTRIES" + this.identifier) { //Pass Alert on
      this.sendNotification("SHOW_ALERT", {
        title: this.translate("GARBAGEENTRIESLEFT", { entriesLeft: payload }),
        message: this.translate("REMEMBERADDINGPICKUPS"),
        imageFA: "recycle",
        timer: "3000"
      });
    }
  },

  // Icons are styled with background images in the module stylesheet.
  iconFactory: function (glyph) {
    var icon = document.createElement("span");
    icon.className = "garbage-icon " + glyph;
    icon.setAttribute("role", "img");
    icon.setAttribute("aria-label", glyph);
    return icon;
  },
  getDom: function () {
    var wrapper = document.createElement("div");

    if (this.loadError || this.nextPickups.length == 0) {
      wrapper.textContent = this.translate(this.loadError ? "SCHEDULEERROR" : (this.loaded ? "NOPICKUPS" : "LOADING"));
      wrapper.className = "dimmed light small";
      return wrapper;
    }

    // Start Fade effect
    if (this.config.fade && this.config.fadePoint < 1) {
      if (this.config.fadePoint < 0) {
        this.config.fadePoint = 0;
      }
      var startFade = Math.min(this.nextPickups.length, this.config.limitTo) * this.config.fadePoint;
      var fadeSteps = Math.min(this.nextPickups.length, this.config.limitTo) - startFade;
    }
    var currentFadeStep = 0;
    // End Fade effect

    for (var i = 0; i < this.nextPickups.length; i++) {
      if (i == this.config.limitTo) {
        break;
      }

      var pickup = this.nextPickups[i];

      //Create CSS Elements
      var pickupContainer = document.createElement("div");
      pickupContainer.classList.add("garbage-container");

      //add pickup date
      var dateContainer = document.createElement("span");
      dateContainer.classList.add("garbage-date");

      //Formats Garbage Pickup Date
      moment.locale(config.language);
      var today = moment().startOf("day");
      var pickUpDate = moment(pickup.pickupDate);
      if (today.isSame(pickUpDate)) {
        dateContainer.innerHTML = this.translate("TODAY");
      } else if (moment(today).add(1, "days").isSame(pickUpDate)) {
        dateContainer.innerHTML = this.translate("TOMORROW");
      } else if (moment(today).add(7, "days").isAfter(pickUpDate)) {
        dateContainer.innerHTML = this.capFirst(pickUpDate.format("dddd"));
      } else {
        dateContainer.innerHTML = this.capFirst(pickUpDate.format(this.config.dateFormat));
      }

      pickupContainer.appendChild(dateContainer);

      //Add Garbage icons
      var iconContainer = document.createElement("span");
      iconContainer.classList.add("garbage-icon-container");
      
      if (pickup.Farligt) {
        iconContainer.appendChild(this.iconFactory("farlig"));
      }
      if (pickup.Glas) {
        iconContainer.appendChild(this.iconFactory("glas"));
      }
      if (pickup.Have) {
        iconContainer.appendChild(this.iconFactory("have"));
      }
      if (pickup.Mad) {
        iconContainer.appendChild(this.iconFactory("mad"));
      }
      if (pickup.Drikke) {
        iconContainer.appendChild(this.iconFactory("drikke"));
      }
      if (pickup.Metal) {
        iconContainer.appendChild(this.iconFactory("metal"));
      }
      if (pickup.Papir) {
        iconContainer.appendChild(this.iconFactory("papir"));
      }
      if (pickup.Pap) {
        iconContainer.appendChild(this.iconFactory("pap"));
      }
      if (pickup.Plast) {
        iconContainer.appendChild(this.iconFactory("plast"));
      }
      if (pickup.Rest) {
        iconContainer.appendChild(this.iconFactory("rest"));
      }
      if (pickup.Stor) {
        iconContainer.appendChild(this.iconFactory("stor"));
      }

      pickupContainer.appendChild(iconContainer);
      wrapper.appendChild(pickupContainer);

      // Start Fading
      if (i >= startFade) {	//fading
        currentFadeStep = i - startFade;
        pickupContainer.style.opacity = 1 - (1 / fadeSteps * currentFadeStep);
      }
      // End Fading

    };

    return wrapper;
  }

});
