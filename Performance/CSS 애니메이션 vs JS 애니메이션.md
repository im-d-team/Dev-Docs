# CSS 애니메이션 vs JS 애니메이션

<br/>

## CSS 애니메이션

다음 코드는 W3C tutorial에 있는 코드를 가져와 CSS 애니메이션으로 수정한 코드다.

```html
<button onclick="myMove()">Click Me</button> 

<div id ="container">
<div id ="animate"></div>
</div>
```

```css
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
        top : 0;
    }

    to {
      	top : 350px;
        left: 350px;
    }
}
```
```javascript
function myMove() {
  var elem = document.getElementById("animate");   
  elem.className = "animation-move";
}
```

**CSS 코드를 보면 `@keyframes`를 사용하여 애니메이션명을 지정하고 이를 `animation-move`라는 클래스 명을 가지는 요소**에 입히고 있다.

그에 따라 버튼을 클릭하면 `div`요소에 `animation-move`라는 클래스를 먹인다. 

* [@keyframes에 관한 구체적인 예시](https://poiemaweb.com/css3-animation)

### 트랜지션 vs 애니메이션

---

#### 트랜지션

> * 요소의 변화를 일정 기간(duration)동안 일어나게 함
> * `hover`나 `click` 같은 **이벤트 트리거에 의해 동작**
> * layout을 변경시킬 경우, reflow 발생을 줄이기 위해 **낮은 계층의 요소에 효과를 주는 것이 좋음**

#### 애니메이션

> * 트랜지션은 시작하기 위해 이벤트가 필요하지만 애니메이션은 **시작, 정지, 반복까지 제어 가능**(물론, 이벤트 제어도 가능)
> * 하나 또는 복수의 **`@keyframes`으로 이루어짐**

<br/>

## JS 애니메이션

```html
<button onclick="myMove()">Click Me</button> 

<div id ="container">
<div id ="animate"></div>
</div>
```

```css
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
```

```javascript
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
```

JS애니메이션으로 위의 CSS애니메이션과 같은 효과를 먹인 코드다.

**JavaScript 코드를 보면 `setInterval`을 주고 일정 주기마다 `frame()` 함수를 실행시켜 요소의 위치를 이동**시키고 있다.

<br/>

## CSS 애니메이션과 JS 애니메이션의 차이

CSS 애니메이션은 낮은 버전의 브라우저에서는 지원을 하지 않는 경우가 있다.(특히, IE). 

즉, **1. 크로스 브라우징면에서는 JS 애니메이션을 사용하는 것이 낫다.**

하지만, CSS 애니메이션은 **모든 동작을 CSS에서 관리하고 필요하다면 JS는 이벤트 감지를 위해서만 사용**한다.

**2.실행 로직을 브라우저 자체에서 실행하기 때문에 메모리 소비를 최적화**해준다.

**3. JavaScript에서는 css, 동작을 모두 관리해줘야하는 반면, CSS애니메이션은 CSS안에서 다 관리하기 때문에 관리에 용이하다.**

<br/>

## velocity.js

사실상, **CSS 애니메이션을 사용하는게 생각보다 JS 애니메이션과 비교해서 빠르지 않다.** 오히려, JS 애니메이션이 더 빠를 수 있다.

하지만, **CSS 애니메이션이 jQuery의 `animate()`를 사용하는 것보단 빠르다.**

결론부터 얘기하자면, **velocity.js, GSAP과 DOM 라이브러리로 구현했을 때, CSS와 jQuery 라이브러리로 애니메이션을 구현했을 때 보다 빠르다.**

> * 8K 밖에 되지 않는 라이브러리
> * jQuery의 `animate()`를 `velocity()`로만 바꿔줘도 사용 가능
> * `setInterVal()`이 아닌 `requestAnimationFrame()`을 사용하기 때문에 **브라우저가 최적의 상태인지 판단하고 실행**
> * 3d-transform과 같은 애니메이션에는 CSS의 작성이 필요함.

<br/>

---

#### Reference

- [CSS vs. JS Animation: Which is Faster?](https://davidwalsh.name/css-js-animation)
- [CSS Animation](https://poiemaweb.com/css3-animation)
- [CSS와 자바스크립트 애니메이션](https://developers.google.com/web/fundamentals/design-and-ux/animations/css-vs-javascript?hl=ko)

