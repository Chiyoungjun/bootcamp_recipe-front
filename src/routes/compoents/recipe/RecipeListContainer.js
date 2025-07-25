import React from "react";
import RecipeListPresenter from "./RecipeListPresenter";

const RecipeListContainer = ({ recipes }) => {
  console.log("RecipeListContainer recipes:", recipes);
  return <RecipeListPresenter recipes={recipes} />;
};

export default RecipeListContainer;
