import React, { useState } from 'react';
import CategoryPresenter from './CategoryPresenter';

// const RECIPE_LIST = [
//   { id: 1, title: '비빔밥', img: '/images/bibimbap.jpg', stars: 5, views: 2025 },
//   { id: 2, title: '간장계란밥', img: '/images/eggsoy.jpg', stars: 4, views: 1600 },
//   { id: 3, title: '스크램블에그덮밥', img: '/images/scramble.jpg', stars: 4, views: 1500 },
//   { id: 4, title: '명란버섯덮밥', img: '/images/myeongran.jpg', stars: 5, views: 1500 },
//   { id: 5, title: '김밥', img: '/images/kimbap.jpg', stars: 4, views: 950 },
//   { id: 6, title: '삼겹살덮밥', img: '/images/porkbowl.jpg', stars: 4, views: 940 },
// ];

function CategoryContainer() {
  const [category, setCategory] = useState('한식');
  const [subCategory, setSubCategory] = useState('밥');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  return (
    <CategoryPresenter
      // recipeList={RECIPE_LIST}
      // recipeList = {}
      category={category}
      setCategory={setCategory}
      subCategory={subCategory}
      setSubCategory={setSubCategory}
      search={search}
      setSearch={setSearch}
      page={page}
      setPage={setPage}
    />
  );
}

export default CategoryContainer;