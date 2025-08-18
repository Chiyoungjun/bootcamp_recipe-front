import React, { useState } from "react";
import SignUpSubPresenter from "./SignUpSubPresenter";

function SignUpSubContainer({ onSubmit, openLogin, onClose }) {
  const [form, setForm] = useState({
    height: "",
    weight: "",
    birth: "",
    gender: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Promise.resolve(onSubmit(form));
      if (typeof onClose === "function") onClose();
    } catch (err) {
      console.error("Sign up failed:", err);
    }
  };

  return (
    <SignUpSubPresenter
      form={form}
      onChange={handleChange}
      onSubmit={handleSubmit}
      openLogin={openLogin}
    />
  );
}

export default SignUpSubContainer;