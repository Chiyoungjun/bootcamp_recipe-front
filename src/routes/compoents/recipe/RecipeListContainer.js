import React from "react";
import RecipeListPresenter from "./RecipeListPresenter";

// recipes: [{id, name, image_url, avg_rating, rating_count, view_count, ...}]
const RecipeListContainer = ({ recipes }) => {
  return <RecipeListPresenter recipes={recipes} />;
};

export default RecipeListContainer;
