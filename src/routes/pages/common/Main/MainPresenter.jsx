import { MainLayout } from '../../../../layouts';
import mainLogo from './main_logo.png';
import NavPresenter from '../../../compoents/navbar';
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
      <RecipeListContainer recipes={recipes} />
    </section>
  </MainLayout>
);

export default MainPresenter;
