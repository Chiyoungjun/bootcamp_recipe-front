// src/components/navbar/NavPresenter.jsx
import React from 'react';
import './Nav.css';

const NavPresenter = ({ onNavigate, activeMenu }) => {
  return (
    <nav className="main-nav">
      <span 
        onClick={() => onNavigate('ranking')}
        className={activeMenu === 'ranking' ? 'active' : ''}
      >
        랭킹
      </span>
      <span 
        onClick={() => onNavigate('recommendation')}
        className={activeMenu === 'recommendation' ? 'active' : ''}
      >
        추천
      </span>
      <span 
        onClick={() => onNavigate('category')}
        className={activeMenu === 'category' ? 'active' : ''}
      >
        분류
      </span>
      <span 
        onClick={() => onNavigate('search-history')}
        className={activeMenu === 'search-history' ? 'active' : ''}
      >
        검색기록
      </span>
    </nav>
  );
};

export default NavPresenter;
