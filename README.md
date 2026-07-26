# React Mobile Wedding Invitation

React로 만든 모바일 청첩장 템플릿입니다. 이 저장소를 fork하거나 clone해서 신랑/신부 이름, 예식 정보, 사진, 지도, 방명록, 갤러리, 공유 정보를 바꾸면 나만의 모바일 청첩장을 만들 수 있습니다.

현재 버전은 다음 기능을 포함합니다.

- 모바일 중심 청첩장 화면
- 커버, 초대글, 달력, 갤러리, 오시는 길, 계좌 안내, 방명록, 하객 사진 업로드 섹션
- Firebase Firestore 기반 설정 저장, 방명록, 관리자 업로드 갤러리
- 관리자 페이지에서 주요 문구와 일부 스타일을 수정하는 기능
- WYSIWYG 형태의 초대글/일정/장소/안내문 편집
- Kakao 공유 버튼, Open Graph / Twitter 미리보기 메타 태그
- GitHub Pages 자동 배포 워크플로우

> 주의: 이 저장소에는 예시용 개인 정보와 Firebase 설정이 들어 있습니다. 본인 청첩장으로 사용하려면 반드시 본인 정보와 본인 Firebase 프로젝트로 교체하세요.

---

## 1. 빠른 시작

```bash
git clone https://github.com/USER_NAME/react-wedding-card.git
cd react-wedding-card
npm install
npm start
```

브라우저에서 `http://localhost:3000`을 열면 개발 서버를 확인할 수 있습니다.

빌드:

```bash
npm run build
```

---

## 2. 처음 바꿔야 할 파일

### 기본 문구와 정보

대부분의 텍스트 기본값은 아래 파일에서 관리합니다.

```text
src/defaultSiteConfig.js
```

주요 항목:

| 항목 | 설명 |
| --- | --- |
| `cover` | 커버 날짜, 시간, 장소, 신랑/신부 이름 |
| `invitation` | 초대글, 양가 부모님, 관계, 이름 |
| `calendar` | 예식 일시, 장소, Google Calendar 링크 정보 |
| `location` | 예식장 이름, 주소, 교통/주차/주의 문구 |
| `gallery` | 갤러리 제목, 관리자 업로드 이미지 기본값 |
| `photoUpload` | 하객 사진 업로드 섹션 문구 |
| `account` | 마음 전하실 곳 계좌 정보 |
| `footer` | 공유 URL, 공유 제목/문구/이미지, 하단 문구 |
| `style` | 기본 색상과 폰트 설정 |

### 사진 교체

대표 이미지와 고정 갤러리 이미지는 아래 위치에 있습니다.

```text
public/gallery/                  # 기본 갤러리 사진
public/wedding.jpg               # 카카오/OG 공유 미리보기용 대표 이미지
src/images/wedding-cover.jpg     # 커버 이미지
src/images/wedding-cover-thumb.jpg
src/images/location-map.png      # 약도 이미지
```

기본 갤러리는 `src/pages/ImgGallery.js`의 `PHOTO_NUMBERS` 배열과 `public/gallery/wedding-gallery-XX.jpg` 파일명을 사용합니다.

예시:

```text
public/gallery/wedding-gallery-01.jpg
public/gallery/wedding-gallery-01-thumb.jpg
```

사진을 바꿀 때는 원본과 썸네일 파일명을 함께 맞추는 것을 권장합니다.

---

## 3. 관리자 페이지 사용법

배포된 청첩장 URL 뒤에 `?admin`을 붙이면 관리자 화면으로 들어갈 수 있습니다.

```text
https://USER_NAME.github.io/react-wedding-card/?admin
```

관리자에서 수정할 수 있는 예:

- 커버 정보
- 초대글 본문
- 일정/장소 문구
- 오시는 길 안내
- 하객 사진 업로드 안내문
- 마음 전하실 곳
- 공유 문구와 공유 이미지 URL
- 관리자 업로드 갤러리 사진

> GitHub Pages에서 `/admin` 같은 직접 경로는 새로고침 시 404가 날 수 있습니다. `?admin` 방식을 사용하세요.

관리자에서 저장한 값은 Firebase Firestore의 `settings/main` 문서에 저장됩니다. 코드의 `defaultSiteConfig.js`는 Firestore 설정이 없을 때 사용하는 기본값입니다.

---

## 4. Firebase 설정

이 프로젝트는 Firebase Firestore를 사용합니다.

사용되는 컬렉션:

| 컬렉션/문서 | 용도 |
| --- | --- |
| `settings/main` | 관리자에서 저장한 사이트 설정 |
| `guestbook` | 방명록 메시지 |
| `galleryImages` | 관리자에서 업로드한 갤러리 이미지 |

### 4-1. Firebase 프로젝트 만들기

1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트를 만듭니다.
2. Web App을 추가합니다.
3. Firestore Database를 생성합니다.
4. 발급받은 Firebase config를 아래 파일에 넣습니다.

```text
src/firebase-config.js
```

예시:

```js
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.firebasestorage.app',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export default db
```

### 4-2. Firestore Rules 예시

아래 규칙은 이 프로젝트 구조에 맞춘 예시입니다. 실제 공개 사이트에서는 누구나 관리자 URL을 알면 설정을 바꿀 수 있으므로, 공개 전에는 Firebase Auth나 별도 관리자 인증을 추가하는 것을 권장합니다.

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /guestbook/{docId} {
      allow read: if true;

      allow create: if
        request.resource.data.keys().hasOnly(['name', 'message', 'passwordHash', 'createdAt']) &&
        request.resource.data.name is string &&
        request.resource.data.name.size() > 0 &&
        request.resource.data.name.size() <= 20 &&
        request.resource.data.message is string &&
        request.resource.data.message.size() > 0 &&
        request.resource.data.message.size() <= 500 &&
        request.resource.data.passwordHash is string &&
        request.resource.data.passwordHash.size() > 20 &&
        request.resource.data.createdAt == request.time;

      allow delete: if true;
    }

    match /settings/{docId} {
      allow read: if true;
      allow write: if docId == 'main';
    }

    match /galleryImages/{docId} {
      allow read: if true;
      allow create, update: if
        request.resource.data.keys().hasOnly(['name', 'alt', 'src', 'thumbnail', 'width', 'height', 'size', 'order', 'createdAt']) &&
        request.resource.data.name is string &&
        request.resource.data.name.size() > 0 &&
        request.resource.data.name.size() <= 120 &&
        request.resource.data.alt is string &&
        request.resource.data.alt.size() <= 120 &&
        request.resource.data.src is string &&
        request.resource.data.src.matches('data:image/.*') &&
        request.resource.data.src.size() < 1050000 &&
        request.resource.data.thumbnail is string &&
        request.resource.data.thumbnail.matches('data:image/.*') &&
        request.resource.data.thumbnail.size() < 350000 &&
        request.resource.data.width is int &&
        request.resource.data.height is int &&
        request.resource.data.size is int &&
        request.resource.data.order is int &&
        request.resource.data.createdAt == request.time;

      allow delete: if true;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 5. GitHub Pages 배포

이 저장소에는 GitHub Pages 배포용 workflow가 포함되어 있습니다.

```text
.github/workflows/deploy-pages.yml
```

### 5-1. `homepage` 수정

`package.json`의 `homepage`를 본인 GitHub Pages 주소로 바꿉니다.

```json
{
  "homepage": "https://USER_NAME.github.io/REPOSITORY_NAME"
}
```

### 5-2. GitHub Pages 설정

GitHub 저장소에서:

1. `Settings` → `Pages`
2. Source를 `GitHub Actions`로 설정
3. main branch에 push하면 자동 배포됩니다.

배포 URL 예시:

```text
https://USER_NAME.github.io/REPOSITORY_NAME/
```

---

## 6. Kakao 공유 설정

Kakao 공유 버튼을 사용하려면 Kakao Developers에서 JavaScript 키를 발급받아야 합니다.

1. [Kakao Developers](https://developers.kakao.com/)에서 앱 생성
2. JavaScript 키 확인
3. 플랫폼 Web에 배포 도메인 등록
4. GitHub 저장소 `Settings` → `Secrets and variables` → `Actions` → `Variables`에 추가

변수명:

```text
REACT_APP_KAKAO_JAVASCRIPT_KEY
```

로컬 개발 시에는 `.env.local`에 넣을 수 있습니다.

```text
REACT_APP_KAKAO_JAVASCRIPT_KEY=YOUR_KAKAO_JAVASCRIPT_KEY
```

공유 제목, 설명, URL, 이미지는 `src/defaultSiteConfig.js`의 `footer` 또는 관리자 페이지에서 수정할 수 있습니다.

```js
footer: {
  shareUrl: 'https://USER_NAME.github.io/REPOSITORY_NAME/',
  shareTitle: '신랑 ♥ 신부 결혼합니다',
  shareText: '2026년 1월 1일 토요일 오후 1시, 예식장 이름',
  shareImage: 'https://USER_NAME.github.io/REPOSITORY_NAME/wedding.jpg',
}
```

> 카카오톡 미리보기 이미지는 캐시가 강하게 남을 수 있습니다. 이미지를 바꾼 뒤에도 예전 이미지가 보이면 Kakao Developers의 공유 디버거/캐시 초기화를 사용하세요.

---

## 7. 하객 사진 업로드

`src/pages/PhotoUpload.js`는 Google Apps Script Web App URL로 사진을 전송하는 구조입니다. 본인 Google Drive로 사진을 받으려면 Apps Script를 별도로 만들고, 배포 URL을 코드 또는 설정에 연결해야 합니다.

관리자 갤러리 업로드와 하객 사진 업로드는 다릅니다.

| 기능 | 저장 위치 |
| --- | --- |
| 관리자 갤러리 업로드 | Firestore `galleryImages` 컬렉션 |
| 하객 사진 업로드 | Google Apps Script를 통해 Google Drive 저장 |

관리자 갤러리 업로드는 Firebase Storage 없이 Firestore에 압축된 이미지 Data URL을 저장합니다. Spark 무료 플랜에서도 동작하지만, 이미지가 많아지면 Firestore 용량/읽기 비용에 주의하세요.

---

## 8. 커스터마이징 체크리스트

출시 전에 아래 항목을 확인하세요.

- [ ] `package.json`의 `homepage`를 내 GitHub Pages 주소로 변경
- [ ] `src/firebase-config.js`를 내 Firebase 프로젝트로 변경
- [ ] Firestore Rules 설정
- [ ] `src/defaultSiteConfig.js`의 신랑/신부/예식 정보 변경
- [ ] 커버 이미지 교체
- [ ] 갤러리 이미지 교체
- [ ] 약도 이미지 교체
- [ ] `public/wedding.jpg` 공유 이미지 교체
- [ ] `public/index.html`의 기본 OG 메타 정보 확인
- [ ] Kakao JavaScript 키 등록
- [ ] 관리자 페이지 `?admin`에서 문구 저장 테스트
- [ ] 방명록 작성/삭제 테스트
- [ ] 모바일 브라우저에서 전체 화면 확인

---

## 9. 주요 디렉터리

```text
src/pages/              # 각 섹션 React 컴포넌트
src/css/                # 각 섹션 스타일
src/images/             # 커버, 지도, 아이콘 등 소스 이미지
public/gallery/         # 기본 갤러리 이미지
public/wedding.jpg      # 공유 미리보기 대표 이미지
src/defaultSiteConfig.js# 사이트 기본 설정
src/firebase-config.js  # Firebase 연결
```

---

## 10. 보안 관련 주의

현재 관리자 페이지는 URL에 `?admin`을 붙이면 접근할 수 있는 구조입니다. 가족/지인에게만 공유하는 개인 청첩장이라면 간단히 사용할 수 있지만, 공개적으로 널리 공유할 경우에는 다음 개선을 권장합니다.

- Firebase Authentication으로 관리자 인증 추가
- 관리자 저장 API 분리
- Firestore Rules에서 인증된 관리자만 `settings`와 `galleryImages`를 수정하도록 제한
- 계좌번호, 전화번호 등 민감 정보 공개 범위 확인

---

## 11. Credits

이 프로젝트는 `YOUNGEUN100/react-wedding-card`를 기반으로 커스터마이징되었습니다.
