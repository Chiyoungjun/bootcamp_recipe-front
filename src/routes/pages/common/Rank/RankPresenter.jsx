import React from "react";
import Card1Container from "../../../components/cards/Card1/Card1Container";

import "./Rank.css";

const RankPresenter = ({ recipes, period, setPeriod, loading }) => {
  return (
    <div className="rank-page-bg">
      <div className="rank-header">
        <h2>Recipe</h2>
        <div className="rank-dropdown-wrap">
          <select
            className="rank-period-select"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            {["일간", "주간", "월간"].map((tab) => (
              <option key={tab} value={tab}>
                {tab}
              </option>
            ))}
          </select>
        </div>
      </div>
      {loading ? (
        <div className="rank-loading">로딩 중...</div>
      ) : (
        <div className="rank-recipe-list">
          {recipes.length === 0 ? (
            <div>레시피가 없습니다.</div>
          ) : (
            recipes.slice(0, 9).map((recipe) => (
              <Card1Container
                key={recipe.id || recipe.RCP_SEQ}
                recipe={{
                  id: recipe.id || recipe.RCP_SEQ,
                  name: recipe.name || recipe.RCP_NM,
                  image_url: recipe.image_url || recipe.ATT_FILE_NO_MAIN,
                  avg_rating: recipe.avg_rating ?? recipe.AVG_RATING ?? 0,
                  rating_count: recipe.rating_count ?? recipe.RATING_COUNT ?? 0,
                  view_count: recipe.view_count ?? recipe.VIEW_COUNT ?? 0,
                }}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default RankPresenter;
