import '../MyPage/MyPage.css';

const UserEditPresenter = ({ userInfo, onChange, onSave, saved }) => (
  <form className="mypage-edit-form-app" onSubmit={onSave}>
    {/* === 상단 대제목 헤더 === */}
    <div className="mypage-real-header-app">
      <h2 className="edit-main-title-app">회원정보 수정</h2>
    </div>

    {/* --- 프로필 정보 구역 --- */}
    <div className="edit-section-title-app">프로필 정보</div>

    <div className="input-group-app">
      <label>이름
        <input
          type="text"
          name="ko_name"
          value={userInfo.ko_name}
          onChange={onChange}
          required
        />
      </label>
    </div>

    <div className="edit-form-row-app input-group-row">
      <div className="input-group-app">
        <label>키(cm)
          <input
            type="number"
            name="height"
            value={userInfo.height}
            onChange={onChange}
          />
        </label>
      </div>
      <div className="input-group-app">
        <label>몸무게(kg)
          <input
            type="number"
            name="weight"
            value={userInfo.weight}
            onChange={onChange}
          />
        </label>
      </div>
    </div>

    <div className="input-group-app">
      <label>생년월일
        <input
          type="text"
          name="birth_date"
          value={userInfo.birth_date || ""}
          onChange={onChange}
          placeholder="예: 030405"
        />
      </label>
    </div>

    <div className="input-group-app">
      <label>선호하는 음식
        <input
          type="text"
          name="preferred_food"
          value={userInfo.preferred_food || ""}
          onChange={onChange}
          placeholder="예: 김치찌개, 된장찌개"
        />
      </label>
    </div>

    <div className="input-group-app">
      <label>선호하는 태그
        <input
          type="text"
          name="preferred_tags"
          value={userInfo.preferred_tags || ""}
          onChange={onChange}
          placeholder="예: 찌개"
        />
      </label>
    </div>

    {/* --- 계정 정보 구역 --- */}
    <div className="edit-section-title-app" style={{ marginTop: 30 }}>계정 정보</div>

    <div className="input-group-app">
      <label>이메일
        <input
          type="email"
          name="email"
          value={userInfo.email}
          disabled
          style={{ background: '#f3f3f3', color: '#aaa' }}
        />
      </label>
    </div>

    <div className="edit-form-row-app input-group-row">
      <div className="input-group-app">
        <label>아이디
          <input
            type="text"
            name="user_id"
            value={userInfo.user_id || ""}
            disabled
            style={{ background: '#f3f3f3', color: '#aaa' }}
          />
        </label>
      </div>
      <div className="input-group-app">
        <label>비밀번호
          <input
            type="password"
            name="password"
            value={userInfo.password || ""}
            onChange={onChange}
          />
        </label>
      </div>
    </div>

    <button type="submit" className="edit-save-btn-app">저장</button>
    {saved && <div className="edit-save-msg-app">✅ 저장되었습니다!</div>}
  </form>
);

export default UserEditPresenter;
