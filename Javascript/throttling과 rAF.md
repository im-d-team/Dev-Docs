# throttling과 rAF

## throttling(쓰로틀링)

`Throttling`은 스크롤 이벤트에서 주로 사용되는 기술로 지나치게 많은 이벤트가 발생하는 것을 몇 초에 한 번, 또는 몇 밀리초에 한 번씩만 실행되게 제한을 두는 것이다.<br/>

```js
var timer;
document.querySelector('#input2').addEventListener('input', function (e) {
    if (!timer) {
        timer = setTimeout(function() {
            timer = null;
            console.log('ajax 요청', e.target.value);
        }, 2000);
    }
});
```

위의 코드에서 보다시피 `setTimeout`을 이용하여 2초 동안에 한 번만 ajax요청을 하도록 하고 있다. 하지만 `setTimeout`은 지정된 시간 뒤에 무조건 실행되는 것을 보장할 수 없다. 위의 코드는 2초 뒤에 콜백 함수를 실행하는 것이 아니라 2초 뒤에 `Task Queue`에 넣는 것을 의미한다. <br/>**`Task Queue`에 들어간 함수는 순차적으로 `Call Stack`에 옮겨지고 실행**되는데 만약 `Call Stack`이 비워져 있지 않다면, 지정한 시간 이후에 실행되는 것을 보장할 수 없다.

<br/>

## requestAnimationFram(rAF)

**`rAF`는 브라우저의 최적화 상태를 고려하여 이벤트를 실행**한다. 즉, `setTimeout`처럼 무조건 지정된 시간에 한 번씩 이벤트를 트리거하지 않아도 된다.
Jbee님 포스팅 중 [스크롤 이벤트 최적화](https://jbee.io/web/optimize-scroll-event/)를 보면 `rAF`를 이용하여 스크롤 이벤트를 구현하는 방식을 살펴 볼 수 있는데 간단히 보면 다음과 같다.

```js
function rAFScroll(callback) {
  let tick = false

  return function trigger() {
    if (tick) {
      return;
    }

    tick = true
    return requestAnimationFrame(function task() {
      tick = false
      return callback();
    })
  }
}
```

`trigger`함수를 보면 `tick`의 값이 `false`일 경우에만 `requestAnimationFrame`의 콜백이 실행된다. <br/>즉, **콜백 함수(`callback`)가 `rAF`에 의해 브라우저가 최적화된 상태에서만 `tick`의 값이 `false`가 되고 실행**된다. 순차적으로 정리하면 다음과 같다.

1. `rAF`의 콜백 함수인 `task`함수가 `animation frame`에 들어간다.
2. `tick`의 값이 `true`라면 `trigger`함수가 호출되어도 콜백 함수가 실행되지 않는다.
3. `task`함수가 실행되면서 `tick`이 `false`가 되면 다시 콜백 함수가 실행될 수 있는 환경이 된다.

이처럼 쓰로틀링을 사용하지 않고 `rAF`을 사용하여 이벤트 최적화가 가능하며 `rAF`는 애니메이션의 최적화에도 많이 사용되는 API이기 때문에 잘 알아두는게 좋다.

<br/>

---

#### Reference

- [스크롤 이벤트 최적화](https://jbee.io/web/optimize-scroll-event/)
- [쓰로틀링과 디바운싱](https://www.zerocho.com/category/Javascript/post/59a8e9cb15ac0000182794fa)

