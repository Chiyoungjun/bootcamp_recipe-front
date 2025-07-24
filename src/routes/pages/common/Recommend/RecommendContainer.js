import React, { useEffect, useState } from "react";
import RecommendPresenter from "./RecommendPresenter";

// 더미 데이터
const DUMMY_DATA = {
  preference: [
    { title: "비빔밥", desc: "한식의 맛!", img: "https://via.placeholder.com/400x180?text=비빔밥" },
    { title: "불고기", desc: "달콤한 한국식 불고기", img: "https://via.placeholder.com/400x180?text=불고기" },
    { title: "김치찌개", desc: "밥도둑 김치찌개 레시피", img: "https://via.placeholder.com/400x180?text=김치찌개" },
    { title: "떡볶이", desc: "초간단 떡볶이 만들기", img: "https://via.placeholder.com/400x180?text=떡볶이" },
    { title: "김밥", desc: "집에서 굴려보자~", img: "https://via.placeholder.com/400x180?text=김밥" },
    { title: "제육볶음", desc: "기숙사생을 그리다", img: "https://via.placeholder.com/400x180?text=제육볶음" },
  ],
  health: [
    { title: "닭가슴살 스테이크", desc: "단백질 보충", img: "https://via.placeholder.com/400x300?text=닭가슴살" },
    { title: "전복죽", desc: "맛과 영양을 한번에!", img: "https://via.placeholder.com/400x180?text=전복죽" },
    { title: "미역국", desc: "생일에는, 피로회복에는 미역국", img: "https://via.placeholder.com/400x180?text=미역국" },
  ],
};

function RecommendContainer() {
  const [preferenceList, setPreferenceList] = useState([]);
  const [healthList, setHealthList] = useState([]);

  useEffect(() => {
    setPreferenceList(DUMMY_DATA.preference);
    setHealthList(DUMMY_DATA.health);
  }, []);

  return (
    <RecommendPresenter preferenceList={preferenceList} healthList={healthList} />
  );
}

export default RecommendContainer;
