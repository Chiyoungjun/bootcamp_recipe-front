import React from "react";
import "./Rank.css";

const tabList = ["일간", "주간", "월간"];

function RecipeCard({ recipe }) {
  return (
    <div className="rank-recipe-card">
      <img src={recipe.img} alt={recipe.title} className="rank-recipe-img" />
      <div className="rank-recipe-info">
        <div className="rank-recipe-title-row">
          <span className="rank-recipe-title">{recipe.title}</span>
          <span className="rank-recipe-rank">Top {recipe.rank}</span>
        </div>
        <div className="rank-recipe-meta">
          <span className="rank-recipe-stars">★ {recipe.stars}</span>
          <span className="rank-recipe-views">조회수 {recipe.views}</span>
        </div>
      </div>
    </div>
  );
}

export default function RankPresenter({ recipes, period, setPeriod, loading }) {
  return (
    <div className="rank-page-bg">
      <div className="rank-header">
        <h2>Recipe</h2>
        <div className="rank-tabs">
          {tabList.map(tab => (
            <button
              key={tab}
              className={`rank-tab-btn${period === tab ? " active" : ""}`}
              onClick={() => setPeriod(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="rank-loading">로딩 중...</div>
      ) : (
        <div className="rank-recipe-list">
          {recipes.length === 0 ? (
            <div>레시피가 없습니다.</div>
          ) : (
            recipes.map(recipe => (
              <RecipeCard key={recipe.rank} recipe={recipe} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
