# Pixel Font Maker
![](.github/screenshot.PNG)

픽셀 폰트를 디자인하고 TTF 파일로 뽑을 수 있는 프로그램입니다.

## 조작
### 보드
- mouse (left|right) (칠하기, 지우기)
- keyboard (left|right|up|down) (보드 이동)
- ctrl+(z|x|c|v) (되돌리기, 자르기, 복사, 붙여넣기)
- ctrl+s (프로젝트 저장)
- (1|2|3) (브러시 크기 조절)
### 기타
- Components에서 컴포넌트를 좌클릭하면 해당 컴포넌트를 편집합니다. 우클릭하면 해당 컴포넌트를 지울 수 있습니다.

## 한글 폰트 작성법
1. 프로젝트를 만들 때 한글 템플릿을 선택 (자모 컴포넌트가 `Private Set` 글리프셋에서 생성됩니다.)
2. `Korean Syllable (모든 11172자)` 또는 `KS X 1001 Korean Syllable (자주 쓰는 2350자)` 글리프셋을 선택
3. Components 에서 자모 컴포넌트를 선택해서 그리기

### 템플릿
- ZIK님 버전:
  - 초성 4벌, 중성 2벌, 종성 2벌 `(4*19 + 2*21 + 2*27) = 172자`
  - 팁(?) : 예를 들어 `공`와 `광`에 사용되는 초성`ㄱ`은 같은 종류를 사용하는데 이 점을 유의; 자세한건 아래의 상세 정보 참고
- 도깨비 버전:
  - 초성 8벌, 중성 4벌, 종성 4벌 `(8*19 + 4*21 + 4*27) = 344자`
- [상세 정보](https://github.com/TandyRum1024/hangul-johab-render-gms#%EA%B8%80%EA%BC%B4-%EA%B4%80%EB%A0%A8)
