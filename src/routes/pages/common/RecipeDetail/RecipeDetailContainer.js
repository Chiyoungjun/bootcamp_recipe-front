import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import RecipeDetailPresenter from "./RecipeDetailPresenter";

const RecipeDetailContainer = () => {
  const location = useLocation();
  const id = location.state?.id;
  const foodName = location.state?.foodName;

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || !foodName) {
      setError("잘못된 레시피 정보입니다.");
      setLoading(false);
      setRecipe(null);
      return;
    }

    setLoading(true);
    setError("");

    fetch(`http://127.0.0.1:8000/api/recipedetail?id=${id}&food_name=${encodeURIComponent(foodName)}`)
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
  }, [id, foodName]);

  return <RecipeDetailPresenter recipe={recipe} loading={loading} error={error} />;
};

export default RecipeDetailContainer;
