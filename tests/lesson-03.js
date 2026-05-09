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

console.log("\nLesson 03: Derived Values\n");

const app = read("src/components/App/App.tsx");

test("App.tsx exists", () => {
  assert(app !== null, "src/components/App/App.tsx not found");
});

test("App declares query state", () => {
  assert(
    app.includes('useState("")') || app.includes("useState('')"),
    'App.tsx does not declare a query state variable — expected useState("")'
  );
});

test("App derives filteredRecipes with .filter()", () => {
  assert(
    app.includes("filteredRecipes") && app.includes(".filter("),
    "App.tsx does not derive filteredRecipes using .filter()"
  );
});

test("filteredRecipes is a derived const, not stored in state", () => {
  assert(
    !app.includes("setFilteredRecipes"),
    "App.tsx defines setFilteredRecipes — filteredRecipes should be a derived const, not a state variable"
  );
});

test("App passes filteredRecipes (not recipes) to RecipeList", () => {
  assert(
    app.includes("recipes={filteredRecipes}"),
    'App.tsx does not pass filteredRecipes to <RecipeList> — expected recipes={filteredRecipes}'
  );
});

test("App renders a search input bound to query", () => {
  assert(
    app.includes("setQuery(") && app.includes('type="search"'),
    'App.tsx does not render a search input of type="search" that updates query state'
  );
});

console.log(`\n${pass} passed, ${fail} failed`);
if (fail === 0) {
  const code = Buffer.from("ZHY3LWZpbHQ=", "base64").toString();
  console.log(`\nVerification code: ${code}`);
}
if (fail > 0) process.exit(1);
