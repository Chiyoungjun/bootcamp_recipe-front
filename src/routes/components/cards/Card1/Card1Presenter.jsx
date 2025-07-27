import React from "react";
import "./Card1.css";

const Card1Presenter = ({ recipe }) => (
  <div className="card">
    <img
      src={recipe.ATT_FILE_NO_MAIN || "/default_recipe.jpg"}
      alt={recipe.RCP_NM || "레시피 이미지"}
      className="card__img"
    />
    <div className="card__body">
      <div className="card__title">{recipe.RCP_NM || "이름없음"}</div>
      {/* <div className="card__rating">⭐⭐⭐⭐⭐</div>  추후 평점 구현 */}
    </div>
  </div>
);

export default Card1Presenter;
