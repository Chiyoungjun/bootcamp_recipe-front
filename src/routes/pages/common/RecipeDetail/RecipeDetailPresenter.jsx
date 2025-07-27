import React from "react";
import "./RecipeDetail.css";

const RecipeDetailPresenter = ({ recipe, loading, error }) => {
  if (loading) return <div className="detail-loading">로딩 중...</div>;
  if (error) return <div className="detail-error">{error}</div>;
  if (!recipe) return null;

  const nutrition = {
    탄수화물: recipe.INFO_CAR,
    단백질: recipe.INFO_PRO,
    지방: recipe.INFO_FAT,
    나트륨: recipe.INFO_NA,
  };

  const manual = [];
  for (let i = 1; i <= 20; i++) {
    const step = recipe[`MANUAL${String(i).padStart(2, "0")}`];
    const img = recipe[`MANUAL_IMG${String(i).padStart(2, "0")}`];
    if (step && step.trim()) manual.push({ step: step.trim(), img });
  }

  return (
    <div className="recipe-detail-wrapper">
      <h2 className="recipe-detail-title">{recipe.RCP_NM}</h2>
      {recipe.ATT_FILE_NO_MAIN && (
        <div className="recipe-detail-img-wrap">
          <img
            src={recipe.ATT_FILE_NO_MAIN}
            alt={recipe.RCP_NM}
            className="recipe-detail-img"
          />
        </div>
      )}

      {/* 별점은 주석으로 위치 표시 */}
      {/* <div className="recipe-detail-rating">⭐⭐⭐⭐⭐</div> */}

      <section className="recipe-detail-section">
        <strong>영양정보 (1인분 기준)</strong>
        <ul>
          {Object.entries(nutrition).map(([key, val]) => (
            <li key={key}>
              {key}: {val}
            </li>
          ))}
        </ul>
      </section>

      {recipe.RCP_PARTS_DTLS && (
        <section className="recipe-detail-section">
          <strong>재료</strong>
          <p>{recipe.RCP_PARTS_DTLS}</p>
        </section>
      )}

      {manual.length > 0 && (
        <section className="recipe-detail-section">
          <strong>만드는 법</strong>
          <ol>
            {manual.map((m, idx) => {
              const stepText = m.step.replace(/^\d+\.\s*/, "");
              return (
                <li key={idx}>
                  {stepText}
                  {m.img && (
                    <div>
                      <img
                        src={m.img}
                        alt={`step${idx + 1}`}
                        className="recipe-detail-step-img"
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {recipe.RCP_NA_TIP && (
        <section className="recipe-detail-section tip">
          <strong>TIP: </strong>
          {recipe.RCP_NA_TIP}
        </section>
      )}
    </div>
  );
};

export default RecipeDetailPresenter;
