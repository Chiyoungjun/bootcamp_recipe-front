import React, { useEffect, useState } from "react";
import RankPresenter from "./RankPresenter";

// 예시 데이터 (실제 API 연동 가능)
// const dummyData = [
//   {
//     title: "비빔밥",
//     rank: 1,
//     views: 2025,
//     stars: 5,
//     img: "/images/bibimbap.jpg"
//   },
//   {
//     title: "불고기",
//     rank: 2,
//     views: 2019,
//     stars: 5,
//     img: "/images/bulgogi.jpg"
//   },
//   {
//     title: "김치찌개",
//     rank: 3,
//     views: 1592,
//     stars: 4,
//     img: "/images/kimchi_stew.jpg"
//   },
//   {
//     title: "떡볶이",
//     rank: 4,
//     views: 1356,
//     stars: 4,
//     img: "/images/tteokbokki.jpg"
//   },
//   {
//     title: "김밥",
//     rank: 5,
//     views: 950,
//     stars: 4,
//     img: "/images/kimbap.jpg"
//   },
//   {
//     title: "제육볶음",
//     rank: 6,
//     views: 750,
//     stars: 4,
//     img: "/images/jeyuk.jpg"
//   }
// ];

function RankContainer() {
  const [recipes, setRecipes] = useState([]);
  const [period, setPeriod] = useState("일간");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      // setRecipes(dummyData);
      setLoading(false);
    }, 300);
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