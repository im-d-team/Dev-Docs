# window.history

**SPA(Single Page Application)** 사이트를 만들어 보신 분들은 한 번쯤 생각하게 되는 고민이 있다. 어떻게 앞으로 가기, 뒤로 가기, 새로 고침을 구현해야 할까? 라는 고민이다.

기존의 사이트들은 페이지 이동 Link를 누르게 되면 해당 주소에 맞는 Resource를 내려받아 화면에 보여주면서 화면이 전환되는 형태였다면, SPA는 1개의 `html` 파일에서 JavaScript를 사용하여 컴포넌트를 붙였다 떼었다를 한다. 여러 페이지로 구성된 사이트처럼 보이도록 앞으로 가기 뒤로 가기가 불가능하다.

만약 앞으로 가기, 뒤로 가기, 새로 고침이 구현되지 않은 상태에서 브라우저에서 지원하는 앞으로 가기, 뒤로 가기 기능을 이용한다고 하자.
같은 도메인에서 이동한 적이 없으니 이전 또는 이후에 방문한 도메인으로 이동을 하게 된다.
새로 고침을 하면 현재 사이트의 메인페이지로 이동하게 될 것이다.

대개 개발자분들의 해결방법은 라이브러리를 사용해서 구현한다. Single Page이지만 Page가 여러 개인듯한 모양을 만들어준다. 하물며 앞으로 가기, 뒤로 가기, 새로 고침도 잘된다. 
그러나 우리가 알고 있어야 하는 부분은 단순하게 이 라이브러리를 사용하니까 잘된다가 아니라 **어떻게 이렇게 되는 거지?** 하는 궁금증이 우선 되어야 한다.

우리는 React를 기준으로 어떻게 앞으로 가기, 뒤로 가기, 새로 고침이 가능한지를 살펴보자.
</br>

## react-router-dom

React로 사이트를 만들 때 Router가 필요하다면 react-route-dom을 사용할 것이다. 이 라이브러리를 사용함으로써 간편하게 주소에 따라 다른 페이지가 보이고, 이동이 가능하며 뒤로 가기도 가능하다.
react-router-dom은 reactDOM을 위해 존재하는 Router 라이브러리로 싱글 페이지를 여러 페이지로 이동하는 듯한 느낌을 준다. 

react-router-dom의 상위 프로젝트로 react-router라는 프로젝트가 존재한다. 

해당 패키지들을 살펴보면

- [react-router Package](https://github.com/ReactTraining/react-router/tree/master/packages)

DOM과 Native라고 적혀있는 폴더를 볼 수 있다. 이를 통해 react-router라는 공통의 패키지가 존재하며 하위의 패키지로 DOM과 Native를 위한 패키지가 있구나라는 것을 알 수 있다. 이제 우리는 웹을 개발할 때 사용하는 react-router-dom을 열어보자

react-router-dom 패키지의 *modules/index.js*를 살펴보게 되면

- [modules/index.js](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/modules/index.js)

React에서 react-router-dom을 사용하면서 보았던 `BrowserRouter`, `Link`, `NavLink`가 있는 것을 확인할 수 있다. 그중에서 우리가 기본으로 사용하는 `BrowserRouter.js` 파일을 열어보자

```js
import React from "react";
import { Router } from "react-router";
import { createBrowserHistory as createHistory } from "history";
import PropTypes from "prop-types";
import warning from "tiny-warning";

/**
 * The public API for a <Router> that uses HTML5 history.
 */
class BrowserRouter extends React.Component {
  history = createHistory(this.props);

  render() {
    return <Router history={this.history} children={this.props.children} />;
  }
}

if (__DEV__) {
  BrowserRouter.propTypes = {
    basename: PropTypes.string,
    children: PropTypes.node,
    forceRefresh: PropTypes.bool,
    getUserConfirmation: PropTypes.func,
    keyLength: PropTypes.number
  };

  BrowserRouter.prototype.componentDidMount = function() {
    warning(
      !this.props.history,
      "<BrowserRouter> ignores the history prop. To use a custom history, " +
        "use `import { Router }` instead of `import { BrowserRouter as Router }`."
    );
  };
}

export default BrowserRouter;
```

`BrowserRouter.js` 파일 안쪽을 보게되면 생각보다 심플하게 36라인으로 구성되어있는 것을 볼 수 있다. 그 중에서도 개발모드를 제외하면 10라인도 되지 않는다.

```js
import React from "react";
import { Router } from "react-router";
import { createBrowserHistory as createHistory } from "history";

/**
 * The public API for a <Router> that uses HTML5 history.
 */
class BrowserRouter extends React.Component {
  history = createHistory(this.props);

  render() {
    return <Router history={this.history} children={this.props.children} />;
  }
}

export default BrowserRouter;
```

본론으로 돌아와 우리가 보아야 하는 내용은 BrowserRouter class에서 `createHistory()`라는 함수이다. 이 함수는 **history** 라이브러리를 통해서 가져왔으며, history를 만들고 그것을 라우터라는 컴포넌트에 props로 넘겨주고 있다.

위에서 주석에서도 보이듯이 

```text
The public API for a <Router> that uses HTML5 history.
```

HTML5 history를 사용하고 있다고 알려주고 있다.
</br>

### [history 라이브러리](https://github.com/ReactTraining/history)

history 라이브러리의 설명을 보면 이렇게 적혀있다.

- `createBrowserHistory` is for use in modern web browsers that support the HTML5 history API (see cross-browser compatibility)
- `createMemoryHistory` is used as a reference implementation and may also be used in non-DOM environments, like React Native or tests
- `createHashHistory` is for use in legacy web browsers

`createBrowserHistory`는 HTML5 history API를 제공하는 모던 웹 브라우저에서 사용,
`createMemoryHistory`는 DOM 환경이 아닌 Native나 tests에서 사용하는 것,
`createHashHistory`는 예전 웹 브라우저를 위해서 사용되는 것이라고 설명되어있다. 

위에서 react-router-dom에서 보았던 `createBrowserHistory` 함수가 있는 것을 확인했다. 
</br>

#### createBrowserHistory.js

[createBrowserHistory 확인하기](https://github.com/ReactTraining/history/blob/763fc13bc8a52aff91d9594a7c1d944faa97961a/modules/createBrowserHistory.js#L38)

위의 코드 중 일부분을 가져오면

```js
/**
 * Creates a history object that uses the HTML5 history API including
 * pushState, replaceState, and the popstate event.
 */
function createBrowserHistory(props = {}) {
  const globalHistory = window.history;
  const canUseHistory = supportsHistory();
  const needsHashChangeListener = !supportsPopStateOnHashChange();
  ...
```

`const globalHistory = window.history;`에서 보이듯이 `window.history`라는 HTML5 history API를 사용하고 있는 것을 볼 수 있다.

추가적으로 뒤에서 설명할 HTML5 history API 몇가지가 사용되는 것을 확인할 수 있다.

```js
function setState(nextState) {
    Object.assign(history, nextState);
    history.length = globalHistory.length;
    transitionManager.notifyListeners(history.location, history.action);
  }

---

globalHistory.pushState({ key, state }, null, href);

---

globalHistory.replaceState({ key, state }, null, href);

---

function go(n) {
  globalHistory.go(n);
}
```

</br>

## HTML5 history API

> [MDN - History](https://developer.mozilla.org/ko/docs/Web/API/History)

JavaScript에는 자체적으로 history를 관리를 할 수 있는 객체이다.
`window.history` 속성은 읽기 전용이며 `History object`를 반환한다. 또한 브라우저 세션 히스토리(현재 페이지가 있는 탭 또는 브라우저에서 방문한 페이지)를 조작하기 위한 인터페이스를 제공한다. 이렇게 조작이 가능하여 SPA에서도 페이지가 이동한 것과 같은 기능을 만들 수 있는 것이다.
</br>

### Syntax

```js
const historyObj = window.history;
```

최상위 페이지의 경우 `History object`를 통해 접근할 수 있는 세션 히스토리 목록은 브라우저의 뒤로 가기, 앞으로 가기 버튼 옆의 드롭다운 목록에서 볼 수 있다. (크롬의 경우 버튼 우클릭)
</br>

### History Interface

History 인터페이스는 브라우저의 세션 히스토리를 조작할 수 있게 해준다. 세션 히스토리에는 탭에서 방문했던 페이지들이나, 현재 페이지가 로딩된 프레임들이 포함되어있다.

History 인터페이스는 어떤 속성도 상속받지 않는다.
</br>

### Properties

- `History.length` : 세션 히스토리의 현재 로딩된 페이지를 포함한 요소 숫자들을(정수 값) 반환한다. 예를 들면, 새로운 탭의 로딩된 페이지는 1을 반환합니다.
- `History.scrollRestoration` : 웹 어플리케이션에서 히스토리 네비게이션의 default 스크롤 복원 기능을 명시적으로 선언합니다.이 속성은 자동 또는 수동이 가능하다.
- `History.state` : 히스토리 스택의 가장 상위에 있는 상태 값을 반환합니다. popstate 이벤트 콜없이 바로 상태를 볼 수 있는 방법입니다.

</br>

### Methods

#### History 내 이동

1. 앞으로 가기와 뒤로가기
- `History.back()` : 세션히스토리의 이전 페이지로 이동한다. 브라우저 백 버튼을 눌렀을 때와 똑같은 효과, `history.go(-1)` 와 동등한 기능이다.
- `History.forward()` : 세션히스토리의 다음 페이지로 이동한다. 브라우저의 앞으로가기 버튼을 눌렀을 때와 같은 효과, `history.go(1)`와 동등한 기능이다.

2. 히스토리에서 특정 위치로 가기
- `History.go()` : 세션히스토리의 특정 페이지를 로딩한다, 현재 페이지의 상대적인 위치에 따라 페이지 순서가 정의된다. 예를 들어, -1은 이전 페이지, 1은 다음 페이지. 변수 값을 넘기지 않거나, 0의 값을 가진 go() 메서드는 현재 페이지를 새로고침을 한다.​​​​​​​
</br>

#### History Entry 추가 및 변경

HTML5는 사용자가 History Entry를 추가하거나 변경할 수 있는 `history.pushState()`와 `history.replaceState()` 메서드를 제공한다. 이 메서드들은 `window.onpopstate` 이벤트와 연동하여 동작한다.

- `History.pushState()`
- `History.replaceState()`

</br>

#### pushState() 메서드

```js
const stateObj = {foo : "foo"};
history.pushState(state, "page1", "page1.html");
```

`pushState()`는 세 개의 변수를 가진다. state 객체, title(예약되어 있으나 내부 역할 없음), 옵션인 URL. 이 변수들에 대해 상세히 알아보면

- state 객체 : `pushState()`에 의해 생성된 새로운 history를 포함하고 있는 자바스크립트 객체이다. 사용자가 새로운 상태로 이동할 때 마다, popstate 이벤트가 발생하고, 이 이벤트의 state 속성은 히스토리의 state객체 사본을 가진다.

- title : Firefox는 현재 이 변수를 무시한다. 나중에 사용될 수도 있기 때문에 빈 문자열을 지정해 놓는 것은 안전하다고 한다. 빈 문자열 대신 이동하고자 하는 state마다 짧은 명칭을 부여하는 것도 좋다.

- URL : 새로운 히스토리 엔트리의 URL을 지정한다. `pushState()` 호출 이후에는 브라우저가 이 URL을 로딩하지 않는 것을 명심해야 한다. 하지만 아마 나중에도 사용될 수도 있다. 새롭게 할당되는 URL은 현재의 URL에 기준하기 때문에, 절대 경로일 필요는 없다. 새로운 URL은 기존의 URL을 기준으로 해석된다. 새로운 URL은 현재 URL에서 유추될 수 없다면 `pushState()`는 예외가 발생한다. 이 변수는 선택 사항으로, 명시되지 않는다면, 현재 URL로 지정된다.

</br>

#### replaceState() 메서드

```js
const stateObj = {foo : "bar"};
history.pushState(stateObj, "page2", "page2.html");
```

`history.replaceState()`는 `history.pushState()`와 동일하게 동작한다. `replaceState()`는 새로운 히스토리를 하나 생성하는 대신에 현재의 히스토리 엔트리를 변경한다.

`replaceState()` 는 state 객체나 사용자의 동작에 따라 현재 히스토리 엔트리의 URL을 업데이트 하려고 할 때 유용하다.
</br>

#### popstate 이벤트

popstate 이벤트는 현재 활성화된 히스토리 엔트리에 변화가 있을 때 마다 실행된다. 만약 pushState 함수나 replaceState 함수에 의해 현재 활성화되어 있는 히스토리 엔트리가 조작 및 변경된다면, popstate 이벤트의 state 속성은 히스토리 항의 state 객체의 사본이 된다.
</br>

#### 현재 상태 읽기

페이지가 로딩이 되었을 때, state 객체는 아마 null이 아닐 수 있다. 이것은, 예를 들어, 페이지가 `pushState()`나 `replaceState()`를 이용하여 state 객체를 설정한 상태에서 브라우저를 재시작했을 때 가능하다. 페이지를 다시 불렀을 때, onload 이벤트가 페이지에 들어가고, popstate는 호출되지 않는다. 그러나, `history.state` 속성에 접근하면, state 객체는 마치 popstate 발생시에 얻었을 객체와 동일하게 얻는다.

popstate 이벤트를 기다릴 필요 없이, 아래와 같은 명령어를 이용하여 현재 히스토리 엔트리의 상태에 접근할 수 있다.

```js
const currentState = history.state;
```

</br>

#### Reference

- [MDN - History_API](https://developer.mozilla.org/ko/docs/Web/API/History_API)
- [MDN - History](https://developer.mozilla.org/ko/docs/Web/API/History)
- [MDN - onpopstate](https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate)
