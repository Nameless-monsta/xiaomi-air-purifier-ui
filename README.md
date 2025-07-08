# Xiaomi Air Purifier Dashboard Card for Home Assistant

This project recreates the Xiaomi Air Purifier UI in Home Assistant using fully custom YAML and lightweight styling, replicating the glowing air ring and smart control buttons found in the official Mi Home app.

![Preview](preview.gif)  
*Aesthetic recreation with colour-adaptive ring, animated background, and dynamic speed control.*

---

## 🌫 Features

- 🟢 Pulsating animated air ring based on PM2.5
- 🟠 Air quality grading with µg/m³ units
- 🔴 Colour-coded controls that match air quality
- 💨 Mode toggle buttons: Power, Auto, Sleep, Favourite
- 📈 Smooth fan speed slider (0–14)
- 🎞 Custom HTML iframe with dynamic particle animation
- 100% YAML-based – no custom JS coding

---

## 🎨 Xiaomi PM2.5 Colour Coding

Xiaomi air purifiers use a colour-coded ring to indicate air quality based on PM2.5 levels:

| Air Quality  | PM2.5 Value (μg/m³) | Ring Colour   |
|--------------|----------------------|---------------|
| Good         | 0–75                 | Green/Teal    |
| Moderate     | 76–150               | Yellow/Orange |
| Poor         | 151+                 | Red           |

These thresholds are applied in both the glow ring and all button icon colours for a consistent UI.

---

## 🧱 Required HACS Cards

Please install the following via [HACS](https://hacs.xyz/):

- `button-card`
- `config-template-card`
- `my-slider-v2`
- `card-mod` (for advanced styling)

---

## 📂 File Structure

Place these in your Home Assistant configuration directory:

```
/config/
├── www/
│   └── dots_canvas.html      # HTML animated dot background
├── dashboards/
│   └── xiaomi_air.yaml       # The full vertical-stack YAML
```

Ensure `/config/www/dots_canvas.html` is accessible at `/local/dots_canvas.html`.

---

## 🔧 PM Animation Explained (iframe injection)

The animated background is a custom HTML file (`dots_canvas.html`) with dynamic control of the particles using PM2.5 values passed via the iframe `url`:

```yaml
type: custom:config-template-card
variables:
  pm: states['sensor.xiaomi_cpa4_4c01_pm25_density'].state
entities:
  - sensor.xiaomi_cpa4_4c01_pm25_density
card:
  type: iframe
  url: ${"/local/dots_canvas.html?pm25=" + pm}
```

In the HTML, JavaScript parses the `pm25` value and adjusts the particle density, colour, and speed accordingly:

```js
const pm25 = parseFloat(new URLSearchParams(window.location.search).get("pm25"));
```

This lets the iframe act as a live particle ring that adapts to real-world air quality data.

---

## 📋 YAML Preview

A full copy of the card YAML can be found in [`xiaomi_air.yaml`](./xiaomi_air.yaml).

You can also paste it directly into your dashboard as a `vertical-stack` card.

---

## 📌 To Do

- [ ] Add CO2/Temperature display
- [ ] Build Blueprint version for easier import
- [ ] Package it as a Home Assistant Dashboard resource

---

## 💬 Community

Drop a comment or feedback on the [Reddit thread](https://www.reddit.com/) (replace with real link).  
If there's enough interest, I’ll publish a step-by-step tutorial and make this a dashboard package!

---
