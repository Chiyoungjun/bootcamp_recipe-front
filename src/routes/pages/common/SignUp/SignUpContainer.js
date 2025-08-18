// SignUp/SignUpContainer.jsx
import React, { useState } from "react";
import SignUpPresenter from "./SignUpPresenter";
import SignUpSubContainer from "../SignUpSub/SignUpSubContainer";

// ✅ onClose / openLogin 기본값 제공: 부모가 안 내려줘도 런타임 에러 방지
function SignUpContainer({ onClose = () => {}, openLogin = () => {} }) {
  const [step, setStep] = useState(1);

  // ✅ 1단계(기본정보) 입력 상태
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    passwordConfirm: "",
    showPassword: false,
    showPasswordConfirm: false,
  });

  // ✅ 공통 입력 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ 비밀번호 표시/숨김 토글
  const toggleShowPassword = () => {
    setInputs((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };
  const toggleShowPasswordConfirm = () => {
    setInputs((prev) => ({ ...prev, showPasswordConfirm: !prev.showPasswordConfirm }));
  };

  // ✅ 1단계 → 2단계 이동
  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(2);
  };

  // ✅ 최종 회원가입 처리: 성공/실패를 boolean으로 반환 (닫기 책임은 Sub로 위임)
  const handleSignUp = async (form) => {
    if (!form.agree) {
      alert("이용약관 및 개인정보 처리방침에 동의해야 합니다.");
      return false; // ← 실패
    }

    const payload = {
      user_id: inputs.username,
      pw: inputs.password,
      ko_name: inputs.name,
      email: inputs.email,
      birth_date: form.birth,
      height: form.height,
      weight: form.weight,
      preferred_food: form.favoriteFood,
      preferred_tags: form.favoriteTag,
    };

    try {
      const response = await fetch("http://localhost:8000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (response.ok && data.status === 200) {
        alert("회원가입이 완료되었습니다!");

        // ✅ 상태 초기화
        setStep(1);
        setInputs({
          name: "",
          email: "",
          username: "",
          password: "",
          passwordConfirm: "",
          showPassword: false,
          showPasswordConfirm: false,
        });

        return true; // ← 성공
      } else {
        alert("회원가입 실패: " + (data.detail || data.message || "알 수 없는 오류"));
        return false; // ← 실패
      }
    } catch (error) {
      alert("서버 요청 중 오류가 발생했습니다: " + error.message);
      return false; // ← 실패
    }
  };

  // ✅ 바깥 배경 클릭 시 닫기
  const onBackgroundClick = (e) => {
    if (e.target.classList.contains("modal-bg")) {
      onClose();
    }
  };

  // ✅ 모달 내부 클릭이 배경 클릭으로 전파되지 않도록 방지
  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div className="modal-bg" onClick={onBackgroundClick}>
      {/* ⬇️ 내부 클릭 전파 방지 */}
      <div className="modal-wrap" onClick={stopPropagation}>
        {/* ✅ X 버튼 */}
        <button className="modal-close-btn" onClick={onClose} aria-label="닫기">
          ×
        </button>

        {step === 1 ? (
          <SignUpPresenter
            inputs={inputs}
            onChange={handleChange}
            onTogglePassword={toggleShowPassword}
            onTogglePasswordConfirm={toggleShowPasswordConfirm}
            onSubmit={handleNextStep}
            openLogin={openLogin}
          />
        ) : (
          // ✅ 중요: 2페이지에도 onClose를 전달 (성공 시점에서 닫기 담당)
          <SignUpSubContainer
            onSubmit={handleSignUp}
            openLogin={openLogin}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}

export default SignUpContainer;