import React, { useState, useContext } from "react";
import SignInPresenter from "./SignInPresenter";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./LoginContext";
import "./SignIn.css";

const SignInContainer = ({ onClose, onLoginSuccess, onGoSignUp }) => {
  const navigate = useNavigate();
  const { setUser } = useContext(LoginContext);

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!id.length) {
      alert("아이디를 입력해주세요");
      return;
    }

    if (!password.length) {
      alert("비밀번호를 입력해주세요");
      return;
    }

    try {
      const userInfo = { user_id: id, pw: password };

      const response = await fetch("http://localhost:8000/api/users/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
      });

      const result = await response.json();

      if (response.ok && result.status === 200) {
        const userData = result.data;
        sessionStorage.setItem("user_id", userData.user_id);

        setUser({
          user_id: userData.user_id,
          ko_name: userData.ko_name || "",
          email: userData.email || "",
          height: userData.height ?? null,
          weight: userData.weight ?? null,
          preferred_food: userData.preferred_food || "",
          preferred_tags: userData.preferred_tags || "",
          birth_date: userData.birth_date || "",
        });

        if (onLoginSuccess) onLoginSuccess(userData);

        alert(`${userData.ko_name}님 반갑습니다.`);

        if (onClose) onClose();
        navigate("/");
        return;
      }

      alert(`로그인 실패: ${result.message || "아이디 또는 비밀번호가 틀렸습니다."}`);
    } catch (error) {
      alert("로그인 요청 에러");
      console.error(error);
    }
  };

  return (
    <SignInPresenter
      id={id}
      password={password}
      setId={setId}
      setPassword={setPassword}
      handleSignIn={handleSignIn}
      onClose={onClose}
      onGoSignUp={onGoSignUp}
    />
  );
};

export default SignInContainer;
