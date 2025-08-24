import React from "react";
import "./Card2.css";

// 별점 표시 함수
function renderStars(avg) {
  if (!avg || isNaN(avg)) return "☆☆☆☆☆";
  const stars = Math.round(avg);
  return (
    <>
      {"★".repeat(stars)}
      {"☆".repeat(5 - stars)}
    </>
  );
}

const Card2Presenter = ({
  recipe,
  rank,
  size = "default",
  cardClass = "user-recipe-card",
  onClick,
}) => (
  <div
    className={`${cardClass}${size === "large" ? " card--large" : ""}`}
    onClick={onClick}
    style={{ cursor: "pointer", position: "relative" }}
    role="button"
    tabIndex={0}
  >
    <div className="card__img-wrap" style={{ position: "relative" }}>
      {/* 랭킹 뱃지 표시 */}
      {rank !== undefined && (
        <div className={`card__rank-badge card__rank-badge--${rank}`}>
          {rank === 1 ? <>👑 1위</> : `${rank}위`}
        </div>
      )}
      <img
        src={recipe.img || "/default_recipe.jpg"}
        alt={recipe.name || "레시피 이미지"}
        className="card__img"
      />
    </div>
    <div className="card__body">
      <div className="card__title">{recipe.name || "이름없음"}</div>
      <div className="card__info-row">
        <span className="card__stars">{renderStars(recipe.avg_rating)}</span>
        <span className="card__rating-count">({recipe.rating_count || 0})</span>
        <span className="card__views">조회수 {recipe.view_count || 0}</span>
      </div>
    </div>
  </div>
);

export default Card2Presenter;
