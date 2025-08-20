import React, { useEffect, useState, useMemo, useContext } from "react";
import { useLocation } from "react-router-dom";
import RecipeDetailPresenter from "./RecipeDetailPresenter";
import { LoginContext } from "../SignIn/LoginContext";
import MapModalContainer from "../MapModal/MapModalContainer"; 

const StarRatingModal = ({ visible, rating, onClose, onSubmit }) => {
  const [tempRating, setTempRating] = useState(rating || 0);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    setTempRating(rating || 0);
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

function normalizeRecipeFields(recipeObj) {
  return {
    id: recipeObj.id || recipeObj.RCP_SEQ,
    name: recipeObj.name || recipeObj.RCP_NM,
    name_en: recipeObj.name_en,
    image_url: recipeObj.image_url || recipeObj.ATT_FILE_NO_MAIN,
    description: recipeObj.description || recipeObj.RCP_PARTS_DTLS,
    description_en: recipeObj.description_en,
    category: recipeObj.category || recipeObj.CATEGORY,
    ingredients: recipeObj.ingredients || recipeObj.INGREDIENTS || [],
    ingredients_en: recipeObj.ingredients_en,
    manual_en: recipeObj.manual_en,
    INFO_ENG: recipeObj.INFO_ENG,
    INFO_CAR: recipeObj.INFO_CAR,
    INFO_PRO: recipeObj.INFO_PRO,
    INFO_FAT: recipeObj.INFO_FAT,
    INFO_NA: recipeObj.INFO_NA,
    RCP_NA_TIP: recipeObj.RCP_NA_TIP,
    RCP_NA_TIP_EN: recipeObj.RCP_NA_TIP_EN,
    avg_rating: recipeObj.avg_rating || 0,
    rating_count: recipeObj.rating_count || 0,
    view_count: recipeObj.view_count || 0,
    user_rating: recipeObj.user_rating || 0,
    ...recipeObj,
  };
}

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

  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [lang, setLang] = useState("ko");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);

  // 음식점 검색 관련 상태 추가
  const [shopList, setShopList] = useState([]);
  const [showShopList, setShowShopList] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [mapError, setMapError] = useState("");

  const fetchRecipeDetail = (selectedLang = "ko", incrementView = true) => {
    if (!id) {
      setRecipe(null);
      setError("잘못된 레시피 id");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    const baseUrl = `http://127.0.0.1:8000/api/recipedetail?id=${id}${
      userId ? `&user_id=${userId}` : ""
    }&lang=${selectedLang}&increment_view=${incrementView}`;
    fetch(baseUrl)
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

  const openMap = () => setMapOpen(true);    // ★ 추가
  const closeMap = () => setMapOpen(false);

  useEffect(() => {
    fetchRecipeDetail(lang, true);
    // eslint-disable-next-line
  }, [id, userId, lang]);

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
      .filter(
        (r) => (r.id || r.RCP_SEQ) !== (recipe.id || recipe.RCP_SEQ) && r.category === recipe.category
      )
      .slice(0, 10)
      .map((r) => ({
        img: r.image_url || r.ATT_FILE_NO_MAIN,
        name: r.name || r.RCP_NM,
        rating: r.avg_rating ? Math.round(r.avg_rating) : 5,
        views: r.view_count || 0,
        RCP_SEQ: r.id || r.RCP_SEQ,
      }));
  }, [recipe, allRecipes]);

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
        fetchRecipeDetail(lang, false);
        setIsModalOpen(false);
      })
      .catch(() => {
        alert("별점 등록에 실패했습니다. 다시 시도해주세요.");
      });
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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

  const handleToggleLanguage = () => {
    setLang((prev) => (prev === "ko" ? "en" : "ko"));
  };

  // ▷▷↓↓ 음식점 검색 버튼/함수/리스트 추가 ↓↓▷▷
  const handleFindNearShops = () => {
    if (!recipe || !recipe.name) {
      setMapError("레시피명이 없습니다.");
      return;
    }
    setMapLoading(true);
    setMapError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const longitude = pos.coords.longitude;
        const latitude = pos.coords.latitude;
        fetch(
          `http://localhost:8000/api/maps/search?keyword=${encodeURIComponent(
            recipe.name
          )}&x=${longitude}&y=${latitude}&radius=2000`
        )
          .then(async (res) => {
            if (!res.ok) {
              const text = await res.text();
              throw new Error(text);
            }
            const data = await res.json();
            if (Array.isArray(data.results)) {
              setShopList(data.results);
            } else {
              setShopList([]);
            }
            setShowShopList(true);
            setMapLoading(false);
          })
          .catch((err) => {
            setMapError("근처 음식점 검색에 실패했습니다. " + String(err));
            setMapLoading(false);
          });
      },
      (err) => {
        setMapError("GPS 위치를 불러올 수 없습니다.");
        setMapLoading(false);
      }
    );
  };

  return (
    <>
      <button
        onClick={handleToggleLanguage}
        style={{
          margin: "16px",
          padding: "8px 16px",
          fontSize: "14px",
          cursor: "pointer",
        }}
      >
        {lang === "ko" ? "영어 보기" : "한국어 보기"}
      </button>

      <RecipeDetailPresenter
        recipe={recipe}
        loading={loading}
        error={error}
        relatedRecipes={relatedRecipes}
        userRating={userRating}
        onRate={submitUserRating}
        onOpenModal={openModal}
        favorite={favorite}
        onToggleFavorite={handleToggleFavorite}
        favoriteLoading={favoriteLoading}
        isEnglish={lang === "en"}
        shopList={shopList}
        showShopList={showShopList}
        mapLoading={mapLoading}
        mapError={mapError}
        handleFindNearShops={handleFindNearShops}
        onOpenMap={openMap}
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
        defaultKeyword={recipe?.name || recipe?.RCP_NM || ""}
      />

    </>
  );
};

export default RecipeDetailContainer;
