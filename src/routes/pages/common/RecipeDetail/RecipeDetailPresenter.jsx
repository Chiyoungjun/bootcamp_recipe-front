import React, { useState, useMemo } from "react";
import "./RecipeDetail.css";

const nutritionUnit = {
  칼로리: "kcal",
  탄수화물: "g",
  단백질: "g",
  지방: "g",
  나트륨: "mg",
};

const itemsPerPage = 3;

const StarRating = ({ rating }) => {
  const [hover, setHover] = useState(0);
  return (
    <div
      className="star-rating"
      style={{ cursor: "default", userSelect: "none" }}
      aria-label="별점 표시"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            color: star <= (hover || rating) ? "#f5a623" : "#ddd",
            fontSize: "24px",
            userSelect: "none",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const RecipeDetailPresenter = ({
  recipe,
  loading,
  error,
  relatedRecipes,
  userRating,
  onRate,
  favorite,
  onToggleFavorite,
  favoriteLoading,
  isEnglish,
  shopList = [],
  showShopList = false,
  mapLoading = false,
  mapError = "",
  handleFindNearShops,
}) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempRating, setTempRating] = useState(userRating || 0);
  const [modalHover, setModalHover] = useState(0);

  const manual = useMemo(() => {
    if (!recipe) return [];
    if (isEnglish && Array.isArray(recipe.manual_en) && recipe.manual_en.length > 0) {
      return recipe.manual_en;
    }
    const arr = [];
    for (let i = 1; i <= 20; i++) {
      const step = recipe[`MANUAL${String(i).padStart(2, "0")}`];
      const img = recipe[`MANUAL_IMG${String(i).padStart(2, "0")}`];
      if (step && typeof step === "string" && step.trim()) {
        arr.push({ step: step.trim(), img });
      }
    }
    return arr;
  }, [recipe, isEnglish]);

  const maxSlides = relatedRecipes ? Math.ceil(relatedRecipes.length / itemsPerPage) : 0;
  const visibleCards = relatedRecipes
    ? relatedRecipes.slice(slideIndex * itemsPerPage, (slideIndex + 1) * itemsPerPage)
    : [];

  const handlePrev = () => {
    setSlideIndex((prev) => (prev > 0 ? prev - 1 : maxSlides - 1));
  };
  const handleNext = () => {
    setSlideIndex((prev) => (prev < maxSlides - 1 ? prev + 1 : 0));
  };
  const handleSimilarClick = (rcp_seq) => {
    if (!rcp_seq) return;
    window.location.href = `/recipedetail?id=${rcp_seq}`;
  };

  const openModal = () => {
    setTempRating(userRating || 0);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setModalHover(0);
  };
  const onSubmitRating = () => {
    if (tempRating > 0) {
      onRate(tempRating);
      closeModal();
    }
  };

  if (loading) return <div className="detail-loading">번역 중...</div>;
  if (error) return <div className="detail-error">{error}</div>;
  if (!recipe) return <div>상세 레시피가 없습니다.</div>;

  const displayedName = isEnglish ? recipe.name_en || recipe.name : recipe.name;
  const displayedDescription = isEnglish ? recipe.description_en || recipe.description : recipe.description;
  const displayedTip = isEnglish ? recipe.RCP_NA_TIP_EN || recipe.RCP_NA_TIP : recipe.RCP_NA_TIP;

  return (
    <>
      <div className="recipe-detail-wrapper">
        <div className="recipe-detail-title-row">
          <h2 className="recipe-detail-title">{displayedName || recipe.RCP_NM}</h2>
          <button
            className={`favorite-btn${favorite ? " on" : ""}`}
            aria-label={favorite ? "즐겨찾기 취소" : "즐겨찾기 추가"}
            onClick={favoriteLoading ? undefined : onToggleFavorite}
            disabled={favoriteLoading}
          >
            {favorite ? "★" : "☆"}
          </button>
        </div>

        <div className="recipe-rating-info" style={{ marginBottom: 16 }}>
          <div>
            <strong>평균 별점:</strong> {recipe.avg_rating?.toFixed(1) ?? "0.0"} ({recipe.rating_count ?? 0}명)
          </div>
          <div>
            <strong>조회수:</strong> {recipe.view_count ?? 0}
          </div>
          <div style={{ marginTop: 8 }}>
            <strong>내 별점 주기:</strong>
            <div
              style={{ display: "inline-block", cursor: "pointer" }}
              onClick={openModal}
              aria-label="별점 입력 모달 열기"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") openModal();
              }}
            >
              <StarRating rating={userRating ?? 0} />
            </div>
          </div>
        </div>

        <div className="recipe-detail-main">
          <div className="recipe-detail-imgblock">
            <img
              src={recipe.image_url || recipe.ATT_FILE_NO_MAIN}
              alt={displayedName || "레시피 이미지"}
              className="recipe-detail-img"
            />
          </div>
          <div className="recipe-detail-info">
            <div className="nutrition-title">영양정보 (1인분)</div>
            <ul className="nutrition-list">
              {Object.entries({
                칼로리: recipe.INFO_ENG,
                탄수화물: recipe.INFO_CAR,
                단백질: recipe.INFO_PRO,
                지방: recipe.INFO_FAT,
                나트륨: recipe.INFO_NA,
              }).map(
                ([key, val]) =>
                  val ? (
                    <li key={key}>
                      <span className="nutri-key">{key}</span>
                      <span className="nutri-value">{val}</span>
                      <span className="unit">{nutritionUnit[key]}</span>
                    </li>
                  ) : null
              )}
            </ul>
          </div>
        </div>

        {(displayedDescription || recipe.RCP_PARTS_DTLS) && (
          <section>
            <div className="ingredient-title">재료</div>
            <div className="ingredient-desc">{displayedDescription || recipe.RCP_PARTS_DTLS}</div>
          </section>
        )}

        {manual.length > 0 && (
          <section>
            <div className="manual-title">만드는 법</div>
            <div className="recipe-detail-manual-list-pigma">
              {manual.map((m, idx) => (
                <div className="manual-pigma-row" key={idx}>
                  <div className="manual-pigma-img-wrap">
                    {m.img && <img src={m.img} alt={`step${idx + 1}`} className="manual-pigma-img" />}
                  </div>
                  <div className="manual-pigma-box">
                    <span className="manual-pigma-num">{idx + 1}</span>
                    <span className="manual-pigma-desc">{m.step.replace(/^(\d+\.)/, "").trim()}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {displayedTip && (
          <section className="recipe-detail-tip-pigma">
            <strong>TIP: </strong>
            {displayedTip}
          </section>
        )}

        <section className="recipe-detail-similar">
          <h3 className="similar-title">유사한 레시피</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button className="slider-btn" onClick={handlePrev} disabled={maxSlides <= 1}>
              &lt;
            </button>
            <div className="similar-recipe-list" style={{ display: "flex", gap: "20px" }}>
              {visibleCards.map((item, i) => (
                <div
                  className="similar-recipe-card"
                  key={item.RCP_SEQ || item.id || i}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSimilarClick(item.RCP_SEQ || item.id)}
                >
                  <img src={item.img} alt={item.name} />
                  <div className="similar-name">{item.name}</div>
                  <div className="similar-rating">
                    {"★".repeat(item.rating)}
                    {"☆".repeat(5 - item.rating)}
                    <span className="similar-views">조회수 {item.views}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="slider-btn" onClick={handleNext} disabled={maxSlides <= 1}>
              &gt;
            </button>
          </div>
          {maxSlides > 1 && (
            <div style={{ textAlign: "center", marginTop: "8px", color: "#999" }}>
              {slideIndex + 1}/{maxSlides}
            </div>
          )}
        </section>

        {/* ▷▷↓↓ 음식점 찾기 UI 추가 ↓↓▷▷ */}
        <section style={{ margin: "32px 0" }}>
          <button
            onClick={handleFindNearShops}
            style={{ padding: "12px 24px", fontSize: "15px", fontWeight: "bold" }}
          >
            근처에서 "{recipe?.name}" 파는 음식점 찾기
          </button>
          {mapLoading && <div style={{ margin: "10px 0" }}>근처 음식점 검색 중...</div>}
          {mapError && <div style={{ color: "red", margin: "10px 0" }}>{mapError}</div>}
          {showShopList && shopList.length > 0 && (
            <div style={{ margin: "16px 0" }}>
              <h3>근처 음식점 ({shopList.length})</h3>
              <ul>
                {shopList.map((shop, idx) => (
                  <li key={shop.id || shop.name || idx} style={{ marginBottom: 12 }}>
                    <strong>{shop.name}</strong> <br />
                    <span>{shop.road_address || shop.address}</span><br />
                    <span>{shop.phone}</span><br />
                    <a href={shop.url} target="_blank" rel="noopener noreferrer">
                      카카오맵 상세보기
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {showShopList && shopList.length === 0 && !mapLoading && (
            <div style={{ margin: "10px 0" }}>
              주변에 해당 음식점을 찾을 수 없습니다.
            </div>
          )}
        </section>
      </div>

      {/* 별점 입력용 모달 */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          className="modal-backdrop"
          aria-modal={true}
          role="dialog"
          aria-label="별점 입력 모달"
          onClick={closeModal}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "8px",
              width: "320px",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: 16 }}>별점을 선택하세요</h3>
            <div style={{ marginBottom: 24 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setTempRating(star)}
                  onMouseEnter={() => setModalHover(star)}
                  onMouseLeave={() => setModalHover(0)}
                  style={{
                    color: star <= (modalHover || tempRating) ? "#f5a623" : "#ddd",
                    fontSize: "36px",
                    cursor: "pointer",
                    userSelect: "none",
                    marginRight: 4,
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${star}점 별점 선택`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setTempRating(star);
                  }}
                >
                  ★
                </span>
              ))}
            </div>
            <button
              onClick={onSubmitRating}
              disabled={tempRating === 0}
              style={{
                padding: "8px 24px",
                fontSize: "16px",
                cursor: tempRating === 0 ? "not-allowed" : "pointer",
                marginRight: 12,
              }}
            >
              확인
            </button>
            <button
              onClick={closeModal}
              style={{ padding: "8px 24px", fontSize: "16px", cursor: "pointer" }}
            >
              취소
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RecipeDetailPresenter;
