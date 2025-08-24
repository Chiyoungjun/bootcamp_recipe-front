import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Card2Presenter from "./Card2Presenter";
import axios from "axios";
import { LoginContext } from "../../pages/common/SignIn/LoginContext"; // 추가

const BACKEND_URL = "http://localhost:8000";

const Card2Container = ({
  recipe,
  size = "default",
  cardClass = "user-recipe-card",
  rank,
  userId, // userId를 상위에서 prop으로 받으면 이거 써도 됨
}) => {
  const navigate = useNavigate();
  const { user } = useContext(LoginContext); // LoginContext에서 userId 받기
  const loginUserId = userId || user?.user_id; // prop 또는 context

  if (!recipe) return null;

  const id = recipe.id;
  const name = recipe.name || recipe.title || "이름 없음";

  let imgPath = recipe.image_url || recipe.thumbnail || recipe.imageUrl || "";
  if (imgPath) {
    imgPath = imgPath.replace(/\\/g, "/").trim();
    if (!/^https?:\/\//i.test(imgPath)) {
      if (!imgPath.startsWith("uploads/")) {
        imgPath = imgPath.startsWith("/") ? `uploads${imgPath}` : `uploads/${imgPath}`;
      }
      imgPath = `${BACKEND_URL}/${imgPath}`;
    }
  } else {
    imgPath = "/default_noimage.png";
  }

  const avg_rating = recipe.avg_rating ?? recipe.ratingAvg ?? 0;
  const rating_count = recipe.rating_count ?? recipe.ratingCount ?? 0;
  const view_count = recipe.view_count ?? recipe.views ?? 0;

  const handleCardClick = async () => {

  // 사용자 레시피 검색기록 저장 (id가 user_recipe_id로 들어감)
  if (loginUserId && recipe.id) {
    try {
      await axios.post("http://localhost:8000/api/search-history", {
        user_id: loginUserId,
        user_recipe_id: recipe.id,       // 여기서 user_recipe_id에 id 전달!
        search_word: name,               // 필요하면 name(레시피명) 같이 전달
      });
      // 기록 남긴 후 상세페이지 이동
    } catch (error) {
      // 에러 처리 원하는 대로
      console.error("검색 기록 저장 에러", error);
    }
  }

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
      rank={rank}
      cardClass={cardClass}
      onClick={handleCardClick}
    />
  );
};

export default Card2Container;
