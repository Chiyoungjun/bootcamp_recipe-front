import React from "react";
import Card1Container from "../../components/cards/Card1/Card1Container";
import "./Recipe.css"; // 필요시

const RecipeListPresenter = ({ recipes }) => {
  if (!recipes || recipes.length === 0) {
    return 
  }
  return (
    <div className="recipe-list">
      {recipes.map((item, idx) => (
        <Card1Container
          key={item.RCP_SEQ || item.RCP_NM || idx}
          recipe={item}
        />
      ))}
    </div>
  );
};

export default RecipeListPresenter;