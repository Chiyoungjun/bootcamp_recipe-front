import React from 'react';
import './ResetPW.css';

function ResetPWPresenter({
  password,
  confirm,
  setPassword,
  setConfirm,
  onSubmit,
  onBack
}) {
  return (
    <>
      <span className="forgotpw-back" onClick={onBack}>&lt; 이메일 입력으로</span>
      <h2 className="signin-title">비밀번호 설정</h2>
      <div className="signin-desc">
        이전 비밀번호가 초기화되었습니다.<br />
        새 비밀번호를 입력해 주세요.
      </div>
      <form className="signin-form" onSubmit={onSubmit}>
        <div className="signin-input-wrap">
          <label className="signin-label">새 비밀번호</label>
          <div className="signin-input-row">
            <input
              type="password"
              className="signin-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="새 비밀번호"
              required
            />
          </div>
        </div>
        <div className="signin-input-wrap">
          <label className="signin-label">새 비밀번호 확인</label>
          <div className="signin-input-row">
            <input
              type="password"
              className="signin-input"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="새 비밀번호 확인"
              required
            />
          </div>
        </div>
        <button className="signin-submit-btn" type="submit">비밀번호 설정</button>
      </form>
    </>
  );
}

export default ResetPWPresenter;
