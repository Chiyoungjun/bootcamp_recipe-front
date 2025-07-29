// src/components/common/Sidebar/SidebarPresenter.jsx
import './Sidebar.css';

const SidebarPresenter = ({ selected, onSelect }) => (
  <aside className="sidebar-app">
    <ul>
      <li
        className={selected === "edit" ? "active" : ""}
        onClick={() => onSelect("edit")}
      >
        회원정보 수정
      </li>
      <li
        className={selected === "favorite" ? "active" : ""}
        onClick={() => onSelect("favorite")}
      >
        즐겨찾기
      </li>
      <li
        className={selected === "history" ? "active" : ""}
        onClick={() => onSelect("history")}
      >
        검색 기록
      </li>
    </ul>
  </aside>
);

export default SidebarPresenter;
