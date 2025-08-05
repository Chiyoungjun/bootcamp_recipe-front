import React, { useContext } from "react";
import Card1Container from "../../components/cards/Card1/Card1Container";
import { LoginContext } from "../../pages/common/SignIn/LoginContext"; // 경로 주의
import "./Recipe.css";

const RecipeListPresenter = ({ recipes }) => {
  const { user } = useContext(LoginContext);
  const userId = user?.user_id;

  if (!recipes || recipes.length === 0) {
    return 
  }

  return (
    <div className="recipe-list">
      {recipes.map((item, idx) => (
        <Card1Container
          key={item.id || item.RCP_SEQ || item.name || idx}
          recipe={{
            id: item.id || item.RCP_SEQ,                      // id 단일화
            name: item.name || item.RCP_NM,
            image_url: item.image_url || item.ATT_FILE_NO_MAIN,
            avg_rating: item.avg_rating ?? item.AVG_RATING ?? 0,
            rating_count: item.rating_count ?? item.RATING_COUNT ?? 0,
            view_count: item.view_count ?? item.VIEW_COUNT ?? 0,
            // 필요시 다른 속성들 추가
          }}
          userId={userId}
        />
      ))}
    </div>
  );
};

export default RecipeListPresenter;
