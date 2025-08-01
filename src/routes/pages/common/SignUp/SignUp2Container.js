import React, { useState } from "react";
import SignUp2Presenter from "./SignUp2Presenter";

function SignUp2Container({ onSubmit }) {
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
    // 부모가 전달한 onSubmit 호출 -> SignUpContainer의 handleSignUp이 실행됨
    onSubmit(form);
  };

  return (
    <SignUp2Presenter form={form} onChange={handleChange} onSubmit={handleSubmit} />
  );
}

export default SignUp2Container;
