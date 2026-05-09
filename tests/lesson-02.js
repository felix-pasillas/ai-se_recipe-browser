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

console.log("\nLesson 02: Tracking Selections with Sets\n");

const app = read("src/components/App/App.tsx");
const list = read("src/components/RecipeList/RecipeList.tsx");
const card = read("src/components/RecipeCard/RecipeCard.tsx");

test("App.tsx exists", () => {
  assert(app !== null, "src/components/App/App.tsx not found");
});

test("App imports useState", () => {
  assert(app.includes("useState"), 'App.tsx does not import "useState"');
});

test("App declares favorites as Set<string> state", () => {
  assert(
    app.includes("Set<string>"),
    "App.tsx does not declare a Set<string> state variable — expected useState<Set<string>>(new Set())"
  );
});

test("App defines handleToggleFavorite", () => {
  assert(
    app.includes("handleToggleFavorite"),
    "App.tsx does not define a handleToggleFavorite function"
  );
});

test("App creates a new Set when toggling", () => {
  assert(
    app.includes("new Set("),
    "App.tsx does not create a new Set inside handleToggleFavorite — mutating the existing Set won't trigger a re-render"
  );
});

test("App passes favorites to RecipeList", () => {
  assert(
    app.includes("favorites={favorites}"),
    'App.tsx does not pass favorites to <RecipeList> — expected favorites={favorites}'
  );
});

test("App passes onToggleFavorite to RecipeList", () => {
  assert(
    app.includes("onToggleFavorite={handleToggleFavorite}"),
    "App.tsx does not pass onToggleFavorite={handleToggleFavorite} to <RecipeList>"
  );
});

test("RecipeList.tsx exists", () => {
  assert(list !== null, "src/components/RecipeList/RecipeList.tsx not found");
});

test("RecipeList accepts favorites prop typed as Set<string>", () => {
  assert(
    list.includes("Set<string>"),
    "RecipeList.tsx Props type does not include favorites: Set<string>"
  );
});

test("RecipeList uses favorites.has() to derive isFavorited", () => {
  assert(
    list.includes("favorites.has("),
    "RecipeList.tsx does not call favorites.has() — isFavorited should be derived here, not passed from App"
  );
});

test("RecipeList forwards onToggleFavorite to RecipeCard", () => {
  assert(
    list.includes("onToggleFavorite={onToggleFavorite}"),
    "RecipeList.tsx does not forward onToggleFavorite to <RecipeCard>"
  );
});

test("RecipeCard.tsx exists", () => {
  assert(card !== null, "src/components/RecipeCard/RecipeCard.tsx not found");
});

test("RecipeCard accepts isFavorited prop", () => {
  assert(
    card.includes("isFavorited"),
    "RecipeCard.tsx Props type does not include isFavorited"
  );
});

test("RecipeCard accepts onToggleFavorite prop", () => {
  assert(
    card.includes("onToggleFavorite"),
    "RecipeCard.tsx Props type does not include onToggleFavorite"
  );
});

test("RecipeCard renders a favorite button that calls onToggleFavorite", () => {
  assert(
    card.includes("onToggleFavorite(recipe.id)"),
    "RecipeCard.tsx favorite button does not call onToggleFavorite(recipe.id)"
  );
});

console.log(`\n${pass} passed, ${fail} failed`);
if (fail === 0) {
  const code = Buffer.from("cmI0LXNldHg=", "base64").toString();
  console.log(`\nVerification code: ${code}`);
}
if (fail > 0) process.exit(1);
