# CarVite - 빠른 시작 (프런트엔드)

## 이 프로젝트는 무엇인가요?
- React + Vite로 만든 차량 브라우저용 프런트엔드입니다.
- 백엔드(`CarBackend`)에서 제공하는 데이터를 화면에 보여줍니다.

## 시작 전에 필요한 것
- Node.js 18 이상

## 1) 설치
```
cd CarVite
npm install
```

## 2) 개발 서버 실행
```
npm run dev
```
- 터미널에 표시되는 주소로 접속하세요(보통 아래 주소):
```
http://127.0.0.1:3000
```

## 3) 백엔드와 연결
- 백엔드가 `http://127.0.0.1:8000`에서 실행 중인지 확인하세요.
- ngrok를 사용한다면 `vite.config.ts`의 `server.allowedHosts`에 ngrok 호스트를 추가하세요.

## 4) 운영용 빌드
```
npm run build
```

## 문제 해결(FAQ)
- Vite가 특정 호스트를 차단한다면: `vite.config.ts`의 `server.allowedHosts`를 수정하세요.
- 화면이 갱신되지 않는 것 같다면: Ctrl+F5로 강력 새로고침을 해보세요.
