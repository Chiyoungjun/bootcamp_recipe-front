import { useState, useRef, useContext } from "react";
import MainPresenter from "./MainPresenter";
import SignInContainer from "../SignIn/SignInContainer";
import { LoginContext } from "../SignIn/LoginContext";

const ITEMS_PER_PAGE = 20;
const BACKEND_URL = "http://localhost:8000";

const MainContainer = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [recipes, setRecipes] = useState([]);         // 기본 레시피
  const [userRecipes, setUserRecipes] = useState([]); // 사용자 작성 레시피
  const [page, setPage] = useState(1);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);
  const { loginModalOpen, closeLoginModal } = useContext(LoginContext);

  const onSearchInputChange = (e) => setSearchKeyword(e.target.value);

const onSearch = async () => {
  if (!searchKeyword.trim()) {
    alert("검색어를 입력해주세요");
    return;
  }
  try {
    // 기본 외부 레시피 검색
    let basicData = [];
    const basicRes = await fetch(
      `${BACKEND_URL}/api/recipes/external/search?q=${encodeURIComponent(searchKeyword.trim())}`
    );
    if (basicRes.ok) {
      basicData = await basicRes.json();
    } else if (basicRes.status === 404) {
      basicData = [];
    } else {
      throw new Error("서버 오류");
    }

    // 사용자 전체 레시피 검색 (user_id 없이)
    let userData = [];
    const userRes = await fetch(
      `${BACKEND_URL}/api/users/recipes/search?q=${encodeURIComponent(searchKeyword.trim())}`
    );
    if (userRes.ok) {
      userData = await userRes.json();
    } else if (userRes.status === 404) {
      userData = [];
    } else {
      userData = [];
    }
    console.log("userRecipes:", userData);

      // 결과 병합 및 상태 설정
      if (basicData.length === 0 && userData.length === 0) {
        setRecipes([]);
        setUserRecipes([]);
        alert("검색 결과가 없습니다.");
      } else {
        setRecipes(basicData);
        setUserRecipes(userData);
        setPage(1);
      }
    } catch (e) {
      alert("검색 중 오류가 발생했습니다.");
      console.error(e);
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
    setShowModal(true);
  };

  const onConfirmUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await fetch(`${BACKEND_URL}/api/recipes/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("서버 오류");

      const data = await res.json();
      setRecipes(data);
      setUserRecipes([]); // 필요할 경우, 업로드 후 초기화
      setPage(1);
      setShowModal(false);
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
        userRecipes={userRecipes}
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

      {/* 로그인 모달 */}
      {loginModalOpen && (
        <SignInContainer open={loginModalOpen} onClose={closeLoginModal} />
      )}
    </>
  );
};

export default MainContainer;
