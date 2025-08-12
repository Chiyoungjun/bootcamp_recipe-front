import React from "react";
import Card1Container from "../../../compoents/Card1";
import './UserFavorites.css';

function UserFavoritesPresenter({
  recipeList,
  userId,
  page,
  totalPages,
  setPage
}) {
  return (
    <div className="favorites-bg">
      <div className="favorites-widebox">
        <h2 className="favorites-title">즐겨찾기</h2>
        <div className="favorites-list-grid">
          {recipeList && recipeList.length > 0 ? (
            recipeList.map(recipe => (
              <Card1Container
                key={recipe.id}
                recipe={recipe}
                userId={userId}
              />
            ))
          ) : (
            <div style={{ padding: "2rem", textAlign: "center", color: "#888" }}>
              즐겨찾기한 레시피가 없습니다.
            </div>
          )}
        </div>
        <div className="favorites-pagination">
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

export default UserFavoritesPresenter;