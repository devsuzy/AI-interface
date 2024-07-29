# AI Interface
- Project : `React + Vite + Typescript + SWC`
- IDE : `VS Code`

<br />

## Contents
- [Installation](#Installation)
- [Version](#Version)
- [Dependencies](#Dependencies)

<br />

### Installation
1. Clone the repository
    ```sh
    git clone https://github.com/dev-imformpm1/AI-Interface.git
    ```
2. Navigate to the project directory:
    ```sh
    cd AI-Interface
    ```
3. Install dependencies:
    ```sh
    npm install
    ```
4. Start the development server:
    ```sh
    npm run dev
    ```
<br />

### Version
- Node 20.13.1
- NPM 10.8.2

<br />

### Dependencies
```json
{
  "dependencies": { 
    "@excalidraw/excalidraw": "^0.17.6", // infinity Canvas 테스트
    "tldraw": "^2.4.1", // infinity Canvas 실제 사용할 예정

    "@tanstack/react-query": "^5.51.15", // 데이터 패칭
    "@tanstack/react-query-devtools": "^5.51.15", // 데이터 패칭
    "axios": "^1.7.2", // Http Request - API 호출 시 사용

    "crypto-js": "^4.2.0", // 암호화 처리 - 로그인 시 사용
    "dayjs": "^1.11.12", // 날짜 계산 및 출력 시 사용
    "framer-motion": "^11.3.17", // 애니메이션 처리 시 사용
    "lodash": "^4.17.21", // javascript utils 함수 필요 시 사용
    "sass": "^1.77.8", // SCSS 사용
    "swiper": "^11.1.8", // 슬라이드 처리 시 사용
    "ua-parser-js": "^1.0.38", // user agent 필요 시 사용
    "uuid": "^10.0.0", // uniq ID 값 생성 시 사용
    "zustand": "^4.5.4", // 전역 상태관리

    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.25.1"
  },
  "devDependencies": {
    "@types/lodash": "^4.17.7",
    "@types/node": "^20.14.12",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@types/ua-parser-js": "^0.7.39",
    "@types/uuid": "^10.0.0",
    "@typescript-eslint/eslint-plugin": "^7.15.0",
    "@typescript-eslint/parser": "^7.15.0",
    "@vitejs/plugin-react-swc": "^3.5.0",
    "eslint": "^8.57.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.2.1",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-react-refresh": "^0.4.7",
    "prettier": "^3.3.3",
    "typescript": "^5.2.2",
    "vite": "^5.3.4",
    "vite-tsconfig-paths": "^4.3.2",

    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.40",
    "tailwindcss": "^3.4.7",
    "cross-env": "^7.0.3",
    "msw": "^1.3.3"
  },
}
```