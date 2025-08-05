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

const StarRating = ({ rating, onRate }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="star-rating" style={{ cursor: "pointer", userSelect: "none" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onRate(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={{ color: star <= (hover || rating) ? "#f5a623" : "#ddd", fontSize: "24px" }}
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
  favorite,         // 추가: 찜 여부
  onToggleFavorite, // 추가: 찜/찜 해제 버튼 클릭리스너
  favoriteLoading,  // 추가: 찜 로딩
}) => {
  const [slideIndex, setSlideIndex] = useState(0);

  const manual = useMemo(() => {
    if (!recipe) return [];
    const arr = [];
    for (let i = 1; i <= 20; i++) {
      const step = recipe[`MANUAL${String(i).padStart(2, "0")}`];
      const img = recipe[`MANUAL_IMG${String(i).padStart(2, "0")}`];
      if (step && typeof step === "string" && step.trim()) {
        arr.push({ step: step.trim(), img });
      }
    }
    return arr;
  }, [recipe]);

  const nutrition = {
    칼로리: recipe?.INFO_ENG,
    탄수화물: recipe?.INFO_CAR,
    단백질: recipe?.INFO_PRO,
    지방: recipe?.INFO_FAT,
    나트륨: recipe?.INFO_NA,
  };

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

  if (loading) return <div className="detail-loading">로딩 중...</div>;
  if (error) return <div className="detail-error">{error}</div>;
  if (!recipe) return <div>상세 레시피가 없습니다.</div>;

  return (
    <div className="recipe-detail-wrapper">
      {/* 타이틀 및 즐겨찾기 */}
      <div className="recipe-detail-title-row">
        <h2 className="recipe-detail-title">{recipe.name || recipe.RCP_NM}</h2>
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
          <StarRating rating={userRating ?? 0} onRate={onRate} />
        </div>
      </div>

      {/* 이하 동일… */}

      <div className="recipe-detail-main">
        <div className="recipe-detail-imgblock">
          <img
            src={recipe.image_url || recipe.ATT_FILE_NO_MAIN}
            alt={recipe.name || "레시피 이미지"}
            className="recipe-detail-img"
          />
        </div>
        <div className="recipe-detail-info">
          <div className="nutrition-title">영양정보 (1인분)</div>
          <ul className="nutrition-list">
            {Object.entries(nutrition).map(
              ([key, val]) =>
                val && (
                  <li key={key}>
                    <span className="nutri-key">{key}</span>
                    <span className="nutri-value">{val}</span>
                    {nutritionUnit[key] && <span className="unit"> {nutritionUnit[key]}</span>}
                  </li>
                )
            )}
          </ul>
        </div>
      </div>
      {(recipe.description || recipe.RCP_PARTS_DTLS) && (
        <section>
          <div className="ingredient-title">재료</div>
          <div className="ingredient-desc">
            {recipe.description || recipe.RCP_PARTS_DTLS}
          </div>
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
      {recipe.RCP_NA_TIP && (
        <section className="recipe-detail-tip-pigma">
          <strong>TIP: </strong>
          {recipe.RCP_NA_TIP}
        </section>
      )}
      <section className="recipe-detail-similar">
        <h3 className="similar-title">유사한 레시피</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {relatedRecipes && relatedRecipes.length > 0 ? (
            <>
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
            </>
          ) : (
            <div style={{ color: "#999", padding: 32 }}>비슷한 레시피가 없습니다.</div>
          )}
        </div>
        {maxSlides > 1 && (
          <div style={{ textAlign: "center", marginTop: "8px", color: "#999" }}>
            {slideIndex + 1}/{maxSlides}
          </div>
        )}
      </section>
    </div>
  );
};

export default RecipeDetailPresenter;
