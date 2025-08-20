import React from "react";
import "./Card2.css";

const Card2Presenter = ({ recipe, rank, size, cardClass, onClick }) => {
  if (!recipe) return null;

  return (
    <div
      className={`${cardClass} ${size}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {rank !== undefined && (
        <div className="card-rank">
          #{rank}
        </div>
      )}
      <div className="card-image">
        {recipe.img ? (
          <img src={recipe.img} alt={recipe.name} />
        ) : (
          <div className="no-image">이미지 없음</div>
        )}
      </div>
      <div className="card-content">
        <h3 className="card-title">{recipe.name}</h3>
        <div className="card-info">
          <span className="rating">⭐ {recipe.avg_rating.toFixed(1)}</span>
          <span className="rating-count">({recipe.rating_count})</span>
          <span className="view-count">👁️ {recipe.view_count}</span>
        </div>
      </div>
    </div>
  );
};

export default Card2Presenter;
