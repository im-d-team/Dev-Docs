# Repaint와 Reflow

<br/>

## 브라우저의 rendering 과정

![rendering](/assets/images/rendering.png)

위의 그림과 같이 브라우저는 화면을 rendering하는 과정에서 **배치\(flow\)** 와 **그리기\(paint\)** 의 과정을 거친다.

<br/>

## Reflow의 발생

생성된 DOM 노드의 레이아웃이 변경될 떄, 변경 후 영향을 받는 모든 노드를 다시 계산하고 렌더 트리를 재생성 한다.

이러한 과정을 `reflow`라 하고 `reflow`가 일어난 후, `repaint`가 일어난다.

```javascript
function reFlow() {
    var container = document.getElementById('container');

    container.style.padding = '20px';
    container.style.border = '20px';
    container.appendChild(document.createTextNode('hello'));
}

```

<br/>

## Repaint의 발생

생성된 DOM 노드에 대하여 style을 변경시켰을 때, **무조건 `reflow`가 발생하진 않는다.**
**레이아웃 수치에 대한 변경이 일어나지 않는다면, `reflow`가 일어나지 않고, `repaint`만 일어난다.**
이러한 경우에는, 색상변경과 같이 레이아웃의 변경이 없는 경우가 있다.

```javascript
function repaint() {
    var container = document.getElementById('container');

    container.style.backgroundColor = 'black';
    container.style.color = 'white';
}

```

<br/>

## Repaint와 Reflow의 최적화

`Repaint`와 `Reflow`가 많아질수록 애플리케이션의 렌더링 성능은 느려지게 된다.
즉, 이를 줄일수록 성능을 높일 수 있다.

### DOM객체의 캐싱

---

```javascript
//Before
for(var i=0; i<100; i++) {
	document.getElementById('container').style.padding = i + 'px';
}

//After
var container = document.getElementById('container');

for(var i=0; i<100; i++) {
    container.style.padding = i + 'px';
}
```

### class명과 cssText사용

---

```javascript
//Before
var container = document.getElementById('container');

container.style.padding = "20px";
container.style.border = "10px solid red";
container.style.color = "blue";

//After cssText
container.style.cssText = 'padding:20px;border:10px solid red;color:blue;';

//After class
container.className = 'test';
```

### 애니메이션이 들어간 노드는 가급적 position:fixed 또는 position:absolute로 지정

---

``` javascript
<div id="animation" style="background:blue;position:absolute;"></div>
```

프레임에 따라 reflow비용이 많은 애니메이션 효과의 경우엔 노드의 `position`을 `absolute`나 `fixed`로 주면 전체 노드에서 분리된다.
이 경우엔, **전체 노드에 걸쳐 Reflow 비용이 들지 않으며 해당 노드의 Repaint 비용만 들어가게 된다.**

### 테이블 레이아웃을 피한다.
테이블로 구성된 페이지 레이아웃의 경우, 점진적 페이지 렌더링이 일어나지 않고 모든 계산이 완료된 후, 화면에 렌더링이 되기 때문에 피하는게 좋다.

<br/>

## Virtual DOM

**Virtual DOM**은 React나 Angular와 같은 UI/UX기반의 라이브러리 혹은 프레임워크에서의 컨셈이 되는 개념이다.

기존에 javascript나 jQuery에서 사용되던 DOM 직접접근 방식의 문제는 reflow와 repaint의 연관성도 빼놓을 수 없다.

**DOM은 정적이다.**
DOM 요소에 접근하여 동적으로 이벤트를 주어 layout을 바꾸게 되면 reflow와 repaint가 일어나게 된다.

이 과정에서 규모가 큰 애플리케이션일수록 recalculate할 양이 늘어나고 이는 성능에 큰 영향을 미친다.

### Virtual DOM의 사용

> 1. 데이터가 업데이트되면, 전체 UI 를 Virtual DOM 에 리렌더링.
> 2. 이전 Virtual DOM 에 있던 내용과 현재의 내용을 비교.
> 3. 바뀐 부분만 실제 DOM 에 적용.

즉, **Virtual DOM을 사용함으로써 바뀐 부분(Component)만 rerendering하기 때문에 컴포넌트가 업데이트 될 때, 레이아웃 계산이 한 번만 일어나게 된다.**

<br/>

---

#### Reference

- [Reflow or Repaint(or ReDraw)과정 설명 및 최적화 방법](http://webclub.tistory.com/346)
- [DOM의 문제점과 Virtual DOM](https://velopert.com/775)

