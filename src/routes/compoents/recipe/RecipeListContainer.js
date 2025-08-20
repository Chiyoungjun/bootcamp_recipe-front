import React, { useContext } from "react";
import RecipeListPresenter from "./RecipeListPresenter";
import { LoginContext } from "../../pages/common/SignIn/LoginContext";

const RecipeListContainer = ({ recipes, userRecipes }) => {
  const { user } = useContext(LoginContext);
  const userId = user?.user_id;

  return (
    <RecipeListPresenter
      recipes={recipes}
      userRecipes={userRecipes} // 사용자 레시피 프로퍼티 추가
      userId={userId}
    />
  );
};

export default RecipeListContainer;
