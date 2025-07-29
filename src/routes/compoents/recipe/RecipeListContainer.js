import React from "react";
import RecipeListPresenter from "./RecipeListPresenter";

const RecipeListContainer = ({ recipes }) => {
  return <RecipeListPresenter recipes={recipes} />;
};

export default RecipeListContainer;