import './Header.css';

const HeaderPresenter = ({
  mainLogo,
  onLogin,
  onMyPage,
  onLogoClick,
  isLoggedIn,
  userName,
  onLogout,
}) => (
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
      {isLoggedIn ? (
        <>
          <span className="main-header__user-name">{userName}님 환영합니다!</span>
          <button onClick={onLogout} className="main-header__logout-btn">
            로그아웃
          </button>
          <button onClick={onMyPage} className="main-header__signup-btn">
            마이페이지
          </button>
        </>
      ) : (
        <>
          <button onClick={onLogin} className="main-header__login-btn">
            로그인
          </button>
          <button onClick={onMyPage} className="main-header__signup-btn">
            마이페이지
          </button>
        </>
      )}
    </div>
  </header>
);

export default HeaderPresenter;
