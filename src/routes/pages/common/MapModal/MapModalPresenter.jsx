import React, { useRef, useEffect } from "react";
import "./MapModal.css";

/**
 * 모달 전담 프레젠터
 * - 오버레이/닫기/검색 UI/지도 컨테이너/검색결과 리스트
 * - 지도 렌더링 자체는 컨테이너에서 담당 (props로 콜백 전달)
 */
export default function MapModalPresenter({
  open,
  onClose,
  keyword,
  onChangeKeyword,
  radius,
  onChangeRadius,
  onSearch,
  onInitMapContainer,   // 지도 div ref 전달받는 콜백 (컨테이너가 지도 붙임)
  results,
  isLoading,
  error,
}) {
  const mapDivRef = useRef(null);

  // 모달 열릴 때마다 지도 DOM을 컨테이너에 전달
  useEffect(() => {
    if (open && mapDivRef.current) {
      onInitMapContainer(mapDivRef.current);
    }
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

        {/* 검색폼 */}
        <div className="mm-toolbar">
          <input
            className="mm-input"
            type="text"
            value={keyword}
            onChange={(e) => onChangeKeyword(e.target.value)}
            placeholder="예: 구운주먹밥, 주먹밥, 분식"
          />
          <select
            className="mm-select"
            value={radius}
            onChange={(e) => onChangeRadius(Number(e.target.value))}
            title="검색 반경"
          >
            <option value={500}>500m</option>
            <option value={1000}>1km</option>
            <option value={2000}>2km</option>
            <option value={3000}>3km</option>
          </select>
          <button className="mm-btn" onClick={onSearch} disabled={isLoading}>
            {isLoading ? "검색 중..." : "검색"}
          </button>
        </div>

        {/* 본문: 지도 + 결과리스트 */}
        <div className="mm-body">
          <div className="mm-map" ref={mapDivRef} />
          <div className="mm-side">
            {error && <div className="mm-error">{error}</div>}
            {!error && results.length === 0 && !isLoading && (
              <div className="mm-empty">검색 결과가 없습니다.</div>
            )}
            <ul className="mm-list">
              {results.map((p) => (
                <li key={p.id} className="mm-item">
                  <div className="mm-item-title">{p.place_name}</div>
                  <div className="mm-item-sub">
                    {p.road_address_name || p.address_name}
                  </div>
                  {p.phone && <div className="mm-item-sub">{p.phone}</div>}
                  {p.place_url && (
                    <a
                      href={p.place_url}
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

        {/* 푸터 안내 */}
        <div className="mm-footer">
          현재 위치 중심으로 반경 내 가게를 검색합니다. (브라우저 위치 권한 필요)
        </div>
      </div>
    </div>
  );
}
