// MyPageContainer.jsx
import { useState } from "react";
import SidebarContainer from "../../../compoents/sidebar/SidebarContainer";
import UserEditContainer from "../UserEdit";

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
        padding: '44px 42px 32px 42px',
        background: '#fff',
        minWidth: 0, // flex-bug 방지
      }}>
        {selectedMenu === "edit" && <UserEditContainer />}
        {selectedMenu === "favorite" && (
          <div style={{ color: "#aaa", textAlign: "center", marginTop: 60 }}>
            <h3>즐겨찾기 기능 준비중</h3>
            <p>곧 만나요 :)</p>
          </div>
        )}
        {selectedMenu === "history" && (
          <div style={{ color: "#aaa", textAlign: "center", marginTop: 60 }}>
            <h3>검색 기록 기능 준비중</h3>
            <p>곧 만나요 :)</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyPageContainer;
