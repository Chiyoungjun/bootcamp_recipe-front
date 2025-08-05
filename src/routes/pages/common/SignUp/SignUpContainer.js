import React, { useState } from "react";
import SignUpPresenter from "./SignUpPresenter";
import SignUp2Container from "./SignUp2Container";

function SignUpContainer({ onClose, openLogin }) {
  const [step, setStep] = useState(1);

  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    passwordConfirm: "",
    showPassword: false,
    showPasswordConfirm: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const toggleShowPassword = () => {
    setInputs((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const toggleShowPasswordConfirm = () => {
    setInputs((prev) => ({ ...prev, showPasswordConfirm: !prev.showPasswordConfirm }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSignUp = async (form) => {
    if (!form.agree) {
      alert("이용약관 및 개인정보 처리방침에 동의해야 합니다.");
      return;
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
        if (onClose) onClose();
      } else {
        alert("회원가입 실패: " + (data.detail || data.message || "알 수 없는 오류"));
      }
    } catch (error) {
      alert("서버 요청 중 오류가 발생했습니다: " + error.message);
    }
  };

  const onBackgroundClick = (e) => {
    if (e.target.classList.contains("modal-bg")) {
      onClose();
    }
  };

  return (
    <div className="modal-bg" onClick={onBackgroundClick}>
      <div className="modal-wrap">
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
          <SignUp2Container onSubmit={handleSignUp} openLogin={openLogin} />
        )}
      </div>
    </div>
  );
}

export default SignUpContainer;
