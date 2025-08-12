import React, { useState, useEffect, useContext } from 'react';
import CategoryPresenter from './CategoryPresenter';
import axios from 'axios';
import { LoginContext } from '../SignIn/LoginContext'; // 경로 주의!

const ITEMS_PER_PAGE = 12; // 한 페이지에 보여줄 아이템 수

function CategoryContainer() {
  const { user } = useContext(LoginContext);
  const userId = user?.user_id;

  const [category, setCategory] = useState('한식');
  const [subCategory, setSubCategory] = useState('밥');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [recipeList, setRecipeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const params = {
          category,
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
      setCategory={setCategory}
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
