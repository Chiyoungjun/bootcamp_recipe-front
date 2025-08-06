import React, { useEffect, useState, useMemo, useContext } from "react";
import { useLocation } from "react-router-dom";
import RecipeDetailPresenter from "./RecipeDetailPresenter"; // 프레젠터 컴포넌트 임포트
import { LoginContext } from "../SignIn/LoginContext";

// ---------------------------
// 모달 컴포넌트 (별도 파일 없이 여기서 정의)
// ---------------------------
const StarRatingModal = ({ visible, rating, onClose, onSubmit }) => {
  const [tempRating, setTempRating] = useState(rating || 0);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    setTempRating(rating || 0); // 모달 열릴 때마다 초기화
  }, [rating, visible]);

  if (!visible) return null;

  const handleSubmit = () => {
    if (tempRating > 0) {
      onSubmit(tempRating);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      aria-modal={true}
      role="dialog"
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "8px",
          width: "320px",
          textAlign: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        <h3 style={{ marginBottom: 16 }}>별점을 선택하세요</h3>
        <div style={{ marginBottom: 24 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setTempRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              style={{
                color: star <= (hover || tempRating) ? "#f5a623" : "#ddd",
                fontSize: "36px",
                cursor: "pointer",
                userSelect: "none",
                marginRight: 4,
              }}
              aria-label={`${star}점 별점 선택`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setTempRating(star);
              }}
            >
              ★
            </span>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          disabled={tempRating === 0}
          style={{
            padding: "8px 24px",
            fontSize: "16px",
            cursor: tempRating === 0 ? "not-allowed" : "pointer",
            marginRight: 12,
          }}
        >
          확인
        </button>
        <button
          onClick={onClose}
          style={{ padding: "8px 24px", fontSize: "16px", cursor: "pointer" }}
        >
          취소
        </button>
      </div>
    </div>
  );
};

// ---------------------------
// normalize 함수
// ---------------------------
function normalizeRecipeFields(recipeObj) {
  return {
    id: recipeObj.id || recipeObj.RCP_SEQ,
    name: recipeObj.name || recipeObj.RCP_NM,
    image_url: recipeObj.image_url || recipeObj.ATT_FILE_NO_MAIN,
    description: recipeObj.description || recipeObj.RCP_PARTS_DTLS,
    category: recipeObj.category || recipeObj.CATEGORY,
    ingredients: recipeObj.ingredients || recipeObj.INGREDIENTS || [],
    INFO_ENG: recipeObj.INFO_ENG,
    INFO_CAR: recipeObj.INFO_CAR,
    INFO_PRO: recipeObj.INFO_PRO,
    INFO_FAT: recipeObj.INFO_FAT,
    INFO_NA: recipeObj.INFO_NA,
    RCP_NA_TIP: recipeObj.RCP_NA_TIP,
    avg_rating: recipeObj.avg_rating || 0,
    rating_count: recipeObj.rating_count || 0,
    view_count: recipeObj.view_count || 0,
    ...recipeObj,
  };
}

// ---------------------------
// RecipeDetailContainer 컴포넌트 시작
// ---------------------------
const RecipeDetailContainer = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const idFromState = location.state?.id;
  const idFromQuery = searchParams.get("id");
  const id = idFromState || idFromQuery;
  const relatedList = location.state?.list;

  const { user } = useContext(LoginContext);
  const userId = user?.user_id;

  const [recipe, setRecipe] = useState(null);
  const [allRecipes, setAllRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState(0);

  const [favorite, setFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // 모달 열림 여부 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 레시피 상세 정보 조회 함수
  // incrementView=true일 때만 조회수 증가
  const fetchRecipeDetail = (incrementView = true) => {
    if (!id) {
      setRecipe(null);
      setError("잘못된 레시피 id");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    const baseUrl = `http://127.0.0.1:8000/api/recipedetail?id=${id}${userId ? `&user_id=${userId}` : ""}`;
    const url = incrementView ? baseUrl : `${baseUrl}&increment_view=false`;

    fetch(url)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`서버 오류: ${res.status} - ${res.statusText} - ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        setRecipe(normalizeRecipeFields(data));
        setLoading(false);
        setUserRating(data.user_rating || 0);
      })
      .catch((err) => {
        setError(err.message || "레시피를 불러오는 데 실패했습니다.");
        setLoading(false);
      });
  };

  // 컴포넌트 마운트 또는 id/userId 변경 시 초기 상세 정보 호출 (조회수 증가 포함)
  useEffect(() => {
    fetchRecipeDetail(true);
  }, [id, userId]);

  // 관련 레시피 리스트 셋팅
  useEffect(() => {
    if (relatedList && Array.isArray(relatedList) && relatedList.length > 0) {
      setAllRecipes(relatedList.map(normalizeRecipeFields));
    } else {
      fetch("http://127.0.0.1:8000/api/recipelist")
        .then((res) => res.json())
        .then((data) => {
          setAllRecipes(Array.isArray(data) ? data.map(normalizeRecipeFields) : []);
        })
        .catch(() => setAllRecipes([]));
    }
  }, [relatedList]);

  const relatedRecipes = useMemo(() => {
    if (!recipe || !recipe.category || allRecipes.length === 0) return [];
    return allRecipes
      .filter((r) => (r.id || r.RCP_SEQ) !== (recipe.id || recipe.RCP_SEQ) && r.category === recipe.category)
      .slice(0, 10)
      .map((r) => ({
        img: r.image_url || r.ATT_FILE_NO_MAIN,
        name: r.name || r.RCP_NM,
        rating: r.avg_rating ? Math.round(r.avg_rating) : 5,
        views: r.view_count || 0,
        RCP_SEQ: r.id || r.RCP_SEQ,
      }));
  }, [recipe, allRecipes]);

  // 별점 등록 함수 (모달에서 호출)
  const submitUserRating = (rating) => {
    if (!id) return;
    if (!userId) {
      alert("별점 등록은 로그인 후 가능합니다.");
      return;
    }
    const requestBody = { user_id: userId, rating };
    fetch(`http://127.0.0.1:8000/api/recipes/${id}/rating`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`서버 오류: ${res.status} - ${res.statusText} - ${text}`);
        }
        return res.json();
      })
      .then(() => {
        setUserRating(rating);
        fetchRecipeDetail(false); // 조회수 증가 없이 갱신
        setIsModalOpen(false); // 모달 닫기
      })
      .catch(() => {
        alert("별점 등록에 실패했습니다. 다시 시도해주세요.");
      });
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // 즐겨찾기 여부 확인
  useEffect(() => {
    if (userId && id) {
      setFavoriteLoading(true);
      fetch(`http://localhost:8000/api/favorites/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.favorites)) {
            setFavorite(!!data.favorites.find((r) => String(r.id) === String(id)));
          } else if (Array.isArray(data)) {
            setFavorite(!!data.find((r) => String(r.id) === String(id)));
          } else {
            setFavorite(false);
          }
        })
        .catch(() => setFavorite(false))
        .finally(() => setFavoriteLoading(false));
    } else {
      setFavorite(false);
    }
  }, [userId, id]);

  // 즐겨찾기 토글
  const handleToggleFavorite = () => {
    if (!userId) {
      alert("찜 기능은 로그인 후 이용 가능합니다.");
      return;
    }
    setFavoriteLoading(true);
    const url = `http://127.0.0.1:8000/api/favorites`;
    const method = favorite ? "DELETE" : "POST";
    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, recipe_id: Number(id) }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt);
        }
        setFavorite(!favorite);
      })
      .catch(() => {
        alert("찜 기능 처리에 실패했습니다.");
      })
      .finally(() => setFavoriteLoading(false));
  };

  return (
    <>
      <RecipeDetailPresenter
        recipe={recipe}
        loading={loading}
        error={error}
        relatedRecipes={relatedRecipes}
        userRating={userRating}
        onRate={submitUserRating}// 별점은 모달에서 처리
        onOpenModal={openModal} // 모달 열기 함수
        favorite={favorite}
        onToggleFavorite={handleToggleFavorite}
        favoriteLoading={favoriteLoading}
      />

      <StarRatingModal
        visible={isModalOpen}
        rating={userRating}
        onClose={closeModal}
        onSubmit={submitUserRating}
      />
    </>
  );
};

export default RecipeDetailContainer;
