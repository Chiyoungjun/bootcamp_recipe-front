// MyPageContainer.jsx
import { useState } from "react";
import SidebarContainer from "../../../compoents/sidebar/SidebarContainer";
import UserEditContainer from "../UserEdit";
import FavoritesContainer from "../UserFavorites";
import SearchHistoryContainer from "../UserSearchHistory";

const MyPageContainer = () => {
  const [selectedMenu, setSelectedMenu] = useState("edit");

  return (
    <div style={{
      display: "flex",
      minHeight: "calc(100vh - 64px)", // 헤더/네비 높이 빼기
      width: "100%",
      background: "#f9f9fc" // 또는 transparent 등
    }}>
      <SidebarContainer selected={selectedMenu} onSelect={setSelectedMenu} />
      <main style={{
        flex: 1,
        padding: "44px 42px 32px 42px",
        background: "#fff",
        minWidth: 0,
      }}>
        {selectedMenu === "edit" && <UserEditContainer />}
        {selectedMenu === "favorite" && <FavoritesContainer />}
        {selectedMenu === "history" && <SearchHistoryContainer />}
      </main>
    </div>
  );
};

export default MyPageContainer;
