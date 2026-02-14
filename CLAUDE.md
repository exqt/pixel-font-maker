# Pixel Font Maker

## Project Overview
픽셀 폰트를 만드는 Electron 데스크탑 앱. React + MobX + Konva 기반 에디터.

## Tech Stack
- **Runtime**: Electron (main: `electron/main.ts`, preload: `electron/preload.ts`)
- **Renderer**: React 18, MobX (mobx-react-lite), styled-components 6, react-konva (Konva 9)
- **Build**: Vite + vite-plugin-electron
- **Font**: fonteditor-core (TTF/WOFF2 생성), opentype.js (폰트 파싱/렌더링)
- **Language**: TypeScript 5

## Project Structure
```
electron/           # Electron main/preload
  main.ts           # BrowserWindow, IPC handlers, native menu
  preload.ts        # contextBridge → window.electronAPI
src/
  index.tsx         # React 18 createRoot entry
  App.tsx           # 라우팅 (main/editor 페이지)
  models/           # MobX stores
    project.ts      # 프로젝트 데이터, 폰트 export (TTF/WOFF2/BDF), save/load
    referenceFont.ts # 레퍼런스 폰트 로딩 (opentype.js)
    editorState.ts  # 에디터 상태 (undo, copy/paste, brush)
    appState.ts     # 앱 전역 상태 (페이지, 모달)
    glyph.ts        # 글리프 모델
    glyphData.ts    # 글리프 픽셀 데이터
  pages/
    main.tsx        # 프로젝트 생성/열기 페이지
    editor.tsx      # 에디터 페이지
  components/       # UI 컴포넌트
    GlyphEditor.tsx # 메인 에디터 캔버스 (Konva)
    GlyphViewer.tsx # 글리프 목록 뷰어
    ProjectMenuBar.tsx # 저장/내보내기/설정/미리보기
    EditorKeyListener.tsx # 키보드 단축키 + Electron 메뉴 이벤트
    modals/         # 모달 다이얼로그들
  misc/             # 기본 글리프, 한글 템플릿
public/fonts/       # 정적 에셋 (empty.ttf, woff2.wasm, NotoSansKR)
```

## Commands
- `npm run dev` — Vite dev server + Electron
- `npm run build` — Production build (dist/ + dist-electron/)
- `npm run package` — Build + electron-builder (.dmg/.exe/.AppImage)

## Key Patterns
- 파일 I/O는 모두 `window.electronAPI` (IPC) 통해 처리
- MobX observable 상태 관리, `observer()` HOC로 React 연결
- 프로젝트 파일 포맷: `.pfp` (JSON)
- styled-components v6: transient props는 `$` prefix 사용
- `fonteditor-core`는 fork 버전 사용 (`exqt/fonteditor-core`)
