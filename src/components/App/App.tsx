import { allRecipes } from "../../data/recipes";
import Header from "../Header/Header";
import { useEffect,useState } from "react";
import type { Recipe } from "../../types";
import RecipeList from "../RecipeList/RecipeList";
import "./App.css";

function App() {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      return new Set<string>(JSON.parse(stored));
    }
    return new Set<string>();
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify([...favorites]));
  }, [favorites]);

  const [isLoading, setIsLoading] = useState(true);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setRecipes(allRecipes);
      setIsLoading(false);
    }, 500);
  }, []);

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
          {isLoading ? (
            <p className="app__loading">Loading recipes...</p>
          ) : (
            <RecipeList recipes={filteredRecipes} favorites={favorites} onToggleFavorite={handleToggleFavorite} />
          )}
      </main>
      </div>
  );
}

export default App;
