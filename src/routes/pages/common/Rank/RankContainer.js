import React, { useEffect, useState, useContext } from "react";
import RankPresenter from "./RankPresenter";
import axios from "axios";
import { LoginContext } from "../SignIn/LoginContext";

function RankContainer() {
  const { user } = useContext(LoginContext);
  const userId = user?.user_id;

  const [recipes, setRecipes] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]); // 사용자 레시피 추가 상태
  const [period, setPeriod] = useState("일간");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const periodMap = {
          "일간": "daily",
          "주간": "weekly",
          "월간": "monthly",
        };
        const periodParam = periodMap[period] || "daily";

        // 기본 레시피 불러오기
        const resBase = await axios.get(
          `http://localhost:8000/api/rankings?period=${periodParam}`
        );
        const baseRecipes = resBase.data.recipes || [];

        // 사용자 레시피 불러오기 (로그인 되어 있을 때만)
        let userRecipesData = [];
        if (userId) {
          const resUser = await axios.get(
            `http://localhost:8000/api/users/${userId}/recipes`
          );
          userRecipesData = Array.isArray(resUser.data)
            ? resUser.data
            : resUser.data.recipes || [];
        }

        // 두 레시피 합치기
        const combined = [...baseRecipes, ...userRecipesData];
        setRecipes(combined);

      } catch (error) {
        console.error("랭킹 데이터 불러오기 실패:", error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period, userId]);

  return (
    <RankPresenter
      recipes={recipes}
      period={period}
      setPeriod={setPeriod}
      loading={loading}
      userId={userId}
    />
  );
}

export default RankContainer;
