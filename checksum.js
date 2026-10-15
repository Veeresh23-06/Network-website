const DESCRIPTIONS = {
  internet: "16-bit one's complement sum, inverted. This is the method used in IP, TCP and UDP headers. The receiver gets 0xFFFF when the data is intact.",
  simple: "Adds all byte values and keeps the total modulo 256. Easy to understand, but weak: it cannot detect swapped characters."
};

const $ = id => document.getElementById(id);
const hex = (n, len = 4) => "0x" + n.toString(16).toUpperCase().padStart(len, "0");
const bin16 = n => n.toString(2).padStart(16, "0").replace(/(.{4})(?=.)/g, "$1 ");

function toBytes(text) {
  return Array.from(new TextEncoder().encode(text));
}

function toWords(bytes) {
  const b = bytes.slice();
  if (b.length % 2 === 1) b.push(0);              // pad with 0x00 if odd
  const words = [];
  for (let i = 0; i < b.length; i += 2) words.push((b[i] << 8) | b[i + 1]);
  return words;
}

// One's complement addition: any carry out of 16 bits wraps around
function addWithWrap(words, steps) {
  let sum = 0;
  words.forEach(w => {
    sum += w;
    let line = "Add " + hex(w) + " → " + hex(sum, 5);
    if (sum > 0xFFFF) {
      sum = (sum & 0xFFFF) + 1;
      line += "  (carry wraps around) → " + hex(sum);
    }
    steps.push(line);
  });
  return sum;
}

function internetSum(text, steps, extraWord) {
  const bytes = toBytes(text);
  const words = toWords(bytes);
  steps.push("Bytes: " + bytes.map(b => hex(b, 2)).join(" "));
  if (bytes.length % 2 === 1) steps.push("Odd number of bytes → padded with 0x00");
  steps.push("16-bit words: " + words.map(w => hex(w)).join(" "));
  if (extraWord !== undefined) {
    steps.push("Received checksum added as the last word: " + hex(extraWord));
    words.push(extraWord);
  }
  steps.push("");
  return addWithWrap(words, steps);
}

function simpleSum(text, steps) {
  const bytes = toBytes(text);
  steps.push("Bytes: " + bytes.map(b => hex(b, 2)).join(" "));
  steps.push("");
  let total = 0;
  bytes.forEach(b => {
    total += b;
    steps.push("Add " + hex(b, 2) + " (" + b + ") → running total " + total);
  });
  return total;
}

function setVerdict(message, state) {
  const v = $("verdict");
  v.textContent = message;
  v.className = "verdict" + (state ? " " + state : "");
}

function methodChanged() {
  $("methodDesc").textContent = DESCRIPTIONS[$("method").value];
  $("senderChecksum").textContent = "—";
  $("senderSteps").textContent = 'Press "Calculate checksum" to see the working.';
  $("receiverSteps").textContent = "";
  $("recvChecksum").value = "";
  setVerdict("Waiting for verification…", "");
}

function calculate() {
  const text = $("dataInput").value;
  const method = $("method").value;
  if (!text) {
    $("senderSteps").textContent = "Please type some data first.";
    return;
  }

  const steps = [];
  let checksumText;

  if (method === "internet") {
    const sum = internetSum(text, steps);
    const checksum = (~sum) & 0xFFFF;
    steps.push("");
    steps.push("Sum          = " + hex(sum) + "  (" + bin16(sum) + ")");
    steps.push("Invert bits  = " + hex(checksum) + "  (" + bin16(checksum) + ")");
    steps.push("→ Checksum   = " + hex(checksum));
    checksumText = hex(checksum);
  } else {
    const total = simpleSum(text, steps);
    const checksum = total % 256;
    steps.push("");
    steps.push("Total " + total + " mod 256 = " + checksum);
    steps.push("→ Checksum = " + hex(checksum, 2));
    checksumText = hex(checksum, 2);
  }

  $("senderChecksum").textContent = checksumText;
  $("senderSteps").textContent = steps.join("\n");

  // "Send" the packet to the receiver
  $("recvData").value = text;
  $("recvChecksum").value = checksumText;
  $("receiverSteps").textContent = "";
  setVerdict("Packet received. Press Verify.", "");
}

function verify() {
  const method = $("method").value;
  const text = $("recvData").value;
  const received = parseInt($("recvChecksum").value.trim(), 16);

  if (!text || Number.isNaN(received)) {
    setVerdict("Enter the received data and a hex checksum first.", "");
    return;
  }

  const steps = [];
  let ok;

  if (method === "internet") {
    const sum = internetSum(text, steps, received & 0xFFFF);
    steps.push("");
    steps.push("Final sum = " + hex(sum) + "  (" + bin16(sum) + ")");
    steps.push("Valid only if the result is 0xFFFF (all 1s).");
    ok = (sum === 0xFFFF);
  } else {
    const total = simpleSum(text, steps);
    const calc = total % 256;
    steps.push("");
    steps.push("Total " + total + " mod 256 = " + calc);
    steps.push("Received checksum = " + received);
    ok = (calc === received);
  }

  $("receiverSteps").textContent = steps.join("\n");
  if (ok) {
    setVerdict("✔ VALID: checksums match, no error detected. Packet accepted.", "ok");
  } else {
    setVerdict("✖ CORRUPTED: checksum mismatch. Packet dropped.", "bad");
  }
}

// Simulate a transmission error: change one random character
function corrupt() {
  const el = $("recvData");
  const v = el.value;
  if (!v) return;
  const i = Math.floor(Math.random() * v.length);
  el.value = v.slice(0, i) + String.fromCharCode(v.charCodeAt(i) + 1) + v.slice(i + 1);
  setVerdict("Data changed in transit. Press Verify.", "");
}

// Swap two characters: the simple sum cannot detect this
function swapChars() {
  const el = $("recvData");
  const v = el.value;
  if (v.length < 2) return;
  el.value = v[1] + v[0] + v.slice(2);
  setVerdict("First two characters swapped. Press Verify.", "");
}

methodChanged();