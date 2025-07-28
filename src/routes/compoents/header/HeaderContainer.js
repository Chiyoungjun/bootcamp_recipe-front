import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderPresenter from "./HeaderPresenter";
import SignInContainer from "../../pages/common/SignIn";  // 실제 로그인 모달 위치/이름에 맞게 수정
import main_logo from './main_logo.png';

const HeaderContainer = () => {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  // 로고, 제목 클릭 시 홈 이동
  const handleLogoClick = () => {
    navigate('/');
  };

  // 로그인 버튼 클릭: 모달 열기
  const handleLogin = () => {
    setShowLogin(true);
  };

  // 로그인 모달 닫기
  const handleLoginClose = () => {
    setShowLogin(false);
  };

  // 회원가입 클릭: 회원가입 페이지로 이동
  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <>
      <HeaderPresenter
        mainLogo={main_logo}
        onLogin={handleLogin}
        onSignUp={handleSignUp}
        onLogoClick={handleLogoClick}
      />
      {showLogin && <SignInContainer onClose={handleLoginClose} />}
    </>
  );
};

export default HeaderContainer;
