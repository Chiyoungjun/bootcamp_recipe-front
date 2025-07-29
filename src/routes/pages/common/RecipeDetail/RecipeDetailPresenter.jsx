import React, { useState, useMemo } from "react";
import "./RecipeDetail.css";

// 영양정보 단위
const nutritionUnit = {
  칼로리: "kcal",
  탄수화물: "g",
  단백질: "g",
  지방: "g",
  나트륨: "mg",
};

// 키워드 추출 (2글자/3글자/단어 단위 모두)
function extractKeywords(name) {
  if (!name || typeof name !== "string") return [];
  const arr = name.replace(/\s+/g, " ").split(" ");
  let tokens = [];
  arr.forEach(w => {
    if (w.length > 1) {
      for (let i = 0; i < w.length - 1; i++) tokens.push(w.slice(i, i + 2));
      for (let i = 0; i < w.length - 2; i++) tokens.push(w.slice(i, i + 3));
    }
    tokens.push(w); // 전체 단어도 추가
  });
  return [...new Set(tokens)].filter(x => x.length > 1);
}

// 랜덤 3개 추출
function getRandomItems(array, count) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
}

const RecipeDetailPresenter = ({ recipe, loading, error, allRecipes }) => {
  const [favorite, setFavorite] = useState(false);

  // ====== [API 데이터 콘솔 확인] ======
  // 실제로 도착한 데이터 값 확인용 (운영 배포 전 삭제)
  console.log("[Presenter] recipe", recipe);
  console.log("[Presenter] allRecipes", allRecipes);

  // === 유사 레시피: 2글자 키워드로 후보를 넓게 추출, 없으면 전체에서 랜덤 3개 ===
  const similarRecipes = useMemo(() => {
    if (!Array.isArray(allRecipes) || !recipe?.RCP_NM) return [];
    const keywords = extractKeywords(recipe.RCP_NM).filter(x => x.length === 2);
    const candidates = allRecipes.filter(
      item =>
        item.RCP_SEQ !== recipe.RCP_SEQ &&
        keywords.some(kw => item.RCP_NM.includes(kw))
    );
    const picked = candidates.length > 0
      ? getRandomItems(candidates, 3)
      : getRandomItems(allRecipes.filter(i => i.RCP_SEQ !== recipe.RCP_SEQ), 3);
    return picked.map(item => ({
      img: item.ATT_FILE_NO_MAIN,
      name: item.RCP_NM,
      rating: 5,
      views: Math.floor(Math.random() * 1000) + 1000,
      RCP_SEQ: item.RCP_SEQ,
    }));
  }, [allRecipes, recipe]);

  if (loading) return <div className="detail-loading">로딩 중...</div>;
  if (error) return <div className="detail-error">{error}</div>;
  if (!recipe) return null;

  const nutrition = {
    칼로리: recipe.INFO_ENG,
    탄수화물: recipe.INFO_CAR,
    단백질: recipe.INFO_PRO,
    지방: recipe.INFO_FAT,
    나트륨: recipe.INFO_NA,
  };

  // 만드는 법
  const manual = [];
  for (let i = 1; i <= 20; i++) {
    const step = recipe[`MANUAL${String(i).padStart(2, "0")}`];
    const img = recipe[`MANUAL_IMG${String(i).padStart(2, "0")}`];
    if (step && typeof step === "string" && step.trim()) {
      manual.push({ step: step.trim(), img });
    }
  }

  const toggleFavorite = () => setFavorite(prev => !prev);

  function handleSimilarClick(rcp_seq) {
    if (!rcp_seq) return;
    window.location.href = `/recipedetail?id=${rcp_seq}`;
  }

  return (
    <div className="recipe-detail-wrapper">
      {/* 타이틀/즐겨찾기 */}
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

      <div className="recipe-detail-main">
        <div className="recipe-detail-imgblock">
          <img
            src={recipe.ATT_FILE_NO_MAIN}
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

      {/* 재료 */}
      {recipe.RCP_PARTS_DTLS && (
        <section>
          <div className="ingredient-title">재료</div>
          <div className="ingredient-desc">{recipe.RCP_PARTS_DTLS}</div>
        </section>
      )}

      {/* 만드는 법 */}
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

      {/* TIP */}
      {recipe.RCP_NA_TIP && (
        <section className="recipe-detail-tip-pigma">
          <strong>TIP: </strong>
          {recipe.RCP_NA_TIP}
        </section>
      )}

      {/* 유사한 레시피 */}
      <section className="recipe-detail-similar">
        <h3 className="similar-title">유사한 레시피</h3>
        <div className="similar-recipe-list">
          {similarRecipes.length > 0
            ? similarRecipes.map((item, i) => (
                <div
                  className="similar-recipe-card"
                  key={item.RCP_SEQ || i}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSimilarClick(item.RCP_SEQ)}
                >
                  <img src={item.img} alt={item.name} />
                  <div className="similar-name">{item.name}</div>
                  <div className="similar-rating">
                    {"★".repeat(item.rating)}
                    {"☆".repeat(5 - item.rating)}
                    <span className="similar-views">조회수 {item.views}</span>
                  </div>
                </div>
              ))
            : <div style={{ color: "#999", padding: 32 }}>비슷한 레시피가 없습니다.</div>
          }
        </div>
      </section>
    </div>
  );
};

export default RecipeDetailPresenter;