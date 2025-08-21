import React from "react";
import { useNavigate } from "react-router-dom";
import BannerCard from "../../../compoents/BannerCard/BannerCardPresenter";
import "./Banner.css";

export default function BannerPresenter({
  banners,
  index,
  onNext,
  onPrev,
  onDot,
  onMouseEnter,
  onMouseLeave,
}) {
  const navigate = useNavigate();
  const current = banners[index];

  const handleCardClick = (e) => {
    const target = e.target;
    if (target.closest(".banner-nav") || target.closest(".dot")) return;
    if (current?.href) navigate(current.href);
  };
  const stop = (e) => e.stopPropagation();

  return (
    <div
      className="banner-root"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="banner-slide fade-in"
        onClick={handleCardClick}
        style={{ cursor: current?.href ? "pointer" : "default" }}
      >
        {/* image/title/desc/bg/alt 를 그대로 전달 */}
        <BannerCard {...current} />
      </div>

      <button
        type="button"
        className="banner-nav prev"
        aria-label="이전"
        onClick={(e) => { stop(e); onPrev(); }}
      >‹</button>
      <button
        type="button"
        className="banner-nav next"
        aria-label="다음"
        onClick={(e) => { stop(e); onNext(); }}
      >›</button>

      <div className="banner-dots" onClick={stop}>
        {banners.map((b, i) => (
          <button
            type="button"
            key={b.id}
            className={`dot ${i === index ? "active" : ""}`}
            aria-label={`${i + 1}번 배너`}
            onClick={() => onDot(i)}
          />
        ))}
      </div>
    </div>
  );
}