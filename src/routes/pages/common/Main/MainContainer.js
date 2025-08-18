// MainContainer.js
import { useState, useRef, useContext } from "react";
import MainPresenter from "./MainPresenter";
import SignInContainer from "../SignIn/SignInContainer"; // 로그인 모달 컴포넌트
import { LoginContext } from "../SignIn/LoginContext";    // 전역 모달 상태

const ITEMS_PER_PAGE = 20;

const MainContainer = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);

  const [previewUrl, setPreviewUrl] = useState(null); // 이미지 미리보기
  const [showModal, setShowModal] = useState(false);  // 이미지 업로드 미리보기 모달
  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);

  // ✅ 전역 로그인 모달 상태/제어 가져오기
  const { loginModalOpen, closeLoginModal } = useContext(LoginContext);

  const onSearchInputChange = (e) => setSearchKeyword(e.target.value);

  const onSearch = async () => {
    if (!searchKeyword.trim()) {
      alert("검색어를 입력해주세요");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8000/api/recipes/external/search?q=${encodeURIComponent(
          searchKeyword.trim()
        )}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setRecipes([]);
          alert("검색 결과가 없습니다.");
        } else {
          throw new Error("서버 오류");
        }
        return;
      }

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setRecipes(data);
        setPage(1);
      } else {
        setRecipes([]);
        alert("검색 결과가 없습니다.");
      }
    } catch {
      alert("검색 중 오류가 발생했습니다.");
    }
  };

  const onPlusClick = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setSelectedFile(file);
    setShowModal(true); // 미리보기 모달 표시
  };

  const onConfirmUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await fetch("http://localhost:8000/api/recipes/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("서버 오류");

      const data = await res.json();
      setRecipes(data);
      setPage(1);
      setShowModal(false); // 이미지 미리보기 모달 닫기
    } catch {
      alert("이미지 검색 실패");
    }
  };

  return (
    <>
      {/* 숨겨진 파일 입력 */}
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={onFileChange}
      />

      {/* 메인 콘텐츠 */}
      <MainPresenter
        recipes={recipes}
        searchKeyword={searchKeyword}
        onSearchInputChange={onSearchInputChange}
        onSearch={onSearch}
        page={page}
        setPage={setPage}
        itemsPerPage={ITEMS_PER_PAGE}
        onPlusClick={onPlusClick}
        previewUrl={previewUrl}
        showModal={showModal}
        setShowModal={setShowModal}
        onConfirmUpload={onConfirmUpload}
      />

      {/* ✅ 전역 로그인 모달: 다른 페이지에서 openLoginModal() 호출해도 여기서 렌더링됨 */}
      {loginModalOpen && (
        <SignInContainer open={loginModalOpen} onClose={closeLoginModal} />
      )}
    </>
  );
};

export default MainContainer;