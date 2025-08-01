import React from 'react';
// import Card from '../../../components/cards/Card/Card';
import './Category.css';

const ALL_CATEGORIES = [
  '한식', '중식', '일식', '퓨전 요리', '양식',
  '밥', '국, 찌개', '면', '반찬', '구이, 찜'
];

export default function CategoryPresenter({
  recipeList,
  category,
  setCategory,
  search,
  setSearch,
  page,
  setPage,
}) {
  return (
    <div className="category-root">
      {/* 카테고리: 한 줄에 5개씩 자동 줄바꿈 */}
      <div className="category-full-filter-wrap">
        {ALL_CATEGORIES.map(cat => (
          <button
            key={cat}
            className={cat === category ? 'cat-btn active' : 'cat-btn'}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 검색/타이틀 */}
      <div className="category-search-row">
        <h2 className="category-title">레시피를 찾아보아요</h2>
        <input
          className="category-search-input"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 원하는 태그를 입력해보세요."
        />
      </div>
      {/* 카드 리스트 */}
      <div className="category-card-list">
        {/* {recipeList.map(recipe => (
          <Card
            key={recipe.id}
            image={recipe.img}
            title={recipe.title}
            stars={recipe.stars}
            views={recipe.views}
          />
        ))} */}
      </div>
      {/* 페이지네이션 */}
      <div className="category-pagination">
        <button disabled className="page-btn active">1</button>
        <button className="page-btn">2</button>
        <button className="page-btn">3</button>
        <span className="page-ellipsis">...</span>
        <button className="page-btn">9</button>
        <button className="page-btn">10</button>
      </div>
    </div>
  );
}