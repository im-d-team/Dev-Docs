# Storybook

프론트엔드에서 컴포넌트 단위로 개발을 진행하는 경우 해당 컴포넌트의 UI를 독립적으로 개발 및 테스트하며 작업하고자 한다면 어떻게 해야 할까? Storybook을 사용하면 원하는 방식으로 작업 할 수 있다.

Storybook은 프론트엔드 UI 컴포넌트 개발 도구이다. React, Vue, Angular 등 컴포넌트 단위로 개발을 하는 프레임워크(혹은 라이브러리)에 적용하여 사용해볼 수 있다. Storybook을 사용하면 UI 테스트를 손쉽게 할 수 있으므로 테스팅 툴로서 많이 사용되고 있다.

![Storybook 지원 범위](https://user-images.githubusercontent.com/16266103/103472343-e1651800-4dcf-11eb-959e-abd2411b3b5f.png)

> 출처: [Storybook 공식 홈페이지](https://storybook.js.org/)

React를 기준으로 CRA(Create React App)환경에서 Storybook 구조와 사용법에 관해서 설명해보도록 하겠다.

## Storybook 시작해보기

```bash
$ npx create-react-app <Project Directory>
```

Storybook을 시작하기에 앞서 CRA(Create React App)으로 새로운 React 프로젝트를 생성해보도록 하자.

```bash
$ cd <Project Directory>
$ npx sb init
```

앞서 생성해둔 React 프로젝트 디렉토리로 이동한 뒤 `npx sb init` 명령어를 사용하면 Storybook 실행 환경이 자동으로 설정된다.

![Storybook init 이후의 변화](https://user-images.githubusercontent.com/16266103/103472346-e3c77200-4dcf-11eb-8f47-471a73a8eee8.png)

> `npx sb init` 이후의 변화

명령어 실행 후에 `package.json`에 storybook 실행 및 빌드를 위한 `script`가 추가되었으며 `devDependencies`에 storybook 관련 의존성이 추가되었음을 확인할 수 있다. 또한 `.storybook` 폴더와 src폴더 내부에 `stories` 폴더가 생성되었다.

```bash
$ npm run storybook
```

Storybook 실행 환경 설정이 끝난 후  `npm run storybook` 명령어를 사용하면 Storybook을 실행해볼 수 있다.

![Storybook 실행 화면](https://user-images.githubusercontent.com/16266103/103472348-e629cc00-4dcf-11eb-9dc8-2ea40d230d4d.png)

> Storybook을  실행한 모습

Storybook을 실행해보면 기존 프로젝트와 독립된 상태로 빌드되며 별도의 웹서버를 통해 실행되게 된다. 따라서 Storybook을 독립적으로 빌드하여 배포하는 것도 가능하다. 이러한 특성으로 UI 컴포넌트 테스트 외에도 UI 컴포넌트 문서화, QA 등에 유용하게 사용할 수 있다.

```bash
$ npm run build-storybook
```

Storybook을 빌드하기 위해서는 `build-storybook` 명령어를 사용할 수 있다. 해당 명령어를 실행할 경우 빌드 결과물인 `storybook-static` 폴더가 프로젝트 최상단에 생성된다.

## Storybook 작성해보기

CRA(Creat React App)으로 React 프로젝트를 생성할 경우 자동으로 만들어지는 App.js를 Storybook에서 확인해볼 수 있도록 해보자.

Storybook에 각 컴포넌트를 연결하기 위해서는 `<filename>.stories.js` 와 같이 파일명과 확장자명 사이에 `stories` 문자열을 comma(`.`) 사이에 넣어주면 된다. Storybook 실행 환경 설정 시 만들어지는 `./src/stories` 폴더를 보면 `Button.stories.js`, `Header.stories.js`, `Page.stories.js` 이렇게 세 개의 예시를 확인해볼 수 있다.

이제 `./src/App.stories.js` 파일을 만들어보자

```javascript
/* App.stories.js */
import React from "react";

import App from "./App";

export default {
  title: "App",
  component: App,
};

const Template = () => <App />;

export const Default = Template.bind({});
```

내용을 위처럼 작성하고 저장 후 `npm run storybook` 으로 Storybook을 실행해보면 Storybook 사이드바에 App 항목이 생긴 것을 확인할 수 있다.

![App.stories.js 추가 후 Storybook 실행 화면](https://user-images.githubusercontent.com/16266103/103472349-e75af900-4dcf-11eb-93fc-3bd7bdd98a6b.png)

`export default { title: "App" ... };` 에서 title의 value에 해당하는 부분이 사이드바의 항목 이름이 된다.

만약 계층을 설정하여 비슷한 항목을 묶고 싶은 경우 `export default { title: "Main/App" ... };` 와 같이 slash 로 구분하여 설정할 수 있다. 해당 작업은 `start-storybook` 를 재실행해야 제대로 반영된다.

![Main 계층 추가 후 Storybook 실행 화면](https://user-images.githubusercontent.com/16266103/103472350-e7f38f80-4dcf-11eb-8e1b-661e0a4394cc.png)

이번에는 `App.js`에 Props를 전달할 수 있도록 수정하고 Props에 따른 Storybook 항목을 생성해보자.

```jsx
/* App.js */
import logo from "./logo.svg";
import "./App.css";

function App({ title = "Learn React" }) {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{title}</p>
      </header>
    </div>
  );
}

export default App;
```

`App.js` 에 `title` Props를 추가하고 기본값을 설정하였다.

```javascript
/* App.stories.js */
import React from "react";

import App from "./App";

export default {
  title: "Main/App",
  component: App,
};

const Template = (args) => <App {...args} />;

export const Default = Template.bind({});

export const Test = Template.bind({});
Test.args = {
  title: "Test",
};

export const Sentence = Template.bind({});
Sentence.args = {
  title: "Storybook 좋아요!"
};
```

`App.stories.js` 에 Props에 따라 각각 세 가지 경우에 대해 렌더링할 수 있도록 항목을 설정하였다.


![Props 추가 후 Storybook 실행 화면](https://user-images.githubusercontent.com/16266103/103472351-e88c2600-4dcf-11eb-86a3-85b38f016efe.png)


위 스크린샷과 같이 설정한 대로 각 Props를 설정한 항목들이 생성되는 것을 확인할 수 있다. 또한 하단에 있는 Add-on 사이드바의 Controls 탭에 Props에 대한 항목들이 생기게 된다. 각 Props 항목들을 변경할 경우 실시간으로 반영된다.


## 마무리

이번 글을 통해 Storybook이 무슨 목적을 위해 사용되는지, 어떻게 설정하는지에 대하여 설명해보았다. 나의 경우 Storybook이 생산성에 긍정적인 영향을 주어 최근 거의 모든 프로젝트마다 필수적으로 설정하여 사용하고 있다. 특히 팀원들(기획자, 개발자, 디자이너)간에 컴포넌트 개발 진행 상황을 손쉽게 공유할 수 있으므로 협업할 때 매우 유용하다.

아쉽게도 아직 설명하지 못한 Storybook의 강력한 기능들이 많다. Storybook의 심화적인 부분에 대해서는 다음에 기회가 되면 다뤄볼 예정이다.

#### References

- [Storybook 공식 문서](https://storybook.js.org/docs/react/get-started/introduction)
- [실용적인 프론트엔드 테스트 전략 (2)](https://meetup.toast.com/posts/178)
