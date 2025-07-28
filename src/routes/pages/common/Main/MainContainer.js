import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainPresenter from "./MainPresenter";
// import SignInContainer from "../SignIn/SignInContainer";

const MainContainer = () => {
  // 상태 관리
  // const [showLogin, setShowLogin] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  // 로그인 모달 열기
  // const handleLogin = () => {
  //   setShowLogin(true);
  // };

  // 로그인 모달 닫기
  // const handleLoginClose = () => {
  //   setShowLogin(false);
  // };

  // 회원가입 페이지 이동
  // const handleSignUp = () => {
  //   navigate("/signup");
  // };

  // 검색어 입력 변경 처리
  const onSearchInputChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  // API 호출 및 검색 수행 함수
  const onSearch = async () => {
    if (!searchKeyword.trim()) {
      alert("검색어를 입력해주세요");
      return;
    }

    try {
      // 백엔드 API 엔드포인트 정확히 맞춤 (FastAPI에 맞게)
      const response = await fetch(
        `http://localhost:8000/api/recipes/external/search?q=${encodeURIComponent(searchKeyword)}`
      );

      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      const data = await response.json();

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
    <>
      <MainPresenter
        // onLogin={handleLogin}
        // onSignUp={handleSignUp}
        recipes={recipes}
        searchKeyword={searchKeyword}
        onSearchInputChange={onSearchInputChange}
        onSearch={onSearch}
      />
      {/* {showLogin && <SignInContainer onClose={handleLoginClose} />} */}
    </>
  );
};

export default MainContainer;
