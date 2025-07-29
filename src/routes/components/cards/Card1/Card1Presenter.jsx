import React from "react";
import "./Card1.css";

const Card1Presenter = ({ recipe, onClick }) => (
  <div className="card" onClick={onClick} style={{ cursor: "pointer" }}>
    <img
      src={recipe.ATT_FILE_NO_MAIN || "/default_recipe.jpg"}
      alt={recipe.RCP_NM || "레시피 이미지"}
      className="card__img"
    />
    <div className="card__body">
      <div className="card__title">{recipe.RCP_NM || "이름없음"}</div>
    </div>
  </div>
);

export default Card1Presenter;
