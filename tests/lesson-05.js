import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { checkCompiles, checkBuilds, normalize } from "./lib/utils.js";

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

console.log("\nLesson 05: Effect Dependencies\n");

const compiled = checkCompiles(root);
if (!compiled.ok) {
  console.log(
    "❌ TypeScript compilation failed — fix all type errors before running tests\n",
  );
  console.log(compiled.output);
  process.exit(1);
}
console.log("✅ Project compiles without type errors");

const built = checkBuilds(root);
if (!built.ok) {
  console.log("❌ Vite build failed — the app does not run without errors\n");
  console.log(built.output);
  process.exit(1);
}
console.log("✅ App builds and runs without errors\n");

const app = normalize(read("src/components/App/App.tsx"));

test("App.tsx exists", () => {
  assert(app !== null, "src/components/App/App.tsx not found");
});

test("App reads favorites from localStorage on mount (lazy initializer)", () => {
  assert(
    app.includes("localStorage.getItem("),
    "App.tsx does not read from localStorage — use a useState lazy initializer to restore favorites on mount",
  );
});

test("App parses the stored value with JSON.parse", () => {
  assert(
    app.includes("JSON.parse("),
    "App.tsx does not call JSON.parse() to deserialize the stored favorites",
  );
});

test("App has a useEffect that syncs favorites to localStorage", () => {
  assert(
    app.includes("localStorage.setItem("),
    "App.tsx does not write to localStorage in a useEffect",
  );
});

test("App serializes the Set before storing (spread into an array and pass to JSON.stringify)", () => {
  assert(
    app.includes("JSON.stringify([...favorites])") ||
      app.includes("JSON.stringify(Array.from(favorites))") ||
      app.includes("JSON.stringify(Array.from("),
    "App.tsx does not serialize favorites before storing — Sets cannot be directly serialized to JSON; use JSON.stringify([...favorites]) or JSON.stringify(Array.from(favorites))",
  );
});

test("The localStorage sync effect lists favorites as a dependency", () => {
  assert(
    app.includes("[favorites]"),
    "App.tsx does not include [favorites] as the dependency array for the localStorage sync effect",
  );
});

console.log(`\n${pass} passed, ${fail} failed`);
if (fail === 0) {
  const code = Buffer.from("bHMyLXN5bmM=", "base64").toString();
  console.log(`\nVerification code: ${code}`);
}
if (fail > 0) process.exit(1);
