# EventLoop_Advanced

## 브라우저에서 비동기 작업을 해보자

1. 자바스크립트 비동기 작업 3가지
2. `RequestAnimationFrame`에 대해서 자세히 알아보기
3. `MutationObserver, ResizeObserver, intersectionObserver`

<br/>

## 자바스크립트 비동기 작업 3가지(크롬 기준)

자바스크립트는 본래 싱글스레드를 기반으로 작동을 했었다. 그러나 구글에서 비동기 호출이라는 것을 선보이면서 더이상 웹에서는 라우터로 이동을 해야만 화면전환이 되는 등의 비동기 작업이 가능해졌다. 
<br/>

그 당시에 `Jquery` 로 보자면 `Ajax` 일 것이다. 그러만 구현부를 뜯어보지는 않았지만 `setTimeOut()` 이나 `xmlHttpRequest()` 로 구현이 되어있을 것으로 생각이 된다.
<br/>

이후에도 자바스크립트의 발전과 브라우저의 발전으로 다양한 방법으로 비동기를 할 수 있는 수단이 생겼다. 
<br/>

그 중에서 우리가 아는 것도 있을 것이라 생각한다.
<br/>

이번 내용은 정말 알아두면 정말 자신에게 좋을 만한 내용이다. 기존 내용 [Event loop](https://github.com/SeonHyungJo/FrontEnd-Dev/blob/master/Browser/EventLoop.md) 에서 나온 내용을 보면 브라우저에는 비동기를 지원하기 위한 Event loop가 있다고 되어있다. 여기 Event loop에 있는 Event queue를 자세히 살펴보게 되면 3가지로 나눌수 있게 된다.
<br/>

1. `setTimeOut(Task Queue)` : 가장 사람들이 잘 알고 있는 비동기 작업의 하나
2. `Promise(Micro Task Queue)` : ES8에 `Async Await`(Async Await도 결국 Promise이지만)
3. `AnimationFrame`

<br/>

크게는 이렇게 3개로 볼 수 있다. 어느 블로그를 가더라도 거의 위의 2가지를 설명해주고 있다.(다른 자료를 찾아보세요.)
<br/>

:point_right: 질문

- 위의 3가지의 우선순위는 어떻게 되나?

위에 보이듯이 우리가 잘 알고있는 `setTimeOut, setInterval`은 `Task Queue` 에 `Promise, async` 는 `Micro Task Queue` 에 들어가게 된다.
<br/>

그리고 다른 한가지 `AnimationFrame` 는 그냥 `AnimationFrame` 이라고 하자 하나의 `Web API` 이니까(브라우저별로 다름). 먼저 그렇다면 어떤것이 먼저 실행되고 끝나는지 예제를 보고 해보자.
<br/>

```js 
console.log('script start'); 

setTimeout(function() { 
  console.log('setTimeout'); 
}, 0); 
	
Promise.resolve()
  .then(function() { 
    console.log('promise1'); 
  })
  .then(function() { 
    console.log('promise2'); 
  }); 

console.log('script end');
```

<br/>

---
**Task**

---
**Micro Task**

---
**jsStack**

---
**log**

---

<br/>

### 참고 및 예제 문제

- [예제 문제](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules)

`setTimeOut` 하나의 `Run script` 가 마무리가 되어야 실행이될 수 있다. 프로미스는 하나의 `script`에서 실행된다. 
<br/>

이부분에서 순서의 차이가 일어난다.위의 결과는 맞춰보자
<br/>

다른 예제 2개도 풀어보기 [살펴보기]((https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules)) <= Event Click 문제 풀기
<br/>

## AnimationFrame(RequestAnimationFrame)_크롬 기준

1. [`RequestAnimationFrame`와 `requestIdleCallback` 에 대해서](https://www.slideshare.net/deview/133-vsync)
2.  예제 파일로 돌려보기(애니메이션 효과 => 물론 js)

<br/>

## MutationObserver, ResizeObserver, intersectionObserver

1. MutationObserver : https://codepen.io/seonhyungjo/pen/pQqOpv
2. InteractionObserver : https://codepen.io/seonhyungjo/pen/wQQYdz
3. ResizeObserver : https://codepen.io/seonhyungjo/pen/pQqOBy
   

### MutationObserver

돔 변형에 감지, 대응하기 위해 제공되는 `API`로 `Mutation Events`를 대체할 목적으로 설계됨

`MutationObserver`가 `MutationEvent`와 다른점

- 비동기
- 변형시마다 바로 실행 되는 것이 아니라 `Micro Task` 마지막에 배치로 DOM 변형들(Array 형태의 MutationRecord)을 콜백에 전달함

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