import React, { useState, useEffect, useContext } from 'react';
import CategoryPresenter from './CategoryPresenter';
import axios from 'axios';
import { LoginContext } from '../SignIn/LoginContext'; // 경로 주의!
import { useLocation } from 'react-router-dom';

const ITEMS_PER_PAGE = 12; // 한 페이지에 보여줄 아이템 수

function CategoryContainer() {
  const { user } = useContext(LoginContext);
  const userId = user?.user_id;
  const location = useLocation();

  // 쿼리 → 내부 라벨 매핑 (필요 시 확장: soup:'국/탕', stew:'찌개' 등)
  const CATEGORY_LABEL_BY_KEY = { salad: '샐러드' };

  // ★ 최초 렌더에서 URL 쿼리(category=salad)를 읽어 초기 카테고리 결정
  const initialCategory = (() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('category'); // 예: 'salad'
    return (q && CATEGORY_LABEL_BY_KEY[q]) ? CATEGORY_LABEL_BY_KEY[q] : '한식';
  })();

  const [category, setCategory] = useState(initialCategory);
  const [subCategory, setSubCategory] = useState(
    initialCategory === '샐러드' ? '샐러드' : '밥'
  );
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [recipeList, setRecipeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  // (선택) 배너에서 #filter로 내려오면 해당 위치로 스크롤
  useEffect(() => {
    if (location.hash === '#filter') {
      const el = document.getElementById('filter');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash]);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const params = {
          category,        // 백엔드가 한글 라벨을 받는다면 그대로 사용
          search,
          page,
          page_size: ITEMS_PER_PAGE,
        };

        const response = await axios.get('http://localhost:8000/api/recipes', { params });
        const data = response.data;

        console.log('API 응답:', data);

        const recipes = data.recipes || data.data?.recipes || [];
        setRecipeList(recipes);

        const totalCount =
          data.total_count || data.data?.total_count || recipes.length;

        const calculatedTotalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
        setTotalPages(calculatedTotalPages);

        console.log('총 개수:', totalCount);
        console.log('총 페이지 수:', calculatedTotalPages);
      } catch (error) {
        console.error('레시피 목록 불러오기 실패:', error);
        setRecipeList([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [category, search, page]);

  return (
    <CategoryPresenter
      recipeList={recipeList}
      category={category}
      setCategory={(val) => {
        setCategory(val);
        // 선택적으로 subCategory도 동기화
        if (val === '샐러드') setSubCategory('샐러드');
      }}
      subCategory={subCategory}
      setSubCategory={setSubCategory}
      search={search}
      setSearch={setSearch}
      page={page}
      setPage={setPage}
      loading={loading}
      totalPages={totalPages}
      userId={userId}  // ✅ 여기서 전달
    />
  );
}

export default CategoryContainer;
