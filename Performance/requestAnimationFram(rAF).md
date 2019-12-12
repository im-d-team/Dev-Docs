# requestAnimationFrame(rAF)

사용자들이 서비스를 선택하는데 있어서 기준은 다양하다. 그 중에서 하나는 인터렉션(Interaction)이다. 인터렉션은 상호 작용이라는 사전적 뜻을 가지며, 서비스 차원에서는 **사용자가 제품이나 서비스를 사용하면서 상호간 작용하는 것**이라는 넓은 의미를 가진다.

이에 서비스를 운영하는 기업들은 부드러운 인터렉션을 만들어내기 위해서 노력을 하고 있다.

개발자의 입장에서 생각을 하면 부드러운 인터렉션을 만들어내기 위해서 프레임 수에 맞도록 시각적인 효과를 만들어야 한다.

오늘날의 기기들은 시각적인 효과를 위해서 초당 60번 화면을 다시 그린다.(요즘에는 주사율이 좋은 모니터들이 많다.) 그러므로 60개 화면안에서 시각적인 효과를 표현해야한다.

초당 60개의 프레임을 렌더링해야한다는 말은 1프레임이 약 16ms(1000ms/60frames)라는 것을 의미한다. 즉 부드러운 화면을 위해서 우리는 16ms미만으로 새로 보여줄 화면을 만들면 된다.

우리가 16ms안에 화면을 만들기 전에 렌더링 파이프라인에 대해서 알아야 한다.

![Pipeline](https://user-images.githubusercontent.com/24274424/69901968-b12c9800-13cb-11ea-9e6f-26ad0167ad53.png)
출처 : https://developers.google.com/web/fundamentals/performance/rendering/?hl=ko

> 참고: [웹 브라우저의 작동 원리](https://github.com/Im-D/Dev-Docs/blob/master/Browser/%EC%9B%B9%20%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80%EC%9D%98%20%EC%9E%91%EB%8F%99%20%EC%9B%90%EB%A6%AC.md)

- 애니메이션 및 기타 작업들을 수행하는 `Javascript`
- CSS 규칙을 어떤 요소에 적용할지 계산하는 `Style`
- 브라우저가 요소에 어떤 규칙을 적용할지 알게 되면 화면에서 얼마나 공간을 차지하고 어디에 배치되는지 계산하는 `Layout(reflow)`
- 픽셀을 채우는 `Paint(redraw)`
- 이러한 작업들이 개별적인 레이어에서 진행되고 이를 합치는 `Composite`

때에 따라 다르지만 기본적으로는 한 번의 화면을 그리기 위해서 위와 같은 과정을 수행한다. 

이전에는 애니메이션을 구현하는데 있어서 `setTimeout()` 또는 `setInterval()`을 사용되었다. 하지만 주어진 시간내에 동작을 할 뿐이지 위에서 언급한 프레임은 고려되지 않는다.

이에 사용되는 것이 `requestAnimationFrame()`이다.

이 메소드는 실제 화면이 갱신되어 표시되는 주기에 따라 함수를 호출해주기 때문에 Callback이 프레임 시작시 실행되는 것이 보장된다.

Callback의 수는 보통 1초에 60회지만, 일반적으로 대부분의 브라우저에서는 W3C 권장사항에 따라 그 수가 디스플레이 주사율과 일치하게 된다. 

대부분의 최신 브라우저에서는 성능과 배터리 수명 향상을 위해 `requestAnimationFrame()` 호출은 백그라운드 탭이나 hidden `<iframe>`에서 실행이 중단된다.

## 예시

Jbee님 포스팅 중 [스크롤 이벤트 최적화](https://jbee.io/web/optimize-scroll-event/)를 보면 `rAF`를 이용하여 스크롤 이벤트를 구현하는 방식을 살펴볼 수 있는데 간단히 보면 다음과 같다.

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

## 브라우저 호환성

![image](https://user-images.githubusercontent.com/24274424/69902311-539a4a80-13cf-11ea-85b8-774690c747b0.png)

---

#### Reference

- [스크롤 이벤트 최적화](https://jbee.io/web/optimize-scroll-event/)
- [requestAnimationFrame() 개념 정리하기](https://fullest-sway.me/blog/2019/01/28/requestAnimationFrame/)
- [Deview 2018 - 웹 성능 최적화에 필요한 브라우저의 모든 것](https://www.slideshare.net/deview/125-119068291)