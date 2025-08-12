import React, { useState } from "react";
import Card1Container from "../../../compoents/Card1";
import "./Recommend.css";

export default function RecommendPresenter({ title, list = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  // 기본 6개 + 나머지(토글 표시용)
  const baseList = list.slice(0, 6);
  const expandedList = list.slice(6);

  return (
    <section className="recommend-section">
      <div className="recommend-section-header">
        <span className="recommend-title">{title}</span>
        {expandedList.length > 0 && (
          <button className="recommend-more-btn" onClick={handleToggle}>
            {isExpanded ? "닫기" : "+ 더 보기"}
          </button>
        )}
      </div>

      <div className="recommend-preference-list">
        {(isExpanded ? list : baseList).map((recipe) => (
          <Card1Container
            key={recipe.id || recipe.RCP_SEQ}
            recipe={{
              id: recipe.id || recipe.RCP_SEQ,
              name: recipe.name || recipe.RCP_NM,
              image_url: recipe.image_url || recipe.ATT_FILE_NO_MAIN,
              avg_rating: recipe.avg_rating ?? recipe.AVG_RATING ?? 0,
              rating_count: recipe.rating_count ?? recipe.RATING_COUNT ?? 0,
              view_count: recipe.view_count ?? recipe.VIEW_COUNT ?? 0,
            }}
          />
        ))}
      </div>
    </section>
  );
}