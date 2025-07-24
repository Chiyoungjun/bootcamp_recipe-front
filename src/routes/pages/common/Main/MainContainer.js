import { useNavigate } from "react-router-dom";
import MainPresenter from "./MainPresenter";

const MainContainer = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/signin');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };



  return (
    <MainPresenter
      onLogin={handleLogin}
      onSignUp={handleSignUp}
    />
  );
};

export default MainContainer;
