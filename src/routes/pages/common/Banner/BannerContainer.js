import React, { useEffect, useRef, useState } from "react";
import BannerPresenter from "./BannerPresenter";

// trophy.jpg가 현재 파일과 같은 폴더에 있으므로 import 방식 사용
import trophy from "./trophy.png";
import tang from "./tang.png"; // public/images 에 배치 시 절대경로 사용
import salad from "./salad.png";

// 배너 데이터 (텍스트/이미지/링크 관리)
const banners = [
  {
    id: "monthly-rank",
    title: "랭킹 TOP3",
    desc: "한 달간 가장 많이 본 레시피",
    image: trophy,                    // ← import 사용
    bg: "#0B1220",                       // 카드 바탕색(이미지 아래)
    href: "/rank?period=monthly#filter",
  },
  {
    id: "category-salad",
    title: "샐러드",
    desc: "샐러드만 모아보기",
    image: salad,   // public/images 에 배치 시 절대경로 사용
    bg: "#0B1220",
    href: "/category?category=salad#filter",
  },
  {
    id: "samgyetang",
    // title: "여름엔 삼계탕!",
    // desc: "든든한 보양 레시피",
    image: tang,
    bg: "#0B1220",
    href: "/recipedetail?name=삼계탕",
  },
];

export default function BannerContainer() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const INTERVAL = 5000; // 5초 자동 넘김

  const start = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, INTERVAL);
  };
  const stop = () => clearInterval(timerRef.current);

  useEffect(() => {
    start();
    return () => clearInterval(timerRef.current);
  }, []);

  const go = (i) =>
    setIndex(((i % banners.length) + banners.length) % banners.length);
  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  return (
    <BannerPresenter
      banners={banners}
      index={index}
      onNext={next}
      onPrev={prev}
      onDot={go}
      onMouseEnter={stop}
      onMouseLeave={start}
    />
  );
}
