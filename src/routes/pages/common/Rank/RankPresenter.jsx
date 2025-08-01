import React from "react";
// import Card from '../../../components/cards/Card/Card';
import Card1Container from "../../../components/cards/Card1/Card1Container";

import "./Rank.css";

export default function RankPresenter({ recipes, period, setPeriod, loading }) {
  return (
    <div className="rank-page-bg">
      <div className="rank-header">
        <h2>Recipe</h2>
        <div className="rank-dropdown-wrap">
          <select
            className="rank-period-select"
            value={period}
            onChange={e => setPeriod(e.target.value)}
          >
            {["일간", "주간", "월간"].map(tab => (
              <option key={tab} value={tab}>{tab}</option>
            ))}
          </select>
        </div>
      </div>
      {loading ? (
        <div className="rank-loading">로딩 중...</div>
      ) : (
        <div className="rank-recipe-list">
          {/* {recipes.length === 0 ? (
            <div>레시피가 없습니다.</div>
          ) : (
            recipes.slice(0,3).map(recipe => (
              <Card1Container
                // key={recipe.rank || recipe.id}
                image={recipe.img}
                title={recipe.title}
                // stars={recipe.stars}
                // views={recipe.views}
              />
            ))
          )} */}
        </div>
      )}
    </div>
  );
}