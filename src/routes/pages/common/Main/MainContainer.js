import { useState } from "react";
import MainPresenter from "./MainPresenter";

const ITEMS_PER_PAGE = 20; // 한 페이지 최대 아이템 수 (5 x 4)

const MainContainer = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);

  const onSearchInputChange = (e) => setSearchKeyword(e.target.value);

const onSearch = async () => {
  if (!searchKeyword.trim()) {
    alert("검색어를 입력해주세요");
    return;
  }
  try {
    const response = await fetch(
      `http://localhost:8000/api/recipes/external/search?q=${encodeURIComponent(
        searchKeyword.trim()
      )}`
    );

    if (response.status === 404) {
      // 검색 결과가 없을 때 404도 정상 처리
      setRecipes([]);
      alert("검색 결과가 없습니다.");
      return;
    }

    if (!response.ok) throw new Error("서버 오류");

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      setRecipes(data);
      setPage(1); // 검색 시 페이지 초기화
    } else {
      setRecipes([]);
      alert("검색 결과가 없습니다.");
    }
  } catch {
    alert("검색 중 오류가 발생했습니다.");
  }
};


  return (
    <MainPresenter
      recipes={recipes}
      searchKeyword={searchKeyword}
      onSearchInputChange={onSearchInputChange}
      onSearch={onSearch}
      page={page}
      setPage={setPage}
      itemsPerPage={ITEMS_PER_PAGE}
    />
  );
};

export default MainContainer;