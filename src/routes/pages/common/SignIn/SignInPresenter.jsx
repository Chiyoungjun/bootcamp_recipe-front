import { MainLayout } from '../../../../layouts';
import './SignIn.css';

const SignInPresenter = ({
    id,
    password,
    setId,
    setPassword,
    handleSignIn,
}) => {
    return (
        <MainLayout>
            <form onSubmit={handleSignIn}>
                <input
                    type='text'
                    placeholder='id'
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />
                <input
                    type='text'
                    placeholder='text'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type='submit'>
                    로그인
                </button>
            </form>
        </MainLayout>
    );
};

export default SignInPresenter;
