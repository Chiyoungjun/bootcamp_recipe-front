import React from "react";
import './SignUp2.css'

function SignUp2Presenter({ form, onChange, onSubmit, openLogin }) {
  return (
    <>
      <h2 className="signup-main-headline">회원 가입</h2>
      <div className="signup-main-desc">
        SNAP COOK의 추천레시피를 사용하기 위해 계정을 등록해 주세요.
      </div>
      <form className="signup-main-form" onSubmit={onSubmit} autoComplete="off">
        <div className="signup-main-row-2">
          <input
            className="signup-main-input"
            type="text"
            name="height"
            placeholder="키"
            value={form.height}
            onChange={onChange}
            required
          />
          <input
            className="signup-main-input"
            type="text"
            name="weight"
            placeholder="몸무게"
            value={form.weight}
            onChange={onChange}
            required
          />
        </div>
        <input
          className="signup-main-input"
          type="text"
          name="birth"
          placeholder="생년월일 (6자리, 예: 010101)"
          value={form.birth}
          onChange={onChange}
          required
        />
        <input
          className="signup-main-input"
          type="text"
          name="favoriteFood"
          placeholder="선호하는 음식"
          value={form.favoriteFood}
          onChange={onChange}
        />
        <input
          className="signup-main-input"
          type="text"
          name="favoriteTag"
          placeholder="선호하는 태그"
          value={form.favoriteTag}
          onChange={onChange}
        />
        <div className="signup-main-agree-row">
          <input
            type="checkbox"
            name="agree"
            id="agree"
            checked={form.agree}
            onChange={onChange}
          />
          <label htmlFor="agree" className="signup-main-agree-label">
            <span className="signup-main-agree-desc">
              <span style={{ color: "#ef6464", fontWeight: 600 }}>
                이용약관 및 개인정보 처리방침
              </span>
              에 모두 동의합니다
            </span>
          </label>
        </div>
        <button className="signup-main-btn" type="submit">
          회원 가입
        </button>
      </form>

      <div className="signup-main-bottom" style={{ marginTop: '24px', width: '100%' }}>
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
    </>
  );
}

export default SignUp2Presenter;
