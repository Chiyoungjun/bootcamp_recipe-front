import React from "react";
import "./Card1.css";

// 별(평균) 렌더링 함수
function renderStars(avg) {
  if (!avg) return "☆☆☆☆☆";
  const stars = Math.round(avg);
  return (
    <>
      {"★".repeat(stars)}
      {"☆".repeat(5 - stars)}
    </>
  );
}

const Card1Presenter = ({ recipe, onClick }) => (
  <div className="card" onClick={onClick} style={{ cursor: "pointer" }}>
    <img
      src={recipe.img || "/default_recipe.jpg"}
      alt={recipe.name || "레시피 이미지"}
      className="card__img"
    />
    <div className="card__body">
      <div className="card__title">{recipe.name || "이름없음"}</div>
      
      {/* 별점/조회수 표시 */}
      <div className="card__info-row">
        <span className="card__stars">{renderStars(recipe.avg_rating)}</span>
        <span className="card__rating-count">
          ({recipe.rating_count || 0})
        </span>
        <span className="card__views">조회수 {recipe.view_count || 0}</span>
      </div>
    </div>
  </div>
);

export default Card1Presenter;


