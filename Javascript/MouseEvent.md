# Mouse Event

오늘은 약간 심플하면서도 약간 헷갈릴만한 주제로 해보려고한다.
<br/>

바로 `Mouse Event`
<br/>

오늘 작업을 하다보니 내가 평소에 알고 있던 마우스 이벤트들인데 왜 이렇게 어렵지라고 생각되는 것이 있어서 정리를 하면서 다시 학습해보려고 한다.
<br/>

기본적으로 내가 알고 있는 마우스 이벤트는 4가지였다.
<br/>

- mousedown : 마우스 누른 상태
- mousemove : 해당 Element 위에서 움직이는 상태
- mouseup : 마우스 떼는 상태
- click : mousedown와 mouseup이 한번 일어난 상태

위의 4가지의 상태는 우리가 흔히 사용하는 마우스 이벤트이다. 그리고 지금 어디선가 누군가도 이것을 사용하고 있을 것이다.
<br/>

간단한 예제를 만들어 보자면
<br/>

```html
<html>
    <head></head>
    <body>
        <div style="
            width:  100px;
            height:  100px;
            background-color: black;
        ">
        black
        </div>
    </body>
</html>
```

간단한 검은색 Div를 만들어서 이 Element에 이벤트를 입힌다.

```js
var div = document.getElementsByTagName("div")

// MouseDown
div[0].addEventListener("mousedown", function(){
    console.log("mousedown")
})

// MouseMove
div[0].addEventListener("mousemove", function(){
    console.log("mousemove")
})

// MouseUp
div[0].addEventListener("mouseup", function(){
    console.log("mouseup")
})

// Click
div[0].addEventListener("click", function(){
    console.log("click")
})
```

예제를 만들어보고 한번 움직이고, 클릭하고 해보자 그러면 더욱 이해가 잘 될 것이다.

자 이제 제일 기본이 되는 이벤트를 알아 보았다. 이제는 헷갈렸던 작업으로 가보자
<br/>

## MouseOver MouseOut

알고는 있었지만 추가적으로 알았다고 하자.

- mouseover : 마우스를 `Element` 위에 올린 상태
- mouseout : 마우스를 `Element` 위에 올린 상태에서 벗어난 상태

쉽게 보자면 내가 이벤트를 선언한 `Element` 위에 마우스를 위치하나 빼냐에 대한 이벤트이다.
<br/>

이번에는 다른 이벤트를 보자
<br/>

## MouseEnter MouseLeave

- mouseleave : 마우스를 `Element` 위에 올린 상태
- mouseenter : 마우스를 `Element` 위에 올린 상태에서 벗어난 상태

이상하다. 위에서의 2개의 이벤트 아래의 이벤트들과 똑같은데? 왜 때문에 같은 기능을 가진 이벤트가 2개씩 있는 것일까?
<br/>

> 이거 때문에 한동안 헤맸다.

## MouseOver MouseOut VS MouseEnter MouseLeave

2종류의 이벤트는 같은 기능을 하는 것처럼 보이지만 약간의 다른 차이점이 존재한다.
<br/>

먼저 예제를 보자 => [예제보기](https://codepen.io/seonhyungjo/pen/wRwWXO)
<br/>

2겹의 `Div` 가 존재한다. 그리고 `Outer div` 에 각각 `MouseOver` 와 `MouseEnter` 이벤트를 추가했다. 그리고 `Inner Div` 에는 이벤트를 추가하지 않았다.
<br/>

결과는 신기하게도 `MouseOver` 이벤트는 자식 `Element`까지 이벤트가 적용이 되었다.
<br/>

결과적으로 `MouseOver MouseOut` 이벤트들은 `Bubble`과 `Capture` 일어나며 다르게 `MouseEnter MouseLeave` 이벤트들은 전파가 되지 않고 선언한 곳에서만 일어나는 것을 확인할 수 있다.
<br/>

관련글을 읽는 것도 도움이 된다. [Event Delegation](https://github.com/SeonHyungJo/FrontEnd-Dev/blob/master/Javascript/Event%20Delegation.md)
<br/>

이 사실은 너무나도 중요하다. 내가 원하는 위치에 `MouseOver` 이벤트를 먹였는데 이상하게 내가 선언하지 않은 곳의 위치에서 작동이 일어나고 있다는 것이 아닌가? 
<br/>

이것은 정말 크리티컬한 이슈가 될 수 있는 것이다.
<br/>

그렇다면 이것을 해결할 수 있는 방법이 있지 않을까?
당연하게 있다. 그리고 사람들은 이미 알고 있다. 
<br/>

---

#### Reference 

- http://webclub.tistory.com/116
- http://webclub.tistory.com/456
- [MDN - MouseEnter](https://developer.mozilla.org/en-US/docs/Web/Events/mouseenter)
- [MDN - preventDefault](https://developer.mozilla.org/ko/docs/Web/API/Event/preventDefault)
- [MDN - stopPropagation](https://developer.mozilla.org/ko/docs/Web/API/Event/stopPropagation)