# Network Basics Explorer

An interactive educational website that explains key computer networking concepts:
how checksums detect errors, how network devices are connected, which cables are used,
and how wireless connections work.

🔗 **Live website:** https://veeresh23-06.github.io/network-website/

---

## 📌 About the Project

This project was built for **VTU (Visvesvaraya Technological University)** to demonstrate basic
networking concepts in a simple, visual and interactive way. It is built with plain HTML, CSS
and JavaScript, with no frameworks or installation needed.

## ✨ Features

| Page | What it shows |
|---|---|
| **Home** | Overview and navigation to all sections |
| **Checksum** | Interactive checksum calculator with step-by-step working. Supports the 16-bit Internet checksum (used by IP/TCP/UDP) and a simple sum checksum. The receiver side can be corrupted to show error detection. |
| **Device Connections** | Clickable network diagram (PC, server, switch, router, access point, laptop, ISP) with a connection table showing the cable used for each link |
| **Wired Cables** | UTP, STP, coaxial, fiber (single/multi-mode), console, serial, straight-through and crossover cables, plus RJ-45 wiring standards |
| **Wireless** | Wi-Fi standards, how a Wi-Fi connection is made, and other wireless technologies (Bluetooth, cellular, satellite, Zigbee, LoRa and more) |

## 🗂️ Project Structure

```
network-website/
├── index.html        Home page
├── checksum.html     Checksum calculator
├── devices.html      Device connections diagram and table
├── cables.html       Wired cable types
├── wireless.html     Wireless technologies
├── css/
│   └── style.css     Shared dark-theme styling
└── js/
    ├── checksum.js   Checksum logic
    └── devices.js    Interactive diagram logic
```

## 🚀 How to Run Locally

1. Download or clone this repository:
```bash
   git clone https://github.com/Veeresh23-06/network-website.git
```
2. Open the folder and double-click `index.html`, or open it with the
   **Live Server** extension in VS Code.

No build step or dependencies are required.

## 🧮 How the Checksum Works

**Internet checksum (16-bit):**
1. Split the data into 16-bit words.
2. Add all the words; any carry beyond 16 bits is added back in.
3. Invert all bits to get the checksum.
4. The receiver adds the data and the checksum. A result of `0xFFFF` means the data is valid.

**Simple sum checksum:**
1. Add the value of every byte.
2. Take the total modulo 256.
3. The receiver repeats the calculation and compares.

## 🛠️ Technologies Used

- HTML5
- CSS3 (Flexbox, Grid, responsive design)
- JavaScript (no libraries)
- SVG for the interactive diagrams
- GitHub Pages for hosting

## 🔭 Future Work

- Simulation of packet drops, and simplex, half-duplex and full-duplex communication using **NS-2**
- CRC-32 checksum demonstration
- Quiz section for self-testing

## 👤 Author

**Veeresh**
VTU (Visvesvaraya
