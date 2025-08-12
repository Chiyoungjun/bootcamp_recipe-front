import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card1Presenter from "./Card1Presenter";

/*
 * Card1Container
 * props:
 *   - recipe: 레시피 정보 객체
 *   - userId: (필수) 현재 로그인된 유저 ID
 *   - rank: (옵션) 랭킹
 *   - size: (옵션) 카드 크기 ("large", "default")
 *   - cardClass: (옵션) 카드 최상위 div 클래스명 (ex. 'card', 'favorites-card')
 */
const Card1Container = ({
  recipe,
  userId,
  rank,
  size = "default",
  cardClass = "card"
}) => {
  const navigate = useNavigate();

  // 모든 네이밍 호환 처리
  const id = recipe.id || recipe.RCP_SEQ;
  const name = recipe.name || recipe.RCP_NM;
  const img = recipe.img || recipe.ATT_FILE_NO_MAIN || recipe.image_url;
  const avg_rating =
    recipe.avg_rating !== undefined
      ? recipe.avg_rating
      : recipe.AVG_RATING ?? 0;
  const rating_count =
    recipe.rating_count !== undefined
      ? recipe.rating_count
      : recipe.RATING_COUNT ?? 0;
  const view_count =
    recipe.view_count !== undefined
      ? recipe.view_count
      : recipe.VIEW_COUNT ?? 0;

  // 카드 클릭: 검색기록 저장 & 상세 이동
  const handleCardClick = async () => {
    try {
      // userId/레시피 id, name 있을 때만 저장
      if (userId && id && name) {
        await axios.post("http://localhost:8000/api/search-history", {
          user_id: userId,
          recipe_id: id,
          search_word: name,
        });
      } else {
        console.warn("userId/id/name 비어있음", { userId, id, name });
      }
    } catch (e) {
      console.error("검색 기록 저장 실패", e);
    }
    // 상세 페이지 이동
    navigate("/recipedetail", {
      state: {
        id: id,
        foodName: name,
      },
    });
  };

  // recipe prop 표준화 및 프레젠터로 위임
  return (
    <Card1Presenter
      recipe={{
        id,
        name,
        img,
        avg_rating,
        rating_count,
        view_count,
      }}
      rank={rank}
      size={size}
      cardClass={cardClass}
      onClick={handleCardClick}
    />
  );
};

export default Card1Container;