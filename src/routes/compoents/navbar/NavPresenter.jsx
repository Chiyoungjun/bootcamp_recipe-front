import React from 'react';
import './Nav.css';

const NavPresenter = ({ onRank, onRecommend, onCategory }) => {
  return (
    <nav className="main-nav">
      <button className="nav__item" onClick={onRank}>랭킹</button>
      <button className="nav__item" onClick={onRecommend}>추천</button>
      <button className="nav__item" onClick={onCategory}>분류</button>
    </nav>
  );
};

export default NavPresenter;
