// LoginContext.js
import React, { createContext, useState, useEffect, useMemo } from "react";

/**
 * 컨텍스트 기본값(IDE 자동완성/타입추론에 도움)
 */
export const LoginContext = createContext({
  user: null,                    // { user_id, ... }
  setUser: () => {},
  isLogin: false,                // user 존재 여부
  logout: () => {},
  loginWithUserId: () => {},     // 인증 성공 후 user_id 세팅
  loginModalOpen: false,         // 로그인 모달 표시 여부(전역)
  openLoginModal: () => {},      // 모달 열기
  closeLoginModal: () => {},     // 모달 닫기
});

export const LoginProvider = ({ children }) => {
  // 1) 새로고침 후에도 로그인 유지: sessionStorage의 user_id 사용
  const [user, setUser] = useState(() => {
    const storedUserId = sessionStorage.getItem("user_id");
    return storedUserId ? { user_id: storedUserId } : null;
  });

  // 2) 초기 프로필 보완 fetch를 기다리는 로딩 플래그
  const [loading, setLoading] = useState(true);

  // 3) 전역 로그인 모달 상태
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const openLoginModal = () => setLoginModalOpen(true);
  const closeLoginModal = () => setLoginModalOpen(false);

  // 4) 파생 로그인 여부
  const isLogin = useMemo(() => !!user?.user_id, [user]);

  // 5) 프로필 보완 fetch (user_id만 있을 때 상세 정보 채우기)
  useEffect(() => {
    let cancelled = false;

    async function fetchUserDetails(userId) {
      try {
        const response = await fetch(`http://localhost:8000/api/users/${userId}`);
        const data = await response.json();

        if (!cancelled) {
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
            // 실패 시 세션 초기화
            setUser(null);
            sessionStorage.removeItem("user_id");
          }
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          sessionStorage.removeItem("user_id");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (!isLogin) {
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }

    const needsProfileFetch = isLogin && (!user.ko_name || !user.email);
    if (needsProfileFetch) {
      setLoading(true);
      fetchUserDetails(user.user_id);
    } else {
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin, user?.user_id]);

  // 6) 로그인/로그아웃 유틸
  const loginWithUserId = (userId) => {
    if (!userId) return;
    sessionStorage.setItem("user_id", String(userId));
    setUser({ user_id: String(userId) }); // 상세는 effect에서 보완
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user_id");
  };

  // 7) 초기 로딩 화면(필요 시 스피너로 교체)
  if (loading) return <div>로딩 중...</div>;

  // 8) 컨텍스트 값 제공
  return (
    <LoginContext.Provider
      value={{
        user,
        setUser,
        isLogin,
        logout,
        loginWithUserId,
        loginModalOpen,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
