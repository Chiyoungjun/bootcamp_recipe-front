import { MainLayout } from '../../../../layouts';
import mainLogo from './main_logo.png';
import NavContainer from '../../../compoents/navbar/NavContainer';
import RecipeListContainer from '../../../compoents/recipe/RecipeListContainer';
import './Main.css';

const MainPresenter = ({
  onLogin,
  onSignUp,
  recipes,
  searchKeyword,
  onSearchInputChange,
  onSearch,
}) => (
  <MainLayout>
    <header className="main-header">
      <div className="main-header__left">
        <div className="main-header__logo-wrap">
          <img src={mainLogo} alt="SNAP COOK 로고" className="main-header__logo-img" />
        </div>
      </div>
      <div className="main-header__center">
        <div className="main-header__logo-title">SNAP COOK</div>
      </div>
      <div className="main-header__auth">
        <button onClick={onLogin} className="main-header__login-btn">로그인</button>
        <button onClick={onSignUp} className="main-header__signup-btn">회원가입</button>
      </div>
    </header>


    <NavContainer />

    <section className="main-search-section">
      <div className="main-search-box">
        <span className="main-search__icon">🔍</span>
        <input
          type="text"
          className="main-search__input"
          placeholder="레시피 검색"
          value={searchKeyword}
          onChange={onSearchInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch();
          }}
        />
        <button
          onClick={onSearch}
          className="main-search__plus-btn"
          type="button"
        >
          +
        </button>
      </div>
    </section>
     <RecipeListContainer recipes={recipes} />
  </MainLayout>
);

export default MainPresenter;
