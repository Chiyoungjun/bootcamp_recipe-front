/**
 * 실제 라우팅을 설정하는 곳
 * 라우팅을 통해 애플리케이션의 각 페이지를 보여줌
 * --
 */

// react-router-dom 라이브러리의 Route와 Routes 컴포넌트를 사용하여 경로 설정
import { Route, Routes } from "react-router-dom";

// pages
import { Main, SignIn, SignUp, Rank, Recommend, MyPage, RecipeDetail, UserEdit, Category, UserSearchHistory, UserFavorites } from './pages';
import { MainLayout } from "../layouts";
import { LoginProvider } from "./pages/common/SignIn/LoginContext";

const Router = () => {
    return (
        <div className="app">

            {/* 라우팅을 처리하는 컴포넌트, 각 URL 경로에 따라 어떤 컴포넌트(페이지)를 렌더링할지를 결정 */}
        <LoginProvider>
            <Routes>
            <Route element={<MainLayout/>}>
                {/* 메인 화면 */}
                {/* 각 페이지의 경로와 해당 경로에서 렌더링할 컴포넌트(페이지)를 지정 */}
                <Route
                    path='/'
                    element={<Main />}
                />

                {/* 로그인 화면 */}
                <Route
                    path='/signin'
                    element={<SignIn />}
                />

                {/* 회원가입 화면 */}
                <Route
                    path='/signup'
                    element={<SignUp />}
                />

                {/* 랭킹 화면 */}
                <Route
                    path='/rank'
                    element={<Rank />}
                />

                {/* 추천 화면 */}
                <Route
                    path='/recommend'
                    element={<Recommend />}
                />

                {/* 분류 화면 */}
                <Route
                    path='/category'
                    element={<Category />}
                />

                {/* 마이페이지 화면 */}
                <Route
                    path='/mypage'
                    element={<MyPage/>}
                />

                {/* 상세 레시피 화면 */}
                <Route
                    path="/recipedetail"
                    element={<RecipeDetail/>}
                />
                {/*회원정보 수정 화면 */}
                <Route
                    path="/useredit"
                    element={<UserEdit/>} />
                
                {/* 검색기록 화면 */}
                <Route
                    path="usersearchhistory"
                    element={<UserSearchHistory/>}/>

                {/* 즐겨찾기 화면 */}
                <Route
                    path="userfavorites"
                    element={<UserFavorites/>}/>
            </Route>
            </Routes>
        </LoginProvider>
        </div>
    );
};

// 라우팅 설정된 Router 컴포넌트 export
export default Router;
