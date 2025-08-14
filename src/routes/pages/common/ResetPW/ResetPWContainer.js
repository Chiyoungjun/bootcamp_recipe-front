import React, { useState } from 'react';
import ResetPWPresenter from './ResetPWPresenter';

function ResetPWContainer({ onBack }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // TODO: 실제 비밀번호 변경 API 연동 예정
    alert('비밀번호가 성공적으로 변경되었습니다.');
    onBack(); // ✅ 로그인창(모달)으로 복귀
  };

  return (
    <ResetPWPresenter
      password={password}
      confirm={confirm}
      setPassword={setPassword}
      setConfirm={setConfirm}
      onSubmit={handleSubmit}
      onBack={onBack}
    />
  );
}

export default ResetPWContainer;
