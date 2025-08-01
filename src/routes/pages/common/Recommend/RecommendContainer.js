import React, { useEffect, useState } from "react";
import RecommendPresenter from "./RecommendPresenter";

// const DUMMY_DATA = {
//   preference: [
//     { title: "비빔밥", desc: "한식의 맛!", img: "https://via.placeholder.com/400x180?text=비빔밥" },
//     { title: "불고기", desc: "달콤한 한국식 불고기", img: "https://via.placeholder.com/400x180?text=불고기" },
//     { title: "김치찌개", desc: "밥도둑 김치찌개 레시피", img: "https://via.placeholder.com/400x180?text=김치찌개" },
//     { title: "떡볶이", desc: "초간단 떡볶이 만들기", img: "https://via.placeholder.com/400x180?text=떡볶이" },
//     { title: "김밥", desc: "집에서 굴려보자~", img: "https://via.placeholder.com/400x180?text=김밥" },
//     { title: "제육볶음", desc: "기숙사생을 그리다", img: "https://via.placeholder.com/400x180?text=제육볶음" },
//     { title: "라면", desc: "언제 먹어도 맛있는 라면", img: "https://via.placeholder.com/400x180?text=라면" },
//     { title: "삼겹살", desc: "고기는 진리", img: "https://via.placeholder.com/400x180?text=삼겹살" },
//   ],
//   health: [
//     { title: "닭가슴살 스테이크", desc: "단백질 보충", img: "https://via.placeholder.com/400x180?text=닭가슴살" },
//     { title: "전복죽", desc: "맛과 영양을 한번에!", img: "https://via.placeholder.com/400x180?text=전복죽" },
//     { title: "미역국", desc: "생일에는, 피로회복에는 미역국", img: "https://via.placeholder.com/400x180?text=미역국" },
//     { title: "쌈밥", desc: "영양만점 쌈밥", img: "https://via.placeholder.com/400x180?text=쌈밥" },
//     { title: "고등어구이", desc: "든든한 생선반찬", img: "https://via.placeholder.com/400x180?text=고등어구이" },
//     { title: "계란찜", desc: "부드러운 계란찜", img: "https://via.placeholder.com/400x180?text=계란찜" },
//     { title: "두부조림", desc: "든든한 단백질 식사", img: "https://via.placeholder.com/400x180?text=두부조림" },
//   ],
// };

function RecommendContainer() {
  const [preferenceList, setPreferenceList] = useState([]);
  const [healthList, setHealthList] = useState([]);

  // useEffect(() => {
  //   setPreferenceList(DUMMY_DATA.preference);
  //   setHealthList(DUMMY_DATA.health);
  // }, []);

  return (
    <div className="recommend-root">
      <RecommendPresenter
        title="회원님의 선호 레시피를 바탕으로 추천해봤어요"
        list={preferenceList}
      />
      <RecommendPresenter
        title="회원님의 건강상태를 바탕으로 추천해봤어요"
        list={healthList}
      />
    </div>
  );
}

export default RecommendContainer;