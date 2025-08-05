import React, { useState } from "react";
import "./SignIn.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import ForgotPWContainer from "./ForgotPWContainer";

function SignInPresenter({
  id,
  password,
  setId,
  setPassword,
  handleSignIn,
  onClose,
  onGoSignUp, // 회원가입 콜백
}) {
  const [showPw, setShowPw] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  const [mode, setMode] = useState("signin");

  return (
    <div className="modal-bg">
      <div className="modal-wrap signin-modal">
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>

        {mode === "signin" ? (
          <>
            <h2 className="signin-title">로그인</h2>
            <div className="signin-desc">SNAP COOK을 사용하려면 로그인하세요</div>
            <form className="signin-form" onSubmit={handleSignIn}>
              <div className="signin-input-wrap">
                <label className="signin-label">아이디</label>
                <div className="signin-input-row">
                  <input
                    type="text"
                    className="signin-input"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="아이디"
                    autoFocus
                  />
                </div>
              </div>
              <div className="signin-input-wrap">
                <label className="signin-label">비밀번호</label>
                <div className="signin-input-row">
                  <input
                    type={showPw ? "text" : "password"}
                    className="signin-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호"
                  />
                  <button
                    type="button"
                    className="pw-eye-btn"
                    onClick={() => setShowPw((v) => !v)}
                    tabIndex={-1}
                    aria-label="비밀번호 보기/숨기기"
                  >
                    {showPw ? <FiEye /> : <FiEyeOff />}
                  </button>
                </div>
              </div>
              <div className="signin-option-row">
                <label className="signin-keep">
                  <input
                    type="checkbox"
                    checked={autoLogin}
                    onChange={() => setAutoLogin((v) => !v)}
                  />
                  로그인 유지
                </label>
                <span className="signin-forgot" onClick={() => setMode("forgot")}>
                  비밀번호를 잊으셨나요?
                </span>
              </div>
              <button className="signin-submit-btn" type="submit">
                로그인
              </button>
            </form>
            <div className="signin-bottom-row">
              Snap Cook이 처음이신가요?
              <span
                className="signin-signup-link"
                onClick={() => {
                  if (onGoSignUp) onGoSignUp();
                }}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && onGoSignUp) onGoSignUp();
                }}
              >
                회원가입
              </span>
            </div>
          </>
        ) : (
          <ForgotPWContainer onBack={() => setMode("signin")} />
        )}
      </div>
    </div>
  );
}

export default SignInPresenter;
