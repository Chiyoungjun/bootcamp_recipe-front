import React, { useEffect, useState, useContext } from "react";
import RecommendPresenter from "./RecommendPresenter";
import axios from "axios";
import { LoginContext } from "../SignIn/LoginContext";  // 로그인 컨텍스트 임포트

function RecommendContainer() {
  const { user } = useContext(LoginContext);
  const userId = user?.user_id || null;  // 로그인된 사용자 ID 가져오기

  const [preferenceList, setPreferenceList] = useState([]);
  const [healthList, setHealthList] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchPreferenceList = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/recommendations/user-preferences`, {
          params: { user_id: userId },
        });
        setPreferenceList(response.data.recipes || []);
      } catch (error) {
        console.error("선호 기반 추천 불러오기 실패:", error);
        setPreferenceList([]);
      }
    };

    fetchPreferenceList();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    // 건강 상태 기반 추천 (머신러닝 미적용 시 현재 기본 동작)
    const fetchHealthList = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/recommendations/bmi`, {
          params: { user_id: userId },
        });
        setHealthList(response.data.recipes || []);
      } catch (error) {
        console.error("건강 상태 기반 추천 불러오기 실패:", error);
        setHealthList([]);
      }
    };

    fetchHealthList();
  }, [userId]);

  return (
    <div className="recommend-root">
      <RecommendPresenter title="회원님의 선호 레시피를 바탕으로 추천해봤어요" list={preferenceList} />
      <RecommendPresenter title="회원님의 건강상태를 바탕으로 추천해봤어요" list={healthList} />
    </div>
  );
}

export default RecommendContainer;
