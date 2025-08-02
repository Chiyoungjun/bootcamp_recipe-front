import React from 'react';
import Card1Container from '../../../components/cards/Card1/Card1Container';
import './Category.css';

const ALL_CATEGORIES = [
  '한식', '샐러드', '일식',  '양식','밥'
  , '국, 찌개', '면', '반찬', '구이, 찜','기타'
];

const CategoryPresenter = ({
  recipeList,
  category,
  setCategory,
  search,
  setSearch,
  page,
  setPage,
  loading,
}) => {
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

      {/* 로딩 중 표시 */}
      {loading && <div className="loading-text">로딩 중...</div>}

      {/* 카드 리스트 */}
      <div className="category-card-list">
        {(!loading && recipeList.length === 0) && (
          <div>레시피가 없습니다.</div>
        )}

        {!loading && recipeList.length > 0 && recipeList.map(recipe => (
          <Card1Container
            key={recipe.id || recipe.RCP_SEQ}
            recipe={{
              id: recipe.id || recipe.RCP_SEQ,
              name: recipe.name || recipe.RCP_NM,
              image_url: recipe.image_url || recipe.ATT_FILE_NO_MAIN,
              avg_rating: recipe.avg_rating ?? recipe.AVG_RATING ?? 0,
              rating_count: recipe.rating_count ?? recipe.RATING_COUNT ?? 0,
              view_count: recipe.view_count ?? recipe.VIEW_COUNT ?? 0,
            }}
          />
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="category-pagination">
        <button disabled={page === 1} className={`page-btn${page === 1 ? ' active' : ''}`} onClick={() => setPage(1)}>1</button>
        <button className="page-btn" onClick={() => setPage(2)}>2</button>
        <button className="page-btn" onClick={() => setPage(3)}>3</button>
        <span className="page-ellipsis">...</span>
        <button className="page-btn" onClick={() => setPage(9)}>9</button>
        <button className="page-btn" onClick={() => setPage(10)}>10</button>
      </div>
    </div>
  );
};

export default CategoryPresenter;
