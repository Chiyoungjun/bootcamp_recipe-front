import React from "react";
import "./Recommend.css";

function RecommendPresenter({ preferenceList, healthList }) {
  return (
    <div className="recommend-root">
      {/* 상단: 3개씩 2줄, 하단 오른쪽 작은 이미지와 똑같은 크기로 */}
      <h3 className="recommend-title">회원님의 선호 레시피를 바탕으로 추천해봤어요</h3>
      <div className="recommend-preference-list">
        {preferenceList.map((item, idx) => (
          <div className="recommend-preference-card" key={idx}>
            <img src={item.img} alt={item.title} className="recommend-preference-img" />
            <div className="recommend-card-title">{item.title}</div>
            <div className="recommend-card-desc">{item.desc}</div>
          </div>
        ))}
      </div>

      {/* 하단: healthList가 3개 이상일 때만 좌우 분할로 보여줌 */}
      {healthList.length >= 3 && (
        <>
          <h3 className="recommend-title" style={{ marginTop: 40 }}>
            회원님의 건강상태를 바탕으로 추천해봤어요
          </h3>
          <div className="recommend-health-grid">
            <div className="health-big-card">
              <img src={healthList[0].img} alt={healthList[0].title} className="health-big-img" />
              <div className="recommend-card-title">{healthList[0].title}</div>
              <div className="recommend-card-desc">{healthList[0].desc}</div>
            </div>
            <div className="health-small-col">
              <div className="health-small-card">
                <img src={healthList[1].img} alt={healthList[1].title} className="health-small-img" />
                <div className="recommend-card-title">{healthList[1].title}</div>
                <div className="recommend-card-desc">{healthList[1].desc}</div>
              </div>
              <div className="health-small-card">
                <img src={healthList[2].img} alt={healthList[2].title} className="health-small-img" />
                <div className="recommend-card-title">{healthList[2].title}</div>
                <div className="recommend-card-desc">{healthList[2].desc}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default RecommendPresenter;
