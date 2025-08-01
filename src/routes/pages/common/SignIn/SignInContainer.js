import { useState } from "react";
import SignInPresenter from "./SignInPresenter";
import { useNavigate } from "react-router-dom";

const SignInContainer = ({ onClose, onLoginSuccess }) => {
  const navigate = useNavigate();

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!id.length) {
      alert('아이디를 입력해주세요');
      return;
    }

    if (!password.length) {
      alert('비밀번호를 입력해주세요');
      return;
    }

    try {
      const userInfo = {
        user_id: id,
        pw: password,
      };

      const response = await fetch("http://localhost:8000/api/users/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      const result = await response.json();

      if (response.ok && result.status === 200) {
        // sessionStorage에 user_id 저장
        sessionStorage.setItem("user_id", result.data.user_id);

        alert(`${result.data.ko_name}님 반갑습니다.`);
        if (onLoginSuccess) onLoginSuccess(result.data);
        if (onClose) onClose();
        return;
      }

      alert(`로그인 실패: ${result.message || "아이디 또는 비밀번호가 틀렸습니다."}`);

    } catch (error) {
      alert('로그인 요청 에러');
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
