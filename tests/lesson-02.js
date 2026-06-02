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

console.log("\nLesson 02: Tracking Selections with Sets\n");

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
const list = normalize(read("src/components/RecipeList/RecipeList.tsx"));
const card = normalize(read("src/components/RecipeCard/RecipeCard.tsx"));

test("App.tsx exists", () => {
  assert(app !== null, "src/components/App/App.tsx not found");
});

test("App imports useState", () => {
  assert(app.includes("useState"), 'App.tsx does not import "useState"');
});

test("App initializes favorites state with an empty Set", () => {
  assert(
    /useState[^(]*\(new Set/.test(app),
    "App.tsx does not initialize favorites with new Set() — expected useState<Set<string>>(new Set()) or useState(new Set<string>())",
  );
});

test("App defines handleToggleFavorite", () => {
  assert(
    app.includes("handleToggleFavorite"),
    "App.tsx does not define a handleToggleFavorite function",
  );
});

test("App checks membership with .has() inside handleToggleFavorite", () => {
  assert(
    app.includes(".has("),
    "App.tsx does not call .has() — handleToggleFavorite should check whether the id is already in the Set",
  );
});

test("App creates a new Set when toggling", () => {
  assert(
    app.includes("new Set("),
    "App.tsx does not create a new Set inside handleToggleFavorite — mutating the existing Set won't trigger a re-render",
  );
});

test("App copies favorites into the new Set", () => {
  assert(
    app.includes("new Set(favorites)"),
    "App.tsx does not call new Set(favorites) — the new Set must be initialized from the existing favorites, not from id or an empty Set"
  );
});

test("App calls the state setter inside handleToggleFavorite", () => {
  assert(
    app.includes("setFavorites("),
    "App.tsx does not call setFavorites() — the state setter must be called for React to re-render",
  );
});

test("App passes favorites to RecipeList", () => {
  assert(
    app.includes("favorites={favorites}"),
    "App.tsx does not pass favorites to <RecipeList> — expected favorites={favorites}",
  );
});

test("App passes onToggleFavorite to RecipeList", () => {
  assert(
    app.includes("onToggleFavorite={handleToggleFavorite}"),
    "App.tsx does not pass onToggleFavorite={handleToggleFavorite} to <RecipeList>",
  );
});

test("RecipeList.tsx exists", () => {
  assert(list !== null, "src/components/RecipeList/RecipeList.tsx not found");
});

test("RecipeList accepts favorites prop typed as Set<string>", () => {
  assert(
    list.includes("Set<string>"),
    "RecipeList.tsx Props type does not include favorites: Set<string>",
  );
});

test("RecipeList uses favorites.has() to derive isFavorited", () => {
  assert(
    list.includes("favorites.has("),
    "RecipeList.tsx does not call favorites.has() — isFavorited should be derived here, not passed from App",
  );
});

test("RecipeList forwards onToggleFavorite to RecipeCard", () => {
  assert(
    list.includes("onToggleFavorite={onToggleFavorite}"),
    "RecipeList.tsx does not forward onToggleFavorite to <RecipeCard>",
  );
});

test("RecipeCard.tsx exists", () => {
  assert(card !== null, "src/components/RecipeCard/RecipeCard.tsx not found");
});

test("RecipeCard accepts isFavorited prop", () => {
  assert(
    card.includes("isFavorited"),
    "RecipeCard.tsx Props type does not include isFavorited",
  );
});

test("RecipeCard accepts onToggleFavorite prop", () => {
  assert(
    card.includes("onToggleFavorite"),
    "RecipeCard.tsx Props type does not include onToggleFavorite",
  );
});

test("RecipeCard renders a favorite button that calls onToggleFavorite", () => {
  assert(
    card.includes("onToggleFavorite(recipe.id)"),
    "RecipeCard.tsx favorite button does not call onToggleFavorite(recipe.id)",
  );
});

test("Clicking the favorite button correctly toggles the recipe in and out of favorites", () => {
  const result = checkBehavior(root, "tests/lib/lesson-02.behavior.test.tsx");
  assert(result.ok, "Behavioral tests failed — run `npm test -- tests/lib/lesson-02.behavior.test.tsx` for details");
});

console.log(`\n${pass} passed, ${fail} failed`);
if (fail === 0) {
  const code = Buffer.from("cmI0LXNldHg=", "base64").toString();
  console.log(`\nVerification code: ${code}`);
}
if (fail > 0) process.exit(1);
