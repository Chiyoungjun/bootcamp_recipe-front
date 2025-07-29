// src/components/common/Sidebar/SidebarContainer.jsx
import SidebarPresenter from './SidebarPresenter';

// selected, onSelect는 마이페이지에서 내려줍니다!
const SidebarContainer = ({ selected, onSelect }) => {
  return (
    <SidebarPresenter selected={selected} onSelect={onSelect} />
  );
};

export default SidebarContainer;
