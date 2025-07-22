import { MainLayout } from "../../../../layouts";

const SignUpPresenter = ({
    userId,
    userPassword,
    userName,

    setUserId,
    setUserPassword,
    setUserName,

    handleSignUp,
}) => {

    return (
        <MainLayout>
            <form
                onSubmit={handleSignUp}
            >
                <input
                    type="text"
                    placeholder="id"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="password"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                />
                <div>
                    <button type="submit">가입하기</button>
                </div>
            </form>
        </MainLayout>
    );
};

export default SignUpPresenter;