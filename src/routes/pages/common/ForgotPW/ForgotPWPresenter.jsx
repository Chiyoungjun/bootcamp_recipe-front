import React from 'react';
import './ForgotPW.css';

function ForgotPWPresenter({ email, setEmail, onSubmit, onBack }) {
  return (
    <>
      <span className="forgotpw-back" onClick={onBack}>&lt; 로그인 페이지로</span>
      <h2 className="signin-title">비밀번호를 잊으셨나요?</h2>
      <div className="signin-desc">
        걱정하지 마세요.<br />
        아래에 가입 시 이메일을 입력하시면 비밀번호를 재설정할 수 있어요.
      </div>
      <form className="signin-form" onSubmit={onSubmit}>
        <div className="signin-input-wrap">
          <label className="signin-label">Email</label>
          <div className="signin-input-row">
            <input
              type="email"
              className="signin-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="snapcook3@gmail.com"
              required
            />
          </div>
        </div>
        <button className="signin-submit-btn" type="submit">보내기</button>
      </form>
    </>
  );
}

export default ForgotPWPresenter;
