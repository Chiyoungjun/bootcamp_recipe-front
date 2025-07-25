import React from "react";
import "./Recipe.css"; // 필요시

const RecipeListPresenter = ({ recipes }) => {
  if (!recipes || recipes.length === 0) {
    return <div>검색 결과가 없습니다.</div>;
  }

  return (
    <div className="recipe-list">
      {recipes.map((item, idx) => (
        <div key={item.RCP_SEQ || item.RCP_NM || idx} className="recipe-list__item">
          <strong>{item.RCP_NM || "이름없음"}</strong>
          {item.RCP_PARTS_DTLS && <div>재료: {item.RCP_PARTS_DTLS}</div>}
          {item.MANUAL01 && <div>1단계: {item.MANUAL01}</div>}
          {/* 필요하면 더 출력 */}
        </div>
      ))}
    </div>
  );
};

export default RecipeListPresenter;
