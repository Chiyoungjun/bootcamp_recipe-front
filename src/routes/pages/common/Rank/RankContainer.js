import React, { useEffect, useState } from "react";
import RankPresenter from "./RankPresenter";
import axios from "axios";  // axios 추가 또는 fetch 사용 가능

function RankContainer() {
  const [recipes, setRecipes] = useState([]);
  const [period, setPeriod] = useState("일간");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 랭킹 데이터 API 호출 함수
    const fetchRankData = async () => {
      setLoading(true);
      try {
        // period API 파라미터 형식 맞추기 (예: "일간" → "daily", "주간" → "weekly", "월간" → "monthly")
        const periodMap = {
          "일간": "daily",
          "주간": "weekly",
          "월간": "monthly",
        };
        const periodParam = periodMap[period] || "daily";

        // 백엔드 API URL 예시 (적절히 변경하세요)
       const response = await axios.get(`http://localhost:8000/api/rankings?period=${periodParam}`);

        // 응답 데이터에 따라 recipes set
        // 예) response.data.recipes 가 배열 형태라고 가정
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
    />
  );
}

export default RankContainer;
