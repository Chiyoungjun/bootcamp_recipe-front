import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import RecipeDetailPresenter from "./RecipeDetailPresenter";

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

  const [recipe, setRecipe] = useState(null);
  const [allRecipes, setAllRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 상세 레시피 가져오기
  useEffect(() => {
    if (!id) {
      setRecipe(null);
      setError("잘못된 레시피 id");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    fetch(`http://127.0.0.1:8000/api/recipedetail?id=${id}`)
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
      })
      .catch((err) => {
        setError(err.message || "레시피를 불러오는 데 실패했습니다.");
        setLoading(false);
      });
  }, [id]);

  // 전체 레시피/추천 레시피 리스트 가져오기
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

  // 유사 레시피 계산 (같은 카테고리, 최대 10개)
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
      img: r.image_url || r.ATT_FILE_NO_MAIN,      // 이미지 필드 보정
      name: r.name || r.RCP_NM,                    // 이름 필드 보정
      rating: 5,                                   // 임의의 별점(값을 원하면 조정)
      views: Math.floor(Math.random() * 1000) + 1000, // 랜덤 조회수
      RCP_SEQ: r.id || r.RCP_SEQ,
    }));
}, [recipe, allRecipes]);


  return (
    <RecipeDetailPresenter
      recipe={recipe}
      loading={loading}
      error={error}
      relatedRecipes={relatedRecipes}
    />
  );
};

export default RecipeDetailContainer;


// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import RecipeDetailPresenter from "./RecipeDetailPresenter";

// const RecipeDetailContainer = () => {
//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);
//   const idFromState = location.state?.id;
//   const idFromQuery = searchParams.get("id");
//   const id = idFromState || idFromQuery;
//   const relatedList = location.state?.list;

//   const [recipe, setRecipe] = useState(null);
//   const [allRecipes, setAllRecipes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!id) {
//       setRecipe(null);
//       setError("잘못된 레시피 id");
//       setLoading(false);
//       return;
//     }
//     setLoading(true);
//     setError("");
//     fetch(`http://127.0.0.1:8000/api/recipedetail?id=${id}`)
//       .then(async (res) => {
//         if (!res.ok) {
//           const text = await res.text();
//           throw new Error(`서버 오류: ${res.status} ${res.statusText} - ${text}`);
//         }
//         return res.json();
//       })
//       .then((data) => {
//         setRecipe(data); // 백엔드에서 CATEGORY, INGREDIENTS 포함되어 있음
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message || "레시피를 불러오는 데 실패했습니다.");
//         setLoading(false);
//       });
//   }, [id]);

//   useEffect(() => {
//     if (relatedList && Array.isArray(relatedList) && relatedList.length > 0) {
//       setAllRecipes(relatedList);
//     } else {
//       fetch("http://127.0.0.1:8000/api/recipelist")
//         .then((res) => res.json())
//         .then((data) => {
//           setAllRecipes(Array.isArray(data) ? data : []);
//         })
//         .catch(() => {
//           setAllRecipes([]);
//         });
//     }
//   }, [relatedList]);

//   return (
//     <RecipeDetailPresenter
//       recipe={recipe}
//       loading={loading}
//       error={error}
//       allRecipes={allRecipes}
//     />
//   );
// };

// export default RecipeDetailContainer;
