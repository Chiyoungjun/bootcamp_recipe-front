import { useState, useEffect } from "react";
import UserEditPresenter from "./UserEditPresenter";

const UserEditContainer = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // sessionStorage에서 user_id 가져오기
  const userId = sessionStorage.getItem("user_id");
  console.log("userId:", userId);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userId) {
        setError("로그인 정보가 없습니다.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/users/${userId}`);
        if (!response.ok) {
          throw new Error(`서버 에러: ${response.status}`);
        }
        const data = await response.json();
        console.log("API 응답 전체:", data);

        if (data.status !== 200 || !data.data) {
          throw new Error(data.message || "사용자 정보를 불러오는데 실패했습니다.");
        }

        const userData = data.data;

        // DB 필드명 기준으로 상태 세팅 (Presenter input name과 완전 일치)
        setUserInfo({
          ko_name: userData.ko_name || "",
          email: userData.email || "",
          user_id: userData.user_id || "",
          password: "", // 비밀번호는 일반적으로 빈 값 초기화
          height: userData.height || "",
          weight: userData.weight || "",
          birth_date: userData.birth_date || "",
          preferred_food: userData.preferred_food || "",
          preferred_tags: userData.preferred_tags || "",
        });

        setError(null);
      } catch (e) {
        console.error("사용자 정보 불러오기 에러:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId]);

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 프론트 상태 필드명 그대로 백엔드에 전달 (또는 필요시 명확히 매핑)
    const submitData = { ...userInfo };

    try {
      const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });
      const data = await response.json();
      console.log("PATCH 응답:", data);

      if (response.ok && data.status === 200) {
        setSaved(true);
        alert("회원정보가 성공적으로 수정되었습니다!");
      } else {
        alert(data.message || data.detail || "수정에 실패했습니다.");
      }
    } catch (error) {
      alert("서버 요청 중 오류가 발생했습니다: " + error.message);
    }
  };

  if (loading) return <div>사용자 정보를 불러오는 중...</div>;
  if (error) return <div>에러 발생: {error}</div>;

  return userInfo ? (
    <UserEditPresenter
      userInfo={userInfo}
      onChange={handleChange}
      onSave={handleSave}
      saved={saved}
    />
  ) : (
    <div>사용자 정보가 없습니다.</div>
  );
};

export default UserEditContainer;
