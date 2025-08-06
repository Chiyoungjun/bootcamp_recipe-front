import './MyPage.css';

const UserEditPresenter = ({ userInfo, onChange, onSave, saved }) => (
  <form className="mypage-edit-form-app" onSubmit={onSave}>
    <h2 className="edit-title-app">회원정보 수정</h2>

    {/* 프로필 정보 영역 */}
    <div className="edit-section-title">프로필 정보</div>

    <div className="input-group-app">
      <label>이름
        <input
          type="text"
          name="name"
          value={userInfo.name}
          onChange={onChange}
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
          name="birth"
          value={userInfo.birth || ""}
          onChange={onChange}
          placeholder="예: 030405"
        />
      </label>
    </div>

    <div className="input-group-app">
      <label>선호하는 음식
        <input
          type="text"
          name="favoriteFood"
          value={userInfo.favoriteFood || ""}
          onChange={onChange}
          placeholder="예: 김치찌개, 된장찌개"
        />
      </label>
    </div>

    <div className="input-group-app">
      <label>선호하는 태그
        <input
          type="text"
          name="favoriteTag"
          value={userInfo.favoriteTag || ""}
          onChange={onChange}
          placeholder="예: 찌개"
        />
      </label>
    </div>

    {/* 계정 정보 영역 */}
    <div className="edit-section-title" style={{ marginTop: 30 }}>계정 정보</div>
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
            name="id"
            value={userInfo.id || ""}
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
