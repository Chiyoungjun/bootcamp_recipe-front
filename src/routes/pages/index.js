// 개별 페이지 컴포넌트를 index.js에서 한 번에 export하여 관리.

// 메인 화면
export { default as Main } from './common/Main';

// 로그인 화면
export { default as SignIn } from './common/SignIn';

// 회원가입 화면
export { default as SignUp } from './common/SignUp';

// 랭킹 화면
export { default as Rank } from './common/Rank';

// 추천 화면
export { default as Recommend } from './common/Recommend';

// 마이페이지 화면
export { default as MyPage } from './common/MyPage';

// 상세 레시피 화면
export { default as RecipeDetail} from './common/RecipeDetail'

//회원정보 수정 화면
export { default as UserEdit} from './common/UserEdit'

// 분류 화면
export { default as Category } from './common/Category';

// 검색 기록 화면
export { default as UserSearchHistory} from './common/UserSearchHistory';

// 즐겨찾기 화면
export { default as UserFavorites} from './common/UserFavorites';
