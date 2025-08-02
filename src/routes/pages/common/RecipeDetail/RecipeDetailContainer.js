import React, { useEffect, useState, useMemo, useContext } from "react";
import { useLocation } from "react-router-dom";
import RecipeDetailPresenter from "./RecipeDetailPresenter";
import { LoginContext } from "../SignIn/LoginContext"; // 경로 맞게 조정

// 컨테이너에서 사용할 normalize 함수 (프레젠터에 중복해서 쓰면 안됨)
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
  // user?.user_id 으로 정확한 필드명 확인 필요 (LoginContext 구조에 따라 다름)
  // 일반적으로 `user.user_id` 여야 함

  const [recipe, setRecipe] = useState(null);
  const [allRecipes, setAllRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [userRating, setUserRating] = useState(0);

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
    // 로그인한 유저 ID가 있다면 user_id 쿼리로 넘겨서 user_rating 받음
    const url = user?.user_id
      ? `http://127.0.0.1:8000/api/recipedetail?id=${id}&user_id=${user.user_id}`
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
  }, [id, user?.user_id]);

  useEffect(() => {
    if (relatedList && Array.isArray(relatedList) && relatedList.length > 0) {
      setAllRecipes(relatedList.map(normalizeRecipeFields));
    } else {
      fetch("http://127.0.0.1:8000/api/recipelist")
        .then((res) => res.json())
        .then((data) => {
          setAllRecipes(Array.isArray(data) ? data.map(normalizeRecipeFields) : []);
        })
        .catch(() => {
          setAllRecipes([]);
        });
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

  // 사용자가 별점 줄 때 호출할 함수
  const submitUserRating = (rating) => {
    if (!id) return;

    if (!user || !user.user_id) {
      alert("별점 등록은 로그인 후 가능합니다.");
      return;
    }

    const requestBody = {
      user_id: user.user_id, // 로그인된 사용자 ID가 user_id 필드에 있음
      rating: rating,
    };
    console.log("별점 등록 요청 바디:", requestBody);

    fetch(`http://127.0.0.1:8000/api/recipes/${id}/rating`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then(async (res) => {
        console.log("서버 응답 상태:", res.status);
        if (!res.ok) {
          const text = await res.text();
          console.error("서버 에러 응답 본문:", text);
          throw new Error(`서버 오류: ${res.status} - ${res.statusText} - ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("별점 등록 성공 응답 데이터:", data);
        setUserRating(rating);
        // 별점 반영 후 상세정보 다시 받아 최신화
        fetchRecipeDetail();
      })
      .catch((err) => {
        console.error("별점 등록 실패:", err);
        alert("별점 등록에 실패했습니다. 다시 시도해주세요.");
      });
  };

  return (
    <RecipeDetailPresenter
      recipe={recipe}
      loading={loading}
      error={error}
      relatedRecipes={relatedRecipes}
      userRating={userRating}
      onRate={submitUserRating}
    />
  );
};

export default RecipeDetailContainer;
