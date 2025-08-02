import React, { createContext, useState, useEffect } from "react";

export const LoginContext = createContext({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export const LoginProvider = ({ children }) => {
  // 1) 세션스토리지에서 user_id를 읽어 임시 상태 세팅 (최초 마운트 시)
  const [user, setUser] = useState(() => {
    const storedUserId = sessionStorage.getItem("user_id");
    return storedUserId ? { user_id: storedUserId } : null;
  });

  // 2) user_id가 존재하면 상세 유저 정보를 백엔드에서 가져와 user 상태를 완전하게 채운다
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user?.user_id && (!user.ko_name || !user.email)) {
        try {
          const response = await fetch(`http://localhost:8000/api/users/${user.user_id}`);
          const data = await response.json();

          if (response.ok && data.status === 200 && data.data) {
            const d = data.data;
            setUser({
              user_id: d.user_id,
              ko_name: d.ko_name || "",
              email: d.email || "",
              height: d.height ?? null,
              weight: d.weight ?? null,
              preferred_food: d.preferred_food || "",
              preferred_tags: d.preferred_tags || "",
              birth_date: d.birth_date || "",
            });
          } else {
            // 상세 정보 불러오기 실패 시 안전하게 로그아웃 처리
            setUser(null);
            sessionStorage.removeItem("user_id");
          }
        } catch (error) {
          console.error("사용자 상세정보 호출 실패", error);
          setUser(null);
          sessionStorage.removeItem("user_id");
        }
      }
    };

    fetchUserDetails();
  }, [user?.user_id]);

  // 로그아웃 함수
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user_id");
  };

  return (
    <LoginContext.Provider value={{ user, setUser, logout }}>
      {children}
    </LoginContext.Provider>
  );
};
