import React from "react";
// 경로 맞게 수정하세요
import Card2Container from "../../../compoents/Card2";
import "./UserRecipe.css";

export default function UserRecipePresenter({
  loading,
  error,
  recipes,
  onClickCreate,
  onReload,
  setSelectedMenu,      // 마이페이지 상태 전환용 함수 (추가)
  setEditTarget,        // 레시피 수정 데이터 설정용 함수 (추가)
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
                <Card2Container
                  key={r.id}
                  recipe={r}
                  fromMyPage={true}
                  setSelectedMenu={setSelectedMenu}   // 추가
                  setEditTarget={setEditTarget}       // 추가
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}