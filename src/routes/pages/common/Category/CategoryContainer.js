import React, { useState, useEffect } from 'react';
import CategoryPresenter from './CategoryPresenter';
import axios from 'axios';

function CategoryContainer() {
  const [category, setCategory] = useState('한식');
  // subCategory는 현재 Presenter에서 쓰이지 않으니 필요하면 관련 UI 및 로직 추가 가능
  const [subCategory, setSubCategory] = useState('밥'); 
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [recipeList, setRecipeList] = useState([]);
  const [loading, setLoading] = useState(false);

  // 카테고리, 검색어, 페이지가 변경될 때마다 레시피 목록 fetch
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        // 간단 예시: 백엔드에 적절히 맞는 검색/카테고리 API 호출 예
        const params = {
          category,
          search,
          page,
        };

        // 예시 API URL, 실제 백엔드 API 경로와 파라미터에 맞게 조정
        const response = await axios.get('http://localhost:8000/api/recipes', { params });


        setRecipeList(response.data.recipes || []);
      } catch (error) {
        console.error('레시피 목록 불러오기 실패:', error);
        setRecipeList([]);
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
    />
  );
}

export default CategoryContainer;
