# Wichnachtswichteln

This project is exists to provide all memebers of family + friends and partners, who will celebrate chrismas with us, with the name they will be the secret santa for.

A json file will be provided, that will look something like this:
```json
{
    "ben": "hannah",
    "paul": "marion"
}
```

The key is the secret santa for the value.

## How it works

The user will enter their name in a text field. If it exists in the json, or is really similar. Then the user is shown who he/she is the secret santa for. 
Also the following is shown in a nicely formatted Text.

```
Hallo <name> und willkommen zum diesjährigen Weihnachtswichteln 🎄🎁,

du darfst diesmal <name> beschenken.

Regeln:
- Budeget: 30€.
- Sag niemanden wen du gezogen hast.
- Äh ja so einfach ist das.

Frohe Vorweihnachtszeit,
euer Weihnachtswichtel Ben
```

A button with the title "Gemerkt!" will show the text field again.

## Requirements
- The website is written in plain html, js, css.
- It is available in german and chinese (toggable with a minimalistic language switcher)
- It has a readme that tell paul not to peek at the names.