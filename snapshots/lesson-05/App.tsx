import { allRecipes } from "../../data/recipes";
import Header from "../Header/Header";
import RecipeList from "../RecipeList/RecipeList";
import "./App.css";
import { useState } from "react";
import { useEffect } from "react";
import type { Recipe } from "../../types";




function App() {

  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? new Set<string>(JSON.parse(stored)) : new Set<string>();
  });
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const filteredRecipes = recipes.filter((recipe) => recipe.title.toLowerCase().includes(query.toLowerCase()));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setRecipes(allRecipes);
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    const favoritesJSON = JSON.stringify([...favorites]);
    localStorage.setItem("favorites", favoritesJSON);
  }, [favorites]);

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
          {isLoading ? <p className="app__loading">Loading recipes...</p> : <RecipeList recipes={filteredRecipes} onToggleFavorite={handleToggleFavorite} favorites={favorites}  />}
        </div>
      </main>
    </div>
  );
}

export default App;
