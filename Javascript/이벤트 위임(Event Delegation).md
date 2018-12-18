# 이벤트 위임(Event Delegation)

**이벤트 위임**의 이해에는 **이벤트 버블링**과 **이벤트 캡쳐**에 대한 이해가 수반된다.

우선 그림으로 보면, 이벤트 버블링과 이벤트 캡쳐의 개념은 다음과 같다.

<br/>

![event_delegation](/assets/images/event_delegation.png)

<br/>

## 이벤트 버블링(Event Bubbling)

```html
<body>
   <div class="el1">
	<div class="el2">
	    <div class="el3">
	    </div>
	</div>
   </div>
</body>
```

```javascript
var divs = document.querySelectorAll('div');
divs.forEach(function(div) {
    div.addEventListener('click', bubbleEvent);
});

function bubbleEvent(e) {
    console.log(e.currentTarget.className);
}


/*
el3
el2
el1
*/
```

위의 코드에서는 class 명이 el3인 element(`<div class="el3"></div>`)을 클릭했을 때, **이벤트가 발생하는 요소인 `<div class="el3"></div>`에서 상위에 있는 요소까지 이벤트를 전파시키고 있다.**
이에 따라 결과 값은 el3만 나오는 것이 아닌 el1까지 콘솔에 출력되고 있다.

이처럼, 이벤트가 발생한 요소로부터 상위요소로 전파시키는 이벤트 전파 방식을 **이벤트 버블링**이라고 한다.

<br/>

## 이벤트 캡쳐(Event Capture)

```html
<body>
   <div class="el1">
       <div class="el2">
	  <div class="el3">
	  </div>
       </div>
   </div>
</body>
```

```javascript
var divs = document.querySelectorAll('div');
divs.forEach(function(div) {
    div.addEventListener('click', captureEvent, {
        capture : true
    });
});

function captureEvent(e) {
    console.log(e.currentTarget.className);
}

/*
el1
el2
el3
*/
```
이벤트 캡쳐(Event Capture)를 테스트하기 위해 `addEventListener()`함수에 `capture : true`라는 옵션을 추가했다.

위의 코드에서는 마찬가지로 class 명이 el3인 element(`<div class="el3"></div>`)을 클릭했을 때, 이벤트 버블링과 다르게 상위 요소에서 하위 요소로 즉, 이벤트 버블링과 반대 방향으로 이벤트를 전파하고 있다.

이에 따라 결과 값은 el3부터 el1까지 상위 요소부터 콘솔에 출력되고 있다.

이처럼, 이벤트가 발생했을 때, 상위 요소부터 하위요소로 전파시키는 이벤트 전파 방식을 **이벤트 캡쳐**라고 한다.

<br/>

## 이벤트 위임(Event Delegation)

**이벤트 위임**은 하위 요소 각각에 이벤트를 구현하지 않고 상위 요소에서 하위요소의 이벤트를 제어하는 방식이다.

```html
<body>
   <ul class="list">
      <li>
         <input type="checkbox" id="one"/>
      </li>
      <li>
         <input type="checkbox" id="two"/>
      </li>
   </ul> 
</body>

```
```javascript
var items = document.querySelectorAll('input');
items.forEach(function(item) {
    item.addEventListener('click', function(e) {
       console.log(e.currentTarget.id);
    });
});

```

위의 코드를 보면 각각의 `input` 요소를 클릭했을 때, 해당 요소의 id 값을 콘솔에 출력하도록 코드가 짜여있다.
하지만 이런 방식으로, 이벤트를 줄 요소를 for문을 돌려 이벤트를 구현할 시, **동적으로 추가되는 요소는 이벤트가 적용되지 않는다**는 치명적인 단점이 있다.

쉽게 말해, **위의 코드에서 li를 특정 버튼을 눌러 추가한 이후, 그 요소를 클릭하면 위의 js코드가 작동하지 않는다는 것**이다.
이러한 문제를 해결할 수 있는 방법이 **이벤트 위임(Event Delegation)을 적용**하는 것이다.

```javascript
/*
var items = document.querySelectorAll('input');
items.forEach(function(item) {
    item.addEventListener('click', function(e) {
       console.log(e.currentTarget.id);
    });
});
*/

//이벤트 위임 방식으로 코드 변경
var items = document.querySelector('.list');
items.addEventListener('click', function(e) {
    console.log(e.currentTarget.id);
});

```

위의 수정된 코드를 보면, 이벤트 줄 요소를 해당 요소가 아닌 그 상위 요소인 `<ul class="list"></ul>`을 지정하고 있다.
**이벤트를 줄 요소가 아닌 그 요소의 부모 요소를 지정하여 이벤트 리스너를 달고, 하위에서 발생한 클릭 이벤틀를 감지하도록 한다.**
이렇게 코드를 짜면, 동적으로 추가된 요소에 대해서도 이벤트가 동작하도록 할 수 있다.

<br/>

## 이벤트 위임(Event Delegation)의 장점

* 상위 요소에서 이벤트 리스너를 관리하기 때문에 하위 요소에는 자유롭게 요소를 추가할 수 있다. 즉, **동적인 element를 관리하기에 수월하다.**

* **이벤트 핸들러를 한 곳에서 관리하기 때문에 관리하기 수월하다.**

* 동적으로 추가되는 요소에 대한 이벤트가 없기 때문에 **메모리의 사용이 줄어든다.**

* 이벤트 핸들러가 줄어들기 때문에 **메모리 누수의 가능성도 줄어든다.**

<br/>

---

#### Reference

- [이벤트 버블링, 이벤트 캡처 그리고 이벤트 위임까지](https://joshua1988.github.io/web-development/javascript/event-propagation-delegation/)
- [Event delegation(이벤트 위임)](http://paiai.tistory.com/42)
