import React from "react";
import Card1Container from "../Card1";
import Card2Container from "../Card2";
import "./Recipe.css";

const RecipeListPresenter = ({ recipes, userRecipes = [], userId }) => {
  // 디버깅: 현재 받아온 userRecipes 전체 콘솔 출력
  if (
    (!recipes || recipes.length === 0) &&
    (!userRecipes || userRecipes.length === 0)
  ) {
    return 
  }

  return (
    <div className="recipe-list">
      {/* 기본 카드들 */}
      {recipes &&
        recipes.map((item, idx) => (
          <Card1Container
            key={item.id || item.RCP_SEQ || item.name || idx}
            recipe={{
              id: item.id || item.RCP_SEQ,
              name: item.name || item.RCP_NM,
              image_url: item.image_url || item.ATT_FILE_NO_MAIN,
              avg_rating: item.avg_rating ?? item.AVG_RATING ?? 0,
              rating_count: item.rating_count ?? item.RATING_COUNT ?? 0,
              view_count: item.view_count ?? item.VIEW_COUNT ?? 0,
            }}
            userId={userId}
          />
        ))}

      {/* 사용자 작성 카드들 */}
      {userRecipes &&
        userRecipes.map((userRecipe, idx) => (
          <Card2Container
            key={userRecipe.id || idx}
            recipe={userRecipe}
            size="default"
            cardClass="user-recipe-card"
          />
        ))
      }
    </div>
  );
};

export default RecipeListPresenter;
