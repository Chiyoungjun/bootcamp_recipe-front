import React from "react";
import "./BannerCards.css";

/**
 * 카드 1장만 렌더 (네비/도트/클릭은 상위 BannerPresenter가 처리)
 * 이미지 위 오버레이 텍스트 레이아웃
 */
export default function BannerCardPresenter({
  image,
  title,
  desc,
  bg = "#111827",
  alt = "배너",
}) {
  return (
    <section className="bc-root" aria-label="배너 카드" aria-live="polite">
      <div className="bc-card" style={{ backgroundColor: bg }}>
        {/* 미디어 레이어 */}
        <div className="bc-media">
          {image ? (
            <img className="bc-img" src={image} alt={alt || title} />
          ) : (
            <div className="bc-img placeholder" aria-hidden />
          )}
          {/* 가독성 향상용 그라디언트 */}
          <div className="bc-overlay" />
          {/* 오버레이 텍스트 */}
          <div className="bc-text">
            {title && <h3 className="bc-title">{title}</h3>}
            {desc && <p className="bc-desc">{desc}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
