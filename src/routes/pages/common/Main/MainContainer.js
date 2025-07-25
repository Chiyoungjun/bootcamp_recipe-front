import { useNavigate } from "react-router-dom";
import MainPresenter from "./MainPresenter";
import { useState } from "react";
import axios from "axios";

const MainContainer = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => navigate('/signin');
  const handleSignUp = () => navigate('/signup');

  const handleSearchInputChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleSearch = async () => {
    const trimmedKeyword = searchKeyword.trim();
    if (!trimmedKeyword) {
      setRecipes([]);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/api/recipes/external/search?q=${encodeURIComponent(trimmedKeyword)}`
      );
      console.log("API에서 받은 recipes:", response.data);
      // 🔴 이 API는 배열만 반환하므로 그대로
      setRecipes(response.data);
    } catch (error) {
      console.error("레시피 검색 중 오류 발생:", error);
      setRecipes([]);
    }
  };

  return (
    <MainPresenter
      onLogin={handleLogin}
      onSignUp={handleSignUp}
      recipes={recipes}
      searchKeyword={searchKeyword}
      onSearchInputChange={handleSearchInputChange}
      onSearch={handleSearch}
    />
  );
};

export default MainContainer;
