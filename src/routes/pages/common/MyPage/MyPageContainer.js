import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SidebarContainer from "../../../compoents/sidebar/SidebarContainer";
import UserEditContainer from "../UserEdit";
import FavoritesContainer from "../UserFavorites";
import SearchHistoryContainer from "../UserSearchHistory";
import RecipeContainer from "../UserRecipe";
import UserRecipeEditContainer from "../UserRecipeEdit";
import { LoginContext } from "../../common/SignIn/LoginContext";

const MyPageContainer = () => {
  const [selectedMenu, setSelectedMenu] = useState("edit");
  const [editTarget, setEditTarget] = useState(null); // 수정할 레시피 정보 저장

  const { isLogin, openLoginModal } = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogin) {
      const goLogin = window.confirm("로그인 후 이용 가능합니다.\n로그인 하시겠습니까?");
      if (goLogin) {
        openLoginModal();
        navigate("/");
      } else {
        navigate(-1);
      }
    }
  }, [isLogin, navigate, openLoginModal]);

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
        {selectedMenu === "recipe" && (
          <RecipeContainer
            setSelectedMenu={setSelectedMenu}
            setEditTarget={setEditTarget}
          />
        )}
        {selectedMenu === "recipeEdit" && (
          <UserRecipeEditContainer recipe={editTarget} />
        )}
      </main>
    </div>
  );
};

export default MyPageContainer;
