import { recipes } from "../../data/recipes";
import Header from "../Header/Header";
import RecipeList from "../RecipeList/RecipeList";
import "./App.css";
import { useState } from "react";

function App() {
  const [favorites, setFavorites] = useState(new Set<string>());
  const [query, setQuery] = useState("");
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(query.toLowerCase()),
  );

  function handleToggleFavorite(id: string) {
    const newSet = new Set(favorites);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setFavorites(newSet);
  }

  return (
    <div className="app">
      <Header />
      <main className="app__main">
        <div className="app__container">
          <h1 className="app__heading">Recipes</h1>
          <input
            type="search"
            placeholder="Search recipes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="app__search"
          />
          <RecipeList
            recipes={filteredRecipes}
            onToggleFavorite={handleToggleFavorite}
            favorites={favorites}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
