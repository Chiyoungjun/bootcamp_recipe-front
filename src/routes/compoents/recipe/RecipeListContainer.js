import React, { useContext } from "react";
import RecipeListPresenter from "./RecipeListPresenter";
import { LoginContext } from "../../pages/common/SignIn/LoginContext"; // 경로 주의

// recipes: [{id, name, image_url, avg_rating, rating_count, view_count, ...}]
const RecipeListContainer = ({ recipes }) => {
  const { user } = useContext(LoginContext);
  const userId = user?.user_id;

  return <RecipeListPresenter recipes={recipes} userId={userId} />;
};

export default RecipeListContainer;
