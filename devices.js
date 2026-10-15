const NS = "http://www.w3.org/2000/svg";

const NODES = {
  pc:     { x: 110, y: 110, icon: "🖥️", label: "PC",
            name: "PC (Workstation)",
            role: "End device that sends and receives data through its network card (NIC) and RJ-45 port." },
  server: { x: 110, y: 310, icon: "🗄️", label: "Server",
            name: "Server",
            role: "Provides services such as web, file or DHCP. Usually wired for speed and reliability." },
  switch: { x: 330, y: 210, icon: "🔀", label: "Switch",
            name: "Switch (Layer 2)",
            role: "Learns MAC addresses and forwards frames only to the correct port. Each port is its own collision domain and runs full duplex." },
  router: { x: 550, y: 210, icon: "📶", label: "Router",
            name: "Router (Layer 3)",
            role: "Forwards packets between networks using its routing table. Decrements TTL and can apply ACLs and NAT." },
  ap:     { x: 330, y: 350, icon: "📡", label: "Access Point",
            name: "Wireless Access Point",
            role: "Bridges wireless clients to the wired LAN. Connected to the switch by UTP, often powered through PoE." },
  laptop: { x: 550, y: 350, icon: "💻", label: "Laptop",
            name: "Laptop (Wi-Fi client)",
            role: "Connects to the access point with its wireless adapter (802.11). No cable required." },
  cloud:  { x: 740, y: 210, icon: "☁️", label: "ISP / Internet",
            name: "ISP / Internet",
            role: "The service provider network, usually reached over fiber or another WAN link." }
};

const LINKS = [
  { a: "pc", b: "switch", kind: "wired", short: "Straight-through",
    cable: "UTP Cat6, straight-through", connector: "RJ-45", distance: "Up to 100 m",
    why: "PC and switch are different device types, so a straight-through cable is used." },
  { a: "server", b: "switch", kind: "wired", short: "Straight-through",
    cable: "UTP Cat6, straight-through", connector: "RJ-45", distance: "Up to 100 m",
    why: "Server and switch are different device types." },
  { a: "ap", b: "switch", kind: "wired", short: "UTP (PoE)",
    cable: "UTP Cat6, straight-through (Power over Ethernet)", connector: "RJ-45", distance: "Up to 100 m",
    why: "Carries data and can also deliver power to the access point." },
  { a: "switch", b: "router", kind: "wired", short: "Straight-through",
    cable: "UTP Cat6, straight-through", connector: "RJ-45", distance: "Up to 100 m",
    why: "Switch and router are different device types." },
  { a: "router", b: "cloud", kind: "fiber", short: "Fiber",
    cable: "Single-mode fiber optic", connector: "LC / SC", distance: "10 km to 40 km or more, depending on optics",
    why: "Fiber gives very high speed over long distances and is immune to electrical interference." },
  { a: "laptop", b: "ap", kind: "wireless", short: "Wi-Fi",
    cable: "Wi-Fi (802.11ac / ax)", connector: "None (radio, 2.4 / 5 GHz)", distance: "About 30 to 50 m indoors",
    why: "Radio waves replace the cable, so the laptop can move freely." }
];

const svg = document.getElementById("netSvg");
const panel = document.getElementById("infoPanel");

function el(tag, attrs, text) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (text !== undefined) e.textContent = text;
  return e;
}

function clearSelection() {
  svg.querySelectorAll(".selected").forEach(e => e.classList.remove("selected"));
}

function selectNode(id, group) {
  clearSelection();
  group.classList.add("selected");
  const n = NODES[id];
  const connected = LINKS
    .filter(l => l.a === id || l.b === id)
    .map(l => {
      const other = NODES[l.a === id ? l.b : l.a].label;
      return "<li><b>" + other + "</b> via " + l.cable + "</li>";
    }).join("");
  panel.innerHTML =
    "<h3>" + n.icon + " " + n.name + "</h3>" +
    "<p>" + n.role + "</p>" +
    "<p><b>Connected to:</b></p><ul>" + connected + "</ul>";
}

function selectLink(link, line) {
  clearSelection();
  line.classList.add("selected");
  const from = NODES[link.a].label, to = NODES[link.b].label;
  panel.innerHTML =
    "<h3>🔌 " + from + " ↔ " + to + "</h3>" +
    "<p><b>Cable / medium:</b> " + link.cable + "</p>" +
    "<p><b>Connector:</b> " + link.connector + "</p>" +
    "<p><b>Maximum distance:</b> " + link.distance + "</p>" +
    "<p><b>Why this one:</b> " + link.why + "</p>";
}

// Draw the links first so the devices sit on top of them
LINKS.forEach(l => {
  const a = NODES[l.a], b = NODES[l.b];
  const coords = { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
  const line = el("line", Object.assign({ class: "link " + l.kind }, coords));
  const hit = el("line", Object.assign({ class: "link-hit" }, coords));
  hit.addEventListener("click", () => selectLink(l, line));
  const label = el("text", {
    x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 - 6, class: "link-label"
  }, l.short);
  svg.append(line, hit, label);
});

Object.keys(NODES).forEach(id => {
  const n = NODES[id];
  const g = el("g", { class: "node", transform: "translate(" + n.x + "," + n.y + ")" });
  g.append(
    el("rect", { x: -45, y: -32, width: 90, height: 64, rx: 12 }),
    el("text", { class: "icon", y: -4 }, n.icon),
    el("text", { class: "lbl", y: 20 }, n.label)
  );
  g.addEventListener("click", () => selectNode(id, g));
  svg.appendChild(g);
});