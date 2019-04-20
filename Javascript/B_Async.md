# Async

자바스크립트는 기본적으로 싱글 쓰레드이다. 이 말을 쉽게 하면 한번에 1가지의 일을 할 수 밖에 없다. 간단한 예제를 들자면 우리가 요리를 한다고 하면, 야채를 썰면서 물을 끓이는 행위를 동시에 할 수 없다는 것을 뜻한다. 이러한 불편한 점을 알았는지 벤더들은 자바스크립트의 싱글 쓰레드를 확장 시켜줄 API를 만들어 주었다.

- [x] setInterval
- [x] setTimeout
- [x] requestAnimationFrame
- [ ] requestIdleCallback

<br/>

## **setInterval**

자바스크립트는 브라우저 내에서 작동하며 기본 동작은 2번째 인자로 받은 `ms` 마다 1번째 인자로 받은 `CallBack Function` 을 실행하는 것을 전제로 한다. 

`setInterval` 이 실행이 되면 WEB API에서 시간을 기다리고 있다가 특정시간 마다 큐에 넣게 된다. 그러나 이것은 `CallStack` 이 비어있어야 하며 다른 작업을 계속해서 하고 있다면 한 없이 기다리게 될 수도 있다.

이렇게 `setInterval` 은 지연이 발생할 수 있으며 시간에 따라 증가하게 된다.

이러한 이유는 3가지로 정리 할 수 있다.

- 앱을 실행하는 기기의 하드웨어 제한사항
- 브라우저의 비활성탭에서 실행되도록 앱남기기(멈추지 않고 계속해서 실행이 된다.)
- 최적화되지 않은 전체 코드베이스

![Async_1](/assets/image/Async_1.png)

위의 사진을 간단하게 보면 `dummyMethod1()` 이 오래 걸리면 자바스크립트의 이벤트 루프는 본연의 특징으로 인해서 스택에 걸려버렸다. 이런 상황이 되면 실행하기 위해서 기다리는 방법밖에 없다. 

이렇게 우리가 조작을 할 수 없는 3번의 순간에 보낸다. 타이머라는게 이상적인 상황일 때는 우리가 생각하는 그 시간에 갈 수 있지만 브라우저와 자바스크립트는 그렇게 이상적이지 않다.

<br/>

## **setTimeout**

`setTimeout` 은 `setInterval` 을 한 번 실행하는 것과 동일하다.

![Async_2](/assets/image/Async_2.png)

위에서 했던 내용을 이번에는 `setTimeout` 의 재귀적 호출로 해보자 그렇게 된다면 결국 `setTimeout` 의  `CallBack Function` 에 `setTimeout` 이 다시 불리는 구조가 될 것이다. 이렇게 만들어서 실행을 한다면 우리가 생각했던 것과 더욱이 달라질 것이다. `setInterval` 은 내가 정한 시간에 맞춰서 CallBack을 실행 하려고 큐에 담았을 것이다. 그러나 `setTimeout` 은 `callback function`이 불려야 다음 `setTimeout` 이 실행이 될 수 있는 조건이 되어 `interval` 보다 지연이 더 심해 질 수 있다.

### 지연예시

```javascript
var counter = 0;
    
var fakeTimeIntensiveOperation = function() {
    
    for(var i =0; i< 50000000; i++) {
        document.getElementById('random');
    }
    
    let insideTimeTakingFunction  = new Date().toLocaleTimeString();
    console.log('insideTimeTakingFunction', insideTimeTakingFunction);
}
    
    
var timer = setInterval(function(){ 
    
    let insideSetInterval = new Date().toLocaleTimeString();
    
    console.log('insideSetInterval', insideSetInterval);
    
    counter++;
    if(counter == 1){
        fakeTimeIntensiveOperation();
    }
    
    if (counter >= 5) {
        clearInterval(timer);
    }
}, 1000);
    
//insideSetInterval 13:50:53
//insideTimeTakingFunction 13:50:55
//insideSetInterval 13:50:55 <---- not called after 1s
//insideSetInterval 13:50:56
//insideSetInterval 13:50:57
//insideSetInterval 13:50:58 
```

<br/>

## **requestAnimationFrame**

기본적으로 브라우저는 **60FPS** 이다 그래서 1초에 60번을 실행하게 되면 애니메이션이 깔끔하게 보인다. 그렇다면 위에서 알게 된 `setInterval` 을 사용해서 표현을 하면

```javascript
setInterval(function() {
    // animiate something
}, 1000/60);
```

이런식으로 표현이 가능하다. 그러나 위에서 언급을 했지만 문제가 있다.
이에 2017년 `requestAnimationFrame` 이라는 기능이 크롬의 `Paul Irish`에 의해서 추가가 되었다.

Paul의 설명에 의하면

- 브라우저가 애니메이션을 최적화 할 수 있으므로 애니메이션이 부드럽게 처리될 수 있다.
- 비활성 탭의 애니메이션이 중지되어 CPU가 시원해진다.
- 더욱이 배터리 친화적이다.

가장 간단한 예제를 보면

```javascript
function repeatOften() {
    // Do whatever
    requestAnimationFrame(repeatOften);
}

requestAnimationFrame(repeatOften);
```

한번 실행하면 재귀적으로 호출한다.


```javascript
requestAnimationFrame 역시 취소하기 위햇 setTimeout setInterval과 마찬가지로 ID를 반환한다.

globalID = requestAnimationFrame(repeatOften);

cancelAnimationFrame(globalID);
```

그러나 아래의 링크를 보면 알게되지만 모든 브라우저가 지원하는 것은 아니다.

> 브라우저 지원여부 확인하기(https://caniuse.com/#feat=requestanimationframe)

### 예제

[https://codepen.io/seonhyungjo/pen/MRVPxL](https://codepen.io/seonhyungjo/pen/MRVPxL)

## 이외의 Async

### **requestIdleCallback**

### **Observer**

- mutation
- resize
- intersection
- performance

---

#### Reference

- [https://javascript.info/settimeout-setinterval](https://javascript.info/settimeout-setinterval)
- [https://dev.to/akanksha_9560/why-not-to-use-setinterval--2na9](https://dev.to/akanksha_9560/why-not-to-use-setinterval--2na9)
- [https://develoger.com/settimeout-vs-setinterval-cff85142555b](https://develoger.com/settimeout-vs-setinterval-cff85142555b)
- [https://www.amitmerchant.com/Handling-Time-Intervals-In-Javascript/](https://www.amitmerchant.com/Handling-Time-Intervals-In-Javascript/)
- [https://css-tricks.com/using-requestanimationframe/](https://css-tricks.com/using-requestanimationframe/)
- [http://www.javascriptkit.com/javatutors/requestanimationframe.shtml](http://www.javascriptkit.com/javatutors/requestanimationframe.shtml)
- [https://yoiyoy.wordpress.com/](https://yoiyoy.wordpress.com/)