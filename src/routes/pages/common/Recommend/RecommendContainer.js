import { useState, useEffect } from "react";
import RecommendPresenter from "./RecommendPresenter";

const RecommendContainer = () => {
  // 예시 데이터 (API 대신 하드코딩)
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // 실제 환경에서는 여기서 fetch()나 axios로 데이터를 불러오세요
    const dummyData = [
      { id: 1, dish: "비빔밥", rating: 4.8 },
      { id: 2, dish: "짜장면", rating: 4.5 },
      { id: 3, dish: "스테이크", rating: 4.9 },
      { id: 4, dish: "초밥", rating: 4.7 },
      { id: 5, dish: "불고기", rating: 4.6 },
    ];

    setRecommendations(dummyData);
  }, []);

  // 평점 높은 Top 3 요리만 추출 (내림차순 정렬 후 slice)
  const topThree = recommendations
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return <RecommendPresenter topThree={topThree} />;
};

export default RecommendContainer;
