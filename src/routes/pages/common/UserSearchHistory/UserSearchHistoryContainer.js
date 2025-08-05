import React, { useState, useEffect, useContext } from "react";
import UserSearchHistoryPresenter from "./UserSearchHistoryPresenter";
import axios from "axios";
import { LoginContext } from "../SignIn/LoginContext";

const ITEMS_PER_PAGE = 6;

function UserSearchHistoryContainer() {
  const { user } = useContext(LoginContext);
  const userId = user?.user_id;

  const [page, setPage] = useState(1);
  const [historyList, setHistoryList] = useState([]);
  const [totalCount, setTotalCount] = useState(0); // 총 검색 기록 개수
  const [allRecipes, setAllRecipes] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // 검색 기록 불러오기 (조건에 맞는 페이지만 요청)
  useEffect(() => {
    if (!userId) {
      setHistoryList([]);
      setTotalCount(0);
      return;
    }
    async function fetchSearchHistory() {
      try {
        const url = `http://localhost:8000/api/search-history/${userId}?page=${page}&items_per_page=${ITEMS_PER_PAGE}`;
        const res = await axios.get(url);
        // 여기서 totalCount도 받아온다고 가정
        setHistoryList(res.data.histories);
        setTotalCount(res.data.totalCount);     // 서버에서 총 개수 받아야 함
      } catch (error) {
        setHistoryList([]);
        setTotalCount(0);
      }
    }
    fetchSearchHistory();
  }, [userId, page]);

  // 전체 레시피 불러오기
  useEffect(() => {
    async function fetchRecipes() {
      try {
        const res = await axios.get("http://localhost:8000/api/recipelist");
        setAllRecipes(Array.isArray(res.data) ? res.data : res.data.recipes || []);
      } catch (error) {
        setAllRecipes([]);
      }
    }
    fetchRecipes();
  }, []);

  // 중복 제거: 같은 recipe_id 한 번만
  const uniqueHistoryList = Array.isArray(historyList)
    ? historyList.filter(
        (h, idx, arr) =>
          arr.findIndex(v => String(v.recipe_id) === String(h.recipe_id)) === idx
      )
    : [];

  // 카드용 레시피 리스트 표준화
  const recipeList = uniqueHistoryList
    .map(h => {
      const r = allRecipes.find(r => String(r.id) === String(h.recipe_id));
      if (!r) return null;
      return {
        id: r.id,
        RCP_SEQ: r.id,
        name: r.name,
        RCP_NM: r.name,
        image_url: r.image_url || r.ATT_FILE_NO_MAIN,
        ATT_FILE_NO_MAIN: r.image_url || r.ATT_FILE_NO_MAIN,
        avg_rating: r.avg_rating ?? r.AVG_RATING ?? 0,
        AVG_RATING: r.avg_rating ?? r.AVG_RATING ?? 0,
        rating_count: r.rating_count ?? r.RATING_COUNT ?? 0,
        RATING_COUNT: r.rating_count ?? r.RATING_COUNT ?? 0,
        view_count: r.view_count ?? r.VIEW_COUNT ?? 0,
        VIEW_COUNT: r.view_count ?? r.VIEW_COUNT ?? 0,
        history_id: h.id,
      };
    })
    .filter(Boolean);

  // 총 페이지 계산 (totalCount 기반)
  useEffect(() => {
    setTotalPages(Math.ceil(totalCount / ITEMS_PER_PAGE));
  }, [totalCount]);

  return (
    <UserSearchHistoryPresenter
      recipeList={recipeList}
      userId={userId}
      page={page}
      totalPages={totalPages}
      setPage={setPage}
    />
  );
}

export default UserSearchHistoryContainer;
