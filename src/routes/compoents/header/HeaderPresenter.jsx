import './Header.css';

const HeaderPresenter = ({ mainLogo, onLogin, onSignUp, onLogoClick }) => (
  <header className="main-header">
    <div className="main-header__left">
      <div
        className="main-header__logo-wrap"
        style={{ cursor: 'pointer' }}
        onClick={onLogoClick}
      >
        <img
          src={mainLogo}
          alt="SNAP COOK 로고"
          className="main-header__logo-img"
        />
      </div>
    </div>
    <div
      className="main-header__center"
      style={{ cursor: 'pointer' }}
      onClick={onLogoClick}
    >
      <div className="main-header__logo-title">SNAP COOK</div>
    </div>
    <div className="main-header__auth">
      <button onClick={onLogin} className="main-header__login-btn">로그인</button>
      <button onClick={onSignUp} className="main-header__signup-btn">마이페이지</button>
    </div>
  </header>
);

export default HeaderPresenter;
