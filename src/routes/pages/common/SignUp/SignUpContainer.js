import React, { useState } from "react";
import SignUpPresenter from "./SignUpPresenter";
import SignUp2Container from "./SignUp2Container"; // 2단계 import

function SignUpContainer() {
  const [step, setStep] = useState(1);  // 단계 상태 추가

  // 1단계 입력값
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
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleShowPassword = () => {
    setInputs((prev) => ({
      ...prev,
      showPassword: !prev.showPassword,
    }));
  };

  const toggleShowPasswordConfirm = () => {
    setInputs((prev) => ({
      ...prev,
      showPasswordConfirm: !prev.showPasswordConfirm,
    }));
  };

  // 1단계 폼 제출 시 2단계로 이동
  const handleNextStep = (e) => {
    e.preventDefault();
    // 검증 로직 추가 가능
    setStep(2);
  };

  // 단계에 따라 화면 분기
  if (step === 1) {
    return (
      <SignUpPresenter
        inputs={inputs}
        onChange={handleChange}
        onTogglePassword={toggleShowPassword}
        onTogglePasswordConfirm={toggleShowPasswordConfirm}
        onSubmit={handleNextStep}   // 변경!
      />
    );
  } else {
    return <SignUp2Container />;
  }
}

export default SignUpContainer;