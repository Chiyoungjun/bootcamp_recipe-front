import React from "react";
import { useNavigate } from "react-router-dom";
import Card1Presenter from "./Card1Presenter";

const Card1Container = ({ recipe }) => {
  const navigate = useNavigate();

  // 양쪽 필드 지원
  const id = recipe.RCP_SEQ || recipe.id;
  const name = recipe.RCP_NM || recipe.name;
  const img = recipe.ATT_FILE_NO_MAIN || recipe.image_url;

  // 추가: 조회수/별점
  const avg_rating = recipe.avg_rating !== undefined ? recipe.avg_rating : recipe.AVG_RATING;
  const rating_count = recipe.rating_count !== undefined ? recipe.rating_count : recipe.RATING_COUNT;
  const view_count = recipe.view_count !== undefined ? recipe.view_count : recipe.VIEW_COUNT;

  const handleCardClick = () => {
    navigate("/recipedetail", {
      state: {
        id,
        foodName: name,
      },
    });
  };

  return (
    <Card1Presenter
      recipe={{
        id,
        name,
        img,
        avg_rating: avg_rating || 0,
        rating_count: rating_count || 0,
        view_count: view_count || 0,
      }}
      onClick={handleCardClick}
    />
  );
};

export default Card1Container;


