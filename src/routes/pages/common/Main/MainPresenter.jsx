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
  userRecipes = [],
}) => {
  const totalPages = Math.ceil(recipes.length / itemsPerPage);
  const startIdx = (page - 1) * itemsPerPage;
  const currentRecipes = recipes.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div>
      {/*
        ✅ 여기서부터 검색창 위에 배너 카드 영역 추가
        - BannerCardContainer는 월간 랭킹 / 샐러드 / 더미 3개 카드 표시
        - 추후 API로 대체 가능
      */}
      <BannerContainer />
      {/* ✅ 배너 카드 영역 끝 */}

      {/* 검색창 */}
      <section className="main-search-section">
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
      </section>

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
      <RecipeListContainer recipes={currentRecipes} userRecipes={userRecipes} />
      <PaginationPresenter
        totalPages={totalPages}
        currentPage={page}
        onPageChange={setPage}
      />
    </div>
  );
};

export default MainPresenter;