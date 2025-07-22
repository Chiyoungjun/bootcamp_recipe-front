import './Recommend.css';  // 기존 스타일 그대로 사용

const RecommendPresenter = ({ topThree }) => {
  return (
    <div>
      <h2>🍽️ Top 3 추천 요리</h2>
      <ol>
        {topThree.map((dish, index) => (
          <li key={dish.id}>
            <strong>{index + 1}위</strong> - {dish.dish} ({dish.rating}점)
          </li>
        ))}
      </ol>
    </div>
  );
};

export default RecommendPresenter;
