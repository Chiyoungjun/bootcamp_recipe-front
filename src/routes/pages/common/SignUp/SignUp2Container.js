import React, { useState } from "react";
import SignUp2Presenter from "./SignUp2Presenter";

function SignUp2Container() {
  const [form, setForm] = useState({
    height: "",
    weight: "",
    birth: "",
    favoriteFood: "",
    favoriteTag: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.agree) {
      alert("이용약관 및 개인정보 처리방침에 동의해야 합니다.");
      return;
    }
    alert("회원가입 완료!\n" + JSON.stringify(form, null, 2));
  };

  return (
    <SignUp2Presenter
      form={form}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}

export default SignUp2Container;
