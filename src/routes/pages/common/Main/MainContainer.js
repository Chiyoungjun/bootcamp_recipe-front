import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 추가
import MainPresenter from "./MainPresenter";
import SignInContainer from "../SignIn/SignInContainer";

const MainContainer = () => {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate(); // 추가

  // 로그인 버튼 클릭 시 모달 오픈
  const handleLogin = () => {
    setShowLogin(true);
  };

  // 모달 닫기 (SignInContainer에서 onClose로 내려줌)
  const handleLoginClose = () => {
    setShowLogin(false);
  };

  // 회원가입 버튼 클릭 시 페이지 이동
  const handleSignUp = () => {
    navigate("/signup"); // 회원가입 페이지로 이동
  };

  return (
    <>
      <MainPresenter
        onLogin={handleLogin}
        onSignUp={handleSignUp}
      />
      {showLogin && (
        <SignInContainer onClose={handleLoginClose} />
      )}
    </>
  );
};

export default MainContainer;
