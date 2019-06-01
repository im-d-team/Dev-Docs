# 웹 컴포넌트(Web Component)

HTML에서 제공하는 엘리먼트들은 브라우저와 운영체제에 따라 다르게 보이는 경우가 많다. 이를 해결하기 위해서는 외부 JS 라이브러리를 사용하는 것이 일반적인데 이 경우 문제는 다음과 같다.

- JS 파일과 CSS 파일을 포함해야 하고 권장하는 마크업 구조를 따라가야 하기 때문에 **개발자의 능력에 따라 사용하기 어려울 수 있다.**
- **라이브러리의 크기에 따라 실행 속도가 느려질 수 있다.**

위와 같은 문제를 해결하기 위해 W3C에서 만든 것이 웹 컴포넌트(Web Component)다.

웹 컴포넌트 명세에는 HTML템플릿(Template), HTML imports, 커스텀 엘리먼트(Custom Element), 섀도우 돔(Shadow DOM) 4가지가 있다.

<br/>

## HTML템플릿(Template)

일반적인 JavaScript 컴포넌트는 문자열 형태로 템플릿을 가지거나 사전에 특정 엘리먼트의 구조를 만드는 형식으로 많이 사용한다.

웹 컴포넌트도 동일하게 특정 엘리먼트의 구조가 필요하며 이 때 사용하는 것이 템플릿(Template)이다.

```js
document.querySelect('#target').innerHTML = [
    '<div class="wrapper">',
    '<div class="content">',
    '<div> helloWorld </div>',
    '</div>',
    '</div>'
].join('');
```

위의 코드는 `innerHTML`을 사용하여 직관적으로 동적으로 `HTML`엘리먼트를 추가하는 코드다. 위와 같이 작성하면 좀 더 직관적으로 코드를 작성할 수 다. 하지만 반복적인 엘리먼트나 조건에 따라 다른 템플릿을 구현할 때 혹은 내부 엘리먼트에 접근할 때 불편한 점이 있다.

```html
<template>
    <style>
        /* styleSheet */
    </style>
    <div class="wrapper">
        <div class="content">
            <div> helloWorld </div>
        </div>
    </div>
</template> 
```  

`<template>` 태그에 있는 엘리먼트는 DOM의 구조를 가지고 있지만 렌더링되지 않으며 이미지와 같은 리소스 파일을 내려받지 않는다. 즉, `<template`태그 내의 엘리먼트들은 사용되기 전까지는 파싱은 되나 렌더링되지 않는다. 활성화 되지 않은 하나의 **DOM chunk**라고 볼 수 있다.

HTML템플릿(Template)은 웹 컴포넌트의 다른 명세 중 하나인 섀도우 돔(Shadow DOM)과 함께 사용했을 때 훨씬 더 유용하게 사용가능하다.

<br/>

## HTML imports

HTML템플릿은 HTML로 작성되어야하기 때문에 컴포넌트를 제어하는 자바스크립트(컨트롤러)와 뷰에 해당하는 HTML이 분리되어야 한다. 컴포넌트를 분리했을 때, 재사용이 가능해야한다. HTML템플릿과 커스텀 엘리먼트로 구성된 컴포넌트를 재사용하기 위해서는 각각 HTML과 JS 파일 2개가 필요하다. 이러한 점은 하나의 모듈로서 컴포넌트로 만들기에 불편하다. 이를 해결한 것이 **HTML imports**다.

HTML 템플릿이 새로운 템플릿을 만들게 해준다면, HTML imports는 다른 HTML 파일에서 템플릿을 가져오게 해준다.

HTML/CSS/JS를 묶음 형태로 사용하며 단일 URL로 호출한다.
다른 도메인의 리소스를 로딩하기 위해서 `CORS` 활성화가 필요하다. 

```html
<!-- main page -->
<head>
    <link rel="import" href="bootstrap.html">
</head>
```

<br/>

## 커스텀 엘리먼트(Custom Element)

커스텀 엘리먼트는 개발자가 새로운 엘리먼트를 만드는 것과 같다. 커스텀 태그를 통해 엘리먼트를 생성할 수 있도록 해주며 엘리먼트를 상속하고 있어 `createElement` 메서드나 생성자로 만들 수 있다.

```js
class ExpandingList extends HTMLElement {
  constructor() {
    super();

    //엘리먼트 기능 작성
    ...
  }
}
```

```js
customElements.define('expanding-list', ExpandingList, { extends: "ul" });
```

위 코드는 커스텀 엘리먼트를 정의하는 방법이다. `expanding-list`라는 엘리먼트를 만들고 `ExpandingList`라는 클래스 오브젝트를 사용하며 `ul`엘리먼트를 상속받는다는 뜻이다.

커스텀 엘리먼트의 클래스 오브젝트는 ES6의 `class`문법을 주로 사용한다.

HTML표준에 정의되어 있지 않으면서도 커스텀 엘리먼트 이름 규칙에 맞지 않는 태그들은 HTMLUnknownElement인터페이스가 할당된다.

결과적으로 다음과 같이 사용할 것이다.

```html
<expanding-list>

  ...

</expanding-list>
```

<br/>

## 섀도우 돔(Shadow DOM)

섀도우 DOM은 DOM의 구조를 가지고 있으나 외부에는 노출되지 않은 DOM을 말하며 DOM의 구조를 캡슐화할 때 사용한다.

Web Component에서는 섀도우 DOM을 이용하여 커스텀 엘리먼트를 설명할 때 말했던 클래스 오브젝트내의 기능을 정의한다.

```js
class ExpandingList extends HTMLElement {
  constructor() {
    super();

    // mode 속성이 open이면 외부에서 shadow DOM에서 접근 가능하며 closed라면 외부에서 접근이 불가능하다.
    const shadowRoot = this.attachShadow({mode: 'open'});
    
    shadowRoot.innerHTML = `
        ...
    `;
  }
}
```

기존의 컴포넌트는 일반적인 DOM 트리가 렌더링된 후 DOM 트리 전체를 변경하기 때문에 reflow와 repaint와 같은 리렌더링에 따르는 비용이 발생한다. 하지만 섀도우 DOM을 사용하면 섀도우 호스트 즉, `expanding-list`를 만나는 순간 렌더링이 되기 때문에 리렌더링에 따른 비용을 줄일 수 있다.

<br/>

위에서 말했던 Web Component 명세를 적용하여 엘리먼트를 만들면 다음과 같다.

```html
<!-- nameTagTemplate.html -->
<!-- HTMLTemplate을 이용하여 템플릿 엘리먼트 구현 -->
<template id="nameTagTemplate">
<style>
    .outer {
      border: 2px solid brown;
      background: red;
    }
    .name {
      color: black;
    }
</style>
<div class="outer">
  <div class="name">
    Bob
  </div>
</div>
</template>

<script>
class NameTag extends HTMLElement {
    constructor() {
        super();
        // Shadow DOM에 NameTag Template 추가
        const shadowRoot = this.attachShadow({mode: 'open'});
        const template = document.querySelector('#nameTagTemplate');
        const clone = document.importNode(template.content, true);
        shadowRoot.appendChild(clone);
    }
}
// name-tag라는 커스텀 엘리먼트 정의
customElements.define('name-tag', NameTag);
</script>
```

```html
<!DOCTYPE html>
<html lang="ko-KR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>웹 컴포넌트</title>

    <!-- HTML imports -->
    <link rel="import" href="./nameTagTemplate.html">

  </head>
  <body>

    <!-- 커스텀 엘리먼트  -->
    <name-tag></name-tag>

  </body>
</html>
```

---

#### Reference

- [kyu.io - 웹 컴포넌트(4) — 템플릿 엘리먼트(Template Element)와 HTML Imports](https://kyu.io/%EC%9B%B9-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B84%E2%80%8A-%E2%80%8Atemplate-element-html-imports/)
- [yamoo9/WebComponent](https://github.com/yamoo9/WebComponent)
- [Naver D2 - 웹 컴포넌트](https://d2.naver.com/helloworld/188655)
- [Custom Elements](https://www.html5rocks.com/en/tutorials/webcomponents/customelements/)
