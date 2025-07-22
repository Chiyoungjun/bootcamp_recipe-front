/**
 * 최상위 index.js로 애플리케이션의 진입점
 * 애플리케이션을 실제 DOM에 렌더링하고, BrowserRouter를 통해 '클라이언트 사이드 라우팅'을 설정
 * 
 * ===== 보는 순서 =====
 * src/index.js
 * ↓
 * src/routes/index.js
 * ↓
 * src/routes/pages/index.js
 */

// React와 관련된 필수 라이브러리 및 파일들을 불러오고, 애플리케이션의 루트 요소를 렌더링.
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // 메인 App 컴포넌트
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'; // 라우팅을 위해 'BrowserRouter' 사용
import './index.css'; // 전역 스타일시트

// React 애플리케이션의 최상위 루트 요소를 생성하여 렌더링 설정
const root = ReactDOM.createRoot(document.getElementById('root'));
// ReactDOM.createRoot(): DOM의 루트 요소에 React 애플리케이션 연결

// 최상위 App 컴포넌트를 BrowserRouter로 감싸서 라우팅 적용 후 렌더링
root.render(
  // <BrowserRouter>: 애플리케이션 전체를 라우팅 가능한 상태로 만듦
  <BrowserRouter>

    {/* <App />: 전체 애플리케이션의 최상위 컴포넌트, 여기에서 라우팅이 정의된 Router를 불러옴 */}
    <App />
    
  </BrowserRouter>
);

// 애플리케이션 성능 측정을 위한거라 신경X
reportWebVitals();