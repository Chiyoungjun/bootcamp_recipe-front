import HeaderContainer from '../../routes/compoents/header/HeaderContainer';
import NavContainer from '../../routes/compoents/navbar/NavContainer';  // 네비 컨테이너
import { Outlet } from 'react-router-dom';


const MainLayout = () => (
  <div className="main-layout">
    <HeaderContainer />
    <NavContainer />

    <div className="main-content">

      <Outlet />
    </div>
  </div>
);

export default MainLayout;
