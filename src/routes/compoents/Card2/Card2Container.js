import React from "react";
import { useNavigate } from "react-router-dom";
import Card2Presenter from "./Card2Presenter";

const BACKEND_URL = "http://localhost:8000";

const Card2Container = ({
  recipe,
  size = "default",
  cardClass = "user-recipe-card",
}) => {
  const navigate = useNavigate();

  if (!recipe) return null;

  const id = recipe.id;
  const name = recipe.name || recipe.title || "이름 없음";

    let imgPath = recipe.image_url || recipe.thumbnail || recipe.imageUrl || "";
    // 모든 백슬래시를 슬래시로 변환
    imgPath = imgPath.replace(/\\/g, "/");

    // 이미 "uploads/"로 시작하면 그대로, 아니면 앞에 붙임
    if (imgPath && !imgPath.startsWith("http")) {
    if (!imgPath.startsWith("uploads/")) {
        imgPath = `uploads/${imgPath}`;
    }
    imgPath = `${BACKEND_URL}/${imgPath}`;
    }


  // 실제 경로 콘솔 출력하여 확인!
  console.log("imgPath:", imgPath);

  const avg_rating = recipe.avg_rating ?? recipe.ratingAvg ?? 0;
  const rating_count = recipe.rating_count ?? recipe.ratingCount ?? 0;
  const view_count = recipe.view_count ?? recipe.views ?? 0;

  const handleCardClick = () => {
    navigate("/userrecipedetail", {
      state: {
        id,
        foodName: name,
      },
    });
  };

  return (
    <Card2Presenter
      recipe={{
        id,
        name,
        img: imgPath,
        avg_rating,
        rating_count,
        view_count,
      }}
      size={size}
      cardClass={cardClass}
      onClick={handleCardClick}
    />
  );
};

export default Card2Container;
