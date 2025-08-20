import React, { useCallback, useEffect, useRef, useState } from "react";
import MapModalPresenter from "./MapModalPresenter";

export default function MapModalContainer({ open, onClose, defaultKeyword = "" }) {
  // 상태
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mapReady, setMapReady] = useState(false);
  const [geoReady, setGeoReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // 레퍼런스
  const mapRef = useRef(null);
  const mapDivRef = useRef(null);
  const markersRef = useRef([]);        // kakao.maps.Marker[] (results 인덱스와 1:1)
  const infoWindowRef = useRef(null);   // kakao.maps.InfoWindow
  const myPosRef = useRef(null);        // kakao.maps.LatLng
  const myMarkerRef = useRef(null);     // 내 위치 마커
  const prevActiveRef = useRef(-1);     // 이전 활성 인덱스(아이콘 복구용)

  const KAKAO_APP_KEY = process.env.REACT_APP_KAKAO_JS_KEY;

  // -----------------------------
  // 마커 아이콘 (SVG → data URL)
  // -----------------------------
  const makePinSrc = (fill, stroke) => {
    const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='30' height='42' viewBox='0 0 30 42'>
      <path d='M15 2c7.18 0 13 5.61 13 12.52 0 8.35-10.1 18.12-12.46 20.29a1 1 0 0 1-1.36 0C11.82 32.64 2 22.87 2 14.52 2 7.61 7.82 2 15 2z' fill='${fill}' stroke='${stroke}' stroke-width='2'/>
      <circle cx='15' cy='15' r='4.2' fill='white'/>
    </svg>`;
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  };
  const ICON = {
    default: { fill: "#3B82F6", stroke: "#1D4ED8" },  // 파랑(일반)
    active:  { fill: "#F59E0B", stroke: "#D97706" },  // 주황(선택)
    me:      { fill: "#10B981", stroke: "#059669" },  // 초록(내 위치)
  };
  const PIN_SIZE = { w: 30, h: 42, ax: 15, ay: 42 };   // 앵커: 하단 중앙

  // --------------------------------
  // 지도 컨테이너 리레이아웃(하단 공백 방지)
  // --------------------------------
  const ensureRelayout = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const center = map.getCenter();
    map.relayout();
    map.setCenter(center);
  }, []);

  // -----------------------------
  // 지도 초기화
  // -----------------------------
  const initMap = useCallback(() => {
    if (!mapDivRef.current) return;
    if (!window.kakao || !window.kakao.maps) return;

    const { kakao } = window;
    const defaultCenter = new kakao.maps.LatLng(37.566535, 126.9779692);

    mapRef.current = new kakao.maps.Map(mapDivRef.current, {
      center: defaultCenter,
      level: 5,
      tileAnimation: false, // 이동/확대 시 배경 번쩍임 최소화
    });

    infoWindowRef.current = new kakao.maps.InfoWindow({ zIndex: 2 });
    setMapReady(true);

    // 모달 오픈 애니메이션 직후 한 틱 뒤 리레이아웃
    setTimeout(ensureRelayout, 0);

    // 내 위치
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const latlng = new kakao.maps.LatLng(latitude, longitude);
          myPosRef.current = latlng;
          mapRef.current.setCenter(latlng);

          // 내 위치 마커(초록)
          const meImg = new kakao.maps.MarkerImage(
            makePinSrc(ICON.me.fill, ICON.me.stroke),
            new kakao.maps.Size(PIN_SIZE.w, PIN_SIZE.h),
            { offset: new kakao.maps.Point(PIN_SIZE.ax, PIN_SIZE.ay) }
          );
          myMarkerRef.current = new kakao.maps.Marker({
            map: mapRef.current,
            position: latlng,
            image: meImg,
            zIndex: 3,
          });

          setGeoReady(true);
        },
        () => setError("위치 권한이 없어 현재 위치 기준 검색이 불가합니다."),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    }
  }, [ensureRelayout]);

  // 마커/인포윈도우 정리
  const clearMarkers = useCallback(() => {
    if (infoWindowRef.current) infoWindowRef.current.close();
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    prevActiveRef.current = -1;
    setActiveIndex(-1);
  }, []);

  // 검색
  const doSearch = useCallback(
    (kw) => {
      const searchKeyword = (kw ?? defaultKeyword ?? "").trim();
      if (!mapRef.current || !searchKeyword) return;

      setIsLoading(true);
      setError("");
      setResults([]);
      clearMarkers();

      const center = myPosRef.current || mapRef.current.getCenter();
      const url = `http://localhost:8000/api/maps/search?keyword=${encodeURIComponent(
        searchKeyword
      )}&x=${center.getLng()}&y=${center.getLat()}&radius=2000&sort=distance`; // x=lng, y=lat

      fetch(url)
        .then(async (res) => {
          if (!res.ok) throw new Error(await res.text());
          return res.json();
        })
        .then((data) => {
          setIsLoading(false);
          if (!data.results?.length) {
            setError("검색 결과가 없습니다.");
            return;
          }
          setResults(data.results);
        })
        .catch((err) => {
          setIsLoading(false);
          setError("검색 중 오류가 발생했습니다: " + err.message);
        });
    },
    [defaultKeyword, clearMarkers]
  );

  // SDK 로드/해제
  useEffect(() => {
    if (!open) return;

    // 초기화
    setError("");
    setResults([]);
    setIsLoading(false);
    setMapReady(false);
    setGeoReady(false);
    mapRef.current = null;
    myPosRef.current = null;
    clearMarkers();

    const SCRIPT_ID = "kakao-maps-sdk";
    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false&libraries=services`;
      script.async = true;
      script.onload = () => window.kakao?.maps?.load(initMap);
      script.onerror = () => setError("카카오맵 SDK 스크립트 로드 실패(키/도메인 설정 확인).");
      document.head.appendChild(script);
    } else {
      window.kakao?.maps?.load(initMap);
    }

    // 정리
    return () => {
      clearMarkers();
      mapRef.current = null;
      myPosRef.current = null;
      if (myMarkerRef.current) myMarkerRef.current.setMap(null);
      myMarkerRef.current = null;
      setGeoReady(false);
      setMapReady(false);
      setIsLoading(false);
      setResults([]);
      setError("");
    };
  }, [open, KAKAO_APP_KEY, initMap, clearMarkers]);

  // 컨테이너 크기 변화 대응(하단 공백 방지)
  useEffect(() => {
    if (!open || !mapDivRef.current) return;
    const ro = new ResizeObserver(() => ensureRelayout());
    ro.observe(mapDivRef.current);
    return () => ro.disconnect();
  }, [open, ensureRelayout]);

  // 창 리사이즈 대응
  useEffect(() => {
    if (!open) return;
    window.addEventListener("resize", ensureRelayout);
    return () => window.removeEventListener("resize", ensureRelayout);
  }, [open, ensureRelayout]);

  // 지도 준비 + 위치 준비되면 자동 검색
  useEffect(() => {
    if (mapReady && geoReady) doSearch(defaultKeyword);
  }, [mapReady, geoReady, defaultKeyword, doSearch]);

  // 리스트/마커 "클릭"으로만 활성화
  const handleActivateItem = useCallback((idx) => {
    const map = mapRef.current;
    const { kakao } = window;
    if (!map || !kakao) return;

    // 이전 활성 마커 복구
    const prev = prevActiveRef.current;
    if (prev >= 0 && markersRef.current[prev]) {
      const img = new kakao.maps.MarkerImage(
        makePinSrc(ICON.default.fill, ICON.default.stroke),
        new kakao.maps.Size(PIN_SIZE.w, PIN_SIZE.h),
        { offset: new kakao.maps.Point(PIN_SIZE.ax, PIN_SIZE.ay) }
      );
      markersRef.current[prev].setImage(img);
    }

    // 현재 활성 마커 설정
    const marker = markersRef.current[idx];
    if (!marker) return;

    const activeImg = new kakao.maps.MarkerImage(
      makePinSrc(ICON.active.fill, ICON.active.stroke),
      new kakao.maps.Size(PIN_SIZE.w, PIN_SIZE.h),
      { offset: new kakao.maps.Point(PIN_SIZE.ax, PIN_SIZE.ay) }
    );
    marker.setImage(activeImg);
    setActiveIndex(idx);
    prevActiveRef.current = idx;

    // 말풍선 + 팬
    const p = results[idx];
    const title = p?.name || p?.place_name || "장소";
    const addr  = p?.road_address || p?.road_address_name || p?.address_name || "";
    infoWindowRef.current.setContent(
      `<div style="padding:6px 8px;font-size:12px;line-height:1.4">
         <div style="font-weight:600">${title}</div>
         <div style="color:#666">${addr}</div>
       </div>`
    );
    infoWindowRef.current.open(map, marker);
    map.panTo(marker.getPosition());
  }, [results]);

  // results → 마커 재생성
  useEffect(() => {
    const map = mapRef.current;
    const { kakao } = window;
    if (!map || !kakao) return;

    clearMarkers();
    if (!results?.length) return;

    const bounds = new kakao.maps.LatLngBounds();

    results.forEach((p, i) => {
      const lat = Number(p?.y ?? p?.lat);
      const lng = Number(p?.x ?? p?.lng);
      if (Number.isNaN(lat) || Number.isNaN(lng)) return;

      const pos = new kakao.maps.LatLng(lat, lng);
      const baseImg = new kakao.maps.MarkerImage(
        makePinSrc(ICON.default.fill, ICON.default.stroke),
        new kakao.maps.Size(PIN_SIZE.w, PIN_SIZE.h),
        { offset: new kakao.maps.Point(PIN_SIZE.ax, PIN_SIZE.ay) }
      );
      const marker = new kakao.maps.Marker({ map, position: pos, image: baseImg, zIndex: 2 });

      // 클릭만 동작
      kakao.maps.event.addListener(marker, "click", () => handleActivateItem(i));

      markersRef.current.push(marker);
      bounds.extend(pos);
    });

    if (!bounds.isEmpty()) {
      map.setBounds(bounds);
      setTimeout(ensureRelayout, 0); // bounds 적용 후 한 번 더 보정
    }
  }, [results, clearMarkers, handleActivateItem, ensureRelayout]);

  // Presenter에 지도를 붙일 DOM 전달
  const handleInitMapContainer = useCallback((node) => {
    mapDivRef.current = node;
  }, []);

  return (
    <MapModalPresenter
      open={open}
      onClose={onClose}
      onInitMapContainer={handleInitMapContainer}
      results={results}
      isLoading={isLoading}
      error={error}
      defaultKeyword={defaultKeyword}
      activeIndex={activeIndex}
      onActivateItem={handleActivateItem}
    />
  );
}
