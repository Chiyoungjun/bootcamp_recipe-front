import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../pages/common/SignIn/LoginContext";
import HeaderPresenter from "./HeaderPresenter";
import SignInContainer from "../../pages/common/SignIn/SignInContainer";
import SignUpContainer from "../../pages/common/SignUp/SignUpContainer";
import main_logo from "./main_logo.png";

const HeaderContainer = () => {
  const { user, logout } = useContext(LoginContext);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = !!user;
  const userName = user?.ko_name || "";

  const handleLogoClick = () => {
    navigate("/");
  };

  const openLogin = () => {
    setShowLogin(true);
    setShowSignUp(false);
  };

  const closeLogin = () => {
    setShowLogin(false);
  };

  const openSignUp = () => {
    setShowSignUp(true);
    setShowLogin(false);
  };

  const closeSignUp = () => {
    setShowSignUp(false);
  };

  const onLoginSuccess = (userData) => {
    setShowLogin(false);
  };

  // 로그인 모달 내 회원가입 클릭 시
  const onGoSignUp = () => {
    setShowLogin(false);
    setShowSignUp(true);
  };

  // 회원가입 모달 내 로그인 클릭 시
  const onGoLogin = () => {
    setShowSignUp(false);
    setShowLogin(true);
  };

  const handleLogout = () => {
    logout();
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  const handleMyPage = () => {
    navigate("/mypage");
  };

  return (
    <>
      <HeaderPresenter
        mainLogo={main_logo}
        onLogoClick={handleLogoClick}
        onLogin={openLogin}
        onMyPage={handleMyPage}
        isLoggedIn={isLoggedIn}
        userName={userName}
        onLogout={handleLogout}
      />

      {/* 로그인 모달 */}
      {showLogin && (
        <SignInContainer
          onClose={closeLogin}
          onLoginSuccess={onLoginSuccess}
          onGoSignUp={onGoSignUp}
        />
      )}

      {/* 회원가입 모달 */}
      {showSignUp && (
        <SignUpContainer onClose={closeSignUp} openLogin={onGoLogin} />
      )}
    </>
  );
};

export default HeaderContainer;
