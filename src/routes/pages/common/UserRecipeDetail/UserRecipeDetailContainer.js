import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import UserRecipeDetailPresenter from "./UserRecipeDetailPresenter";
import { LoginContext } from "../SignIn/LoginContext";

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
          {[1, 2, 3, 4, 5].map(star => (
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
    user_id: recipeObj.user_id,

    author_name: recipeObj.author_name || "",

    ...recipeObj,
  };
}

const UserRecipeDetailContainer = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const idFromState = location.state?.id;
  const idFromQuery = searchParams.get("id");
  const id = String(idFromState || idFromQuery || "");

  let isUserRecipe = location.state?.isUserRecipe;
  if (typeof isUserRecipe === "undefined") {
    isUserRecipe = location.pathname.includes("/user");
  }

  const { user } = useContext(LoginContext);
  const userId = user?.user_id;

  const [recipe, setRecipe] = useState(null);
  const [authorName, setAuthorName] = useState("");
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState(0);

  const [favorite, setFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 알림 메시지 상태 추가
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    console.log("상세조회 분기:", { id, isUserRecipe });
  }, [id, isUserRecipe]);

  const fetchRecipeDetail = (incrementView = true) => {
    if (!id) {
      setRecipe(null);
      setError("잘못된 레시피 id");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");

    const baseUrl = isUserRecipe
      ? `http://127.0.0.1:8000/api/users/recipes/${id}?increment_view=${incrementView}&user_id=${userId}`
      : `http://127.0.0.1:8000/api/recipes/${id}?increment_view=${incrementView}&user_id=${userId}`;

    fetch(baseUrl)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`서버 오류: ${res.status} - ${res.statusText} - ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("서버 응답:", data);
        const normalized = normalizeRecipeFields(data);
        setRecipe(normalized);
        setUserRating(normalized.user_rating || 0);
        setAuthorName(normalized.author_name || "");
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "레시피를 불러오는 데 실패했습니다.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRecipeDetail(true);
    // eslint-disable-next-line
  }, [id, userId, isUserRecipe]);

  useEffect(() => {
    if (recipe && recipe.user_id) {
      fetch(`http://127.0.0.1:8000/api/users/${recipe.user_id}/recipes`)
        .then((res) => res.json())
        .then((data) => {
          console.log("API response data:", data);
          if (Array.isArray(data)) {
            const filtered = data
              .map(normalizeRecipeFields)
              .filter((item) => String(item.id) !== id);
            setUserRecipes(filtered);
            if (filtered.length > 0) {
              setAuthorName(filtered[0].author_name || "");
            } else {
              setAuthorName("");
            }
          } else {
            setUserRecipes([]);
            setAuthorName("");
          }
        })
        .catch(() => {
          setUserRecipes([]);
          setAuthorName("");
        });
    } else {
      setUserRecipes([]);
      setAuthorName("");
    }
  }, [recipe, id]);

  const submitUserRating = (rating) => {
    if (!id) return;
    if (!userId) {
      alert("별점 등록은 로그인 후 가능합니다.");
      return;
    }

    const requestBody = isUserRecipe
      ? { user_id: userId, rating, user_recipe_id: id }
      : { user_id: userId, rating, recipe_id: id };

    const url = isUserRecipe
      ? `http://127.0.0.1:8000/api/users/recipes/${id}/rating`
      : `http://127.0.0.1:8000/api/recipes/${id}/rating`;

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        return res.json();
      })
      .then(() => {
        setUserRating(rating);
        fetchRecipeDetail(false);
        setIsModalOpen(false);
      })
      .catch(() => alert("별점 등록에 실패했습니다. 다시 시도해주세요."));
  };

  useEffect(() => {
    if (userId && id) {
      setFavoriteLoading(true);
      const url = `http://localhost:8000/api/favorites/${userId}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          const favoritesList = data.favorites || data;
          setFavorite(!!favoritesList.find((r) => String(r.id) === id));
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
    const body = isUserRecipe
      ? { user_id: userId, user_recipe_id: id }
      : { user_id: userId, recipe_id: Number(id) };

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt);
        }
        const fetchFavoritesUrl = `http://localhost:8000/api/favorites/${userId}`;
        const res2 = await fetch(fetchFavoritesUrl);
        if (!res2.ok) throw new Error("찜 목록 재조회 실패");
        const data = await res2.json();
        const favoritesList = data.favorites || data;
        const newFavorite = !!favoritesList.find((r) => String(r.id) === id);
        setFavorite(newFavorite);

        // 알림 메시지 설정
        if (newFavorite) {
          setAlertMessage("찜목록에 추가되었습니다");
        } else {
          setAlertMessage("찜목록이 취소되었습니다");
        }
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 2000);
      })
      .catch(() => alert("찜 기능 처리에 실패했습니다."))
      .finally(() => setFavoriteLoading(false));
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <UserRecipeDetailPresenter
        recipe={recipe}
        loading={loading}
        error={error}
        userRating={userRating}
        onRate={submitUserRating}
        onOpenModal={openModal}
        favorite={favorite}
        onToggleFavorite={handleToggleFavorite}
        favoriteLoading={favoriteLoading}
        isEnglish={false}
        userRecipes={userRecipes}
        user={user}
        authorName={authorName}
        alertMessage={alertMessage}
        showAlert={showAlert}
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

export default UserRecipeDetailContainer;
