import React from "react";
// ✅ 경로 확인: components 철자 주의
import Card1Container from "../../../compoents/Card1";
import "./UserRecipe.css";

export default function UserRecipePresenter({
  loading,
  error,
  recipes,
  onClickCreate,
  onReload,
}) {
  return (
    <div className="user-recipe-root">
      {/* 헤더 */}
      <div className="user-recipe-header">
        <h2 className="user-recipe-title">내 레시피</h2>
        <button
          type="button"
          className="user-recipe-create-btn"
          onClick={onClickCreate}
        >
          등록하기
        </button>
      </div>

      {/* 로딩/에러 */}
      {loading && <div className="user-recipe-state">불러오는 중…</div>}
      {!loading && error && (
        <div className="user-recipe-state error">
          {error}
          <button
            type="button"
            className="user-recipe-retry-btn"
            onClick={onReload}
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 본문 */}
      {!loading && !error && (
        <>
          {(!recipes || recipes.length === 0) ? (
            <div className="user-recipe-empty">
              <p>등록된 요리가 없습니다.</p>
              <button
                type="button"
                className="user-recipe-create-secondary"
                onClick={onClickCreate}
              >
                지금 등록하기
              </button>
            </div>
          ) : (
            <div className="user-recipe-grid">
              {recipes.map((r) => (
                <Card1Container
                  key={r.id}

                  /* ✅ Card1Container가 기대하는 prop 이름에 맞춰 매핑하세요.
                     아래는 흔한 필드명 기준 기본 매핑입니다. */
                  id={r.id}
                  title={r.title}
                  image={r.thumbnail || r.imageUrl}
                  rating={r.ratingAvg ?? r.rating ?? 0}
                  ratingCount={r.ratingCount ?? 0}
                  views={r.views ?? r.viewCount ?? 0}

                  /* 필요 시 추가:
                  tags={r.tags}
                  onClick={() => navigate(`/recipe/${r.id}`)}
                  */
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
