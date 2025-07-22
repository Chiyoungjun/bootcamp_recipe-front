import { useState } from "react";
import SignUpPresenter from "./SignUpPresenter"

const SignUpContainer = () => {
    const [userId, setUserId] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [error, setError] = useState(null);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const userInfo = {
                id: userId,
                password: userPassword,
                name: userName
            };

            const response = await fetch('http://localhost:8080/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userInfo),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('회원가입 성공', result);
                alert('회원가입 성공');
            } else {
                const error = await response.json();
                console.log('회원가입 실패', error.message);
                alert(`회원가입 실패: ${error.message}`);
            }

            setUserId('');
            setUserPassword('');
            setUserName('');

        } catch (err) {
            setError('중복 가입');
            console.error('회원가입 요청 에러:', err);
        }
    };

    return (
        <SignUpPresenter
            userId={userId}
            userPassword={userPassword}
            userName={userName}

            setUserId={setUserId}
            setUserPassword={setUserPassword}
            setUserName={setUserName}

            handleSignUp={handleSignUp}
        />
    );
};

export default SignUpContainer;
