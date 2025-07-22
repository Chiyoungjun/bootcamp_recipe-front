import './Rank.css';

const RankPresenter = ({ topThree }) => {
    return (
        <div>
            <h2>🏆 Top 3 랭킹</h2>
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

export default RankPresenter;
