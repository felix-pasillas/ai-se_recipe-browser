import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { checkCompiles, checkBuilds, checkBehavior, normalize } from "./lib/utils.js";

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

console.log("\nLesson 04: Side Effects with useEffect\n");

const compiled = checkCompiles(root);
if (!compiled.ok) {
  console.log("❌ TypeScript compilation failed — fix all type errors before running tests\n");
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
const data = normalize(read("src/data/recipes.ts"));

test("App.tsx exists", () => {
  assert(app !== null, "src/components/App/App.tsx not found");
});

test("App imports useEffect", () => {
  assert(
    app.includes("useEffect"),
    'App.tsx does not import "useEffect" from React'
  );
});

test("App declares isLoading state starting at true", () => {
  assert(
    app.includes("useState(true)"),
    "App.tsx does not declare isLoading state — expected useState(true)"
  );
});

test("App declares recipes as state starting as an empty array", () => {
  assert(
    app.includes("useState<Recipe[]>([])") ||
      app.includes("useState<Recipe[]>([ ])"),
    "App.tsx does not declare recipes as useState<Recipe[]>([]) — it should start empty and be populated by the effect"
  );
});

test("App has a useEffect with an empty dependency array", () => {
  assert(
    app.includes("useEffect(") && app.includes("}, [])"),
    "App.tsx does not have a useEffect with an empty dependency array []"
  );
});

test("App uses setTimeout inside useEffect to simulate a fetch", () => {
  assert(
    app.includes("setTimeout("),
    "App.tsx does not use setTimeout inside useEffect to simulate a fetch"
  );
});

test("App calls setIsLoading(false) when the simulated fetch resolves", () => {
  assert(
    app.includes("setIsLoading(false)"),
    "App.tsx does not call setIsLoading(false) after the simulated fetch resolves"
  );
});

test("App conditionally renders a loading state when isLoading is true", () => {
  assert(
    app.includes("isLoading"),
    "App.tsx does not reference isLoading in the JSX to conditionally render a loading state"
  );
});

test("recipes source data is referenced as allRecipes in App", () => {
  const dataFileRenamed = data !== null && data.includes("allRecipes");
  const importAliased = app.includes("recipes as allRecipes");
  assert(
    dataFileRenamed || importAliased,
    'App.tsx does not reference the recipe data as "allRecipes" — either rename the export in src/data/recipes.ts, or use `import { recipes as allRecipes }` in App.tsx'
  );
});

test("Loading indicator appears on mount and disappears after fetch resolves", () => {
  const result = checkBehavior(root, "tests/lib/lesson-04.behavior.test.tsx");
  assert(result.ok, "Behavioral tests failed — run `npm test` for details");
});

console.log(`\n${pass} passed, ${fail} failed`);
if (fail === 0) {
  const code = Buffer.from("ZWY5LWxvYWQ=", "base64").toString();
  console.log(`\nVerification code: ${code}`);
}
if (fail > 0) process.exit(1);
