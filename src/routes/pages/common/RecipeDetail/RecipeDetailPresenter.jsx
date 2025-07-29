import React, { useState, useEffect } from "react";
import "./RecipeDetail.css";

const nutritionUnit = {
  칼로리: "kcal",
  탄수화물: "g",
  단백질: "g",
  지방: "g",
  나트륨: "mg",
};

const RecipeDetailPresenter = ({ recipe, loading, error }) => {
  const [favorite, setFavorite] = useState(false);
  const [similarRecipes, setSimilarRecipes] = useState([]);

  // 유사 레시피를 API로 불러온다(현재 레시피명 기준)
  useEffect(() => {
    if (!recipe?.RCP_NM) {
      setSimilarRecipes([]);
      return;
    }
    // 유사 레시피 검색
    fetch(`http://127.0.0.1:8000/api/recipes/external/search?q=${encodeURIComponent(recipe.RCP_NM)}`)
      .then(res => (res.ok ? res.json() : []))
      .then(data => {
        // 현재 상세 레시피와 같은 시퀀스는 제외, 최대 3개
        const similars = (data || [])
          .filter(r => String(r.RCP_SEQ) !== String(recipe.RCP_SEQ))
          .slice(0, 3);
        setSimilarRecipes(similars);
      })
      .catch(() => setSimilarRecipes([]));
  }, [recipe?.RCP_SEQ, recipe?.RCP_NM]);

  if (loading)
    return <div className="detail-loading">로딩 중...</div>;
  if (error)
    return <div className="detail-error">{error}</div>;
  if (!recipe)
    return null;

  // 영양정보
  const nutrition = {
    칼로리: recipe.INFO_ENG, // kcal
    탄수화물: recipe.INFO_CAR,
    단백질: recipe.INFO_PRO,
    지방: recipe.INFO_FAT,
    나트륨: recipe.INFO_NA,
  };

  // 만드는 법(끝부분 영문 알파벳/점 제거)
  const manual = [];
  for (let i = 1; i <= 20; i++) {
    const step = recipe[`MANUAL${String(i).padStart(2, "0")}`];
    const img = recipe[`MANUAL_IMG${String(i).padStart(2, "0")}`];
    if (step && step.trim()) {
      const cleanStep = step.trim().replace(/[a-z]\.?$/, "").trim();
      manual.push({ step: cleanStep, img });
    }
  }

  const toggleFavorite = () => setFavorite(f => !f);

  return (
    <div className="recipe-detail-wrapper">
      {/* ===== 타이틀/즐겨찾기 ===== */}
      <div className="recipe-detail-title-row">
        <h2 className="recipe-detail-title">{recipe.RCP_NM}</h2>
        <button
          className={`favorite-btn${favorite ? " on" : ""}`}
          aria-label={favorite ? "즐겨찾기 취소" : "즐겨찾기 추가"}
          onClick={toggleFavorite}
        >
          {favorite ? "★" : "☆"}
        </button>
      </div>

      {/* ===== 메인이미지 & 영양정보 ===== */}
      <div className="recipe-detail-main">
        <div className="recipe-detail-imgblock">
          <img
            src={recipe.ATT_FILE_NO_MAIN || "/default_recipe.jpg"}
            alt={recipe.RCP_NM}
            className="recipe-detail-img"
          />
        </div>
        <div className="recipe-detail-info">
          <div className="nutrition-title">영양정보 (1인분)</div>
          <ul className="nutrition-list">
            {Object.entries(nutrition).map(([key, val]) =>
              val ? (
                <li key={key}>
                  <span className="nutri-key">{key}</span>
                  <span className="nutri-value">{val}</span>
                  {nutritionUnit[key] && (
                    <span className="unit"> {nutritionUnit[key]}</span>
                  )}
                </li>
              ) : null
            )}
          </ul>
        </div>
      </div>

      {/* ===== 재료 ===== */}
      {recipe.RCP_PARTS_DTLS && (
        <section>
          <div className="ingredient-title">재료</div>
          <div className="ingredient-desc">{recipe.RCP_PARTS_DTLS}</div>
        </section>
      )}

      {/* ===== 만드는 법 (피그마 스타일) ===== */}
      {manual.length > 0 && (
        <section>
          <div className="manual-title">만드는 법</div>
          <div className="recipe-detail-manual-list-pigma">
            {manual.map((m, idx) => (
              <div className="manual-pigma-row" key={idx}>
                <div className="manual-pigma-img-wrap">
                  {m.img && (
                    <img
                      src={m.img}
                      alt={`step${idx + 1}`}
                      className="manual-pigma-img"
                    />
                  )}
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

      {/* ===== TIP ===== */}
      {recipe.RCP_NA_TIP && (
        <section className="recipe-detail-tip-pigma">
          <strong>TIP: </strong>
          {recipe.RCP_NA_TIP}
        </section>
      )}

      {/* ===== 유사 레시피 (실제 API 연동) ===== */}
      <section className="recipe-detail-similar">
        <h3 className="similar-title">유사한 레시피</h3>
        <div className="similar-recipe-list">
          {similarRecipes.length > 0 ? 
            similarRecipes.map((item, i) => (
              <div className="similar-recipe-card" key={item.RCP_SEQ || i}>
                <img src={item.ATT_FILE_NO_MAIN || "/default_recipe.jpg"} alt={item.RCP_NM} />
                <div className="similar-name">{item.RCP_NM}</div>
                <div className="similar-rating">
                  {"★".repeat(5)}
                  <span className="similar-views">
                    {item.INFO_ENG ? `칼로리 ${item.INFO_ENG}kcal` : ""}
                  </span>
                </div>
              </div>
            ))
          : (
            <div style={{ color: "#aaa", fontSize: 15, padding: 20 }}>유사한 레시피가 없습니다.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default RecipeDetailPresenter;
