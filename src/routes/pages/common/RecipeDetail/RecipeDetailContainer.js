import React, { useEffect, useState, useMemo, useContext } from "react";
import { useLocation } from "react-router-dom";
import RecipeDetailPresenter from "./RecipeDetailPresenter";
import { LoginContext } from "../SignIn/LoginContext";

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

  // ☆☆☆ 즐겨찾기 true/false 상태, 로딩 ☆☆☆
  const [favorite, setFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // 상세 레시피 가져오기
  const fetchRecipeDetail = () => {
    if (!id) {
      setRecipe(null);
      setError("잘못된 레시피 id");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    const url = userId
      ? `http://127.0.0.1:8000/api/recipedetail?id=${id}&user_id=${userId}`
      : `http://127.0.0.1:8000/api/recipedetail?id=${id}`;
    fetch(url)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`서버 오류: ${res.status} - ${res.statusText} - ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        const normalized = normalizeRecipeFields(data);
        setRecipe(normalized);
        setLoading(false);
        setUserRating(data.user_rating || 0);
      })
      .catch((err) => {
        setError(err.message || "레시피를 불러오는 데 실패했습니다.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRecipeDetail();
  }, [id, userId]);

  // 모든 레시피 불러오기 (추천/유사 활용)
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
        (r) =>
          (r.id || r.RCP_SEQ) !== (recipe.id || recipe.RCP_SEQ) &&
          r.category === recipe.category
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

  // 별점 등록 함수
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
      .then((data) => {
        setUserRating(rating);
        fetchRecipeDetail();
      })
      .catch((err) => {
        alert("별점 등록에 실패했습니다. 다시 시도해주세요.");
      });
  };

  // ☆☆☆ 즐겨찾기 여부 확인 (마운트/ID, 유저 변경 시마다)
useEffect(() => {
  if (userId && id) {
    setFavoriteLoading(true);
    fetch(`http://localhost:8000/api/favorites/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('즐겨찾기 응답:', data); // ★ 추가!
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

  // ☆☆☆ 즐겨찾기 추가/해제 요청 함수
  const handleToggleFavorite = () => {
    if (!userId) {
      alert("찜 기능은 로그인 후 이용 가능합니다.");
      return;
    }
    setFavoriteLoading(true);
    const url = `http://127.0.0.1:8000/api/favorites`;
    // 즐겨찾기 추가/해제는 POST/DELETE로 구분 (백엔드 API 방식과 맞추세요)
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
      .catch((err) => {
        alert("찜 기능 처리에 실패했습니다.");
      })
      .finally(() => setFavoriteLoading(false));
  };

  return (
    <RecipeDetailPresenter
      recipe={recipe}
      loading={loading}
      error={error}
      relatedRecipes={relatedRecipes}
      userRating={userRating}
      onRate={submitUserRating}
      favorite={favorite}
      onToggleFavorite={handleToggleFavorite}
      favoriteLoading={favoriteLoading}
    />
  );
};

export default RecipeDetailContainer;
