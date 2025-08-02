import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../pages/common/SignIn/LoginContext";// 실제 경로로 바꾸세요
import HeaderPresenter from "./HeaderPresenter";
import SignInContainer from "../../pages/common/SignIn"; // 로그인 모달 경로에 맞게 조정
import main_logo from './main_logo.png'; // 로고 경로에 맞게 조정

const HeaderContainer = () => {
  const { user, logout } = useContext(LoginContext);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = !!user;
  const userName = user?.ko_name || "";

  // 로고 클릭 시 메인 페이지 이동
  const handleLogoClick = () => {
    navigate("/");
  };

  // 로그인 모달 열기
  const handleLogin = () => {
    setShowLogin(true);
  };

  // 로그인 모달 닫기
  const handleLoginClose = () => {
    setShowLogin(false);
  };

  // 로그인 성공 시 호출되는 콜백
  const handleLoginSuccess = (userData) => {
    // LoginContext의 setUser가 이미 로그인 상태를 관리하므로
    // 여기서는 모달 닫기만 해도 충분할 수 있음
    setShowLogin(false);
    // 추가로 필요하면 다른 상태 처리 가능
  };

  // 로그아웃 처리
  const handleLogout = () => {
    logout();
    alert("로그아웃 되었습니다.");
    navigate("/"); // 로그아웃 후 메인 페이지 이동 선택적 수행
  };

  // 회원가입 페이지 이동
  const handleMyPage = () => {
    navigate("/mypage"); // 회원가입 라우트에 맞게 변경
  };

  return (
    <>
      <HeaderPresenter
        mainLogo={main_logo}
        onLogoClick={handleLogoClick}
        onLogin={handleLogin}
        onMyPage={handleMyPage}
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
