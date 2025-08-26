import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./UserRecipeEdit.css";

export default function UserRecipeEditPresenter({
  loading,
  saving,
  error,
  recipe,
  steps = [],
  mainImagePreview,
  stepImagePreviews = {},
  onChangeField,
  onChangeNutrition,
  onChangeMainImage,
  onChangeStepText,
  onChangeStepImage,
  onAddStep,
  onRemoveStep,
  onSave,
  onCancel,
}) {
  const navigate = useNavigate();
  const mainImageInputRef = useRef(null);
  const stepImageInputRefs = useRef({});

  const handleClickMainUploader = () => mainImageInputRef.current?.click();
  const handleClickStepUploader = (idx) => stepImageInputRefs.current[idx]?.click();

  /** 절대 URL 변환 */
  const viteBase =
    typeof import.meta !== "undefined" && import.meta.env
      ? import.meta.env.VITE_API_BASE
      : undefined;
  const BACKEND_BASE = viteBase || process.env.REACT_APP_API_BASE || "http://localhost:8000";
  const toAbsUrl = (raw) => {
    if (!raw) return "";
    const s = String(raw).replace(/\\/g, "/").trim();
    if (/^(https?:|data:|blob:)/i.test(s)) return s;
    let path = "";
    if (s.startsWith("/uploads/")) path = s;
    else if (s.startsWith("uploads/")) path = `/${s}`;
    else {
      const base = s.includes("/") ? s.split("/").pop() : s;
      path = `/uploads/${base}`;
    }
    return `${BACKEND_BASE}${path}`;
  };

  /** recipe 키 폴백(서버/공공데이터 혼용 대비) */
  const vRecipe = {
    name: recipe?.name ?? recipe?.title ?? recipe?.RCP_NM ?? "",
    description:
      recipe?.description ?? recipe?.tip ?? recipe?.desc ?? recipe?.RCP_NA_TIP ?? "",
    ingredients:
      recipe?.ingredients ?? recipe?.INGREDIENTS ?? recipe?.RCP_PARTS_DTLS ?? "",
    nutrition: {
      kcal:
        recipe?.nutrition?.kcal ??
        recipe?.kcal ??
        recipe?.INFO_ENG ??
        "",
      carb:
        recipe?.nutrition?.carb ??
        recipe?.carb ??
        recipe?.INFO_CAR ??
        "",
      protein:
        recipe?.nutrition?.protein ??
        recipe?.protein ??
        recipe?.INFO_PRO ??
        "",
      fat:
        recipe?.nutrition?.fat ??
        recipe?.fat ??
        recipe?.INFO_FAT ??
        "",
      sodium:
        recipe?.nutrition?.sodium ??
        recipe?.sodium ??
        recipe?.INFO_NA ??
        "",
    },
    mainImageUrl:
      recipe?.mainImageUrl ??
      recipe?.main_image_url ??
      recipe?.ATT_FILE_NO_MAIN ??
      recipe?.image_url ??
      recipe?.image ??
      recipe?.img ??
      "",
  };

  /** step 이미지 기본값(MANUAL_IMG01~20 폴백) */
  const defaultStepImages = Array.from({ length: 20 }, (_, i) =>
    toAbsUrl(recipe?.[`MANUAL_IMG${String(i + 1).padStart(2, "0")}`] || "")
  );

  /** 저장 → 성공 시 마이페이지 이동 */
  const handleSave = async (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (saving) return;
    try {
      const result = await (onSave?.() ?? true);
      if (result !== false) {
        navigate("/mypage", { replace: true });
      }
    } catch (err) {
      // 에러는 상단 error로 표출된다고 가정
      console.error(err);
    }
  };

  /** 취소 */
  const handleCancel = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    navigate(-1);  // 뒤로 가기
    onCancel?.();
  };

  return (
    <div className="ure-root">
      <h1 className="ure-page-title">레시피 수정</h1>

      {error && <div className="ure-error">{error}</div>}
      {loading && <div className="ure-help">불러오는 중…</div>}

      {/* ===== 요리 정보 (좌: 필드 / 우: 대표 사진) ===== */}
      <section className="ure-section">
        <div className="ure-grid ure-section as-card">
          {/* 좌측 */}
          <div className="ure-left">
            <h2 className="ure-section-title">요리 정보</h2>

            <div>
              <label className="ure-label" htmlFor="ure-name">요리 이름</label>
              <input
                id="ure-name"
                className="ure-input"
                value={vRecipe.name}
                onChange={(e) => {
                  const v = e.target.value;
                  onChangeField?.("name", v);
                  onChangeField?.("title", v);
                  onChangeField?.("RCP_NM", v);
                }}
                placeholder="예) 전복 미역국"
              />
            </div>

            {/* <div>
              <label className="ure-label" htmlFor="ure-description">소개</label>
              <textarea
                id="ure-description"
                className="ure-textarea"
                value={vRecipe.description}
                onChange={(e) => onChangeField?.("description", e.target.value)}
                placeholder="요리 소개를 입력하세요."
              />
            </div> */}

            {/* 요리 Tip 입력 필드 추가 */}
            <div>
              <label className="ure-label" htmlFor="ure-tip">요리 Tip</label>
              <p className="ure-help">요리 특징이나 Tip을 적어주세요.</p>
              <input
                id="ure-tip"
                className="ure-input"
                value={recipe?.RCP_NA_TIP || ""}
                onChange={(e) => {
                  const v = e.target.value;
                  onChangeField?.("RCP_NA_TIP", v);
                }}
                placeholder="예) 미리 삶아두면 편해요, 국물은 진하게"
              />
            </div>

            <div>
              <label className="ure-label">영양 정보 (선택)</label>
              <p className="ure-help">1인분 기준으로 입력하세요. 비워두면 저장 시 제외됩니다.</p>

              <div className="ure-nutrition-grid">
                <div className="ure-nutri-item">
                  <span className="ure-label">칼로리</span>
                  <div className="ure-nutri-input-wrap">
                    <input
                      className="ure-input with-unit"
                      type="number"
                      placeholder="예) 500"
                      value={vRecipe.nutrition.kcal}
                      onChange={(e) => onChangeNutrition?.("kcal", e.target.value)}
                    />
                    <span className="ure-unit">kcal</span>
                  </div>
                </div>

                <div className="ure-nutri-item">
                  <span className="ure-label">탄수화물</span>
                  <div className="ure-nutri-input-wrap">
                    <input
                      className="ure-input with-unit"
                      type="number"
                      placeholder="예) 61"
                      value={vRecipe.nutrition.carb}
                      onChange={(e) => onChangeNutrition?.("carb", e.target.value)}
                    />
                    <span className="ure-unit">g</span>
                  </div>
                </div>

                <div className="ure-nutri-item">
                  <span className="ure-label">단백질</span>
                  <div className="ure-nutri-input-wrap">
                    <input
                      className="ure-input with-unit"
                      type="number"
                      placeholder="예) 20"
                      value={vRecipe.nutrition.protein}
                      onChange={(e) => onChangeNutrition?.("protein", e.target.value)}
                    />
                    <span className="ure-unit">g</span>
                  </div>
                </div>

                <div className="ure-nutri-item">
                  <span className="ure-label">지방</span>
                  <div className="ure-nutri-input-wrap">
                    <input
                      className="ure-input with-unit"
                      type="number"
                      placeholder="예) 10"
                      value={vRecipe.nutrition.fat}
                      onChange={(e) => onChangeNutrition?.("fat", e.target.value)}
                    />
                    <span className="ure-unit">g</span>
                  </div>
                </div>

                <div className="ure-nutri-item">
                  <span className="ure-label">나트륨</span>
                  <div className="ure-nutri-input-wrap">
                    <input
                      className="ure-input with-unit"
                      type="number"
                      placeholder="예) 600"
                      value={vRecipe.nutrition.sodium}
                      onChange={(e) => onChangeNutrition?.("sodium", e.target.value)}
                    />
                    <span className="ure-unit">mg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 우측: 대표 사진 */}
          <aside className="ure-right">
            <label className="ure-label">대표 사진</label>
            <div
              className="ure-image-uploader"
              onClick={handleClickMainUploader}
              role="button"
              title="클릭하여 대표 이미지 선택"
            >
              <input
                ref={mainImageInputRef}
                type="file"
                accept="image/*"
                className="ure-file-input-hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onChangeMainImage?.(f);
                }}
              />
              {mainImagePreview ? (
                <img className="ure-image-preview" src={mainImagePreview} alt="대표 미리보기" />
              ) : vRecipe.mainImageUrl ? (
                <img className="ure-image-preview" src={toAbsUrl(vRecipe.mainImageUrl)} alt="대표" />
              ) : (
                <div className="ure-image-placeholder">
                  <div className="ure-plus">+</div>
                </div>
              )}
            </div>
            <p className="ure-image-help">이미지를 클릭하여 업로드</p>
          </aside>
        </div>
      </section>

      {/* 요리 재료 */}
      <section className="ure-section">
        <div className="ure-section-title">요리 재료</div>
        <div className="ure-card">
          <label className="ure-label">요리 재료를 적어주세요</label>
          <textarea
            className="ure-textarea"
            name="ingredients"
            placeholder="예) 애호박 160g, 소금 3g, 고추장 1큰술, 간장 1큰술"
            value={vRecipe.ingredients}
            onChange={(e) => onChangeField?.("ingredients", e.target.value)}
          />
        </div>
      </section>

      {/* 요리 순서 */}
      <section className="ure-section">
        <div className="ure-card ure-steps-card">
          <h2 className="ure-section-title">요리 순서</h2>

          <ul className="ure-steps">
            {steps.map((text, idx) => {
              const imgSrc = stepImagePreviews[idx] || defaultStepImages[idx] || "";
              return (
                <li className="ure-step" key={idx}>
                  {/* 썸네일 */}
                  <div
                    className="ure-step-thumb"
                    onClick={() => handleClickStepUploader(idx)}
                    role="button"
                    title="클릭하여 이미지 선택"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="ure-file-input-hidden"
                      ref={(el) => (stepImageInputRefs.current[idx] = el)}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) onChangeStepImage?.(idx, f);
                      }}
                    />
                    {imgSrc ? (
                      <img className="ure-step-preview" src={imgSrc} alt={`STEP ${idx + 1}`} />
                    ) : (
                      <div className="ure-step-placeholder">
                        <div className="ure-plus step">+</div>
                      </div>
                    )}
                  </div>

                  {/* 설명 */}
                  <div className="ure-step-textbox">
                    <span className="ure-step-number">{idx + 1}</span>
                    <textarea
                      className="ure-step-textarea"
                      placeholder={`step ${idx + 1}. 레시피 입력해주세요`}
                      value={text || ""}
                      onChange={(e) => onChangeStepText?.(idx, e.target.value)}
                    />
                  </div>
                </li>
              );
            })}
          </ul>

          {/* 하단 액션바(공용) */}
          <div className="ure-steps-actions-bar">
            <button
              type="button"
              className="ure-step-remove"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                steps.length > 0 && onRemoveStep?.(steps.length - 1);
              }}
              disabled={steps.length <= 1}
            >
              step. 삭제
            </button>
            <button
              type="button"
              className="ure-step-add"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddStep?.();
              }}
            >
              step. 추가
            </button>
          </div>
        </div>
      </section>

      {/* 하단 액션 */}
      <div className="ure-actions two">
        <button
          type="button"
          className="ure-cancel"
          onClick={handleCancel}
          disabled={saving}
        >
          취소
        </button>
        <button
          type="button"
          className="ure-save"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "수정 중…" : "수정"}
        </button>
      </div>
    </div>
  );
}
