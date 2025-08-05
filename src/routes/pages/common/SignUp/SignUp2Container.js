import React, { useState } from "react";
import SignUp2Presenter from "./SignUp2Presenter";

function SignUp2Container({ onSubmit, openLogin }) {
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
    onSubmit(form);
  };

  return (
    <SignUp2Presenter form={form} onChange={handleChange} onSubmit={handleSubmit} openLogin={openLogin} />
  );
}

export default SignUp2Container;
