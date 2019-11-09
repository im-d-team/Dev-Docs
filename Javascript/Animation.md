# CSS 애니메이션 vs JS 애니메이션

웹기술이 발전되면서 좀 더 사용자 친화적으로 개발하려는 노력을 하고 있다.
이에 방법 중 하나로 애니메이션을 추가함으로써 더욱 이쁘고 완성도가 높은 웹을 만든다.

예전에는 단순하게 CSS와 JS를 사용해서 애니메이션을 구현했다. 

그 예시로 stackoverflow의 만우절 이벤트를 들 수 있다.

![stackoverflow](https://user-images.githubusercontent.com/24274424/68475826-83d94800-026c-11ea-90d1-760751c82d1f.png)

현재는 WebGL, Canvas, SVG, Observer API / Web-Lottie, D3 등등 여러 기술과 라이브러리가 있어  구현할 수 있는 방법이 다양해졌다.

그 중에서 기본이 되는 CSS와 JS 애니메이션을 살펴보자.

## CSS 애니메이션

먼저 간단하게 CSS 애니메이션의 특징을 살펴보게 되면,

1. JS를 모르더라도 간단한 애니메이션을 만들 수 있다.
2. JS를 이용한 애니메이션은 잘 만들어졌더라도 성능이 좋지 못한 경우가 있다. CSS 애니메이션은 `frame-skipping` 같은 여러 기술을 사용되어 최대한 부드럽게 렌더링된다.(성능최적화로 렌더링된다.)
3. 브라우저가 애니메이션의 성능을 효율적으로 최적화한다. 예를 들어 안 보이는 엘리먼트에 대한 애니메이션은 업데이트 주기를 줄여 부하를 최소화한다.
4. CSS에서 미리 정의된 애니메이션을 브라우저의 기능을 이용해서 애니메이션의 중간 상태를 나타내는 `@keyframe`을 계산 후 애니메이션을 브라우저에서 렌더링한다.
5. 정해진 시간에 정해진 동작을 하도록 선언한 후, 애니메이션을 브라우저에 표현한다.(선언적)

간단한 애니메이션을 만들어보자.

```html
<style>
  #container {
    width: 400px;
    height: 400px;
    position: relative;
    background: yellow;
  }

  #animate {
    width: 50px;
    height: 50px;
    position: absolute;
    background-color: red;
  }

  .animation-move {
    animation: move 4s
  }

  /* @keyframes rule */
  @keyframes move {
    from {
      left: 0;
      top: 0;
    }

    to {
      top: 350px;
      left: 350px;
    }
  }
</style>

<body>
  <button onclick="myMove()">Click Me</button>

  <div id="container">
    <div id="animate"></div>
  </div>
</body>
<script>
  function myMove() {
    var elem = document.getElementById("animate");
    elem.className = "animation-move";
  }
</script>
```

**CSS 코드를 보게되면 `@keyframes`를 사용해 애니메이션명을 지정하고 이를 `animation-move`라는 클래스 명을 해당 요소**에 넣어주고 있다.

이에 버튼을 클릭하게 되면 `div`요소에 `animation-move`라는 클래스가 추가되면서 애니메이션이 실행된다.

* [@keyframes에 관한 구체적인 예시](https://poiemaweb.com/css3-애니메이션)

### 트랜지션과 애니메이션

CSS로 애니메이션을 표현하는 방법은 크게 2가지 있다.

#### 트랜지션

- 요소의 변화를 일정 기간(duration)동안 일어나게 한다.
- `hover`나 `click` 같은 **이벤트 Trigger에 의해 동작한다.**
- layout을 변경시킬 경우, reflow 발생을 줄이기 위해 **낮은 계층의 요소에 효과를 주는 것이 좋다.**

#### 애니메이션

- 트랜지션은 시작하기 위해 이벤트가 필요하지만 애니메이션은 **시작, 정지, 반복까지 제어 가능하다.**(물론, 이벤트 제어도 가능)
- 하나 또는 복수의 **`@keyframes`으로 이루어진다.**

### 간단하게 살펴보는 기본 Animation 속성

- animation-delay : Element가 load되고 얼마 뒤에 시작될지 설정
- animation-direction : 애니메이션이 종료되고 다시 처음부터 시작할지 역방향으로 진행할지 설정
- animation-duration : 한 싸이클의 애니메이션이 어느 정도의 시간에 걸쳐 일어날지 설정
- animation-fill-mode : 애니메이션이 시작되기 전이나 끝나고 난 후 어떤 값이 적용될지 설정(forwards | backwards | both)
- animation-name : 애니메이션의 중간 상태를 지정한다. 중간 상태란 `@keyframe` 규칙을 이용하여 기술한 keyframe 이름이다.

#### Example

- [Animation-Delay](https://codepen.io/seonhyungjo/pen/aeOpxp)
- [Animation-Direction](https://codepen.io/seonhyungjo/pen/zgGZRE)
- [Animation-Duration](https://codepen.io/seonhyungjo/pen/ZgGeVJ)
- [Animation-fill-mode](https://codepen.io/seonhyungjo/pen/qedrgM)

### keyframe

애니메이션 중간 중간 특정 지점들을 지나는 키프레임들을 설정함으로써 CSS 애니메이션 과정의 중간 절차를 제어할 수 있도록 도와주는 속성이다.

키프레임 규칙을 이용해서 두 개 이상의 중간 상태를 기술할 수 있다.

중간 상태에 명시한 스타일이 언제 등장할지를 `%`를 이용해서 지정한다. `0%`는 시작시점을 의미하며, `100%`는 마지막 지점이 된다. 최소한 이 두 시점은 기술되어야 브라우저가 언제 애니메이션이 시작되고 끝나는지 알 수 있다.

> [Animation-keyframe](https://codepen.io/seonhyungjo/pen/VoLbdL)

### 한방에 적어서 사용하기

animation CSS 속성은 다수의 스타일을 전환하는 애니메이션을 적용할 수 있다. 

`animation-name`, `animation-duration`, `animation-timing-function,` `animation-delay`, `animation-iteration-count`, `animation-direction`, `animation-fill-mode`, `animation-play-state`의 단축 속성이다.

```css
animation: 3s ease-in 1s 2 reverse both paused slidein;
```

## JS 애니메이션

1. 다양한 컨트롤 또는 사용자 입력에 의해서 상태가 변하는 애니메이션을 구현하기 위해서 사용한다.
2. 애니메이션의 시간, 효과 등의 제한없이 구현이 가능하다.
3. 프레임 단위로 애니메이션을 정의한다.
4. setInterval, setTimeOut을 이용한 애니메이션과 requestAnimationFrame을 이용한 애니메이션이 있다.

```html
<style>
  #container {
    width: 400px;
    height: 400px;
    position: relative;
    background: yellow;
  }

  #animate {
    width: 50px;
    height: 50px;
    position: absolute;
    background-color: red;
  }
</style>

<body>
  <button onclick="myMove()">Click Me</button>

  <div id="container">
    <div id="animate"></div>
  </div>
</body>
<script>
  function myMove() {
    var elem = document.getElementById("animate");
    var pos = 0;
    var id = setInterval(frame, 5);

    function frame() {
      if (pos == 350) {
        clearInterval(id);
      } else {
        pos++;
        elem.style.top = pos + 'px';
        elem.style.left = pos + 'px';
      }
    }
  }
</script>
```

JS 애니메이션으로 위에서 살펴본 CSS 애니메이션과 같은 효과를 넣은 코드이다.

**JavaScript 코드를 보면 `setInterval`을 주고 일정 주기마다 `frame()` 함수를 실행시켜 요소를 이동**시키고 있다.

## CSS 애니메이션과 JS 애니메이션의 차이

CSS 애니메이션은 낮은 버전의 브라우저에서는 지원을 하지 않는 경우가 있다.(특히, IE). 
즉, **1. 크로스 브라우징면에서는 JS 애니메이션을 사용하는 것이 좋다.**

하지만, CSS 애니메이션은 **모든 동작을 CSS에서 관리하고 필요하다면 JS는 이벤트 감지를 위해서만 사용**한다.

**2. CSS 애니메이션 실행 로직은 브라우저 자체관리는 해주기 때문에 메모리 소비를 최적화**해준다.
**3. JavaScript에서는 CSS, 동작을 모두 관리해줘야하는 반면, CSS 애니메이션은 CSS안에서 다 관리하기 때문에 관리에 용이하다.**

---

#### Reference

- [CSS vs. JS 애니메이션: Which is Faster?](https://davidwalsh.name/css-js-애니메이션)
- [CSS 애니메이션](https://poiemaweb.com/css3-애니메이션)
- [CSS와 자바스크립트 애니메이션](https://developers.google.com/web/fundamentals/design-and-ux/애니메이션s/css-vs-javascript?hl=ko)
- [CSS 애니메이션 사용하기 - MDN](https://developer.mozilla.org/ko/docs/Web/CSS/CSS_Animations/Using_CSS_animations)
- [Web Animations 명세](https://www.w3.org/TR/web-animations/)