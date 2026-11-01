# MMM-MyGarbage-BODK

Affaldskalender til [MagicMirror²](https://github.com/MagicMirrorOrg/MagicMirror), vedligeholdt af BODK.
Viser afhentningsdatoer med danske affaldspiktogrammer. Ikoner og layout følger med modulet; særskilt ikonopsætning i `custom.css` er ikke nødvendig.



## Installation

Klon projektet fra BODK, og installér afhængighederne:

```sh
cd ~/MagicMirror/modules
git clone https://github.com/BravoOscarDK/MMM-MyGarbage-BODK.git
cd MMM-MyGarbage-BODK
npm install
```

Brug den Node.js-version, din MagicMirror²-version kræver. Koden er gennemgået mod MagicMirror² master, men er endnu ikke testet i en kørende MagicMirror²-installation.

## Konfiguration

Tilføj i `modules` i MagicMirrors `config/config.js`:

```js
{
  module: "MMM-MyGarbage-BODK",
  position: "top_left",
  header: "Affaldskalender",
  config: {
    alert: 4,
    weeksToDisplay: 2,
    limitTo: 99,
    dateFormat: "dddd D MMMM",
    fade: true,
    fadePoint: 0.25
  }
}
```

Sæt MagicMirrors globale `language` til `"da"` for dansk visning.

| Indstilling | Betydning | Standard |
| --- | --- | --- |
| `alert` | Advarsel ved højst dette antal fremtidige afhentninger; `false` slår den fra | `false` |
| `weeksToDisplay` | Antal uger frem, fra og med i dag | `2` |
| `limitTo` | Højeste antal viste afhentninger | `99` |
| `dateFormat` | Moment-format for datoer længere fremme | `"dddd D MMMM"` |
| `fade` | Nedton senere afhentninger | `true` |
| `fadePoint` | Startpunkt for nedtoning, mellem 0 og 1 | `0.25` |

## Afhentningsplan

Redigér `garbage_schedule.csv` i modulets mappe. Filen skal bruge komma som separator og følgende kolonner:

```csv
WeekStarting,Farligt,Glas,Have,Mad,Drikke,Metal,Papir,Pap,Plast,Rest,Stor
11/02/26,0,0,0,1,0,0,0,0,0,1,0
11/04/26,0,0,0,0,1,0,1,0,1,0,0
```

Datoformatet er `MM/DD/YY`: `11/02/26` betyder 2. november 2026.
`0` eller et tomt felt betyder ingen afhentning; brug `1` for afhentning.
`Drikke` er mad- og drikkekartoner. Én række svarer til én afhentningsdato.

Planen læses hver time. Rækker sorteres efter dato. En tom periode vises med en besked; læsefejl og ugyldige datoer vises som en fejlbesked og logges på serveren.

## Ikoner og layout

De 11 SVG-billeder ligger i `imgs/`. Farver, relative billedstier og størrelsen 70 × 70 px defineres i `MMM-MyGarbage-BODK.css`.
Fjern den tidligere `.MMM-MyGarbage`-blok fra `custom.css` efter opgradering.

## Kontrol

```sh
npm run check
```

Dette kontrollerer JavaScript-syntaks. Kontrollér også visningen på dit MagicMirror.

## Licens

MIT. Se [LICENSE](LICENSE) for copyrightmeddelelser og licensvilkår.
