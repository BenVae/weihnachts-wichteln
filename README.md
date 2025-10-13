# Weihnachtswichteln 🎄🎁

A simple, bilingual (German/Chinese) web application for Secret Santa gift exchange.

## ⚠️ WICHTIG FÜR PAUL / IMPORTANT FOR PAUL ⚠️

**Paul, bitte nicht in die Namen gucken! Das verdirbt die ganze Überraschung! 🎅**

**Paul, please don't peek at the names! It will ruin the surprise! 🎅**

---

## Features

- Clean, minimalistic design
- Bilingual support (German 🇩🇪 / Chinese 🇨🇳)
- Fuzzy name matching (handles typos and case differences)
- Simple, intuitive user interface
- Mobile responsive

## How It Works

1. Enter your name in the text field
2. Click "Anzeigen" (Show) or press Enter
3. See who you're the Secret Santa for
4. Read the rules
5. Click "Gemerkt!" (Got it!) to return to the input screen

## Setup

1. Clone this repository
2. Edit `names.json` with your Secret Santa assignments:
   ```json
   {
       "ben": "hannah",
       "paul": "marion"
   }
   ```
   The key is the Secret Santa, the value is who they gift to.

3. Open `index.html` in a web browser

## Files

- `index.html` - Main HTML structure
- `styles.css` - Styling and layout
- `script.js` - Application logic and bilingual support
- `names.json` - Secret Santa assignments (KEEP THIS SECRET!)

## Language Support

Toggle between German and Chinese using the language switcher in the top-right corner.

## Rules

- Budget: 30€
- Don't tell anyone who you drew
- That's it - simple!

---

**Frohe Vorweihnachtszeit! / 圣诞快乐！** 🎄
