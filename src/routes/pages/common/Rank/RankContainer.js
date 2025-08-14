import React, { useEffect, useState, useContext, useMemo } from "react";
import RankPresenter from "./RankPresenter";
import axios from "axios";
import { LoginContext } from "../SignIn/LoginContext";
import { useLocation } from "react-router-dom";

// 드롭다운 라벨 ↔ API 키 매핑
const PERIOD_LABEL_BY_KEY = { daily: "일간", weekly: "주간", monthly: "월간" };
const PERIOD_KEY_BY_LABEL = { "일간": "daily", "주간": "weekly", "월간": "monthly" };

const API_BASE = "http://localhost:8000"; // 필요 시 환경변수로 교체

function RankContainer() {
  const { user } = useContext(LoginContext);
  const userId = user?.user_id;

  const location = useLocation();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // ★ 핵심: 최초 렌더에서 URL 쿼리를 읽어 초기 라벨을 결정
  const initialLabel = (() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("period"); // daily | weekly | monthly
    return (q && PERIOD_LABEL_BY_KEY[q]) ? PERIOD_LABEL_BY_KEY[q] : "일간";
  })();
  const [period, setPeriod] = useState(initialLabel); // 드롭다운은 라벨(한글)로 관리

  // 현재 라벨 → API용 키(daily/weekly/monthly)
  const periodKey = useMemo(
    () => PERIOD_KEY_BY_LABEL[period] ?? "daily",
    [period]
  );

  // (선택) #filter 앵커로 스크롤
  useEffect(() => {
    if (location.hash === "#filter") {
      const el = document.getElementById("filter");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  // periodKey 변경 시마다 데이터 호출
  useEffect(() => {
    let alive = true;
    const fetchRankData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/api/rankings`, {
          params: { period: periodKey },
        });
        const list =
          Array.isArray(res.data) ? res.data :
          Array.isArray(res.data?.recipes) ? res.data.recipes :
          Array.isArray(res.data?.items) ? res.data.items : [];
        if (alive) setRecipes(list);
      } catch (err) {
        console.error("랭킹 데이터 불러오기 실패:", err);
        if (alive) setRecipes([]);
      } finally {
        if (alive) setLoading(false);
      }
    };
    fetchRankData();
    return () => { alive = false; };
  }, [periodKey]);

  return (
    <RankPresenter
      recipes={recipes}
      period={period}
      setPeriod={setPeriod}  // 드롭다운 변경 시 상태만 갱신 → 자동 재호출
      loading={loading}
      userId={userId}
    />
  );
}

export default RankContainer;
