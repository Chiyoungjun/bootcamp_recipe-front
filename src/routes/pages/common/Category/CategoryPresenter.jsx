import React from 'react';
import Card1Container from '../../../compoents/Card1';
import './Category.css';

const ALL_CATEGORIES = [
  '한식', '샐러드', '일식', '양식', '밥',
  '국, 찌개', '면', '반찬', '구이, 찜', '기타'
];

const PAGE_GROUP_SIZE = 5;

const CategoryPresenter = ({
  recipeList,
  category,
  setCategory,
  search,
  setSearch,
  page,
  setPage,
  loading,
  totalPages,
  userId, // ✅ 컨테이너에서 받은 userId
}) => {
  const currentGroup = Math.floor((page - 1) / PAGE_GROUP_SIZE);
  const startPage = currentGroup * PAGE_GROUP_SIZE + 1;
  const endPage = Math.min(startPage + PAGE_GROUP_SIZE - 1, totalPages);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const goToFirst = () => setPage(1);
  const goToLast = () => setPage(totalPages);
  const goToPrevPage = () => setPage(Math.max(1, page - 1));
  const goToNextPage = () => setPage(Math.min(totalPages, page + 1));

  return (
    <div className="category-root">
      <div className="category-full-filter-wrap">
        {ALL_CATEGORIES.map(cat => (
          <button
            key={cat}
            className={cat === category ? 'cat-btn active' : 'cat-btn'}
            onClick={() => {
              setCategory(cat);
              setPage(1);
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="category-search-row">
        <h2 className="category-title">레시피를 찾아보아요</h2>
        <input
          className="category-search-input"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="🔍 원하는 태그를 입력해보세요."
        />
      </div>

      {loading && <div className="loading-text">로딩 중...</div>}

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
            userId={userId}  // ✅ 여기서 사용
          />
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="category-pagination">
        <button disabled={page === 1} className="page-btn" onClick={goToFirst} aria-label="처음 페이지">
          &laquo;
        </button>

        <button disabled={page === 1} className="page-btn" onClick={goToPrevPage} aria-label="이전 페이지">
          &lt;
        </button>

        {pageNumbers.map(num => (
          <button
            key={num}
            className={`page-btn${num === page ? ' active' : ''}`}
            onClick={() => setPage(num)}
          >
            {num}
          </button>
        ))}

        <button disabled={page === totalPages} className="page-btn" onClick={goToNextPage} aria-label="다음 페이지">
          &gt;
        </button>

        <button disabled={page === totalPages} className="page-btn" onClick={goToLast} aria-label="마지막 페이지">
          &raquo;
        </button>
      </div>
    </div>
  );
};

export default CategoryPresenter;
