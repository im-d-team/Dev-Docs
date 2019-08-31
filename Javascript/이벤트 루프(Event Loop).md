
# 이벤트 루프(Event Loop)

<br/>

## 자바스크립트는 싱글쓰레드 기반이다.

자바스크립트를 공부해본 개발자라면 한 번쯤은 `자바스크립트는 싱글 쓰레드 기반의 언어다.`라는 말을 들어봤을 것이다. 하지만 우리는 실제 웹 애플리케이션에서 여러 개의 작업이 동시에 처리되는 것처럼(비동기적) 느끼는 일이 더 많다. 싱글 쓰레드 기반의 언어에서 즉, 한 번에 하나의 작업만 처리가능한 환경에서 어떻게 많은 작업이 동시에 처리되는 것처럼 느낄 수 있을까? 그 답은 **이벤트 루프**에 있다.

브라우저 환경을 간단히 표현하면 다음 이미지와 같다.

![eventLoop](/assets/images/event_loop.jpeg)

우선, 위의 그림에서 보여지는 각각에 대해서 살펴본 후, 전체적으로 이벤트 루프가 동작하는 방식을 살펴보도록 하자.

<br/>

## 자바스크립트 엔진

### Heap

동적으로 생성된 객체 인스턴스는 Heap에 할당이 된다. Heap은 메모리에서 대부분 구조화되지 않은 영역을 나타낸다.

### Call Stack(호출 스택)

호출 스택은 이름 그대로 `Stack`이며 LIFO구조를 갖는다. 함수를 호출하면(작업을 요청하면) 작업은 순차적으로 콜 스택에 쌓이고 실행된다. 자바스크립트 엔진은 하나의 스택만 가지고 있기 때문에 하나의 작업이 끝나기 전까지 다른 작업을 수행할 수 없다.

## Web APIs

흔히 WebAPI라 불리는 API들은 웹 브라우저에 내장되어 있다.

이것은 자바스크립트에 포함되는 것이 아니며 자바스크립트 언어를 사용하는데 있어 강력한 성능을 제공한다. 즉, 우리는 Web API의 내부는 조작할 수 없으며 호출만 가능하다.

### 콜백함수

자바스크립트의 싱글 쓰레드 구조에서 비동기성의 이벤트 기반 실행(대표적으로 `setTimeout`)이나 `ajax`요청이 필요하다면, 콜백 함수를 이용해 백그라운드로 보내고 큐를 통해 호출 스택으로 보내 해결하게 된다.

자바스크립트에서는 쓰레드를 통해 병렬처리가 안되기 때문에 콜백 함수의 사용은 필수불가결하게 되는 것이다.

<br/>

## Event Queue(이벤트 큐)

이벤트 큐는 말 그대로 콜백 함수들이 대기하는 `Queue`이며 `FIFO`의 구조를 갖는다. 이벤트 루프는 호출 스택이 비워질 때마다 큐에서 콜백 함수를 꺼내와서 실행하는 역할을 해 준다.

<br/>

## 이벤트 루프를 통한 비동기적 처리

이벤트 루프의 역할은 생각보다 단순한다. 호출 스택에 실행 중인 작업이 있는지, 이벤트 큐에 대기 중인 작업이 있는지 반복해서 확인한다. 만약 호출 스택이 비어있다면 이벤트 큐에 있는 작업을 호출 스택으로 옮긴다. 그리고 이 작업을 수행하는 것은 결국 호출 스택이다.

```js
function func1() {
  console.log('func1');
  func2();
}

function func2() {
  setTimeout(function () {
    console.log('func2');
  }, 0);

  func3();
}

function func3() {
  console.log('func3');
}

func1();
```

위 예제는 이벤트 루프를 설명할 때 가장 많이 사용되는 예제다. 만약, 이벤트 루프가 수행하는 과정이 없고 순차적으로 호출 스택에만 쌓이게 된다면 `func1`, `func2`, `func3`가 순차적으로 출력될 것이다. 하지만 실제로 위 코드를 실행해보면 `func1`, `func3`, `func2`가 순차적으로 출력되는 것을 볼 수 있을 것이다. 이런 결과가 나오는 이유는 위에서 설명한 것 처럼 이벤트 큐와 이벤트 루프를 통해 비동기 처리를 수행하는 `setTimeout`함수가 다른 함수들과 다르게 동작하기 때문이다.

아래 이미지는 위 코드가 실행되는 것을 과정을 보여준다.

<br/>

![event_loop_gif](/assets/images/event_loop_gif.gif)

> 이미지 출처: https://poiemaweb.com/js-event

<br/>

위 과정을 순차적으로 정리하면 다음과 같다.

> 1. `func1`함수가 호출되고 이는 호출 스택에 올라가고 `console.log('func1')`이 실행된다.
> 2. `func2`함수가 호출 스택에 올라가고 `setTimout`함수를 호출한다.
> 3. 호출된 `setTimeout`함수의 수행은 비동기적 처리를 수행하는 Web API에 넘어간다.
> 4. `func3`함수가 호출 스택에 올라가고 `console.log('func3')`이 실행된다.
> 5. Web API에서 `setTimout`함수에서 지정한 시간이 지나면 `callback`함수를 이벤트 큐로 넘긴다.
> 6. 작업이 끝난 `func3`, `func2`, `func1`은 순차적으로 호출 스택에서 제거된다.
> 7. 이벤트 루프는 호출 스택에 작업 중인 태스크가 없는 것을 확인하고 이벤트 큐에 있는 `callback`함수를 호출 스택으로 올린다.
> 8. 호출 스택에 올라간 `callback`함수가 실행되면서 `console.log('func3')`가 실행된다.

위 설명에서 주의 깊게 볼 것은 비동기 함수인 `setTimeout`함수에 세팅된 시간이 3초라면 `3초 후에 콜백 함수를 실행시켜라`가 아닌 `3초 후에 콜백 함수를 이벤트 큐에 넣어라`가 된다는 것이다. 

즉, `setTimeout` 함수는 n초 뒤에 콜백을 단순히 큐에 집어넣는게 끝이다. 코드를 간단히 보자면 아래와 같다.

```js
var eventLoop = [];
var event;

while (true) {
  // 틱!
  if (eventLoop.length > 0) {
    event = eventLoop.shift();
  }

  try {
    event(); // 호출스택으로 밀어넣는다
  } catch (err) {
    //...
  }
}
```

이 큐에 이미 대기번호가 100개가 있다면 `func3`는 101번째 대기표를 받게 될 것이다. 따라서 `setTimeout`은 지정한 시간동안은 실행되지 않는 것은 보장할 수 있지만 지정한 시간에 실행되는것은 보장할 수 없다.

```js
while (await messageQueue.nextMessage()) {
  let message = messageQueue.shift();
  message.run();
}
```

결론적으로, 이벤트 루프는 메시지 큐에 메시지가 더 있는지 확인하는 루프이다.

메시지 큐에 메시지가 있으면 메시지 큐에서 다음 메시지를 제거하고 그 메시지와 연관된 기능을 실행한다. 그렇지 않으면 새 메시지가 메시지 대기열에 추가될 때까지 대기를 한다. 이벤트 루프가 자바스크립트에게 비동기를 허용하는 기본 모델이다.

<br/>

## ES6이후의 변화된 비동기 처리와 이벤트 루프

기본적으로 이벤트 루프는 위에서 설명한 내용이 큰 틀이다. 큐와 스택을 감시하며 스택의 작업이 없으면 큐의 작업을 스택에 올린다. 다만, `ES6`이후에는 몇 가지 비동기적 작업을 수행하는 API들이 추가되었고 이에 따라 약간의 추가된 내용이 있다. 하지만, 전체적인 실행 방식은 동일하며 각각의 비동기 처리에 수행 순서에 초점을 두고 살펴보자.

기존에 살펴보았던 이벤트 큐(Event Queue)를 좀 더 자세히 나눠보면 다음과 같다.

1. `Task Queue` : 가장 사람들이 잘 알고 있는 비동기 작업인 `setTimeout`이 들어가는 큐
2. `Micro Task Queue` : ES6에서 추가된 `Promise`와 ES8의 `Async Await`(Async Await도 결국 Promise)
3. `AnimationFrame`: `requestAnimationFrame(rAF)`의 콜백 함수가 들어간다.

```js
console.log("script start");

setTimeout(function() {
  console.log("setTimeout");
}, 0);

Promise.resolve().then(function() {
  console.log("promise1");
}).then(function() {
  console.log("promise2");
});

requestAnimationFrame(function {
    console.log("requestAnimationFrame");
})
console.log("script end");
```

위의 코드를 실행하면 다음과 같으 결과가 출력된다.

```js
script start
script end
promise1
promise2
requestAnimationFrame
setTimeout
```

즉, 이벤트 큐에서 나눠지는 3가지 영역의 우선 순위는 다음과 같다.

> Micro Task Queue => AnimationFrame => Task Queue

기존에 이벤트 루프에 대해서 이해가 된 상태라면 이 내용은 크게 어렵지 않다. 쉽게 보면 비동기 작업을 처리하는 방법이 추가되었고 이에 따라 이벤트 큐에서 내부적으로 처리하는 로직에 약간의 변화가 생겼을 뿐이다. 결국, 정리하면 다음과 같다.

1. 비동기 작업으로 등록되는 작업은 `Task`와 `Micro Task`, 그리고 `AnimationFrame`으로 구분된다.
2. `Micro Task`는 `Task`보다 먼저 처리된다.
3. `Micro Task`가 처리된 이후 `requestAnimationFrame`이 호출되고 이후 브라우저 랜더링이 발생한다.

- [Task Queue와 Micro Task Queue의 처리 과정](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

<br/>

---

#### Reference

- [JavaScript Event Loop Explained]([https://medium.com/front-end-weekly/javascript-event-loop-explained-4cd26af121d4](https://medium.com/front-end-weekly/javascript-event-loop-explained-4cd26af121d4))
- [What is the Event Loop in Javascript]([https://www.wptutor.io/web/js/javascript-event-loop](https://www.wptutor.io/web/js/javascript-event-loop))
- [Understanding JS: The Event Loop]([https://hackernoon.com/understanding-js-the-event-loop-959beae3ac40](https://hackernoon.com/understanding-js-the-event-loop-959beae3ac40))
- [Event loop in javascript]([https://code.likeagirl.io/what-the-heck-is-event-loop-1e414fccef49](https://code.likeagirl.io/what-the-heck-is-event-loop-1e414fccef49))
- [The JavaScript Event Loop]([https://flaviocopes.com/javascript-event-loop/](https://flaviocopes.com/javascript-event-loop/))
- [Tasks, microtasks, queues and schedules]([https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/))
- [Poiemaweb - 자바스크립트/이벤트](https://poiemaweb.com/js-event)