import React, { useEffect, useState, useMemo, useContext, useCallback } from "react";
import { useLocation } from "react-router-dom";
import RecipeDetailPresenter from "./RecipeDetailPresenter"; // 프레젠터 컴포넌트 임포트
import { LoginContext } from "../SignIn/LoginContext";
import MapModalContainer from "../MapModal/MapModalContainer"; // ★ 지도 모달 컨테이너

/* ---------------------------
   모달 컴포넌트 (별도 파일 없이 여기서 정의)
--------------------------- */
const StarRatingModal = ({ visible, rating, onClose, onSubmit }) => {
  const [tempRating, setTempRating] = useState(rating || 0);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    setTempRating(rating || 0); // 모달 열릴 때마다 초기화
  }, [rating, visible]);

  if (!visible) return null;

  const handleSubmit = () => {
    if (tempRating > 0) onSubmit(tempRating);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
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
          padding: 24,
          borderRadius: 8,
          width: 320,
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
                fontSize: 36,
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
          style={{ padding: "8px 24px", marginRight: 12, cursor: tempRating === 0 ? "not-allowed" : "pointer" }}
        >
          확인
        </button>
        <button onClick={onClose} style={{ padding: "8px 24px", cursor: "pointer" }}>
          취소
        </button>
      </div>
    </div>
  );
};

/* ---------------------------
   normalize 함수
--------------------------- */
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

/* ---------------------------
   RecipeDetailContainer
--------------------------- */
const RecipeDetailContainer = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const idFromState = location.state?.id;
  const idFromQuery = searchParams.get("id");
  const nameFromQuery = searchParams.get("name"); // ← 이름 기반 진입 지원 (예: 삼계탕)
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false); // ★ 지도 모달 상태

  /** 상세 조회 (id 우선, 없으면 name으로 2단계 조회: 목록 검색 → id 추출 → 상세) */
  const fetchRecipeDetail = useCallback(
    async (incrementView = true) => {
      if (!id && !nameFromQuery) {
        setRecipe(null);
        setError("레시피 식별자(id 또는 name)가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        let targetId = id;

        // 1) name으로 들어온 경우: 검색해서 id 찾기
        if (!targetId && nameFromQuery) {
          const listRes = await fetch(
            `http://127.0.0.1:8000/api/recipelist?search=${encodeURIComponent(nameFromQuery)}`
          );
          if (!listRes.ok) {
            const t = await listRes.text();
            throw new Error(`검색 실패: ${listRes.status} - ${t}`);
          }
          const listJson = await listRes.json();
          const arr = Array.isArray(listJson) ? listJson : listJson?.recipes || [];

          // 우선순위: 완전일치 > 포함 > 첫 항목
          const picked =
            arr.find((r) => (r.RCP_NM || r.name)?.trim() === nameFromQuery.trim()) ||
            arr.find((r) => (r.RCP_NM || r.name)?.includes(nameFromQuery)) ||
            arr[0];

          targetId = picked?.RCP_SEQ || picked?.id;
          if (!targetId) throw new Error(`${nameFromQuery} 레시피를 찾을 수 없습니다.`);
        }

        // 2) id로 상세 조회
        const baseUrl = `http://127.0.0.1:8000/api/recipedetail?id=${targetId}${
          userId ? `&user_id=${userId}` : ""
        }`;
        const url = incrementView ? baseUrl : `${baseUrl}&increment_view=false`;

        const detailRes = await fetch(url);
        if (!detailRes.ok) {
          const t = await detailRes.text();
          throw new Error(`상세 조회 실패: ${detailRes.status} - ${t}`);
        }
        const detailJson = await detailRes.json();

        setRecipe(normalizeRecipeFields(detailJson));
        setUserRating(detailJson.user_rating || 0);
      } catch (e) {
        setError(e?.message || "레시피를 불러오는 데 실패했습니다.");
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    },
    [id, nameFromQuery, userId]
  );

  // 마운트 또는 id/name/userId 변경 시 상세 호출
  useEffect(() => {
    fetchRecipeDetail(true);
  }, [fetchRecipeDetail]);

  // 관련 레시피 목록
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

  // 별점 등록 (이름 진입 시 응답의 recipe.id 사용)
  const submitUserRating = (rating) => {
    const targetId = recipe?.id || id;
    if (!targetId) return;
    if (!userId) {
      alert("별점 등록은 로그인 후 가능합니다.");
      return;
    }
    const requestBody = { user_id: userId, rating };
    fetch(`http://127.0.0.1:8000/api/recipes/${targetId}/rating`, {
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
  const openMap = () => setMapOpen(true);    // ★ 추가
  const closeMap = () => setMapOpen(false);  // ★ 추가

  // 즐겨찾기 여부 확인 (이름 진입 대응)
  useEffect(() => {
    const targetId = recipe?.id || id;
    if (userId && targetId) {
      setFavoriteLoading(true);
      fetch(`http://localhost:8000/api/favorites/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.favorites)) {
            setFavorite(!!data.favorites.find((r) => String(r.id) === String(targetId)));
          } else if (Array.isArray(data)) {
            setFavorite(!!data.find((r) => String(r.id) === String(targetId)));
          } else {
            setFavorite(false);
          }
        })
        .catch(() => setFavorite(false))
        .finally(() => setFavoriteLoading(false));
    } else {
      setFavorite(false);
    }
  }, [userId, id, recipe?.id]);

  // 즐겨찾기 토글 (이름 진입 대응)
  const handleToggleFavorite = () => {
    if (!userId) {
      alert("찜 기능은 로그인 후 이용 가능합니다.");
      return;
    }
    const targetId = recipe?.id || id;
    if (!targetId) return;

    setFavoriteLoading(true);
    const url = `http://127.0.0.1:8000/api/favorites`;
    const method = favorite ? "DELETE" : "POST";
    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, recipe_id: Number(targetId) }),
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
        onRate={submitUserRating} // 별점은 모달에서 처리
        onOpenModal={openModal}   // 별점 모달 열기
        onOpenMap={openMap}       // ★ 지도 모달 열기
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

      {/* ★ 지도 모달 */}
      <MapModalContainer
        open={mapOpen}
        onClose={closeMap}
        defaultKeyword={recipe?.name || recipe?.RCP_NM || "분식"}
      />
    </>
  );
};

export default RecipeDetailContainer;
