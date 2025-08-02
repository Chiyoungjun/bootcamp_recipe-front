import React, { useState, useContext } from "react";
import SignInPresenter from "./SignInPresenter";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./LoginContext";

const SignInContainer = ({ onClose, onLoginSuccess }) => {
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
      const userInfo = {
        user_id: id,
        pw: password,
      };

      const response = await fetch("http://localhost:8000/api/users/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
      });

      const result = await response.json();

      if (response.ok && result.status === 200) {
        const userData = result.data;

        // sessionStorage에 user_id 저장
        sessionStorage.setItem("user_id", userData.user_id);

        // 전역 로그인 상태에 상세 정보 저장 (null 가능 필드도 고려)
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

        // HeaderContainer에 로그인 성공 알리기
        if (onLoginSuccess) {
          onLoginSuccess(userData);
        }

        alert(`${userData.ko_name}님 반갑습니다.`);

        if (onClose) onClose();

        navigate("/"); // 로그인 후 이동 경로 설정
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
    />
  );
};

export default SignInContainer;
