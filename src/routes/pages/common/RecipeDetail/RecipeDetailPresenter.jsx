import React, { useState, useMemo } from "react";
import "./RecipeDetail.css";

const nutritionUnit = {
  칼로리: "kcal",
  탄수화물: "g",
  단백질: "g",
  지방: "g",
  나트륨: "mg",
};

const itemsPerPage = 3; // 한 번에 보여줄 카드 개수

const RecipeDetailPresenter = ({ recipe, loading, error, relatedRecipes }) => {
  const [favorite, setFavorite] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  // 만드는 법
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

  // 영양정보
  const nutrition = {
    칼로리: recipe?.INFO_ENG,
    탄수화물: recipe?.INFO_CAR,
    단백질: recipe?.INFO_PRO,
    지방: recipe?.INFO_FAT,
    나트륨: recipe?.INFO_NA,
  };

  // 슬라이더 관련
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

  const toggleFavorite = () => setFavorite((prev) => !prev);

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
          onClick={toggleFavorite}
        >
          {favorite ? "★" : "☆"}
        </button>
      </div>

      {/* 메인 이미지 및 영양정보 */}
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

      {/* 재료 */}
      {(recipe.description || recipe.RCP_PARTS_DTLS) && (
        <section>
          <div className="ingredient-title">재료</div>
          <div className="ingredient-desc">
            {recipe.description || recipe.RCP_PARTS_DTLS}
          </div>
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

      {/* TIP */}
      {recipe.RCP_NA_TIP && (
        <section className="recipe-detail-tip-pigma">
          <strong>TIP: </strong>
          {recipe.RCP_NA_TIP}
        </section>
      )}

      {/* 유사한 레시피 - 슬라이더 */}
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
        {/* 현재 페이지 표기 */}
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



// import React, { useState, useMemo } from "react";
// import "./RecipeDetail.css";

// // 영양정보 단위
// const nutritionUnit = {
//   칼로리: "kcal",
//   탄수화물: "g",
//   단백질: "g",
//   지방: "g",
//   나트륨: "mg",
// };

// // 랜덤 3개 추출 함수 (이거 기존 코드 그대로 유지)
// function getRandomItems(array, count) {
//   const arr = array.slice();
//   for (let i = arr.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [arr[i], arr[j]] = [arr[j], arr[i]];
//   }
//   return arr.slice(0, count);
// }

// const RecipeDetailPresenter = ({ recipe, loading, error, allRecipes }) => {
//   const [favorite, setFavorite] = useState(false);

//   // ====== [API 데이터 콘솔 확인] ======
//   console.log("[Presenter] recipe", recipe);
//   console.log("[Presenter] allRecipes", allRecipes);

//   // === 유사 레시피: 백엔드 가공된 CATEGORY / INGREDIENTS 기준 ===
//   const similarRecipes = useMemo(() => {
//     if (!Array.isArray(allRecipes) || !recipe) return [];
//     if (!recipe.CATEGORY || !Array.isArray(recipe.INGREDIENTS)) return [];

//     // 같은 카테고리 레시피 필터 (현재 레시피 제외)
//     const sameCategoryRecipes = allRecipes.filter(
//       (item) =>
//         item.RCP_SEQ !== recipe.RCP_SEQ &&
//         item.CATEGORY === recipe.CATEGORY &&
//         Array.isArray(item.INGREDIENTS)
//     );

//     // 재료 일부라도 겹치는지 체크 함수
//     const hasIngredientOverlap = (arr1, arr2) =>
//       arr1.some((ing) => arr2.includes(ing));

//     // 재료 겹치는 후보 추출
//     const candidates = sameCategoryRecipes.filter((item) =>
//       hasIngredientOverlap(recipe.INGREDIENTS, item.INGREDIENTS)
//     );

//     // 후보가 있으면 후보 중 랜덤 추출, 없으면 같은 카테고리 랜덤, 그래도 없으면 전체 랜덤 3개 추출
//     const picked =
//       candidates.length > 0
//         ? getRandomItems(candidates, 3)
//         : sameCategoryRecipes.length > 0
//         ? getRandomItems(sameCategoryRecipes, 3)
//         : getRandomItems(allRecipes.filter((i) => i.RCP_SEQ !== recipe.RCP_SEQ), 3);

//     return picked.map((item) => ({
//       img: item.ATT_FILE_NO_MAIN,
//       name: item.RCP_NM,
//       rating: 5, // 고정 별점
//       views: Math.floor(Math.random() * 1000) + 1000, // 랜덤 조회수
//       RCP_SEQ: item.RCP_SEQ,
//     }));
//   }, [allRecipes, recipe]);

//   if (loading) return <div className="detail-loading">로딩 중...</div>;
//   if (error) return <div className="detail-error">{error}</div>;
//   if (!recipe) return null;

//   // 영양정보 객체 생성
//   const nutrition = {
//     칼로리: recipe.INFO_ENG,
//     탄수화물: recipe.INFO_CAR,
//     단백질: recipe.INFO_PRO,
//     지방: recipe.INFO_FAT,
//     나트륨: recipe.INFO_NA,
//   };

//   // 만드는 법 배열 준비
//   const manual = [];
//   for (let i = 1; i <= 20; i++) {
//     const step = recipe[`MANUAL${String(i).padStart(2, "0")}`];
//     const img = recipe[`MANUAL_IMG${String(i).padStart(2, "0")}`];
//     if (step && typeof step === "string" && step.trim()) {
//       manual.push({ step: step.trim(), img });
//     }
//   }

//   const toggleFavorite = () => setFavorite((prev) => !prev);

//   function handleSimilarClick(rcp_seq) {
//     if (!rcp_seq) return;
//     window.location.href = `/recipedetail?id=${rcp_seq}`;
//   }

//   return (
//     <div className="recipe-detail-wrapper">
//       {/* 타이틀 및 즐겨찾기 */}
//       <div className="recipe-detail-title-row">
//         <h2 className="recipe-detail-title">{recipe.RCP_NM}</h2>
//         <button
//           className={`favorite-btn${favorite ? " on" : ""}`}
//           aria-label={favorite ? "즐겨찾기 취소" : "즐겨찾기 추가"}
//           onClick={toggleFavorite}
//         >
//           {favorite ? "★" : "☆"}
//         </button>
//       </div>

//       {/* 메인 이미지 및 영양정보 */}
//       <div className="recipe-detail-main">
//         <div className="recipe-detail-imgblock">
//           <img
//             src={recipe.ATT_FILE_NO_MAIN}
//             alt={recipe.RCP_NM}
//             className="recipe-detail-img"
//           />
//         </div>
//         <div className="recipe-detail-info">
//           <div className="nutrition-title">영양정보 (1인분)</div>
//           <ul className="nutrition-list">
//             {Object.entries(nutrition).map(
//               ([key, val]) =>
//                 val && (
//                   <li key={key}>
//                     <span className="nutri-key">{key}</span>
//                     <span className="nutri-value">{val}</span>
//                     {nutritionUnit[key] && <span className="unit"> {nutritionUnit[key]}</span>}
//                   </li>
//                 )
//             )}
//           </ul>
//         </div>
//       </div>

//       {/* 재료 */}
//       {recipe.RCP_PARTS_DTLS && (
//         <section>
//           <div className="ingredient-title">재료</div>
//           <div className="ingredient-desc">{recipe.RCP_PARTS_DTLS}</div>
//         </section>
//       )}

//       {/* 만드는 법 */}
//       {manual.length > 0 && (
//         <section>
//           <div className="manual-title">만드는 법</div>
//           <div className="recipe-detail-manual-list-pigma">
//             {manual.map((m, idx) => (
//               <div className="manual-pigma-row" key={idx}>
//                 <div className="manual-pigma-img-wrap">
//                   {m.img && (
//                     <img
//                       src={m.img}
//                       alt={`step${idx + 1}`}
//                       className="manual-pigma-img"
//                     />
//                   )}
//                 </div>
//                 <div className="manual-pigma-box">
//                   <span className="manual-pigma-num">{idx + 1}</span>
//                   <span className="manual-pigma-desc">{m.step.replace(/^(\d+\.)/, "").trim()}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* TIP */}
//       {recipe.RCP_NA_TIP && (
//         <section className="recipe-detail-tip-pigma">
//           <strong>TIP: </strong>
//           {recipe.RCP_NA_TIP}
//         </section>
//       )}

//       {/* 유사한 레시피 */}
//       <section className="recipe-detail-similar">
//         <h3 className="similar-title">유사한 레시피</h3>
//         <div className="similar-recipe-list">
//           {similarRecipes.length > 0 ? (
//             similarRecipes.map((item, i) => (
//               <div
//                 className="similar-recipe-card"
//                 key={item.RCP_SEQ || i}
//                 style={{ cursor: "pointer" }}
//                 onClick={() => handleSimilarClick(item.RCP_SEQ)}
//               >
//                 <img src={item.img} alt={item.name} />
//                 <div className="similar-name">{item.name}</div>
//                 <div className="similar-rating">
//                   {"★".repeat(item.rating)}
//                   {"☆".repeat(5 - item.rating)}
//                   <span className="similar-views">조회수 {item.views}</span>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div style={{ color: "#999", padding: 32 }}>비슷한 레시피가 없습니다.</div>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default RecipeDetailPresenter;
