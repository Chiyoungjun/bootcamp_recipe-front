import React, { useCallback, useEffect, useRef, useState } from "react";
import MapModalPresenter from "./MapModalPresenter";

const KAKAO_APP_KEY = "YOUR_KAKAO_JAVASCRIPT_KEY"; // ← 본인 JS 키로 교체

export default function MapModalContainer({
  open,
  onClose,
  defaultKeyword = "", // 예: recipe?.name 또는 recipe?.RCP_NM
}) {
  const [keyword, setKeyword] = useState(defaultKeyword || "분식");
  const [radius, setRadius] = useState(2000); // m
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const mapRef = useRef(null);       // kakao.maps.Map
  const mapDivRef = useRef(null);    // 지도 DOM
  const placesRef = useRef(null);    // kakao.maps.services.Places
  const markersRef = useRef([]);     // 생성한 마커들
  const infoWindowRef = useRef(null);// 공용 인포윈도우
  const myPosRef = useRef(null);     // 현재 위치 LatLng

  // 카카오 SDK 로드
  const loadScript = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (window.kakao && window.kakao.maps) return resolve();

      const script = document.createElement("script");
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&libraries=services`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Kakao SDK 로드 실패(네트워크/도메인/키 확인)"));
      document.head.appendChild(script);
    });
  }, []);

  // Presenter에서 지도 div를 받아옴
  const handleInitMapContainer = useCallback((node) => {
    mapDivRef.current = node;
  }, []);

  // 지도 초기화
  const initMap = useCallback(() => {
    if (!mapDivRef.current) return;
    const kakao = window.kakao;

    // 위치권한 거부 대비: 서울시청
    const defaultCenter = new kakao.maps.LatLng(37.566535, 126.9779692);

    mapRef.current = new kakao.maps.Map(mapDivRef.current, {
      center: defaultCenter,
      level: 5,
    });
    infoWindowRef.current = new kakao.maps.InfoWindow({ zIndex: 2 });
    placesRef.current = new kakao.maps.services.Places();

    // 현재 위치 시도
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const latlng = new kakao.maps.LatLng(latitude, longitude);
          myPosRef.current = latlng;
          mapRef.current.setCenter(latlng);

          new kakao.maps.Marker({
            map: mapRef.current,
            position: latlng,
          });
        },
        () => { /* 권한 거부 시 기본 좌표 유지 */ },
        { enableHighAccuracy: true, timeout: 7000 }
      );
    }
  }, []);

  // 마커 전체 삭제
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
  }, []);

  // 검색 실행 (kwOverride 전달 시 그걸로 검색)
  const doSearch = useCallback(
    (kwOverride) => {
      const kakao = window.kakao;
      if (!placesRef.current || !mapRef.current) return;

      setIsLoading(true);
      setError("");
      setResults([]);
      clearMarkers();

      const center = myPosRef.current || mapRef.current.getCenter();
      const query = (kwOverride ?? keyword ?? "분식").trim() || "분식";

      const cb = (data, status) => {
        setIsLoading(false);
        if (status !== kakao.maps.services.Status.OK) {
          setError("검색 실패 또는 결과 없음");
          return;
        }
        setResults(data);

        const bounds = new kakao.maps.LatLngBounds();

        data.forEach((p) => {
          const pos = new kakao.maps.LatLng(p.y, p.x);
          bounds.extend(pos);

          const marker = new kakao.maps.Marker({
            map: mapRef.current,
            position: pos,
          });

          kakao.maps.event.addListener(marker, "click", () => {
            const html = `
              <div style="padding:6px 8px;white-space:nowrap;">
                <div style="font-weight:600;margin-bottom:2px;">${p.place_name}</div>
                <div style="font-size:12px;">${p.road_address_name || p.address_name || ""}</div>
                ${p.phone ? `<div style="font-size:12px;">${p.phone}</div>` : ""}
                <a href="${p.place_url}" target="_blank" rel="noreferrer" style="font-size:12px;display:inline-block;margin-top:4px;">
                  카카오맵 상세보기
                </a>
              </div>
            `;
            infoWindowRef.current.setContent(html);
            infoWindowRef.current.open(mapRef.current, marker);
          });

          markersRef.current.push(marker);
        });

        if (data.length > 0) {
          mapRef.current.setBounds(bounds);
        }
      };

      placesRef.current.keywordSearch(query, cb, {
        location: center,
        radius: radius,
        sort: kakao.maps.services.SortBy.DISTANCE,
      });
    },
    [keyword, radius, clearMarkers]
  );

  // 모달 열릴 때 + defaultKeyword 바뀔 때: 입력값 동기화
  useEffect(() => {
    if (open) {
      setKeyword(defaultKeyword || "분식");
    }
  }, [open, defaultKeyword]);

  // 모달 열릴 때: SDK 로드 → 지도 초기화 → 기본 검색을 defaultKeyword로 강제
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!open) return;

      try {
        await loadScript();
        if (!mounted) return;
        window.kakao.maps.load(() => {
          initMap();
          doSearch(defaultKeyword || "분식"); // ← 초기 검색을 레시피 키워드로
        });
      } catch (e) {
        setError("지도를 불러오지 못했습니다. (키/네트워크 확인)");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [open, loadScript, initMap, doSearch, defaultKeyword]);

  return (
    <MapModalPresenter
      open={open}
      onClose={onClose}
      keyword={keyword}
      onChangeKeyword={setKeyword}
      radius={radius}
      onChangeRadius={setRadius}
      onSearch={() => doSearch()}               // 입력창 값으로 검색
      onInitMapContainer={handleInitMapContainer}
      results={results}
      isLoading={isLoading}
      error={error}
    />
  );
}
