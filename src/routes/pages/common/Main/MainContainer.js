import { useState } from "react";
import MainPresenter from "./MainPresenter";

const MainContainer = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [recipes, setRecipes] = useState([]);

  const onSearchInputChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const onSearch = async () => {
    if (!searchKeyword.trim()) {
      alert("검색어를 입력해주세요");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/recipes/external/search?q=${encodeURIComponent(
          searchKeyword
        )}`
      );
      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      const data = await response.json();
      console.log("서버응답 데이터:", data);

      if (Array.isArray(data) && data.length > 0) {
        setRecipes(data);
      } else {
        setRecipes([]);
        alert("검색 결과가 없습니다.");
      }
    } catch (error) {
      console.error("검색 중 오류 발생:", error);
      alert("검색 중 오류가 발생했습니다.");
    }
  };

  return (
    <MainPresenter
      recipes={recipes}
      searchKeyword={searchKeyword}
      onSearchInputChange={onSearchInputChange}
      onSearch={onSearch}
    />
  );
};

export default MainContainer;
