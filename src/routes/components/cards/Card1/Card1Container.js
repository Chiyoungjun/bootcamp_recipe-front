import React from "react";
import { useNavigate } from "react-router-dom";
import Card1Presenter from "./Card1Presenter";

const Card1Container = ({ recipe }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate("/recipedetail", {
      state: {
        id: recipe.RCP_SEQ,
        foodName: recipe.RCP_NM,
      },
    });
  };

  return <Card1Presenter recipe={recipe} onClick={handleCardClick} />;
};

export default Card1Container;
