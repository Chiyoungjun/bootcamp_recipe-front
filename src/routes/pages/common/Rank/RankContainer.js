import { useState, useEffect } from "react";
import RankPresenter from "./RankPresenter";


const RankContainer = () => {
    // 예시 데이터 (API 대신 하드코딩)
    const [rankData, setRankData] = useState([]);

    useEffect(() => {
        // 실제 환경에서는 여기서 fetch()나 axios로 데이터를 불러오세요
        const dummyData = [
            { id: 1, name: "Alice", score: 95 },
            { id: 2, name: "Bob", score: 90 },
            { id: 3, name: "Charlie", score: 85 },
            { id: 4, name: "David", score: 80 }
        ];

        setRankData(dummyData);
    }, []);

    // Top 3만 추출 (점수 내림차순 정렬 후 추출)
    const topThree = [...rankData].sort((a, b) => b.score - a.score).slice(0, 3);

    return <RankPresenter topThree={topThree} />;
};

export default RankContainer;
