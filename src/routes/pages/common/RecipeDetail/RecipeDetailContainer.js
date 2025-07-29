// RecipeDetailContainer.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import RecipeDetailPresenter from "./RecipeDetailPresenter";

const RecipeDetailContainer = () => {
  const location = useLocation();

  // location.state?.id 가 없으면, URL 쿼리(id=…)에서 꺼내오도록
  const searchParams = new URLSearchParams(location.search);
  const idFromState = location.state?.id;
  const idFromQuery = searchParams.get("id");
  const id = idFromState || idFromQuery;

  const relatedList = location.state?.list;   // ★ 검색에서 받은 목록 (없으면 undefined)

  const [recipe, setRecipe] = useState(null);
  const [allRecipes, setAllRecipes] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 상세 레시피
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
          throw new Error(`서버 오류: ${res.status} ${res.statusText} - ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        setRecipe(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "레시피를 불러오는 데 실패했습니다.");
        setLoading(false);
      });
  }, [id]);

  // ★ 만약 "검색에서 전달된 목록"이 없을 때만 전체 API로 받아오기
  useEffect(() => {
    if (relatedList && Array.isArray(relatedList) && relatedList.length > 0) {
      setAllRecipes(relatedList);
    } else {
      fetch("http://127.0.0.1:8000/api/recipelist")
        .then(res => res.json())
        .then(data => {
          setAllRecipes(Array.isArray(data) ? data : []);
        })
        .catch(() => {
          setAllRecipes([]);
        });
    }
  }, [relatedList]);

  return (
    <RecipeDetailPresenter
      recipe={recipe}
      loading={loading}
      error={error}
      allRecipes={allRecipes}   // ← 항상 이 배열에서 유사레시피 3개 추출
    />
  );
};

export default RecipeDetailContainer;