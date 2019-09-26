# Observer

<br/>

## 옵저버 패턴(Observer Pattern)

옵저버 패턴은 데이터를 기반으로 하는 인터페이스가 데이터의 변화를 감시하는 구조를 말한다. 특정 이벤트가 일어나고 해당 이벤트에 의해 특정 데이터가 변경되었다고 가정해보자. 해당 데이터와 관련된 모든 요소는 자동으로 변경이 되어야 한다. 

즉, 옵저버 패턴은 데이터를 보유한 주체를 여러 객체들이 감시하면서 데이터가 변화했을 때 각 객체에서 이를 감시하다가 알아서 각 객체들이 할 일을 각자 수행하는 구조다.

예시는 [다음](https://github.com/Im-D/Dev-Docs/blob/master/Language/Reactive.md#async)으로 대체한다.

자바스크립트에서 옵저버 패턴을 구현할 수 있도록 제공하는 API에는 크게 5가지가 있다.

- Mutation Observer
- Intersection Observer
- Resize Observer
- Performance Observer
- Reporting Observer

그렇다면 이제 각각을 살펴보도록 하자.

<br/>

## Mutation Observer

`Mutation Observer`을 가장 먼저 소개하는 이유는 다른 `Observer`들에 비해 가장 활용도가 높기 때문이다. ie11까지 지원하고 있다.

`Mutation Observer`는 객체의 속성 변화를 감지하며 객체의 속성이 변화될 때마다 특정 행위를 수행하도록 한다.

```js
let mo = new MutationObserver((mutations, thisMo) => {
  mutations.forEach(mutation => {
    // 개별 변형 대응
  });
});

let target = document.querySelector("body");
let options = {
 childList: true,
 attributes: true,
 subtree: true,
 characterData: true
};
 
mo.observe(target, options);
```

### MutationObserverInit

- childList : 타겟 노드의 자식 엘레멘트(텍스트 노드를 포함)들의 추가 혹은 제거를 관찰해야할 때 true
- attributes : 타겟 노드의 속성들의 변형들을 관찰해야할 때 true
- characterData : 타겟 노드의 데이터를 관찰해야할 때 true
- subtree : 타겟 노드부터 자손 노드들의 변형들까지 관찰해야할 때 true
- attributeOldValue : attributes이 true면서 타겟 노드의 변경된 속성들 이전 값을 기록해야할 때 true
- characterDataOldValue : characterData true면서 타겟 노드의 변경된 데이터 이전 값을 기록해야할 때 true
- attributeFilter : 모든 속성들을 관찰하고 싶지않을 때 관찰할 속성명의 Array

- [MutationObserver 예시](https://codepen.io/seonhyungjo/pen/pQqOpv)

<br/>

## Intersection Observer

`Intersection Observer`는 용어 뜻 그대로 그대로 특정 DOM 객체가 우리가 보는 화면 영역(viewport)과 교차 되는 것을 감시한다.

이를 이용해서 우리는 `scroll event`를 쓰지 않고 `Lazy Loading`을 구현할 수 있다. 예를 들어, 우리가 스크롤이 특정 위치에 도착했을 때 이벤트를 일으켜 해당 부분의 데이터를 가져와 볼 수 있다면 어떨까? 그렇다면 초기에 모든 데이터를 가져올 필요가 없기 때문에 초기 로딩 속도를 높일 수 있다.

- [IntersectionObserver 예시](https://codepen.io/seonhyungjo/pen/wQQYdz)

<br/>

## Resize Observer

`Resize Observer` 또한 용어 그대로의 역할을 수행한다. DOM 객체의 크기 변화를 감시한다.

예를 들어, viewport의 크기 변화에 따라 다른 크기의 이미지를 보여줘야 한다고 해보자. 이 때 viewport의 크기에 따라 콜백 함수를 활용하여 해당 이미지를 로드해서 보여주면 된다. 다만, 이는 최신 크롬 환경에서만 동작하기 떄문에 polyfill을 이용하여 구현해야한다.

- [ResizeObserver 예시](https://alligator.io/js/resize-observer/#simple-demo)

<br/>

## Performance Observer

`Performance Observer`는 FCP(First Contentful Paint), FMP(First Meaningful Paint) 등을 측정할 수 있게 해준다.

- FCP: 텍스트나 이미지가 출력되기 시작하는 순간이다.
- FMP: 사용자에게 의미 있는 콘텐츠가 그려지기 시작하는 첫 순간이다. 콘텐츠를 노출하는데 필요한 CSS, 자바스크립트 로드가 시작되고 스타일이 적용되어 주요 콘텐츠를 읽을 수 있다.

단, 해당 옵저버는 최신 기능이다보니 polyfill도 완벽하게 적용되어있지 않다. 또 다른 퍼포먼스 측정 툴에는 [Perfume.js](https://github.com/Zizzamia/perfume.js)가 있다.

<br/>

## Reporting Observer

`Reporting Observer`는 실험적인 기능이다보니 사실상 지원하는 브라우저가 거의 없다.

`Reporting Observer`는 사용자의 window 객체를 조회해서 정책적으로 너무 오래된 메서드가 쓰이면 경고를 주는 기능을 한다.

- [MDN Docs - Reporting Observer](https://developer.mozilla.org/en-US/docs/Web/API/ReportingObserver)

<br/>

---

#### Reference

- [Huskyhoochu 기술 블로그 - JS: The Observers](https://www.huskyhoochu.com/js-observers/)
- [alligator.io - resize observer](https://alligator.io/js/resize-observer/#simple-demo)
- [레진 기술블로그 - intersection observer](https://tech.lezhin.com/2017/07/13/intersectionobserver-overview)
- [Toast UI FE Guide - 성능 최적화](https://ui.toast.com/fe-guide/ko_PERFORMANCE/)
