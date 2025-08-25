import React, { useContext } from "react";
import Card2Presenter from "./Card2Presenter";
import axios from "axios";
import { LoginContext } from "../../pages/common/SignIn/LoginContext";

const BACKEND_URL = "http://localhost:8000";

const Card2Container = ({
  recipe,
  size = "default",
  cardClass = "user-recipe-card",
  rank,
  userId,
  fromMyPage = false,
  setSelectedMenu,    // 마이페이지 상태 전환용 함수
  setEditTarget,      // 수정 대상 레시피 설정용 함수
}) => {
  const { user } = useContext(LoginContext);
  const loginUserId = userId || user?.user_id;

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
    if (loginUserId && recipe.id) {
      try {
        await axios.post("http://localhost:8000/api/search-history", {
          user_id: loginUserId,
          user_recipe_id: recipe.id,
          search_word: name,
        });
      } catch (error) {
        console.error("검색 기록 저장 에러", error);
      }
    }

    // 마이페이지에서 카드 클릭: 사이드바와 함께 레시피 수정 화면으로
    if (loginUserId && fromMyPage && setSelectedMenu && setEditTarget) {
      setEditTarget(recipe);
      setSelectedMenu("recipeEdit");
    } else {
      // 그 외엔 상세페이지로 이동
      window.location.href = "/userrecipedetail?id=" + encodeURIComponent(id);
    }
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
