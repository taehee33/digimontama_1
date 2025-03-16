Digimon Tamagotchi 🐾
📂 폴더 구조
digimon-tamagotchi-frontend/
├── public/
│   └── images/
│       └── (디지몬 스프라이트 이미지)
├── src/
│   ├── components/       👉 UI 컴포넌트 (추후 추가)
│   ├── data/             👉 디지몬 데이터
│   │   ├── digimonStartNumber.js
│   │   └── digimonAnimations.js
│   ├── pages/
│   │   └── Game.jsx
│   ├── App.jsx
│   └── index.js
├── package.json
└── README.md


🚀 실행 방법
# 프론트엔드 폴더로 이동
cd digimon-tamagotchi-frontend

# 패키지 설치
npm install

# 실행
npm start


📊 디지몬 데이터 관리
파일	역할
/src/data/digimonStartNumber.js	디지몬별 시작 번호 관리
/src/data/digimonAnimations.js	애니메이션 상대 번호 관리
디지몬 추가 시 → 이 두 파일만 수정하면 쉽게 추가 가능!

💡 향후 개발 예정
로그인 시스템
여러 디지몬 관리
스탯 강화, 진화 시스템
배틀 기능git add README.md