import React, { useState, useEffect, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserRecipeEditPresenter from "./UserRecipeEditPresenter";
import { LoginContext } from "../SignIn/LoginContext";

const BACKEND_URL = "http://localhost:8000";

async function fetchDetail({ userId, id }) {
  const res = await fetch(`${BACKEND_URL}/api/users/${userId}/recipes/${id}`);
  if (!res.ok) throw new Error("상세 정보를 불러올 수 없습니다.");
  return res.json();
}

function fixUrl(url) {
  if (!url) return "";
  let path = url.replace(/\\/g, "/");
  if (!/^https?:\/\//i.test(path)) {
    path = `${BACKEND_URL}/${path.replace(/^\/+/, "")}`;
  }
  return path;
}

export default function UserRecipeEditContainer({ recipe }) {
  const navigate = useNavigate();
  const { user, isLogin } = useContext(LoginContext);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const id = useMemo(() => recipe?.id || null, [recipe]);
  const userId = useMemo(() => user?.user_id || null, [user]);

  const [editRecipe, setEditRecipe] = useState(null);
  const [steps, setSteps] = useState([]);

  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [stepImageFiles, setStepImageFiles] = useState({});
  const [stepImagePreviews, setStepImagePreviews] = useState({});

  useEffect(() => {
    if (!isLogin) {
      setError("로그인이 필요합니다.");
      setLoading(false);
      setTimeout(() => navigate("/mypage", { replace: true }), 1500);
      return;
    }
    if (!id || !userId) {
      setError("선택된 레시피 정보가 없습니다.");
      setLoading(false);
      setTimeout(() => navigate("/mypage", { replace: true }), 1500);
      return;
    }

    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchDetail({ userId, id });
        if (!alive) return;

        setEditRecipe({
          name: data.name || "",
          description: data.description || "",
          way: data.way || "",
          category: data.category || "",
          ingredients: Array.isArray(data.ingredients)
            ? data.ingredients.join("\n")
            : data.ingredients || "",
          nutrition: {
            kcal: data.INFO_ENG || "",
            carb: data.INFO_CAR || "",
            protein: data.INFO_PRO || "",
            fat: data.INFO_FAT || "",
            sodium: data.INFO_NA || "",
          },
          mainImageUrl: data.main_image_url || data.image_url || "",
          RCP_NA_TIP: data.RCP_NA_TIP || "",    // 요리 팁 추가
          ...data,
        });

        const loadedSteps =
          Array.isArray(data.steps) && data.steps.length > 0
            ? data.steps
            : Array.from({ length: 20 })
                .map((_, i) => data[`MANUAL${String(i + 1).padStart(2, "0")}`] || "")
                .filter(Boolean);

        setSteps(loadedSteps.length ? loadedSteps : [""]);

        setMainImagePreview(fixUrl(data.main_image_url || data.image_url));

        const previews = {};
        for (let i = 0; i < 20; i++) {
          const key = `MANUAL_IMG${String(i + 1).padStart(2, "0")}`;
          const img = data[key];
          if (img) previews[i] = fixUrl(img);
        }
        setStepImagePreviews(previews);
      } catch (e) {
        if (alive) setError(e.message || "불러오기 실패");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id, userId, isLogin, navigate]);

  // 서버 이미지 + 새로 업로드한 Blob URL 병합
  const mergedStepImagePreviews = steps.map((_, i) => {
    if (stepImagePreviews[i]) return stepImagePreviews[i];
    if (
      editRecipe &&
      editRecipe[`MANUAL_IMG${String(i + 1).padStart(2, "0")}`]
    ) {
      return fixUrl(editRecipe[`MANUAL_IMG${String(i + 1).padStart(2, "0")}`]);
    }
    return "";
  });

  const onChangeField = (field, value) => {
    setEditRecipe((prev) => ({ ...prev, [field]: value }));
  };

  const onChangeNutrition = (field, value) => {
    setEditRecipe((prev) => ({
      ...prev,
      nutrition: { ...(prev.nutrition || {}), [field]: value },
    }));
  };

  const onChangeStepText = (idx, value) => {
    setSteps((prev) => prev.map((step, i) => (i === idx ? value : step)));
  };

  const onAddStep = () => setSteps((prev) => [...prev, ""]);

  const onRemoveStep = (idx) => {
    setSteps((prev) => prev.filter((_, i) => i !== idx));
    setStepImageFiles((prev) => {
      const next = {};
      Object.entries(prev).forEach(([key, file]) => {
        const index = Number(key);
        if (index === idx) return;
        next[index > idx ? index - 1 : index] = file;
      });
      return next;
    });
    setStepImagePreviews((prev) => {
      const next = {};
      Object.entries(prev).forEach(([key, url]) => {
        const index = Number(key);
        if (index === idx) return;
        next[index > idx ? index - 1 : index] = url;
      });
      return next;
    });
  };

  const onChangeMainImage = (file) => {
    setMainImageFile(file);
    setMainImagePreview(URL.createObjectURL(file));
  };

  const onChangeStepImage = (idx, file) => {
    setStepImageFiles((prev) => ({ ...prev, [idx]: file }));
    setStepImagePreviews((prev) => ({ ...prev, [idx]: URL.createObjectURL(file) }));
  };

  const onSave = async () => {
    if (!editRecipe.name || !editRecipe.name.trim()) {
      setError("요리 이름을 입력해주세요.");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("name", editRecipe.name || "");
      formData.append("description", editRecipe.description || "");
      formData.append("way", editRecipe.way || "");
      formData.append("category", editRecipe.category || "");
      formData.append("ingredients", editRecipe.ingredients || "");
      formData.append("INFO_ENG", editRecipe.nutrition.kcal || "");
      formData.append("INFO_CAR", editRecipe.nutrition.carb || "");
      formData.append("INFO_PRO", editRecipe.nutrition.protein || "");
      formData.append("INFO_FAT", editRecipe.nutrition.fat || "");
      formData.append("INFO_NA", editRecipe.nutrition.sodium || "");

      // 요리 팁 추가
      formData.append("RCP_NA_TIP", editRecipe.RCP_NA_TIP || "");

      for (let i = 0; i < steps.length; i++) {
        formData.append(`MANUAL${String(i + 1).padStart(2, "0")}`, steps[i] || "");
      }

      if (mainImageFile) {
        formData.append("image_url", mainImageFile);
      }

      const res = await fetch(`${BACKEND_URL}/api/users/${userId}/recipes/${id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "저장 실패");
      }

      for (const [stepIdx, file] of Object.entries(stepImageFiles)) {
        if (!file) continue;
        const stepForm = new FormData();
        stepForm.append("file", file);
        try {
          await fetch(
            `${BACKEND_URL}/api/users/${userId}/recipes/${id}/steps/${stepIdx}/image`,
            {
              method: "POST",
              body: stepForm,
            }
          );
        } catch (e) {
          console.warn(`스텝 ${stepIdx} 이미지 업로드 실패:`, e);
        }
      }

      alert("저장 완료");
      navigate("/mypage", { replace: true });
    } catch (e) {
      setError(e.message || "오류가 발생했습니다.");
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => {
    navigate("/mypage", { replace: true });
  };

  return (
    <UserRecipeEditPresenter
      loading={loading}
      saving={saving}
      error={error}
      recipe={editRecipe}
      steps={steps}
      mainImagePreview={mainImagePreview}
      stepImagePreviews={mergedStepImagePreviews}
      onChangeField={onChangeField}
      onChangeNutrition={onChangeNutrition}
      onChangeStepText={onChangeStepText}
      onChangeStepImage={onChangeStepImage}
      onChangeMainImage={onChangeMainImage}
      onAddStep={onAddStep}
      onRemoveStep={onRemoveStep}
      onSave={onSave}
      onCancel={onCancel}
    />
  );
}
