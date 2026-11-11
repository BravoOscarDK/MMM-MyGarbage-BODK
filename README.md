# MMM-MyGarbage-BODK

## Description

A garbage collection calendar for [MagicMirror²](https://github.com/MagicMirrorOrg/MagicMirror), maintained by [BODK](https://github.com/BravoOscarDK).

Displays upcoming collection dates with Danish waste sorting pictograms. Icons and layout are included in the module; no icon configuration in `custom.css` is required.

## Requirements

A working MagicMirror² installation and a Node.js version supported by that installation.

## Installation

Run these commands on the device running MagicMirror²:

```sh
cd ~/MagicMirror/modules
git clone https://github.com/BravoOscarDK/MMM-MyGarbage-BODK.git
cd MMM-MyGarbage-BODK
npm install
```

Keep the folder name `MMM-MyGarbage-BODK` unchanged. Complete the configuration below, then restart MagicMirror² using your usual startup method.

## Configuration

Add this entry to the `modules` array in MagicMirror²'s `config/config.js`:

```js
{
  module: "MMM-MyGarbage-BODK",
  position: "top_left",
  header: "Waste Collection",
  config: {
    language: "en",
    alert: 4,
    weeksToDisplay: 2,
    limitTo: 99,
    dateFormat: "dddd D MMMM",
    fade: true,
    fadePoint: 0.25
  }
}
```

Date labels follow this module's `language` option, which defaults to `"en"`. Use `language: "da"` in the module config for Danish. The wording inside the pictogram images remains Danish.

| Option | Default | Description |
| --- | --- | --- |
| `language` | `"en"` | Display language: English (`en`) or Danish (`da`). |
| `alert` | `false` | Warn when the number of remaining collection entries is at or below this threshold; use `false` to disable |
| `weeksToDisplay` | `2` | Number of weeks to display, starting today |
| `limitTo` | `99` | Maximum number of collection entries to display |
| `dateFormat` | `"dddd D MMMM"` | Moment date format for dates at least a week away |
| `fade` | `true` | Fade later collection entries |
| `fadePoint` | `0.25` | Point at which fading starts, from 0 to 1 |

### Collection schedule

Edit `garbage_schedule.csv` in the module directory. Use commas as separators and keep these column names:

```csv
WeekStarting,Farligt,Have,Stor,Pap,Papir,Plast,Drikke,Glas,Metal,Rest,Mad
11/02/26,0,0,0,0,0,0,0,0,0,1,1
11/04/26,0,0,0,0,1,1,1,0,0,0,0
```

- Dates use `MM/DD/YY`: `11/02/26` means November 2, 2026.
- Use `1` for a collection and `0` or an empty field for no collection.
- Each row represents one collection date.
- You can rearrange columns if you move each heading together with its values. Keep the headings unchanged, including capitalization.
- Rows are sorted by date automatically. Changing CSV column order does not change the icon order on screen.

The schedule is read every hour, so CSV edits do not require a restart. Empty periods display a message. File errors and invalid dates display an error message and are logged on the server.

`garbage_schedule_STANDARD.csv` is a reference template with helper comments. Remove those comments before using its rows in the live `garbage_schedule.csv`; the live CSV parser does not support trailing helper comments. Yearly backup files are kept locally and excluded from Git.

### Waste pictograms

The 11 SVG files are stored in `imgs/`. Their filenames and printed labels remain Danish. The table follows the column order in the schedule.

| Icon | CSV column | Description |
| --- | --- | --- |
| <img src="imgs/FARLIGT_AFFALD_rgb.svg" width="70" alt="Hazardous waste"> | `Farligt` | Hazardous waste |
| <img src="imgs/HAVEAFFALD_rgb.svg" width="70" alt="Garden waste"> | `Have` | Garden waste |
| <img src="imgs/STORSKRALD_rgb.svg" width="70" alt="Bulky waste"> | `Stor` | Bulky waste |
| <img src="imgs/PAP_rgb.svg" width="70" alt="Cardboard"> | `Pap` | Cardboard |
| <img src="imgs/PAPIR_rgb.svg" width="70" alt="Paper"> | `Papir` | Paper |
| <img src="imgs/PLAST_rgb.svg" width="70" alt="Plastic"> | `Plast` | Plastic |
| <img src="imgs/MAD-DRIKKEKARTONER_rgb.svg" width="70" alt="Food and beverage cartons"> | `Drikke` | Food and beverage cartons |
| <img src="imgs/GLAS_rgb.svg" width="70" alt="Glass"> | `Glas` | Glass |
| <img src="imgs/METAL_rgb.svg" width="70" alt="Metal"> | `Metal` | Metal |
| <img src="imgs/RESTAFFALD_rgb.svg" width="70" alt="Residual waste"> | `Rest` | Residual waste |
| <img src="imgs/MADAFFALD_rgb.svg" width="70" alt="Food waste"> | `Mad` | Food waste |

### Appearance

Colors, relative image paths and the 70 × 70 px icon size are defined in `MMM-MyGarbage-BODK.css`.

When upgrading from your previous setup, remove the old `.MMM-MyGarbage` icon block from `custom.css`.

## Language

English is the default, independently of the MagicMirror² global language. Set the language in this module's `config`:

```js
language: "en" // English (default); use "da" for Danish.
```

Unsupported languages fall back to English. Custom labels, device names and upstream data retain their configured or reported values. Technical logs and diagnostic errors are in English.

German (`de`), Swedish (`sv`) and Dutch (`nl`) collection translations are also supported. The pictograms contain original Danish labels; CSV column names and image filenames remain unchanged for compatibility.

## Updating

For an installation created with `git clone`:

```sh
cd ~/MagicMirror/modules/MMM-MyGarbage-BODK
git pull --ff-only
npm install
```

Restart MagicMirror² using your usual startup method. Keep your module settings in `~/MagicMirror/config/config.js`. If Git reports local changes or diverging branches, preserve those changes and resolve the issue before updating. A ZIP download or copied folder must be replaced manually or migrated to a Git clone before using `git pull`.

## Troubleshooting

Check `garbage_schedule.csv` for valid dates in `MM/DD/YY` format and unchanged column names. File errors appear on the display and in the server log. The schedule is read hourly; allow up to one hour for edits to appear.

## Validation

```sh
npm test
npm run check
```

Automated tests do not establish hardware compatibility. Verify the module on your own MagicMirror² installation.

## License

MIT. See [LICENSE](LICENSE) for license terms and attribution.
