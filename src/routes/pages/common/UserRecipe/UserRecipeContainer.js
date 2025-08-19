import React, { useEffect, useState, useCallback } from "react";
import UserRecipePresenter from "./UserRecipePresenter";
import UserRecipeCreateContainer from "../UserRecipeCreate/UserRecipeCreateContainer";

export default function UserRecipeContainer() {
  // ✅ 목록(1) ↔ 작성(2)
  const [step, setStep] = useState(1);

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyRecipes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/my/recipes", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) throw new Error(`목록 조회 실패: ${res.status}`);
      const data = await res.json();
      setRecipes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("레시피 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 목록 화면일 때만 조회
    if (step === 1) fetchMyRecipes();
  }, [step, fetchMyRecipes]);

  // ✅ “등록하기” 버튼 → 작성 화면으로 전환
  const handleClickCreate = () => setStep(2);

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
        onCancel={handleCancelCreate}
        onSaved={handleSaved} // 저장 성공 시 호출하도록 연결(아래 2) 참고)
      />
    );
  }

  // 목록 화면
  return (
    <UserRecipePresenter
      loading={loading}
      error={error}
      recipes={recipes}
      onClickCreate={handleClickCreate}
      onReload={fetchMyRecipes}
    />
  );
}
