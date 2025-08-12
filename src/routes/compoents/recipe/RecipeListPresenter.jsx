import React from "react";
import Card1Container from "../Card1";
import "./Recipe.css";

const RecipeListPresenter = ({ recipes, userId }) => {
  if (!recipes || recipes.length === 0) {
    return null; // 기존에 return만 있던 문제를 null로 명확히 수정
  }

  return (
    <div className="recipe-list">
      {recipes.map((item, idx) => (
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
    </div>
  );
};

export default RecipeListPresenter;
