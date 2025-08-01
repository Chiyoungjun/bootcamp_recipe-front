import React, { useState } from "react";
import SignUpPresenter from "./SignUpPresenter";
import SignUp2Container from "./SignUp2Container";

function SignUpContainer() {
  const [step, setStep] = useState(1);

  // 1단계 입력값 (기존 변수명 유지)
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

  // 1단계 제출 → 2단계 이동
  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(2);
  };

  // --- 여기에 2단계에서 받은 데이터로 회원가입 요청하는 함수 추가 ---
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
    const response = await fetch("http://localhost:8000/api/users/signup", {  // users 복수형으로 변경
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
    } else {
      alert("회원가입 실패: " + (data.detail || data.message || "알 수 없는 오류"));
    }
  } catch (error) {
    alert("서버 요청 중 오류가 발생했습니다: " + error.message);
  }
};


  // 단계별 화면 분기, 2단계일 때 Props로 onSubmit(최종 submit 함수) 전달
  if (step === 1) {
    return (
      <SignUpPresenter
        inputs={inputs}
        onChange={handleChange}
        onTogglePassword={toggleShowPassword}
        onTogglePasswordConfirm={toggleShowPasswordConfirm}
        onSubmit={handleNextStep}
      />
    );
  } else {
    return <SignUp2Container onSubmit={handleSignUp} />;  // onSubmit 전달
  }
}

export default SignUpContainer;
