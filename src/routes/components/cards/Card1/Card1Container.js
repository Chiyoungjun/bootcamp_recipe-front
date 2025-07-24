import { useState, useEffect } from "react";
import Card1Presenter from "./Card1Presenter";
import Card1Container from ".";

const Card1Container = () => {
  // 사용자 데이터 상태
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    // 실제 환경에서는 fetch 또는 axios로 사용자 데이터를 불러옵니다
    const dummyData = [
      { id: 1, name: "Alice", score: 95 },
      { id: 2, name: "Bob", score: 90 },
      { id: 3, name: "Charlie", score: 85 },
      { id: 4, name: "David", score: 80 }
    ];

    setUserData(dummyData);
  }, []);

  // 상위 3명 추출 (점수 기준 정렬)
  const topThree = [...userData]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return <MyPagePresenter topThree={topThree} />;
};

export default Card1Container;
