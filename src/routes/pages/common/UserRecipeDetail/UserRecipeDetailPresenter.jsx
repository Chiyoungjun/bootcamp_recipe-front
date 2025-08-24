import React, { useState, useMemo, useEffect } from "react";
import "./UserRecipeDetail.css";

const nutritionUnit = {
  칼로리: "kcal",
  탄수화물: "g",
  단백질: "g",
  지방: "g",
  나트륨: "mg",
};

const itemsPerPage = 3;

const StarRating = ({ rating }) => {
  return (
    <div aria-label="별점 표시" style={{ userSelect: "none", cursor: "default" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            color: star <= Math.round(rating) ? "#f5a623" : "#ddd",
            fontSize: "24px",
            marginRight: 2,
            userSelect: "none",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const UserRecipeDetailPresenter = ({
  recipe,
  loading,
  error,
  userRating,
  onRate,
  favorite,
  onToggleFavorite,
  favoriteLoading,
  isEnglish,
  userRecipes = [],
  user,
  authorName,
  
  // 추가된 alert props
  alertMessage,
  showAlert,
}) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempRating, setTempRating] = useState(userRating || 0);
  const [modalHover, setModalHover] = useState(0);

  useEffect(() => {
    setTempRating(userRating || 0);  // userRating 변경시 초기화
  }, [userRating]);

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

  const maxSlides = userRecipes.length ? Math.ceil(userRecipes.length / itemsPerPage) : 0;
  const visibleCards = userRecipes.length
    ? userRecipes.slice(slideIndex * itemsPerPage, (slideIndex + 1) * itemsPerPage)
    : [];

  const handlePrev = () => setSlideIndex((prev) => (prev > 0 ? prev - 1 : maxSlides - 1));
  const handleNext = () => setSlideIndex((prev) => (prev < maxSlides - 1 ? prev + 1 : 0));
  const handleSimilarClick = (rcp_id) => window.location.href = `/userrecipedetail?id=${rcp_id}`;

  const openModal = () => setIsModalOpen(true);
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

  if (loading) return <div className="ud-detail-loading">번역 중...</div>;
  if (error) return <div className="ud-detail-error">{error}</div>;
  if (!recipe) return <div>상세 레시피가 없습니다.</div>;

  const displayedName = isEnglish ? recipe.name_en || recipe.name : recipe.name;
  const displayedDescription = isEnglish ? recipe.description_en || recipe.description : recipe.description;
  const displayedTip = isEnglish ? recipe.RCP_NA_TIP_EN || recipe.RCP_NA_TIP : recipe.RCP_NA_TIP;

  const recipeImgSrc = recipe.image_url
    ? `http://127.0.0.1:8000/${recipe.image_url}`
    : (recipe.ATT_FILE_NO_MAIN || "");

  return (
    <>
      <div className="ud-detail-wrapper">
        <div className="ud-detail-title-row">
          <h2 className="ud-detail-title">{displayedName || recipe.RCP_NM}</h2>
          <button
            className={`ud-favorite-btn${favorite ? " on" : ""}`}
            aria-label={favorite ? "즐겨찾기 취소" : "즐겨찾기 추가"}
            onClick={favoriteLoading ? undefined : onToggleFavorite}
            disabled={favoriteLoading}
          >
            {favorite ? "★" : "☆"}
          </button>
        </div>

        <div className="ud-rating-info" style={{ marginBottom: 16 }}>
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

        <div className="ud-detail-main">
          <div className="ud-detail-imgblock">
            <img
              src={recipeImgSrc}
              alt={displayedName || "레시피 이미지"}
              className="ud-detail-img"
              onError={e => { e.target.style.display = 'none'; }}
            />
          </div>
          <div className="ud-detail-info">
            <div className="ud-nutrition-title">영양정보 (1인분)</div>
            <ul className="ud-nutrition-list">
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
                      <span className="ud-nutri-key">{key}</span>
                      <span className="ud-nutri-value">{val}</span>
                      <span className="ud-unit">{nutritionUnit[key]}</span>
                    </li>
                  ) : null
              )}
            </ul>
          </div>
        </div>

        {(displayedDescription || recipe.RCP_PARTS_DTLS) && (
          <section>
            <div className="ud-ingredient-title">재료</div>
            <div className="ud-ingredient-desc">{displayedDescription || recipe.RCP_PARTS_DTLS}</div>
          </section>
        )}

        {manual.length > 0 && (
          <section>
            <div className="ud-manual-title">만드는 법</div>
            <div className="ud-detail-manual-list-pigma">
              {manual.map((m, idx) => (
                <div className="ud-manual-row" key={idx}>
                  <div className="ud-manual-img-wrap">
                    {m.img && (
                      <img
                        src={/^http/.test(m.img) ? m.img : `http://127.0.0.1:8000/${m.img}`}
                        alt={`step${idx + 1}`}
                        className="ud-manual-img"
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    )}
                  </div>
                  <div className="ud-manual-box">
                    <span className="ud-manual-num">{idx + 1}</span>
                    <span className="ud-manual-desc">{m.step.replace(/^(\d+\.)/, "").trim()}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {displayedTip && (
          <section className="ud-detail-tip-pigma">
            <strong>TIP: </strong>
            {displayedTip}
          </section>
        )}

        {userRecipes.length > 0 && (
          <section className="ud-detail-similar">
            <h3 className="ud-similar-title">
              {authorName ? `${authorName}님의 다른 레시피` : "회원 레시피"}
            </h3>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <button className="ud-slider-btn" onClick={handlePrev} disabled={userRecipes.length <= itemsPerPage}>
                &lt;
              </button>
              <div className="similar-ud-list" style={{ display: "flex", gap: "20px" }}>
                {visibleCards.map((item, i) => (
                  <div key={item.id || i} className="similar-ud-card" onClick={() => handleSimilarClick(item.id)}>
                    <img src={`http://127.0.0.1:8000/${item.image_url}`} alt={item.name} />
                    <div className="ud-similar-name">{item.name}</div>
                    <div className="ud-similar-author">
                      {item.author_name ? `${item.author_name}님` : ""}
                    </div>
                    <div className="ud-similar-rating">
                      {"★".repeat(item.avg_rating ? Math.round(item.avg_rating) : 5)}
                      {"☆".repeat(5 - (item.avg_rating ? Math.round(item.avg_rating) : 5))}
                      <span className="ud-similar-views">조회수 {item.view_count || 0}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button className="ud-slider-btn" onClick={handleNext} disabled={userRecipes.length <= itemsPerPage}>
                &gt;
              </button>
            </div>
            {maxSlides > 1 && (
              <div style={{ textAlign: "center", marginTop: "8px", color: "#999" }}>
                {slideIndex + 1}/{maxSlides}
              </div>
            )}
          </section>
        )}
      </div>

      {/* 알림창 추가 */}
      {showAlert && (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            position: "fixed",
            top: "250px",           // 헤더 밑, 본문 중간에 오도록 조정 (원하는대로 px 수정)
            left: "50%",            // 가로 중앙
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "12px 24px",
            borderRadius: "8px",
            zIndex: 1100,
            userSelect: "none",
            boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
            fontSize: "15px",
            fontWeight: "500",
            whiteSpace: "nowrap",
          }}
        >
          {alertMessage}
        </div>
      )}


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
          className="ud-modal-backdrop"
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
            className="ud-modal-content"
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

export default UserRecipeDetailPresenter;
