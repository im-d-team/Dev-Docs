# React Server Component

지난 2020년 12월 React Team에서 진행하고 있는 연구에 대해서 공유했다. 해당 내용에 대해서 자세히 알고 싶으면 [RFC](https://github.com/reactjs/rfcs/blob/bf51f8755ddb38d92e23ad415fc4e3c02b95b331/text/0000-server-components.md) 나 [YouTube](https://www.youtube.com/watch?v=TQQPAU21ZUw&feature=emb_title) 영상을 보는 것을 추천하다.

## Intro

오늘은 진행되고 있는 연구에 대해서 알아보는 시간이 되면서, 앞으로 프론트엔드가 어떻게 변화될 수 있을까? 생각해보는 시간을 가졌으면 한다.

**RSC**라 불리는 이번 주제는 **React Server Component**의 약자이다. 이 기능은 모던 UX 서버 기반 모델에서 착안하였다고 한다.

이는 우리가 이미 알고 있는 SSR과 다른 결과물로, Client-Side의 JS bundle을 줄여주는 것이 메인이다. 아직 Production Version에는 아직 올라오지 않았지만, [RFC](https://github.com/reactjs/rfcs/blob/bf51f8755ddb38d92e23ad415fc4e3c02b95b331/text/0000-server-components.md) 나 [YouTube](https://www.youtube.com/watch?v=TQQPAU21ZUw&feature=emb_title) 으로 확인 가능하다.

위 영상의 Full Name은 **zero-bundle-size** React Server Component이다. 영상에는 설명뿐만 아니라 데모 영상과 데모 Repo도 알려주고 있어 따라 해볼 수 있다.

## 주요 특징

- 번들 사이즈를 줄인다.
- Server Side Resource에 접근할 수 있다.
- 데이터를 서버에서 로드하고 Component를 만드는데 필요한 데이터를 Client로 보낸다(JSON, HTML이 아니다).
- Client에서 필요한 Component만 호출한다.
- Server Component는 파일명이 `.server.js`다.
- Client Component는 파일명이 `.client.js`다.
- 두 군데 모두 사용하는 Shared Component는 파일명이 `.js`다.

## SSR의 한계

우리는 SSR을 Client Side의 차선책으로 사용한다. Server에서 HTML String을 만들어서 내려준다. 만들어진 HTML은 브라우저로 가서 First Contentful Paint 또는 Largest Contentful Paint로 보인다.

SSR은 보통 초기 렌더링에만 쓰이고 다시 사용되지 않는다.

RSC는 주기적으로 refetch 할 수 있다. rerendering이 필요할 때(data가 바뀌었을 때) 서버에서 만들어 Client로 보낸다.

Client로 보내는 데이터는 단순한 JSON 또는 HTML이 아니라 React에서 사용되는 데이터 형식이라고 한다.

```jsx
// NoteWithMarkdown.js: *before* Server Components

import marked from 'marked'; // 35.9K (11.2K gzipped)
import sanitizeHtml from 'sanitize-html'; // 206K (63.3K gzipped)

function NoteWithMarkdown({text}) {
  const html = sanitizeHtml(marked(text));
  return (/* render */);
}
```

> Third Party Package를 사용하면 필요하지 않은 코드가 들어가게 되어 번들 사이드가 커진다.

그러나 React의 새로운 Server Component는 Server Side Rendering을 보완하여 JavaScript 번들에 추가하지 않고도 중간 추상화 형식으로 렌더링할 수 있다고 한다.

server-tree와 client-tree state는 서로 유실없이 scaling up 할 수 있다. 이는 SSR에서는 검색 입력 텍스트, 포커스 및 선택 상태가 유지되지 않으나, Server Component에서는 가능하다는 것이다.

Server Component가 SSR을 대체할 수 없다. 그러나 같이 사용할 수 있게 만들어질 수 있으며, 시너지가 좋을 것으로 생각된다.

Facebook 팀에서 Server Component는를 적용해 본 결과. 번들 사이즈가 줄었다고 한다. 초기 측정 시 **-18%** 였으며, 최근에는 **-29%** 까지 되었다고 한다. 

```jsx
// NoteWithMarkdown.server.js - Server Component === zero bundle size

import marked from 'marked'; // zero bundle size
import sanitizeHtml from 'sanitize-html'; // zero bundle size

function NoteWithMarkdown({text}) {
  // same as before
}
```

> Server Component를 적용하게 되면 Third Party Package는 번들에 포함되지 않게 되며, Client에 내려주는 경우 필요한 정보만을 내리기 때문에 더욱 절약된다고 한다.

## SSR vs Server Component

- Server Component 코드가 Client에 전송되지 않는다. 반면 기존 SSR은 모든 Component 코드가 JS 번들로 Client에 전송된다.
- Server Component를 사용하면 Tree의 어디에서나 백엔드에 직접 접근할 수 있다. Next.js에서는 `getServerProps()` 내부의 백엔드에 접근할 수 있지만, 최상위 페이지 수준에서만 작동하므로 Component화가 매우 제한적이다.
- Server Component는 Tree 내부의 client state를 잃지 않고 다시 설정할 수 있다. 기본 전송이 HTML보다 풍부하여 내부 state(예: 검색 입력 텍스트, 포커스 및 선택)를 날려보내지 않고 서버 렌더링 부분(예: 검색 결과 목록)을 다시 가져올 수 있다.

## Auto Code Splitting

best practise 중 하나는 Code Splitting 해서 User가 필요한 코드를 필요할 때 가져올 수 있다. 기존에 우리가 사용하던 `React.lazy()`은 휴리스틱에 의존했었다.

```jsx
// PhotoRenderer.js (before Server Components)
import React from 'react';

// one of these will start loading *when rendered on the client*:
const OldPhotoRenderer = React.lazy(() => import('./OldPhotoRenderer.js'));
const NewPhotoRenderer = React.lazy(() => import('./NewPhotoRenderer.js'));

function Photo(props) {
  // Switch on feature flags, logged in/out, type of content, etc:
  if (FeatureFlags.useNewPhotoRenderer) {
    return <NewPhotoRenderer {...props} />; 
  } else {
    return <PhotoRenderer {...props} />;
  }
}
```

### code-splitting의 문제점

- 메타 프레임 워크 (예 : Next.js) 외부에서 최적화는 수동으로 처리하여 `import`문을 `Dynamic import`로 대체해야 하는 경우가 많다.
- 응용 프로그램이 사용자 환경에 영향을 미치는 Component를 로드하기 시작하면 지연될 수 있다.

Server Component는 Client Component는 모든 일반 `import`를 가능한 code-splitting 지점으로 처리하여 auto code-splitting을 해준다.

또한, 개발자는 서버에서 미리 사용할 Component를 선택할 수 있어, Client rendering에서 미리 가져올 수 있다.

```jsx
// PhotoRenderer.server.js - Server Component
import React from 'react';

// one of these will start loading *once rendered and streamed to the client*:
import OldPhotoRenderer from './OldPhotoRenderer.client.js';
import NewPhotoRenderer from './NewPhotoRenderer.client.js';

function Photo(props) {
  // Switch on feature flags, logged in/out, type of content, etc:
  if (FeatureFlags.useNewPhotoRenderer) {
    return <NewPhotoRenderer {...props} />;
  } else {
    return <PhotoRenderer {...props} />;
  }
}
```

## 마무리

간단하게 React 팀에서 하는 새로운 연구를 살펴보았다. 아직은 완성되지 않았지만, 연구가 새로운 생각을 만들어주었으면 앞으로가 기대된다.

이를 통해서 앞으로의 프론트엔드를 점지할 수는 없지만, 여러 방향 중 하나는 알아보는 시간이 되었다고 생각한다.

#### Reference

- [React Server Components](https://addyosmani.com/blog/react-server-components)
- [React 서버 컴포넌트](https://ui.toast.com/weekly-pick/ko_20210119)
- [RFC: React Server Components](https://github.com/reactjs/rfcs/blob/bf51f8755ddb38d92e23ad415fc4e3c02b95b331/text/0000-server-components.md#summary)
- [SSR vs Server Component](https://news.ycombinator.com/item?id=25499171)
