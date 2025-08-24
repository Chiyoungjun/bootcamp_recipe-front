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
  const [totalCount, setTotalCount] = useState(0);
  const [allRecipes, setAllRecipes] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]); // 회원 레시피 추가!
  const [totalPages, setTotalPages] = useState(1);

  // 검색 기록 페이징 불러오기
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
        setHistoryList(res.data.histories);
        setTotalCount(res.data.totalCount);
      } catch (error) {
        setHistoryList([]);
        setTotalCount(0);
      }
    }
    fetchSearchHistory();
  }, [userId, page]);

  // 전체 기본 레시피 불러오기
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

  // 회원(사용자) 레시피 불러오기
  useEffect(() => {
    if (!userId) return;
    async function fetchUserRecipes() {
      try {
        const res = await axios.get(`http://localhost:8000/api/users/${userId}/recipes`);
        setUserRecipes(Array.isArray(res.data) ? res.data : res.data.recipes || []);
      } catch (error) {
        setUserRecipes([]);
      }
    }
    fetchUserRecipes();
  }, [userId]);

  // 중복 제거: 같은 recipe_id나 user_recipe_id 한 번만
const uniqueHistoryList = Array.isArray(historyList)
  ? historyList.filter(
      (h, idx, arr) =>
        (h.recipe_id && arr.findIndex(v => String(v.recipe_id) === String(h.recipe_id)) === idx) ||
        (h.user_recipe_id && arr.findIndex(v => String(v.user_recipe_id) === String(h.user_recipe_id)) === idx)
    )
  : [];

  // 카드용 레시피 리스트 표준화 (기본+회원 레시피 모두)
const recipeList = historyList
  .map(h => {
    const r = h.recipe_info;
    if (!r) return null;
    return {
      id: r.id ?? h.recipe_id ?? h.user_recipe_id,
      name: r.name,
      image_url: r.image_url || r.ATT_FILE_NO_MAIN,
      avg_rating: r.avg_rating ?? r.AVG_RATING ?? 0,
      rating_count: r.rating_count ?? r.RATING_COUNT ?? 0,
      view_count: r.view_count ?? r.VIEW_COUNT ?? 0,
      user_id: r.user_id,
      user_recipe_id: h.user_recipe_id,
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
