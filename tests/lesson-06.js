import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function read(relPath) {
  try {
    return readFileSync(join(root, relPath), "utf8");
  } catch {
    return null;
  }
}

let pass = 0;
let fail = 0;

function test(label, fn) {
  try {
    fn();
    console.log(`✅ ${label}`);
    pass++;
  } catch (err) {
    console.log(`❌ ${label} — ${err.message}`);
    fail++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

console.log("\nLesson 06: Cleaning Up Effects\n");

const app = read("src/components/App/App.tsx");

test("App.tsx exists", () => {
  assert(app !== null, "src/components/App/App.tsx not found");
});

test("App stores the setTimeout return value", () => {
  assert(
    app.includes("const timeoutId") || app.includes("const id ="),
    "App.tsx does not store the setTimeout return value — you need the ID to clear it in the cleanup"
  );
});

test("App returns a cleanup function from the fetch useEffect", () => {
  assert(
    app.includes("return () =>") || app.includes("return () => {"),
    "App.tsx does not return a cleanup function from the fetch useEffect"
  );
});

test("App calls clearTimeout in the cleanup", () => {
  assert(
    app.includes("clearTimeout("),
    "App.tsx does not call clearTimeout() in the cleanup function"
  );
});

console.log(`\n${pass} passed, ${fail} failed`);
if (fail === 0) {
  const code = Buffer.from("Y3UzLWNsbnA=", "base64").toString();
  console.log(`\nVerification code: ${code}`);
}
if (fail > 0) process.exit(1);
