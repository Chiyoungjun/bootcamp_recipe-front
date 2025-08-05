import React, { useState, useEffect, useContext } from "react";
import UserFavoritesPresenter from "./UserFavoritesPresenter";
import axios from "axios";
import { LoginContext } from "../SignIn/LoginContext";

const ITEMS_PER_PAGE = 6;

function UserFavoritesContainer() {
  const { user } = useContext(LoginContext);
  const userId = user?.user_id;

  const [page, setPage] = useState(1);
  const [favoritesRaw, setFavoritesRaw] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!userId) {
      setFavoritesRaw([]);
      return;
    }
    async function fetchFavorites() {
      try {
        // 반드시 /api/favorites/{userId}로 요청!
        const res = await axios.get(`http://localhost:8000/api/favorites/${userId}`);
        // API 응답이 { favorites: [...] } 형태임을 가정
        setFavoritesRaw(Array.isArray(res.data.favorites) ? res.data.favorites : []);
      } catch (e) {
        setFavoritesRaw([]);
      }
    }
    fetchFavorites();
  }, [userId]);

  // 페이지에 맞는 즐겨찾기 추출
  const favoritesToShow = favoritesRaw.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setTotalPages(Math.max(1, Math.ceil(favoritesRaw.length / ITEMS_PER_PAGE)));
  }, [favoritesRaw]);

  return (
    <UserFavoritesPresenter
      recipeList={favoritesToShow}
      userId={userId}
      page={page}
      totalPages={totalPages}
      setPage={setPage}
    />
  );
}

export default UserFavoritesContainer;
