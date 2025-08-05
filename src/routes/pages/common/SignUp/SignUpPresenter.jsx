import React from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./SignUp.css";

function SignUpPresenter({
  inputs,
  onChange,
  onTogglePassword,
  onTogglePasswordConfirm,
  onSubmit,
  openLogin
}) {
  return (
    <div className="signup-main-root">
      {/* <div className="signup-logo-row">
        <img src="/logo.png" alt="snap cook logo" className="signup-main-logo" />
        <span className="signup-main-title">SNAP COOK</span>
      </div> */}
      <div className="signup-main-contents">
        <h2 className="signup-main-headline">회원 가입</h2>
        <div className="signup-main-desc">
          SNAP COOK의 추천레시피를 사용하기 위해 계정을 등록해 주세요.
        </div>
        <form className="signup-main-form" onSubmit={onSubmit} autoComplete="off">
          <input
            className="signup-main-input"
            type="text"
            name="name"
            value={inputs.name}
            onChange={onChange}
            placeholder="이름"
            required
          />
          <input
            className="signup-main-input"
            type="email"
            name="email"
            value={inputs.email}
            onChange={onChange}
            placeholder="Email"
            required
          />
          <input
            className="signup-main-input"
            type="text"
            name="username"
            value={inputs.username}
            onChange={onChange}
            placeholder="아이디"
            required
          />
          <div className="signup-main-input-wrap">
            <input
              className="signup-main-input"
              type={inputs.showPassword ? "text" : "password"}
              name="password"
              value={inputs.password}
              onChange={onChange}
              placeholder="비밀번호"
              required
            />
            <button
              type="button"
              className="signup-main-eye-btn"
              onClick={onTogglePassword}
              tabIndex={-1}
              aria-label="비밀번호 보기"
            >
              {inputs.showPassword ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>
          <div className="signup-main-input-wrap">
            <input
              className="signup-main-input"
              type={inputs.showPasswordConfirm ? "text" : "password"}
              name="passwordConfirm"
              value={inputs.passwordConfirm}
              onChange={onChange}
              placeholder="비밀번호 확인"
              required
            />
            <button
              type="button"
              className="signup-main-eye-btn"
              onClick={onTogglePasswordConfirm}
              tabIndex={-1}
              aria-label="비밀번호 확인 보기"
            >
              {inputs.showPasswordConfirm ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>
          <button className="signup-main-btn" type="submit">
            다음 페이지
          </button>
        </form>
        <div className="signup-main-bottom">
          이미 계정이 있으신가요?{" "}
          <button
            type="button"
            className="signup-main-login-link"
            onClick={(e) => {
              e.preventDefault();
              if (openLogin) openLogin();
            }}
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUpPresenter;
