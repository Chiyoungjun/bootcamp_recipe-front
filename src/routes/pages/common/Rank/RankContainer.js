import React, { useEffect, useState, useContext } from "react";
import RankPresenter from "./RankPresenter";
import axios from "axios";
import { LoginContext } from "../SignIn/LoginContext"; // ✅ 경로 주의

function RankContainer() {
  const { user } = useContext(LoginContext);
  const userId = user?.user_id;

  const [recipes, setRecipes] = useState([]);
  const [period, setPeriod] = useState("일간");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankData = async () => {
      setLoading(true);
      try {
        const periodMap = {
          "일간": "daily",
          "주간": "weekly",
          "월간": "monthly",
        };
        const periodParam = periodMap[period] || "daily";

        const response = await axios.get(
          `http://localhost:8000/api/rankings?period=${periodParam}`
        );

        setRecipes(response.data.recipes || []);
      } catch (error) {
        console.error("랭킹 데이터 불러오기 실패:", error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRankData();
  }, [period]);

  return (
    <RankPresenter
      recipes={recipes}
      period={period}
      setPeriod={setPeriod}
      loading={loading}
      userId={userId} // ✅ userId 전달
    />
  );
}

export default RankContainer;
