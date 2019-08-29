# Event Loop

자바스크립트는 싱글 쓰레드이다. 그래서 비동기를 처리하기 위해서는 다른 누군가의 도움이 필요하다. 

우리가 자바스크립트를 기본적으로 브라우저에서 사용을 한다. 그렇다면 당연하게 자바스크립트의 한계를 보완해주는 역할은 브라우저가 해준다는 것이다. 브라우저가 해주는 많은 역할 중 하나는 비동기처리를 도와주는 것이다.

오늘은 비동기를 처리하는데 있어서 큰 역할을 하고 있는 것을 알아보도록 하자.
<br/>

## 목차

- [x]  Heap
- [x]  Stack
- [x]  Browser or Web APIs
- [x]  Event Table
- [x]  Event Loop

자바스크립트는 스크립트가 실행이 되는 엔진이 있다. 크롬을 기준으로 본다면 엔진은 V8이 된다. 이 엔진을 구성하는 요소는 크게보면 Heap과 Stack으로 구성이 되어있다.
<br/>

### Heap

객체는 Heap에 할당이 된다. Heap은 메모리에서 대부분 구조화되지 않은 영역을 나타낸다.
<br/>

### Stack

자바스크립트 코드 실행을 위해 제공된 단일 쓰레드이다. 함수를 호출하게 되면 하나의 Stack Frame이 형성이 된다. 

더이상의 자세한 내용은 CallStack에 대해서 작성한 글을 참고 해주세요.

> [CallStack 알아보기](https://github.com/SeonHyungJo/FrontEnd-Dev/blob/master/Javascript/Basic_1_CallStack.md)

<br/>

### Browser or Web APIs

흔히 WebAPI라 불리는 API들은 웹 브라우저에 내장되어 있으며 브라우저 및 이외 컴퓨터 환경에서 데이터를 노출 할 수 있으며 복잡한 환경에서 유용하게 사용할 수 있다.(ex. 위치정보등등)

이것은 자바스크립트에 포함되는 것이 아니며 자바스크립트 언어를 사용하는데 있어 강력한 성능을 제공한다.
<br/>

## 예제로 살펴보기

```javascript
function main(){
    console.log('A');
    setTimeout(
    function display(){ console.log('B'); }
    ,0);
    console.log('C');
}
main();
//	Output
//	A
//	C
//  B
```

![event_loop](https://github.com/SeonHyungJo/FrontEnd-Dev/blob/master/assets/image/basic_event_loop.png?raw=true)

1. main함수가 실행이 되어서 처음에 들어가게 된다. main함수 안에 있는 `console.log` 가 스택에 쌓이게 된다. 함수가 실행이 되면 알파벳이 콘솔창에 출력이 된다.
2. 다음으로 `setTimeout` 이 들어오면서 실행이 된다. `setTimeout` 은 `browserAPI` 의 콜백을 지연하는 함수를 사용한다. 
3. 브라우저에서 타이머가 이루어지는 동안 `console.log` 가 실행이 되고 C가 출력이 된다. 여기서 초가 0이더라도 콜백은 메시지 큐에 담기게 되어 브라우저는 그것을 받는다.
4. main함수가 모두 다 끝나게 되면 스택이 비게 된다. 그러면 브라우저가 큐에 쌓았던 콜백을 실행하게 된다. 

스택이 비었을때 자바스크립트 엔진은 메시지 큐가 비었는지 확인을 한다. 만약에 비었다면 엔진은 첫번째 메시지를 지우고 함수의 안을 실행한다. 이때 새로운 스택프레임(inital frame)이 생성이 되고 스택에 쌓인다.  함수가 끝났다면 initial 프레임이 스택에서 제거가 된다. 이러한 과정은 메시지 큐가 없을 때까지 이루어진다. 
<br/>

## The Event Loop

위에서 언급을 했던 끊임없이 비었는지 검사하는 것이 바로 이벤트 루프이다. 이벤트 큐에 대기중인 항목이 있으면 호출 스택으로 이동한다. 그렇지 않으면 아무일도 일어나지 않는다.

```javascript
setTimeout(() => console.log('first'), 0)

console.log('second')
```

위의 경우는 second가 찍히고 first가 찍히게 된다.

멀티쓰레드라면 하나의 일을 하고 있을 때 다른 쓰레드를 사용해서 일을 처리할 수 있지만 자바스크립트는 싱글쓰레드이기 때문에 불가능하다. 그래서 비동기를 하는데 있어서 이벤트 루프는 필수적이다.

```javascript
while (await messageQueue.nextMessage()) {
  let message = messageQueue.shift();
  message.run();
}
```

이벤트 루프는 메시지 큐에 메시지가 더 있는지 확인하는 루프이다.

메시지 큐에 메시지가 있으면 메시지 큐에서 다음 메시지를 제거하고 그 메시지와 연관된 기능을 실행한다. 그렇지 않으면 새 메시지가 메시지 대기열에 추가 될때까지 대기를 한다. 이벤트루프가 자바스크립트에게 비동기를 허용하는 기본 모델이다.

---

#### Reference

- [JavaScript Event Loop Explained]([https://medium.com/front-end-weekly/javascript-event-loop-explained-4cd26af121d4](https://medium.com/front-end-weekly/javascript-event-loop-explained-4cd26af121d4))
- [What is the Event Loop in Javascript]([https://www.wptutor.io/web/js/javascript-event-loop](https://www.wptutor.io/web/js/javascript-event-loop))
- [Understanding JS: The Event Loop]([https://hackernoon.com/understanding-js-the-event-loop-959beae3ac40](https://hackernoon.com/understanding-js-the-event-loop-959beae3ac40))
- [Event loop in javascript]([https://code.likeagirl.io/what-the-heck-is-event-loop-1e414fccef49](https://code.likeagirl.io/what-the-heck-is-event-loop-1e414fccef49))
- [The JavaScript Event Loop]([https://flaviocopes.com/javascript-event-loop/](https://flaviocopes.com/javascript-event-loop/))
- [Tasks, microtasks, queues and schedules]([https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/))