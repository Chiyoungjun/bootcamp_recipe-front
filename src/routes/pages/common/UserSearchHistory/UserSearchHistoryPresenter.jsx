import React from "react";
import Card1Container from "../../../compoents/Card1";
import Card2Container from "../../../compoents/Card2"; // ← 추가!
import './UserSearchHistory.css';

function UserSearchHistoryPresenter({
  recipeList,
  userId,
  page,
  totalPages,
  setPage,
}) {
  return (
    <div className="history-bg">
      <div className="history-widebox">
        <h2 className="history-title">검색 기록</h2>
        <div className="history-list-grid">
          {recipeList.length > 0 ? (
            recipeList.map(recipe =>
              // user_id 또는 user_recipe_id가 있으면 회원 레시피 카드로!
              recipe.user_id || recipe.user_recipe_id ? (
                <Card2Container
                  key={recipe.history_id || recipe.id}
                  recipe={recipe}
                  userId={userId}
                />
              ) : (
                <Card1Container
                  key={recipe.history_id || recipe.id}
                  recipe={recipe}
                  userId={userId}
                />
              )
            )
          ) : (
            <div style={{ padding: "2rem", textAlign: "center", color: "#888" }}>
              검색 기록이 없습니다.
            </div>
          )}
        </div>
        <div className="history-pagination">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx + 1}
              onClick={() => setPage(idx + 1)}
              className={`pagination-btn${page === idx + 1 ? " active" : ""}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserSearchHistoryPresenter;
