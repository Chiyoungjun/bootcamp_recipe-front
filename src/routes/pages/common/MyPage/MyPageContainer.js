// MyPageContainer.jsx
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SidebarContainer from "../../../compoents/sidebar/SidebarContainer";
import UserEditContainer from "../UserEdit";
import FavoritesContainer from "../UserFavorites";
import SearchHistoryContainer from "../UserSearchHistory";
import RecipeContainer from "../UserRecipe";
import { LoginContext } from "../../common/SignIn/LoginContext"; // 전역 로그인/모달 컨텍스트

const MyPageContainer = () => {
  const [selectedMenu, setSelectedMenu] = useState("edit");

  // 전역 로그인 여부와 모달 제어 함수
  const { isLogin, openLoginModal } = useContext(LoginContext);

  const navigate = useNavigate();

  useEffect(() => {
    // 1) 마이페이지 진입 시 비로그인이라면
    if (!isLogin) {
      // 2) 안내 후 확인이면 모달을 연다
      const goLogin = window.confirm("로그인 후 이용 가능합니다.\n로그인 하시겠습니까?");
      if (goLogin) {
        // 중요: 메인으로 이동하기 전에/이동한 직후에도 모달이 뜰 수 있게 '전역 상태'를 true로 만든다
        openLoginModal();

        // 필요 시 메인으로 라우팅 (레이아웃/메인에서 모달을 렌더링)
        navigate("/");
      } else {
        // 취소 시 뒤로 가기(또는 메인으로)
        navigate(-1);
      }
    }
  }, [isLogin, navigate, openLoginModal]);

  // 비로그인 상태에서는 본문을 렌더하지 않음(모달에 제어 위임)
  if (!isLogin) return null;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "calc(100vh - 64px)",
        width: "100%",
        background: "#f9f9fc",
      }}
    >
      {/* 왼쪽 메뉴 */}
      <SidebarContainer selected={selectedMenu} onSelect={setSelectedMenu} />

      {/* 오른쪽 컨텐츠 */}
      <main
        style={{
          flex: 1,
          padding: "44px 42px 32px 42px",
          background: "#fff",
          minWidth: 0,
        }}
      >
        {selectedMenu === "edit" && <UserEditContainer />}
        {selectedMenu === "favorite" && <FavoritesContainer />}
        {selectedMenu === "history" && <SearchHistoryContainer />}
        {selectedMenu === "recipe" && <RecipeContainer />}
      </main>
    </div>
  );
};

export default MyPageContainer;