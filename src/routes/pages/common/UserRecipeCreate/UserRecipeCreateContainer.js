import React, { useState, useContext } from "react";
import UserRecipeCreatePresenter from "./UserRecipeCreatePresenter";
import { LoginContext } from "../SignIn/LoginContext";

const BACKEND_BASE_URL = "http://localhost:8000";

export default function UserRecipeCreateContainer({ onCancel, onSaved }) {
  // LoginContext에서 userId 가져오기
  const { user, isLogin } = useContext(LoginContext);
  const userId = user?.user_id;

  // -----------------------------
  // 1) 상단 폼 상태 (카테고리 제거)
  // -----------------------------
  const [form, setForm] = useState({
    title: "",        // 요리 이름
    tip: "",         // 태그 문자열(쉼표/공백 구분)
    ingredients: "",  // 요리 재료
    imageFile: null,  // 대표 이미지 파일
    imageUrl: "",     // 대표 이미지 미리보기
    nutrition: {      // 영양 정보(선택)
      calorie: "",    // kcal
      carbs: "",      // g
      protein: "",    // g
      fat: "",        // g
      sodium: "",     // mg
    },
  });

  // -----------------------------
  // 2) 단계(step) 상태
  // -----------------------------
  const [steps, setSteps] = useState([
    { imageFile: null, imageUrl: "", text: "", order: 1 },
  ]);

  // -----------------------------
  // 3) 입력 핸들러
  // -----------------------------
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name} = ${value}`);

    // 영양 정보 하위 필드 처리 (name="nutrition.xxx")
    if (name.startsWith("nutrition.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        nutrition: { ...prev.nutrition, [key]: value },
      }));
      return;
    }

    // 일반 필드
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 대표 이미지
  const onChangeImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, imageFile: file, imageUrl: url }));
  };

  // step 이미지
  const onChangeStepImage = (index, file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSteps((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], imageFile: file, imageUrl: url };
      return next;
    });
  };

  // step 텍스트
  const onChangeStepText = (index, value) => {
    setSteps((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], text: value };
      return next;
    });
  };

  // step 추가/삭제
  const onAddStep = () => {
    setSteps((prev) => [
      ...prev,
      { imageFile: null, imageUrl: "", text: "", order: prev.length + 1 },
    ]);
  };
  const onRemoveStep = () => {
    setSteps((prev) => (prev.length > 1 ? prev.slice(0, prev.length - 1) : prev));
  };

  // -----------------------------
  // 4) 저장
  // -----------------------------
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!userId) {
      alert("사용자 정보 오류. 다시 로그인해주세요.");
      return;
    }
    // 필수값 검증
    if (!form.title.trim()) {
      alert("요리 이름을 입력하세요.");
      return;
    }
    if (!form.ingredients.trim()) {
      alert("요리 재료를 입력하세요.");
      return;
    }

    // FormData 구성
    const fd = new FormData();
    fd.append("name", form.title);
    fd.append("RCP_NA_TIP", form.tip);
    fd.append("ingredients", form.ingredients);
    if (form.imageFile) fd.append("image_url", form.imageFile);

    // 영양 정보(선택) - 값이 있을 때만 추가
    const { calorie, carbs, protein, fat, sodium } = form.nutrition;
    if (calorie) fd.append("INFO_ENG", calorie);
    if (carbs) fd.append("INFO_CAR", carbs);
    if (protein) fd.append("INFO_PRO", protein);
    if (fat) fd.append("INFO_FAT", fat);
    if (sodium) fd.append("INFO_NA", sodium);

    // steps
    steps.forEach((s, i) => {
      fd.append(`MANUAL${String(i + 1).padStart(2, "0")}`, s.text ?? "");
      if (s.imageFile) fd.append(`MANUAL_IMG${String(i + 1).padStart(2, "0")}`, s.imageFile);
    });
      for (let pair of fd.entries()) {
    console.log(`${pair[0]}: ${pair[1]}`);
    }


    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/users/${userId}/recipes`, {
        method: "POST",
        body: fd,
      });

      if (!response.ok) {
        alert("저장 실패.");
        return;
      }

      alert("저장 성공!");
      if (typeof onSaved === "function") onSaved();
    } catch (error) {
      alert("오류가 발생했습니다.");
    }
  };

  // -----------------------------
  // 5) 취소
  // -----------------------------
  const handleCancel = () => {
    if (window.confirm("작성 내용을 취소하시겠습니까?")) {
      if (typeof onCancel === "function") onCancel();
    }
  };

  // -----------------------------
  // 6) 프레젠터 렌더
  // -----------------------------
  return (
    <UserRecipeCreatePresenter
      form={form}
      steps={steps}
      onChangeInput={onChangeInput}
      onChangeImage={onChangeImage}
      onChangeStepImage={onChangeStepImage}
      onChangeStepText={onChangeStepText}
      onAddStep={onAddStep}
      onRemoveStep={onRemoveStep}
      onSubmit={onSubmit}
      onCancel={handleCancel}
    />
  );
}
