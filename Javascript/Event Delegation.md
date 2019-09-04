# Event Delegation

이벤트 위임의 개념에 앞서, 가장 먼저 이해해야 하는 상황은 다음과 같다.

```html
<html>
  <body>
    <div id="1">
      <div id="2">
        <div id="3"></div>
      </div>
    </div>
  </body>
</html>
```

이러한 구조일 때 id가 3인 div를 클릭했다고 하자. `div#3(이하 div3)`은 html > body > div1 > div2 하위에 있다.

그럼 3을 누르면 html body div1 div2 div3을 모두 누른 셈이다. 하위 노드지만 사실 겹쳐있기 때문이다. 어떤 것을 눌렀다고 정의하기 어렵다.

더 나아가 클릭 이벤트는 저 5개의 태그 중 어디에서 발생하는 것이 맞는 걸까?

## 이벤트 등록

```html
<body>
  <ul>
    <li><span>11111</span></li>
    <li><span>22222</span></li>
    <li><span>33333</span></li>
    <li><span>44444</span></li>
  </ul>
</body>
```

```javascript
const lists = document.querySelectorAll('ul > li');

for (let i = 0; i < lists.length; i++) {
  lists[i].addEventListener('click', function(evt) {
    const target = evt.target;
    target.innerHTML += 'clicked';
  });
}
```

위 코드는 li를 클릭하면 clicked를 추가하는 코드다. 의도대로 잘 작동한다.
그런데 이 경우 브라우저는 이벤트 리스너를 4개를 기억하고 있다. li가 훨씬 많다면 비효율적일 것이다.

또 새로운 li가 동적으로 추가된다면, event가 추가되지 않는다. 이 부분은 잠재적인 버그를 가진 코드가 될 것이다.

```javascript
const ul = document.querySelector('ul');
ul.addEventListener('click', function(evt) {
  console.log(evt.currentTarget, evt.target);
});
```

위와 같이 코드를 작성하고 span태그를 클릭하면 어떨까?

결과 역시 제대로 작동한다.

이벤트를 줄 요소가 아닌 그 요소의 **부모 요소**를 지정하여 이벤트 리스너를 달고, 하위에서 발생한 클릭 이벤트를 감지하도록 했다.

즉 이벤트를 대상 요소에 직접 주는 것이 아니라 상위의 요소에 위임시켰다. 이를 **이벤트 위임**이라고 한다.

li와 span은 ul의 하위에 속하기 때문에 ul의 이벤트에도 반응하게 되어있다.

실제로 클릭한 곳은 span이지만 span > li > ul 순으로 찾아 올라가며 이벤트리스너가 있는지 찾아갔다.

이를 이벤트 버블링이라고 한다.

## Event Bubbling, EventCapturing

![event_delegation](https://user-images.githubusercontent.com/24724691/63207547-0c7b9880-c103-11e9-8548-efdc34c9c378.png)

![event_diagram](https://user-images.githubusercontent.com/24724691/63207546-0c7b9880-c103-11e9-9c5a-314bd828fae4.png)

### Event Bubbling

방금의 예시가 버블링이다.

즉 span을 눌렀을 때 span, li, ul이 동시에 모두 눌린 것으로 간주하지만 발생하는 순서가 하위 > 상위이다.

이벤트가 발생했을 때, 하위 요소부터 상위 요소로 전파하는 이벤트 전파 방식을 **event bubbling** 이라고 한다.

### Event Capturing

```javascript
const ul = document.querySelector('ul');
const liAll = document.querySelectorAll('li');
const spanAll = document.querySelectorAll('span');
const cb = e => console.log(`나는 ${e.currentTarget.tagName}`);

ul.addEventListener('click', e => cb(e), { capture: true });
liAll.forEach(li => li.addEventListener('click', e => cb(e), { capture: true }));
spanAll.forEach(span => span.addEventListener('click', e => cb(e), { capture: true }));

/*
나는 UL
나는 LI
나는 SPAN
*/
```

Event Capture를 테스트하기 위해 `addEventListener()`함수에 `capture : true`라는 옵션을 추가했다.

결과값을 보듯 아까와는 반대로 ul > li > span의 순서로 진행된다.

이벤트가 발생했을 때, 상위 요소부터 하위요소로 전파시키는 이벤트 전파 방식을 **event capturing** 이라고 한다.

## target과 currentTarget

추가로 위에서 사용된 코드를 다시 보자.

```javascript
ul.addEventListener('click', function(evt) {
  console.log(evt.currentTarget, evt.target);
});
```

이러한 코드가 있다. currentTarget과 target은 조금 다르다. currentTarget은 event가 바인딩 된 요소, 즉 이벤트 리스너가 있는 곳을 가리킨다.

target은 event가 발생한 끝 지점, 즉 클릭한 곳을 가리킨다.

두 가지의 사용 용도가 다르니 주의하자.

## Event Delegation의 장점

- 상위 요소에서 이벤트 리스너를 관리하기 때문에 하위 요소에는 자유롭게 요소를 추가할 수 있다. 즉, **동적인 element를 관리하기에 수월하다.**

- **이벤트 핸들러를 한 곳에서 관리하기 때문에 관리하기 수월하다.**

- 동적으로 추가되는 요소에 대한 이벤트가 없기 때문에 **메모리의 사용이 줄어든다.**

- 이벤트 핸들러가 줄어들기 때문에 **메모리 누수의 가능성도 줄어든다.**

## bubbling이 안되는 event

보통의 경우 bubbling이 기본으로 적용된다. 그런데 아닌 이벤트들도 존재한다.

focus, blur, load, scroll등의 몇몇 이벤트들은 bubbling이나 capturing이 되지 않는다.

![focusEvent.png](https://user-images.githubusercontent.com/24724691/63207869-967a3000-c108-11e9-9ee9-94ba1d1bb589.PNG)

위는 focus event의 mdn 설명이며 bubble이 안되는 것을 볼 수 있다.

관련 부분은 [Wiki DOM events](https://en.wikipedia.org/wiki/DOM_events#Events)같은 문서에서 한 눈에 확인할 수 있다.

---

### Reference

- [이벤트 버블링, 이벤트 캡처 그리고 이벤트 위임까지](https://joshua1988.github.io/web-development/javascript/event-propagation-delegation/)
- [Event delegation(이벤트 위임)](http://paiai.tistory.com/42)
- [DOM events](https://en.wikipedia.org/wiki/DOM_events#Events)
- [Element: focus event MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/focus_event)
