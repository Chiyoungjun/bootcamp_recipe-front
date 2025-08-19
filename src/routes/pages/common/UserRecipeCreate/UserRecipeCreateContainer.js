// UserRecipeCreateContainer.jsx
import React, { useState } from "react";
import UserRecipeCreatePresenter from "./UserRecipeCreatePresenter";

export default function UserRecipeCreateContainer({ onCancel, onSaved }) {
  // -----------------------------
  // 1) 상단 폼 상태 (카테고리 제거)
  // -----------------------------
  const [form, setForm] = useState({
    title: "",        // 요리 이름
    tags: "",         // 태그 문자열(쉼표/공백 구분)
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

    // 필수값 검증
    if (!form.title.trim()) {
      alert("요리 이름을 입력하세요.");
      return;
    }
    if (!form.ingredients.trim()) {
      alert("요리 재료를 입력하세요.");
      return;
    }

    // FormData 구성 (type 제거)
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("tags", form.tags);
    fd.append("ingredients", form.ingredients);
    if (form.imageFile) fd.append("image", form.imageFile);

    // 영양 정보(선택) - 값이 있을 때만 추가
    const { calorie, carbs, protein, fat, sodium } = form.nutrition;
    if (calorie) fd.append("nutrition[calorie]", calorie);
    if (carbs) fd.append("nutrition[carbs]", carbs);
    if (protein) fd.append("nutrition[protein]", protein);
    if (fat) fd.append("nutrition[fat]", fat);
    if (sodium) fd.append("nutrition[sodium]", sodium);

    // steps
    steps.forEach((s, i) => {
      fd.append(`steps[${i}][order]`, String(i + 1));
      fd.append(`steps[${i}][text]`, s.text ?? "");
      if (s.imageFile) fd.append(`steps[${i}][image]`, s.imageFile);
    });

    // TODO: 실제 API 호출
    console.log("SUBMIT DEMO", {
      form: {
        title: form.title,
        tags: form.tags,
        ingredients: form.ingredients,
        nutrition: { ...form.nutrition },
        image: form.imageFile?.name,
      },
      steps: steps.map((s, i) => ({
        order: i + 1,
        text: s.text,
        image: s.imageFile?.name,
      })),
    });
    alert("저장 실패.");

    if (typeof onSaved === "function") onSaved();
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
  // 6) 프레젠터 렌더 (typeOptions 제거)
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
