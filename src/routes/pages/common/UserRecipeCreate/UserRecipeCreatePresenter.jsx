import React from "react";
import "./UserRecipeCreate.css";

export default function UserRecipeCreatePresenter({
  form,
  steps,
  onChangeInput,
  onChangeImage,
  onChangeStepImage,
  onChangeStepText,
  onAddStep,
  onRemoveStep,
  onSubmit,
  onCancel,
}) {
  return (
    <form className="ur-root" onSubmit={onSubmit}>
      <h1 className="ur-page-title">레시피 작성</h1>

      {/* ================== 요리 정보 ================== */}
      <section className="ur-section">
        <div className="ur-section-title">요리 정보</div>
        <div className="ur-card">
          <div className="ur-grid">
            {/* 좌측 입력 */}
            <div className="ur-left">
              {/* 이름 */}
              <label className="ur-label">요리 이름</label>
              <input
                className="ur-input"
                type="text"
                name="title"
                placeholder="예) 전복 미역국"
                value={form.title}
                onChange={onChangeInput}
                required
              />

              {/* 소개/태그 */}
              <label className="ur-label mt-16">Tip</label>
              <p className="ur-help">
                요리와 관련된 팁이나 정보를 적어주세요
              </p>
              <input
                className="ur-input"
                type="text"
                name="tip"
                placeholder=""
                value={form.tip}
                onChange={onChangeInput}
              />

              {/* 영양 정보 (카테고리 자리 대체) */}
              <label className="ur-label mt-24">영양 정보 (선택)</label>
              <p className="ur-help">
                1인분 기준으로 입력하세요. 비워두면 저장 시 제외됩니다.
              </p>

              <div className="ur-nutrition-grid">
                {/* 칼로리 */}
                <div className="ur-nutri-item">
                  <label className="ur-label">칼로리</label>
                  <div className="ur-nutri-input-wrap">
                    <input
                      className="ur-input with-unit"
                      type="number"
                      min="0"
                      name="nutrition.calorie"
                      placeholder="예) 500"
                      value={form?.nutrition?.calorie ?? ""}
                      onChange={onChangeInput}
                    />
                    <span className="ur-unit">kcal</span>
                  </div>
                </div>

                {/* 탄수화물 */}
                <div className="ur-nutri-item">
                  <label className="ur-label">탄수화물</label>
                  <div className="ur-nutri-input-wrap">
                    <input
                      className="ur-input with-unit"
                      type="number"
                      min="0"
                      name="nutrition.carbs"
                      placeholder="예) 61"
                      value={form?.nutrition?.carbs ?? ""}
                      onChange={onChangeInput}
                    />
                    <span className="ur-unit">g</span>
                  </div>
                </div>

                {/* 단백질 */}
                <div className="ur-nutri-item">
                  <label className="ur-label">단백질</label>
                  <div className="ur-nutri-input-wrap">
                    <input
                      className="ur-input with-unit"
                      type="number"
                      min="0"
                      name="nutrition.protein"
                      placeholder="예) 20"
                      value={form?.nutrition?.protein ?? ""}
                      onChange={onChangeInput}
                    />
                    <span className="ur-unit">g</span>
                  </div>
                </div>

                {/* 지방 */}
                <div className="ur-nutri-item">
                  <label className="ur-label">지방</label>
                  <div className="ur-nutri-input-wrap">
                    <input
                      className="ur-input with-unit"
                      type="number"
                      min="0"
                      name="nutrition.fat"
                      placeholder="예) 10"
                      value={form?.nutrition?.fat ?? ""}
                      onChange={onChangeInput}
                    />
                    <span className="ur-unit">g</span>
                  </div>
                </div>

                {/* 나트륨 */}
                <div className="ur-nutri-item">
                  <label className="ur-label">나트륨</label>
                  <div className="ur-nutri-input-wrap">
                    <input
                      className="ur-input with-unit"
                      type="number"
                      min="0"
                      name="nutrition.sodium"
                      placeholder="예) 600"
                      value={form?.nutrition?.sodium ?? ""}
                      onChange={onChangeInput}
                    />
                    <span className="ur-unit">mg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 우측 대표 사진 */}
            <div className="ur-right">
              <div className="ur-label">대표 사진</div>
              <label className="ur-image-uploader" tabIndex={0}>
                {form.imageUrl ? (
                  <img
                    src={form.imageUrl}
                    alt="preview"
                    className="ur-image-preview"
                  />
                ) : (
                  <div className="ur-image-placeholder">
                    <div className="ur-plus">+</div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={onChangeImage}
                  style={{ display: "none" }}
                  name="imageFile"
                />
              </label>
              <div className="ur-image-help">이미지를 클릭하여 업로드</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================== 요리 재료 ================== */}
      <section className="ur-section">
        <div className="ur-section-title">요리 재료</div>
        <div className="ur-card">
          <label className="ur-label">요리 재료를 적어주세요.</label>
          <textarea
            className="ur-textarea"
            name="ingredients"
            placeholder="예) 애호박 160g, 소금 3g, 고추장 1큰술, 간장 1큰술 ..."
            value={form.ingredients}
            onChange={onChangeInput}
            rows={6}
            required
          />
        </div>
      </section>

      {/* ================== 요리 순서 ================== */}
      <section className="ur-section">
        <div className="ur-section-title">요리 순서</div>
        <div className="ur-card ur-steps-card">
          <ul className="ur-steps">
            {steps.map((s, i) => (
              <li key={i} className="ur-step">
                {/* 이미지 업로더 */}
                <label className="ur-step-thumb" tabIndex={0}>
                  {s.imageUrl ? (
                    <img
                      src={s.imageUrl}
                      alt={`step-${i + 1}`}
                      className="ur-step-preview"
                    />
                  ) : (
                    <div className="ur-step-placeholder">
                      <div className="ur-plus">+</div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onChangeStepImage(i, e.target.files?.[0])}
                    style={{ display: "none" }}
                    name={`stepImage${i}`}
                  />
                </label>

                {/* 텍스트 */}
                <div className="ur-step-textbox">
                  <div className="ur-step-number">{i + 1}</div>
                  <textarea
                    className="ur-step-textarea"
                    placeholder={`step ${i + 1}. 레시피 입력해주세요`}
                    value={s.text}
                    onChange={(e) => onChangeStepText(i, e.target.value)}
                  />
                </div>
              </li>
            ))}
          </ul>

          <div className="ur-step-actions swapped">
            <button
              type="button"
              className="ur-step-remove"
              onClick={onRemoveStep}
              disabled={steps.length <= 1}
            >
              step. 삭제
            </button>
            <button type="button" className="ur-step-add" onClick={onAddStep}>
              step. 추가
            </button>
          </div>
        </div>
      </section>

      {/* 하단 액션 */}
      <div className="ur-actions two">
        <button type="button" className="ur-cancel" onClick={onCancel}>
          취소
        </button>
        <button type="submit" className="ur-save">
          저장
        </button>
      </div>
    </form>
  );
}

// // UserRecipeCreatePresenter.jsx
// import React from "react";
// import "./UserRecipeCreate.css";

// export default function UserRecipeCreatePresenter({
//   form,
//   steps,
//   onChangeInput,
//   onChangeImage,
//   onChangeStepImage,
//   onChangeStepText,
//   onAddStep,
//   onRemoveStep,
//   onSubmit,
//   onCancel,
// }) {
//   return (
//     <form className="ur-root" onSubmit={onSubmit}>
//       <h1 className="ur-page-title">레시피 작성</h1>

//       {/* ================== 요리 정보 ================== */}
//       <section className="ur-section">
//         <div className="ur-section-title">요리 정보</div>
//         <div className="ur-card">
//           <div className="ur-grid">
//             {/* 좌측 입력 */}
//             <div className="ur-left">
//               {/* 이름 */}
//               <label className="ur-label">요리 이름</label>
//               <input
//                 className="ur-input"
//                 type="text"
//                 name="title"
//                 placeholder="예) 전복 미역국"
//                 value={form.title}
//                 onChange={onChangeInput}
//               />

//               {/* 소개/태그 */}
//               <label className="ur-label mt-16">요리 소개</label>
//               <p className="ur-help">요리에 해당하는 태그를 적어주세요 (최대 5개)</p>
//               <input
//                 className="ur-input"
//                 type="text"
//                 name="tags"
//                 placeholder="예) 다이어트, 한식, 소고기"
//                 value={form.tags}
//                 onChange={onChangeInput}
//               />

//               {/* 영양 정보 (카테고리 자리 대체) */}
//               <label className="ur-label mt-24">영양 정보 (선택)</label>
//               <p className="ur-help">1인분 기준으로 입력하세요. 비워두면 저장 시 제외됩니다.</p>

//               <div className="ur-nutrition-grid">
//                 {/* 칼로리 */}
//                 <div className="ur-nutri-item">
//                   <label className="ur-label">칼로리</label>
//                   <div className="ur-nutri-input-wrap">
//                     <input
//                       className="ur-input with-unit"
//                       type="number"
//                       min="0"
//                       name="nutrition.calorie"
//                       placeholder="예) 500"
//                       value={form?.nutrition?.calorie ?? ""}
//                       onChange={onChangeInput}
//                     />
//                     <span className="ur-unit">kcal</span>
//                   </div>
//                 </div>

//                 {/* 탄수화물 */}
//                 <div className="ur-nutri-item">
//                   <label className="ur-label">탄수화물</label>
//                   <div className="ur-nutri-input-wrap">
//                     <input
//                       className="ur-input with-unit"
//                       type="number"
//                       min="0"
//                       name="nutrition.carbs"
//                       placeholder="예) 61"
//                       value={form?.nutrition?.carbs ?? ""}
//                       onChange={onChangeInput}
//                     />
//                     <span className="ur-unit">g</span>
//                   </div>
//                 </div>

//                 {/* 단백질 */}
//                 <div className="ur-nutri-item">
//                   <label className="ur-label">단백질</label>
//                   <div className="ur-nutri-input-wrap">
//                     <input
//                       className="ur-input with-unit"
//                       type="number"
//                       min="0"
//                       name="nutrition.protein"
//                       placeholder="예) 20"
//                       value={form?.nutrition?.protein ?? ""}
//                       onChange={onChangeInput}
//                     />
//                     <span className="ur-unit">g</span>
//                   </div>
//                 </div>

//                 {/* 지방 */}
//                 <div className="ur-nutri-item">
//                   <label className="ur-label">지방</label>
//                   <div className="ur-nutri-input-wrap">
//                     <input
//                       className="ur-input with-unit"
//                       type="number"
//                       min="0"
//                       name="nutrition.fat"
//                       placeholder="예) 10"
//                       value={form?.nutrition?.fat ?? ""}
//                       onChange={onChangeInput}
//                     />
//                     <span className="ur-unit">g</span>
//                   </div>
//                 </div>

//                 {/* 나트륨 */}
//                 <div className="ur-nutri-item">
//                   <label className="ur-label">나트륨</label>
//                   <div className="ur-nutri-input-wrap">
//                     <input
//                       className="ur-input with-unit"
//                       type="number"
//                       min="0"
//                       name="nutrition.sodium"
//                       placeholder="예) 600"
//                       value={form?.nutrition?.sodium ?? ""}
//                       onChange={onChangeInput}
//                     />
//                     <span className="ur-unit">mg</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* 우측 대표 사진 */}
//             <div className="ur-right">
//               <div className="ur-label">대표 사진</div>
//               <label className="ur-image-uploader">
//                 {form.imageUrl ? (
//                   <img src={form.imageUrl} alt="preview" className="ur-image-preview" />
//                 ) : (
//                   <div className="ur-image-placeholder">
//                     <div className="ur-plus">+</div>
//                   </div>
//                 )}
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={onChangeImage}
//                   style={{ display: "none" }}
//                 />
//               </label>
//               <div className="ur-image-help">이미지를 클릭하여 업로드</div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ================== 요리 재료 ================== */}
//       <section className="ur-section">
//         <div className="ur-section-title">요리 재료</div>
//         <div className="ur-card">
//           <label className="ur-label">요리 재료를 적어주세요.</label>
//           <textarea
//             className="ur-textarea"
//             name="ingredients"
//             placeholder="예) 애호박 160g, 소금 3g, 고추장 1큰술, 간장 1큰술 ..."
//             value={form.ingredients}
//             onChange={onChangeInput}
//             rows={6}
//           />
//         </div>
//       </section>

//       {/* ================== 요리 순서 ================== */}
//       <section className="ur-section">
//         <div className="ur-section-title">요리 순서</div>
//         <div className="ur-card ur-steps-card">
//           <ul className="ur-steps">
//             {steps.map((s, i) => (
//               <li key={i} className="ur-step">
//                 {/* 이미지 업로더 */}
//                 <label className="ur-step-thumb">
//                   {s.imageUrl ? (
//                     <img src={s.imageUrl} alt={`step-${i + 1}`} className="ur-step-preview" />
//                   ) : (
//                     <div className="ur-step-placeholder">
//                       <div className="ur-plus">+</div>
//                     </div>
//                   )}
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => onChangeStepImage(i, e.target.files?.[0])}
//                     style={{ display: "none" }}
//                   />
//                 </label>

//                 {/* 텍스트 */}
//                 <div className="ur-step-textbox">
//                   <div className="ur-step-number">{i + 1}</div>
//                   <textarea
//                     className="ur-step-textarea"
//                     placeholder={`step ${i + 1}. 레시피 입력해주세요`}
//                     value={s.text}
//                     onChange={(e) => onChangeStepText(i, e.target.value)}
//                   />
//                 </div>
//               </li>
//             ))}
//           </ul>

//           <div className="ur-step-actions swapped">
//             <button type="button" className="ur-step-remove" onClick={onRemoveStep}>
//               step. 삭제
//             </button>
//             <button type="button" className="ur-step-add" onClick={onAddStep}>
//               step. 추가
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* 하단 액션 */}
//       <div className="ur-actions two">
//         <button type="button" className="ur-cancel" onClick={onCancel}>
//           취소
//         </button>
//         <button type="submit" className="ur-save">
//           저장
//         </button>
//       </div>
//     </form>
//   );
// }
