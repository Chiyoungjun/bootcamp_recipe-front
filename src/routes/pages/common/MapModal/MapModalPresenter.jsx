import React, { useRef, useEffect } from "react";
import "./MapModal.css";

export default function MapModalPresenter({
  open,
  onClose,
  onInitMapContainer,
  results,
  isLoading,
  error,
  defaultKeyword,
  activeIndex,
  onActivateItem,
}) {
  const mapDivRef = useRef(null);

  useEffect(() => {
    if (open && mapDivRef.current) onInitMapContainer(mapDivRef.current);
  }, [open, onInitMapContainer]);

  if (!open) return null;

  return (
    <div className="mm-overlay" role="dialog" aria-modal="true">
      <div className="mm-modal">
        {/* 헤더 */}
        <div className="mm-header">
          <h3 className="mm-title">주변 가게 찾기</h3>
          <button className="mm-close" onClick={onClose} aria-label="닫기">✕</button>
        </div>

        {/* 본문: 그리드(좌 지도 / 우 목록) */}
        <div className="mm-body">
          <div className="mm-map" ref={mapDivRef} />
          <div className="mm-side">
            {isLoading && <div className="mm-loading">검색 중...</div>}
            {error && <div className="mm-error">{error}</div>}
            {!error && results.length === 0 && !isLoading && (
              <div className="mm-empty">검색 결과가 없습니다.</div>
            )}
            <ul className="mm-list">
              {results.map((p, index) => (
                <li
                  key={index}
                  className={`mm-item${activeIndex === index ? " mm-item-on" : ""}`}
                  tabIndex={0}
                  onClick={() => onActivateItem?.(index)}   // 클릭으로만 활성화
                >
                  <div className="mm-item-title">{p.name || p.place_name}</div>
                  <div className="mm-item-sub">
                    {p.road_address || p.road_address_name || p.address_name}
                  </div>
                  {p.phone && <div className="mm-item-sub">{p.phone}</div>}
                  {(p.url || p.place_url) && (
                    <a
                      href={p.url || p.place_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mm-link"
                    >
                      카카오맵에서 보기 →
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 푸터 */}
        <div className="mm-footer">
          현재 위치 중심으로 기본 키워드("{defaultKeyword}") 검색 결과를 보여줍니다.
        </div>
      </div>
    </div>
  );
}
