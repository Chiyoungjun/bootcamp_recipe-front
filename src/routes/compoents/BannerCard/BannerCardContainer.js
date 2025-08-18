// src/components/BannerCard/BannerCardPresenter.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./BannerCards.css";

/**
 * 프리젠터: 한 장만 렌더 + 내비게이션 UI
 */
export default function BannerCardPresenter({
  slide,
  total,
  index,
  onPrev,
  onNext,
  onDot,
  onMouseEnter,
  onMouseLeave,
}) {
  const { title, subtitle, img, bg = "#111827", href = "#" } = slide || {};

  return (
    <section
      className="bc-carousel-root"
      style={{ backgroundColor: bg }}
      /* 섹션은 기본 role=region이므로 중복 role 제거 */
      aria-roledescription="carousel"
      aria-label="배너 카드"
      aria-live="polite"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="bc-carousel-inner">
        {/* 카드 한 장 */}
        <Link to={href} className="bc-card">
          <div className="bc-card-text">
            <h3 className="bc-card-title">{title}</h3>
            {subtitle && <p className="bc-card-sub">{subtitle}</p>}
          </div>

          {img ? (
            <img className="bc-card-img" src={img} alt={title} />
          ) : (
            <div className="bc-card-img placeholder" aria-hidden />
          )}
        </Link>

        {/* 좌우 네비게이션 */}
        {total > 1 && (
          <>
            <button className="bc-nav prev" aria-label="이전" onClick={onPrev}>
              ‹
            </button>
            <button className="bc-nav next" aria-label="다음" onClick={onNext}>
              ›
            </button>
          </>
        )}

        {/* (3) 도트 ARIA 단순화 */}
        {total > 1 && (
          <div className="bc-dots" aria-label="슬라이드 선택">
            {Array.from({ length: total }).map((_, i) => (
              <button
                key={i}
                className={`bc-dot ${i === index ? "active" : ""}`}
                aria-label={`${i + 1}번 슬라이드로 이동`}
                aria-pressed={i === index}
                onClick={() => onDot(i)}
                title={`${i + 1}번 슬라이드`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
