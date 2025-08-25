import React, { useEffect, useState, useCallback, useContext } from "react";
import UserRecipePresenter from "./UserRecipePresenter";
import UserRecipeCreateContainer from "../UserRecipeCreate/UserRecipeCreateContainer";
import { LoginContext } from "../SignIn/LoginContext";

// setSelectedMenu, setEditTarget를 props로 받는다!
export default function UserRecipeContainer({ setSelectedMenu, setEditTarget }) {
  const { user, isLogin } = useContext(LoginContext);
  const userId = user?.user_id;

  // ✅ 목록(1) ↔ 작성(2)
  const [step, setStep] = useState(1);

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BACKEND_BASE_URL = "http://localhost:8000";

  const fetchMyRecipes = useCallback(async () => {
    if (!userId) {
      setError("로그인이 필요합니다.");
      setRecipes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${BACKEND_BASE_URL}/api/users/${userId}/recipes`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error(`목록 조회 실패: ${res.status}`);
      const data = await res.json();
      setRecipes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("레시피 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    // 목록 화면일 때만 조회
    if (step === 1) fetchMyRecipes();
  }, [step, fetchMyRecipes]);

  // ✅ “등록하기” 버튼 → 작성 화면으로 전환
  const handleClickCreate = () => {
    if (!isLogin) {
      alert("로그인이 필요합니다.");
      return;
    }
    setStep(2);
  };

  // ✅ 작성 취소 → 목록 복귀
  const handleCancelCreate = () => setStep(1);

  // ✅ 작성 저장 완료 → 목록 복귀 + 새로고침
  const handleSaved = () => {
    setStep(1);
    fetchMyRecipes();
  };

  if (step === 2) {
    // 작성 화면
    return (
      <UserRecipeCreateContainer
        userId={userId}
        onCancel={handleCancelCreate}
        onSaved={handleSaved}
      />
    );
  }

  // 목록 화면: props로 setSelectedMenu, setEditTarget을 전달
  return (
    <UserRecipePresenter
      loading={loading}
      error={error}
      recipes={recipes}
      onClickCreate={handleClickCreate}
      onReload={fetchMyRecipes}
      setSelectedMenu={setSelectedMenu}
      setEditTarget={setEditTarget}
    />
  );
}
