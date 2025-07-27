import React from 'react';
import NavPresenter from './NavPresenter';
import { useNavigate } from 'react-router-dom';

const NavContainer = () => {
  const navigate = useNavigate();

const handleRank = () => {
  console.log('랭킹 버튼 클릭!');
  navigate('/rank');
};

  const handleRecommend = () => {
    navigate('/recommend');
  };

  const handleCategory = () => {
    navigate('/category');
  };

  return (
    <NavPresenter
      onRank={handleRank}
      onRecommend={handleRecommend}
      onCategory={handleCategory}
    />
  );
};

export default NavContainer;
