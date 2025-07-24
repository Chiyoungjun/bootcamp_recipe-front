// src/components/navbar/NavContainer.jsx
import React, { useState, useEffect } from 'react';
import NavPresenter from './NavPresenter';
import { useNavigate, useLocation } from 'react-router-dom';

const NavContainer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 활성화된 메뉴 상태 (URL 변화에 따라 sync)
  const [activeMenu, setActiveMenu] = useState('');

  // URL 변경 시 activeMenu를 동기화하는 효과
  useEffect(() => {
    // location.pathname 예) "/ranking" "/recommendation"
    const path = location.pathname.replace('/', '') || 'ranking'; // 기본값 'ranking'
    setActiveMenu(path);
  }, [location]);

  // 메뉴 클릭 시 페이지 이동 + activeMenu 변경
  const handleNavigate = (menu) => {
    navigate(`/${menu}`);
    setActiveMenu(menu);
  };

  return (
    <NavPresenter onNavigate={handleNavigate} activeMenu={activeMenu} />
  );
};

export default NavContainer;
