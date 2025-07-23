import React, { useEffect, useState } from "react";
import RankPresenter from "./RankPresenter";

// 더미 데이터 (나중에 API 연결 시 이 부분만 fetch로 교체)
const dummyData = [
  {
    title: "비빔밥",
    rank: 1,
    views: 2025,
    stars: 5,
    img: "https://cdn.pixabay.com/photo/2016/11/18/15/37/bibimbap-1835376_1280.jpg"
  },
  {
    title: "불고기",
    rank: 2,
    views: 2019,
    stars: 5,
    img: "https://cdn.pixabay.com/photo/2017/09/02/14/46/bulgogi-2701254_1280.jpg"
  },
  {
    title: "김치찌개",
    rank: 3,
    views: 1592,
    stars: 4,
    img: "https://cdn.pixabay.com/photo/2017/10/17/12/55/kimchi-stew-2861049_1280.jpg"
  },
  {
    title: "떡볶이",
    rank: 4,
    views: 1356,
    stars: 4,
    img: "https://cdn.pixabay.com/photo/2020/02/25/13/21/tteokbokki-4881122_1280.jpg"
  },
  {
    title: "김밥",
    rank: 5,
    views: 950,
    stars: 4,
    img: "https://cdn.pixabay.com/photo/2017/09/05/23/18/kimbap-2712896_1280.jpg"
  },
  {
    title: "제육볶음",
    rank: 6,
    views: 750,
    stars: 4,
    img: "https://cdn.pixabay.com/photo/2021/07/16/10/29/food-6470954_1280.jpg"
  }
];

export default function RankContainer() {
  const [recipes, setRecipes] = useState([]);
  const [period, setPeriod] = useState("일간");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // --- 더미 데이터 사용 부분 (나중에 API로 교체 가능) ---
    // 실제 API 연동시 아래를 fetch/axios로 변경
    setTimeout(() => {
      setRecipes(dummyData);
      setLoading(false);
    }, 300); // 더미 로딩 딜레이

    // --- 예시: 실제 API 연동 코드
    /*
    fetch(`/api/recipes?period=${period}`)
      .then(res => res.json())
      .then(data => {
        setRecipes(data);
        setLoading(false);
      });
    */
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
