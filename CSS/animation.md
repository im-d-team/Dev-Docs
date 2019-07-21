# CSS Animation

크게 애니메이션을 구현하는 방법은 2가지가 있다. 하나는 자바스크립트로 작성하는 방법이며, 다른 하나는 CSS의 animation 속성을 사용하는 방법이다.

각각의 특성을 살펴보면,

<br/>

## CSS 애니메이션

1. 자바스크립트를 모르더라도 간단하게 애니메이션을 만들 수 있다.
2. 자바스크립트를 이용한 애니메이션은 잘 만들어졌더라도 성능이 좋지 못할때가 있다. CSS 애니메이션은 `frame-skipping` 같은 여러 기술을 이용하여 최대한 부드럽게 렌더링된다.
3. 브라우저는 애니메이션의 성능을 효율적으로 최적화할 수 있다. 예를 들어 현재 안보이는 엘리먼트에 대한 애니메이션은 업데이트 주기를 줄여 부하를 최소화할 수 있다.
4. CSS에서 미리 정의된 애니메이션을 브라우저의 기능을 이용해서 애니메이션의 중간 상태를 나타내는 `@keyframe`을 계산해서 애니메이션을 브라우저에서 렌더링한다.
5. 정해진 시간에 정해진 동작을 하도록 선언한 후 정해진 애니메이션을 브라우저에서 표현한다.
6. 선언형 애니메이션

<br/>

## JavaScript 애니메이션

1. 다양한 컨트롤 또는 사용자 입력에 의해서 상태가 변하는 애니메이션을 구현하기 위해서 사용한다.
2. 애니메이션의 시간, 효과등의 제한이 없이 구현이 가능하다.
3. 프레임 단위로 애니메이션을 정의한다.
4. setInterval, setTimeOut을 이용한 애니메이션과 requestAnimationFrame을 이용하 애니메이션이 있다.
5. 명령형 애니메이션

<br/>

## animation 속성은?

- animation-delay : 엘리먼트가 로드되고 나서 언제 시작될지
- animation-direction : 애니메이션이 종료되고 다시 처음부터 시작할지 역방향으로 진행할지?
- animation-duration : 한 싸이클의 애니메이션이 어느 정도의 시간에 걸쳐 일어날지 지정
- animation-fill-mode : 애니메이션이 시작되기 전이나 끝나고 난 후 어떤 값이 적용될지 지정
- animation-name : 이 애니메이션의 중간 상태를 지정, 중간 상태란 @keyframe 규칙을 이용하여 기술한다.

<br/>

### animation-delay

애니메이션의 시작할 시점을 지정하는 것으로, 시간을 값으로 넣어준다.

time값으로 초 또는 밀리 초(ms)를 넣을 수 있으며, 음수도 넣을 수 있다. 음수를 넣게 되면 바로 실행이 되지만 해당 초가 지난 후의 모습부터 진행한다.

```css
/* Single animation */
animation-delay: 3s;
animation-delay: 0s;
animation-delay: -4000ms;

/* Multiple animations */
animation-delay: 1s, 300ms;
```

> [Animation-Delay](https://codepen.io/seonhyungjo/pen/aeOpxp)


<br/>

### animation-direction

애니메이션이 앞으로, 뒤로 또는 앞뒤로 번갈아 재생되어야하는지 여부를 지정한다.

```text
normal | reverse | alternate | alternate-reverse
```

- normal : 매 사이클마다 정방향으로 재생한다.
- reverse : 매 사이클마다 역방향으로 재생한다.
- alternate : 매 사이클마다 각주기의 방향을 뒤집으며, 첫 번째 반복은 정방향으로 진행한다.
- alternate-reverse : 매 사이클마다 각주기의 방향을 뒤집으며, 첫 번째 반복은 역방향으로 진행한다.

> [Animation-Direction](https://codepen.io/seonhyungjo/pen/zgGZRE)

<br/>

### animation-duration

한 사이클을 완료하는데 걸리는 시간을 지정한다.

```css
animation-duration: 6s;
animation-duration: 120ms;
```

> [Animation-Duration](https://codepen.io/seonhyungjo/pen/ZgGeVJ)

<br/>

### animation-fill-mode

애니메이션이 실행 전과 후에 대상에 스타일을 적용하는 방법을 지정한다.

```text
none | forwards | backwards | both
```

> [Animation-fill-mode](https://codepen.io/seonhyungjo/pen/qedrgM)

<br/>

---

## animation-name

애니메이션의 중간 상태를 지정한다. 중간상태는 `@keyframe` 규칙을 이용하여 기술한다.

```css
/* Single animation */
animation-name: none;
animation-name: sildeIn;
```

### keyframe

애니메이션 중간중간의 특정 지점들을 거칠 수 있는 키프레임들을 설정함으로써 CSS 애니메이션 과정의 중간 절차를 제어할 수 있다.

키프레임 규칙을 이용해서 두개 이상의 중간 상태를 기술할 수 있다.

중간 상태에 명시한 스타일이 언제 등장할지를 `%`를 이용해서 지정한다. `0%`는 시작시점을 의미하며,  `100%`는 마지막 지점이 된다. 최소한 이 두 시점은 기술되어야 브라우저가 언제 애니메이션이 시작되고 끝나는지 알 수 있다.

> [Animation-keyframe](https://codepen.io/seonhyungjo/pen/VoLbdL)

<br/>

## 한방에 적어서 사용하기

animation CSS 속성은 다수의 스타일을 전환하는 애니메이션을 적용할 수 있다. 

`animation-name`, `animation-duration`, `animation-timing-function,` `animation-delay`, `animation-iteration-count`, `animation-direction`, `animation-fill-mode`, `animation-play-state`의 단축 속성이다.

```css
animation: 3s ease-in 1s 2 reverse both paused slidein;
```

---

#### Reference

- [CSS 애니메이션 사용하기 - MDN](https://developer.mozilla.org/ko/docs/Web/CSS/CSS_Animations/Using_CSS_animations)
- [Web Animations 명세](https://www.w3.org/TR/web-animations/)
