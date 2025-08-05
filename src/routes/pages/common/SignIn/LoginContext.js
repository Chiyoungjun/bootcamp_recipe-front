import React, { createContext, useState, useEffect } from "react";

export const LoginContext = createContext({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export const LoginProvider = ({ children }) => {
  // 로그인 user 초기화 (sessionStorage에 저장된 user_id 기반)
  const [user, setUser] = useState(() => {
    const storedUserId = sessionStorage.getItem("user_id");
    return storedUserId ? { user_id: storedUserId } : null;
  });

  // 유저 정보 로딩 상태 플래그
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserDetails() {
      // user_id는 있지만 프로필 정보가 없으면 보완 fetch
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
            setUser(null);
            sessionStorage.removeItem("user_id");
          }
        } catch (error) {
          setUser(null);
          sessionStorage.removeItem("user_id");
        }
      }
      // user 정보 충분하면 loading 해제
      setLoading(false);
    }
    fetchUserDetails();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // 로그아웃 함수
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user_id");
  };

  // 유저 정보 로딩 중에는 children 렌더링 안 함 (Undefined 에러 방지)
  if (loading) return <div>로딩 중...</div>;

  return (
    <LoginContext.Provider value={{ user, setUser, logout }}>
      {children}
    </LoginContext.Provider>
  );
};
