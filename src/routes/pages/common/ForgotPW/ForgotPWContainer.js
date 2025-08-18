import React, { useState } from 'react';
import ForgotPWPresenter from './ForgotPWPresenter';
import ResetPWContainer from '../ResetPW/ResetPWContainer'; // 🔹 새 비밀번호 입력 화면 import

function ForgotPWContainer({ onBack }) {
  const [step, setStep] = useState('email'); // 🔹 상태: 'email' | 'reset'
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    alert(`비밀번호 재설정 메일이 ${email} 주소로 전송되었습니다.`);
    setStep('reset'); // 🔹 다음 단계로 이동
  };

  return step === 'email' ? (
    <ForgotPWPresenter
      email={email}
      setEmail={setEmail}
      onSubmit={handleEmailSubmit}
      onBack={onBack} // 로그인 모달로 돌아가기
    />
  ) : (
    <ResetPWContainer onBack={onBack} />
  );
}

export default ForgotPWContainer;