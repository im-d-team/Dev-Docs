# Layout(Reflow), Repaint

## 브라우저 Rendering 과정

![rendering](/assets/images/rendering.png)

브라우저는 화면을 Rendering하는 과정에는 **배치\(flow\)**, **그리기\(paint\)** 가 포함되어있다.

> [브라우저 작동원리](/Browser/웹%20브라우저의%20작동%20원리.md)

### [들어가기전에] 60fps 및 기기 새로 고침 빈도

오늘날 대부분의 기기는 초당 60회의 빈도로 화면 뿌려주고 있다. 실행 중인 애니메이션 또는 화면전환이 있거나, 사용자가 페이지를 스크롤 중이면, 브라우저가 기기의 빈도에 일치하도록 각 화면 새로 고침에 대해 하나의 새 그림이나 프레임을 제공하려고 하고 있다.

각 프레임에는 **16ms** 가량의 시간이 할당된다. (1초/60 = 16.66ms). 실제로 브라우저는 실행 준비를 해야 하므로 10ms 내에 모든 작업을 완료해야 한다. 이 제한 시간을 충족하지 못하면 프레임 속도가 떨어지고 화면에서 콘텐츠가 끊어진다. 이러한 현상을 버벅거림 현상이라고 한다.

더 자세한 내용을 알고 싶으면 아래의 NAVER D2 자료를 참고하면 된다.

> [Frame의 차이 맛보기](https://codepen.io/seonhyungjo/pen/mdbMLeo)

> [참고 자료 - 브라우저는 vsync를 어떻게 활용하고 있을까](https://www.slideshare.net/deview/133-vsync)

#### 60fps Example

```html
<body>
  <p>The Caterpillar and Alice looked at each other for some time in silence:
    at last the Caterpillar took the hookah out of its mouth, and addressed
    her in a languid, sleepy voice.</p>
</body>
<style>
  p {
    display: inline;
    animation-duration: 3s;
    animation-name: slidein;
  }

  @keyframes slidein {
    from {
      margin-left: 100%;
      width: 300%
    }

    to {
      margin-left: 0%;
      width: 100%;
    }
  }
</style>
```

![60fps_example](https://user-images.githubusercontent.com/24274424/64056788-cf1e0d00-cbd0-11e9-910a-c266e84317be.png)


우리가 위와 같이 부드럽게 보이도록 작업할 수 있는 영역을 간단하게 표현하게 되면 아래와 같이 5개의 단계가 있다. 오늘은 그 중 Layout과 Paint에 대해서 보자.

![image](https://user-images.githubusercontent.com/24274424/64056321-4e114680-cbcd-11e9-9e64-9febc4e37071.png)

## Laytout(Reflow)

생성된 DOM 노드의 레이아웃이 변경될 때, 변경 후 영향을 받는 모든 노드를 다시 계산하고 렌더트리를 재생성한다.

이러한 과정을 `Reflow`라 하고 `Reflow`가 일어나게 되면 위의 사진에서 보이듯이 `paint`, `composite`이 일어난다.

우리가 많이 사용하는 문법에는 강제로 Reflow를 일으키는 것들이 있다. 아래의 링크를 확인해보자.

> [What forces layout / Reflow](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)

### Forced Reflow Example

```html
<body>
  <p>The Caterpillar and Alice looked at each other for some time in silence:
    at last the Caterpillar took the hookah out of its mouth, and addressed
    her in a languid, sleepy voice.</p>
</body>
<script>

  const pElement = document.getElementsByTagName('p')[0];

  function test() {
    for (let i = 0; i < 1000; i++) {
      const offsetLeft = pElement.offsetLeft
    }
  }

  test();
</script>
```

![foreced_Reflow1](https://user-images.githubusercontent.com/24274424/64056918-ed383d00-cbd1-11e9-8191-7eb6111b898c.png)

test function 안쪽을 돌게 되면 style을 재계산을 하고 Laytout 하는 것을 볼 수 있다.

![foreced_Reflow2](https://user-images.githubusercontent.com/24274424/64056970-76e80a80-cbd2-11e9-967b-407278014a74.png)

Layout 영역을 열어보면 line by line로 걸린 시간 역시 Dev Tool에서 확인할 수 있다.

## Repaint

생성된 DOM 노드에 대하여 style을 변경시켰을 때, **`Reflow`는 발생하지 않는다.**
**레이아웃 수치에 대한 변경이 일어나지 않는다면, `Reflow`가 일어나지 않고, `Repaint`만 일어난다.**
이러한 경우에는, 색상변경과 같이 레이아웃의 변경이 없는 경우가 있다.

```html
<body>
  <p id="test">The Caterpillar and Alice looked at each other for some time in silence:
    at last the Caterpillar took the hookah out of its mouth, and addressed
    her in a languid, sleepy voice.</p>


</body>
<script>
  setTimeout(() => {
    document.getElementById('test').style.color = 'red'
  }, 3000);
</script>
```

![image](https://user-images.githubusercontent.com/24274424/64056658-e9a3b680-cbcf-11e9-8d43-4e9ad1265d40.png)

## Repaint, Reflow의 최적화

`Repaint`와 `Reflow`가 많아질수록 애플리케이션의 렌더링 성능은 느려지게 된다.
즉, 이를 줄일수록 성능을 높일 수 있다.

#### 1. 클래스 변경을 통해 Style을 변경하는 경우, 최대한 말단의 노드의 클래스를 변경한다.

#### 2. 인라인 Style을 사용하지 않는다.

- Style 속성을 통해 설정하면, Reflow가 발생한다.
- Element의 클래스가 변경될 때 한 번의 Reflow만 발생한다.
- Inline Style은 HTML이 다운로드될 때, 레이아웃에 영향을 미치면서 추가 Reflow를 발생시킨다.

#### 3. 애니메이션이 들어간 Element는 `position: fixed` 또는 `position: absolute` 로 지정한다.

``` javascript
<div id="animation" style="background:blue;position:absolute;"></div>
```

프레임에 따라 Reflow 비용이 많은 애니메이션 효과엔 노드의 `position`을 `absolute`나 `fixed`로 주면 전체 노드에서 분리된다.
이 경우엔, **전체 노드에 걸쳐 Reflow 비용이 들지 않으며 해당 노드의 Repaint 비용만 들어가게 된다.**

#### 4. 부드러운 애니메이션이 성능을 저하시킨다.

- 한 번에 1px씩 Element를 이동하면 부드러워 보이지만, 성능이 저하되는 원인이 될 수 있다.
- Element를 한 프레임당 4px씩 이동하면 덜 부드럽게 보이겠지만, Reflow 처리의 `1/4`만 필요하게 된다.

#### 5. 레이아웃을 위한 `<table>`을 피한다.

- `<table>`은 점진적으로 렌더링되지 않고, 모두 불려지고 계산된 다음에서야 렌더링이 된다. 또한, 작은 변경만으로도 테이블의 다른 모든 노드에 대한 Reflow가 발생한다.
- 레이아웃 용도가 아닌 데이터 표시 용도의 `<table>`을 사용하더라고, `table-layout: fixed` 속성을 주는 것이 좋다. `table-layout: fixed`를 사용하면, 열 너비가 머리글 행 내용을 기반으로 계산되기 때문이다.

#### 6. CSS 하위 셀렉터를 최소화한다.

- 사용하는 규칙이 적을수록 Reflow가 빠르다.

#### 7. 숨겨진 Element를 변경한다.

- `display: none;` 으로 숨겨진 Element는 변경될 때, Repaint나 Reflow를 일으키지 않는다. 그렇기 때문에 Element를 표시하기 전에 Element를 변경한다.

#### 8. JavaScript를 통해서 Style을 변경할 경우, `.cssText`를 사용하거나, 클래스를 변경한다.

```js
//Before
const container = document.getElementById('container');

container.style.padding = "20px";
container.style.border = "10px solid red";
container.style.color = "blue";

//After cssText
container.style.cssText = 'padding:20px;border:10px solid red;color:blue;';

//After class
container.className = 'test';
```

#### 9. JavaScript를 통해 리스트를 추가하는 경우, DOM Fragment를 통해 추가한다.

- 3 개의 리스트를 추가하는 경우, 한 번에 하나씩 추가하면 최대 7 개의 Reflow가 발생한다.
  - `<ul>` 이 추가될 때
  - `<li>` 에 대해 3번
  - 텍스트 노드에 대해 3번

```js
const frag = document.createDocumentFragment();
const ul = frag.appendChild(document.createElement('ul'));

for (let i = 1; i <= 3; i++) { 
  li = ul.appendChild(document.createElement('li')); li.textContent = `item ${ i }`;
}

document.body.appendChild(frag);
```

> [createDocumentFragment - MDN](https://developer.mozilla.org/ko/docs/Web/API/Document/createDocumentFragment)

#### 10. 캐쉬를 활용한 Reflow 최소화.

- 브라우저는 레이아웃 변경을 큐에 저장했다가 한 번에 실행함으로써 Reflow를 최소화하는데, `offset`, `scrollTop` 과 같은 계산된 Style 정보를 요청할 때마다 정확한 정보를 제공하기 위해 큐를 비우고, 모든 변경을 다시 적용한다.
- 이를 최소화하기 위해 수치에 대한 Style 정보를 변수에 저장하여 정보 요청 횟수를 줄임으로써 Reflow를 최소화한다.

```js
for (let i = 0; i < len; i++) {
  el.style.top = `${el.offsetTop + 10}px`; el.style.left = `${el.offsetLeft + 10}px`;
}
// Bad practice

let top = el.offsetTop, left = el.offsetLeft, elStyle = el.style;

for (let i = 0; i < len; i++) {
  top += 10; left += 10; elStyle.top = `${top}px`; elStyle.left = `${left}px`;
}
// Good practice
```

#### 11. Dev Tool을 사용해서 직접 측정해서 최적화하기(Performace Tab)

---

#### Reference

- [Reflow or Repaint(or ReDraw)과정 설명 및 최적화 방법](http://webclub.tistory.com/346)
- [DOM의 문제점과 Virtual DOM](https://velopert.com/775)
- [Reflow-Repaint](https://github.com/wonism/TIL/blob/master/front-end/browser/Reflow-Repaint.md)
- [Layout Performance](https://kellegous.com/j/2013/01/26/layout-performance/)
- [렌더링 성능 - Google](https://developers.google.com/web/fundamentals/performance/rendering/?hl=ko)
- [CSS 애니메이션 성능 개선 방법(Reflow 최소화, will-change 사용)](https://wit.nts-corp.com/2017/06/05/4571)