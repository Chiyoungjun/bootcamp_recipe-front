import './Card1.css'; // 필요에 따라 스타일 파일 만들거나 기존 Rank.css 재사용

const Card1Presenter = ({ topThree }) => {
  return (
    <div>
      <h2>👤 마이페이지 - Top 3 유저</h2>
      <ol>
        {topThree.map((user, index) => (
          <li key={user.id}>
            <strong>{index + 1}위</strong> - {user.name} ({user.score}점)
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Card1Presenter;
