import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderPresenter from "./HeaderPresenter";
import SignInContainer from "../../pages/common/SignIn";  // 로그인 모달 경로에 맞게 조정
import main_logo from './main_logo.png';

const HeaderContainer = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogin = () => {
    setShowLogin(true);
  };

  const handleLoginClose = () => {
    setShowLogin(false);
  };

  // 로그인 성공 시 호출
  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setShowLogin(false);
    setUserName(userData.ko_name || "");
  };

  // 로그아웃 처리
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
    alert("로그아웃 되었습니다.");
  };

  const handleSignUp = () => {
    navigate('/mypage');
  };

  return (
    <>
      <HeaderPresenter
        mainLogo={main_logo}
        onLogin={handleLogin}
        onSignUp={handleSignUp}
        onLogoClick={handleLogoClick}
        isLoggedIn={isLoggedIn}
        userName={userName}
        onLogout={handleLogout}
      />
      {showLogin && (
        <SignInContainer 
          onClose={handleLoginClose}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
};

export default HeaderContainer;
