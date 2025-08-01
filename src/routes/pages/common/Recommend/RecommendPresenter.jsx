import React, { useState } from "react";
// import Card from "../../../components/cards/Card/Card";
import "./Recommend.css";

export default function RecommendPresenter({ title, list = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  // 기본 6개 + 나머지
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
        {/* {baseList.map((item, idx) => (
          <Card
            key={`base-${idx}`}
            image={item.img}
            title={item.title}
            desc={item.desc}
          />
        ))}
        {isExpanded &&
          expandedList.map((item, idx) => (
            <Card
              key={`expanded-${idx}`}
              image={item.img}
              title={item.title}
              desc={item.desc}
            />
          ))} */}
      </div>
    </section>
  );
}