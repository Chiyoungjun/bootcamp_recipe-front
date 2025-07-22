import { useState } from "react";
import SignInPresenter from "./SignInPresenter"
import { useNavigate } from "react-router-dom";

const SignInContainer = () => {
    const navigate = useNavigate();

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async (e) => {
        // <form></form> 태그로 작성 시, 새롭게 렌더링 되는 것을 막기 위해 추가함
        e.preventDefault();

        if (!id.length) {
            alert('아이디를 입력해주세요');
            return;
        }

        if (!password.length) {
            alert('비밀번호를 입력해주세요');
            return;
        }

        try {
            const userInfo = {
                id: id,
                password: password,
            };

            const response = await fetch('http://localhost:8080/user/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userInfo),
            });

            const result = await response.json();

            if (result.status == 200) {
                console.log(`로그인 성공`, result);
                alert(`${result.data.name}님 반갑습니다.`);
                navigate('/');
                return;
            }
            
            console.log('로그인 실패:', result.message);
            alert(`로그인 실패: ${result.message}`);

        } catch (e) {
            console.error('로그인 요청 에러:', e);
            alert('로그인 요청 에러');
        }
    };

    return (
        <SignInPresenter
            id={id}
            password={password}
            setId={setId}
            setPassword={setPassword}
            handleSignIn={handleSignIn}
        />
    );
};

export default SignInContainer;
