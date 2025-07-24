import { MainLayout } from '../../../../layouts'; // export 방식 확인
import mainLogo from './main_logo.png';
import NavPresenter from '../../../compoents/navbar';
import './Main.css';

const MainPresenter = ({ onLogin, onSignUp }) => {
  return (
    <MainLayout>
      <header className="main-header">
        <div className="main-header__logo-wrap">
          <img src={mainLogo} alt="SNAP COOK 로고" className="main-header__logo-img" />
          <div className="main-header__logo-title">SNAP COOK</div>
        </div>
        <div className="main-header__auth">
          <button onClick={onLogin} className="main-header__login-btn">로그인</button>
          <button onClick={onSignUp} className="main-header__signup-btn">회원가입</button>
        </div>
      </header>
      <NavPresenter />
      <section className="main-search-section">
        <div className="main-search-box">
          <span className="main-search__icon">🔍</span>
          <input
            type="text"
            className="main-search__input"
            placeholder="레시피 검색"
          />
          <button className="main-search__plus-btn">+</button>
        </div>
      </section>
    </MainLayout>
  );
};

export default MainPresenter;
