import React from "react";
import { useNavigate } from "react-router-dom";
import Card1Presenter from "./Card1Presenter";

const Card1Container = ({ recipe }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate("/recipedetail", { state: { id: recipe.RCP_SEQ } });
  };

  return (
    <div onClick={handleCardClick} style={{ cursor: "pointer" }}>
      <Card1Presenter recipe={recipe} />
    </div>
  );
};

export default Card1Container;
