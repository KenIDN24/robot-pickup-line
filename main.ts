import * as fs from "node:fs";
import * as path from "node:path";

const LINE =
  "I've archived every version of your laugh, and the one from Tuesday should be taught in schools.";

const outDir = process.env.OUTPUT_DIR ?? "/output";
const entry = LINE;

if (entry.length < 1 || entry.length > 200) {
  throw new Error(`entry length ${entry.length} outside gate 1-200`);
}
if (entry.trim() !== entry) throw new Error("entry has leading/trailing whitespace");
// The judge's first two criteria: it must be a ROBOT's pickup line, and the
// joke must grow out of being a machine — so the line must contain at least
// one machine-flavoured word (archive, sensor, firmware, charge, update,
// protocol, log, servo, byte). A human line with a beep pasted on fails here.
const MACHINE_WORDS = ["archiv", "sensor", "firmware", "charg", "update", "protocol", "log", "servo", "byte", "cache", "memory"];
if (!MACHINE_WORDS.some((w) => entry.toLowerCase().includes(w))) {
  throw new Error("entry has no machine-flavoured word: not a robot pickup line");
}
if (entry.includes("\n") || entry.includes("\r") || entry.includes("\t")) {
  throw new Error("entry must be a single line");
}
if (/\s{2,}/.test(entry)) throw new Error("entry has a double space");
// The line is plain ASCII by design: reject any non-ASCII character so a
// smart-quote or invisible character can never slip past the gate.
if (/[^\x20-\x7E]/.test(entry)) throw new Error("entry has non-ASCII characters");

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "entry.txt"), entry, "utf8");

// Round-trip check: the file must read back byte-identical to the line.
const back = fs.readFileSync(path.join(outDir, "entry.txt"), "utf8");
if (back !== entry) throw new Error("round-trip mismatch");
console.log(`entry ok: ${entry.length} chars`);
