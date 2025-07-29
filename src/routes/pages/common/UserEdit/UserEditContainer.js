import { useState } from "react";
import UserEditPresenter from "./UserEditPresenter";

const dummyUser = {
  name: "김씨임",
  email: "snapcook3@gmail.com",
  id: "snapcook0722",
  password: "",
  height: 173,
  weight: 61,
  birth: "030405",
  favoriteFood: "김치찌개, 된장찌개",
  favoriteTag: "찌개",
};

const UserEditContainer = () => {
  const [userInfo, setUserInfo] = useState(dummyUser);
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    // 실제 프로젝트에선 여기서 PATCH 요청!
  };

  return (
    <UserEditPresenter
      userInfo={userInfo}
      onChange={handleChange}
      onSave={handleSave}
      saved={saved}
    />
  );
};

export default UserEditContainer;
