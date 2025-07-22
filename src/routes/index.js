/**
 * 실제 라우팅을 설정하는 곳
 * 라우팅을 통해 애플리케이션의 각 페이지를 보여줌
 * --
 */

// react-router-dom 라이브러리의 Route와 Routes 컴포넌트를 사용하여 경로 설정
import { Route, Routes } from "react-router-dom"

// pages
import { Main, SignIn, SignUp } from './pages';

const Router = () => {
    return (
        <div className="app">

            {/* 라우팅을 처리하는 컴포넌트, 각 URL 경로에 따라 어떤 컴포넌트(페이지)를 렌더링할지를 결정 */}
            <Routes>

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

            </Routes>
        </div>
    );
};

// 라우팅 설정된 Router 컴포넌트 export
export default Router;