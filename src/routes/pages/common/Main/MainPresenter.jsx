import React from "react";
import PaginationPresenter from "../../../compoents/pagination/PaginationPresenter";
import RecipeListContainer from "../../../compoents/recipe/RecipeListContainer";
import BannerContainer from "../Banner/BannerContainer";
import "./Main.css";

const MainPresenter = ({
  recipes,
  searchKeyword,
  onSearchInputChange,
  onSearch,
  page,
  setPage,
  itemsPerPage,
  onPlusClick,
  previewUrl,
  showModal,
  setShowModal,
  onConfirmUpload,
}) => {
  const totalPages = Math.ceil(recipes.length / itemsPerPage);
  const startIdx = (page - 1) * itemsPerPage;
  const currentRecipes = recipes.slice(startIdx, startIdx + itemsPerPage);

  return (
    <>
      {/* 배너 영역: 별도 div */}
      <div className="main-banner-section">
        <BannerContainer />
      </div>

      {/* 검색창: 별도 div */}
      <div className="main-search-section">
        <div className="main-search-box">
          <span className="main-search__icon">🔍</span>
          <input
            type="text"
            className="main-search__input"
            placeholder="레시피 검색"
            value={searchKeyword}
            onChange={onSearchInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearch();
            }}
          />
          <button
            onClick={onPlusClick}
            className="main-search__plus-btn"
            type="button"
          >
            +
          </button>
        </div>
      </div>

      {/* 본문: 리스트/페이지네이션/모달은 main-root로 묶음 */}
      <div className="main-root">
        {/* 이미지 모달 */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>이미지 미리보기</h3>
              <img
                src={previewUrl}
                alt="미리보기"
                style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "8px" }}
              />
              <div style={{ marginTop: "16px" }}>
                <button onClick={onConfirmUpload} className="modal-confirm-btn">
                  확인
                </button>
                <button onClick={() => setShowModal(false)} className="modal-cancel-btn">
                  취소
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 레시피 리스트 및 페이지네이션 */}
        <RecipeListContainer recipes={currentRecipes} />
        <PaginationPresenter
          totalPages={totalPages}
          currentPage={page}
          onPageChange={setPage}
        />
      </div>
    </>
  );
};

export default MainPresenter;
