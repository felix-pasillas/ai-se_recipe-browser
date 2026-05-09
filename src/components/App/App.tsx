import { recipes } from "../../data/recipes";
import Header from "../Header/Header";
import RecipeList from "../RecipeList/RecipeList";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Header />
      <main className="app__main">
        <div className="app__container">
          <h1 className="app__heading">Recipes</h1>
          <RecipeList recipes={recipes} />
        </div>
      </main>
    </div>
  );
}

export default App;
