import { recipes } from "../../data/recipes";
import Header from "../Header/Header";
import { useState } from "react";
import RecipeList from "../RecipeList/RecipeList";
import "./App.css";

function App() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");

  function handleToggleFavorite(id: string) {
      const newFavorites = new Set(favorites);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      setFavorites(newFavorites);
  }

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(query.toLowerCase())
  );
  
  return (
    <div className="app">
      <Header />
      <main className="app__main">
        <div className="app__container">
          <h1 className="app__heading">Recipes</h1>
          
            <input
              className="app__search"
              type="search"
              placeholder="Search recipes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <RecipeList recipes={filteredRecipes} favorites={favorites} onToggleFavorite={handleToggleFavorite} />
      </main>
      </div>
  );
}

export default App;
