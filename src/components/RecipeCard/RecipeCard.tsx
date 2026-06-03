import type { Recipe } from "../../types";
import { categoryColors } from "../../data/recipes";

import "./RecipeCard.css";

type Props = {
  recipe: Recipe;
};

function RecipeCard({ recipe }: Props) {
  return (
    <article className="recipe-card">
      <span
        style={{
          backgroundColor: categoryColors[recipe.category.toLocaleLowerCase()],
        }}
        className="recipe-card__category"
      >
        {recipe.category}
      </span>
      <h2 className="recipe-card__title">{recipe.title}</h2>
      <p className="recipe-card__description">{recipe.description}</p>
    </article>
  );
}

export default RecipeCard;
