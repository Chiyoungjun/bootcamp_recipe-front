# 🍳 SNAP COOK - Frontend (AI & ML Integrated)

"음식 사진만으로 레시피를 찾아주는 AI 기반 플랫폼"의 클라이언트 사이드입니다. 
YOLO11 인식 결과, BMI 기반 추천 로직, AI 챗봇 응답 등 복잡한 데이터를 사용자에게 직관적으로 전달하는 인터페이스를 구축했습니다.

## 🔗 Repository URL
- https://github.com/Chiyoungjun/bootcamp_recipe-front/tree/finalfront

## 🛠 Tech Stack
- **Framework**: React.js
- **Design Tool**: FIGMA (UI/UX 설계)
- **State Management**: React Hooks, Context API
- **Interaction**: Axios (FastAPI 백엔드와 통신)

## 🌟 핵심 구현 기능
1. **AI 사진 검색 인터페이스**: 사용자가 업로드한 음식 사진을 백엔드로 전송하고, YOLO11 분석 결과를 바탕으로 관련 레시피를 실시간 렌더링합니다.
2. **맞춤형 건강 대시보드 (BMI 기반)**: 키와 몸무게 정보를 입력받아 머신러닝 모델(Random Forest)이 분류한 체형 상태(저체중/정상/비만 등)에 맞춰 레시피를 추천합니다.
3. **지능형 SNAPCOOK Chat**: OpenAI API를 연동하여 실시간 요리 질의응답이 가능한 대화형 챗봇 UI를 구현했습니다.
4. **다국어 레시피 지원**: 한국어, 영어, 일본어, 중국어로 레시피 정보를 전환하여 볼 수 있는 다국어 뷰를 제공합니다.
5. **사용자 참여형 마이페이지**: 레시피 작성, 수정, 검색 기록 관리 및 즐겨찾기 기능을 포함합니다.

## 🚀 기술적 성장 포인트
- **데이터 시각화 및 UX**: 백엔드의 영양 정보 및 BMI 분류 로직을 시각화하여 사용자 편의성을 극대화했습니다.
- **컴포넌트 기반 설계**: 반복되는 레시피 카드와 폼 요소를 모듈화하여 유지보수 효율을 높였습니다.
