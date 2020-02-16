# 웹으로 모바일 슬라이드 화면처럼 만들어보기

<div align="center">
 <image style="border: 1px solid black" src="../assets/gif/MobileCSS.gif"/>
</div>

오늘은 위와 같이 앱에서 보는 슬라이드 레이아웃을 웹으로 만들어보자.

## 우리가 아는 슬라이드는

우리가 아는 슬라이드는 네이버나 구글에서 검색하고 내리면서 보여주는 위아래 또는 좌우로 움직이는 부드러운 모양새이다.

CSS 속성에 `scroll-snap-type` 이라는 것이 있다.
이 속성은 스크롤에 대한 유형을 지정해줄 수 있는 속성으로 스냅 포인트가 있는 경우 스냅 포인트가 엄격하게 적용되는 정도를 설정할 수 있다.

> [MDN - scroll-snap-type](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type)

```css
scroll-snap-type: x mandatory;
```

위의 속성을 주게 되면 X축을 기준으로 스냅을 필수적으로 설정하는 것으로 스크롤이 완료된 경우 해당 포인트로 움직이게 된다.

이를 가지고 앱에서 보이는 슬라이드 레이아웃을 구현해볼 수 있다.

### 예제

<div align="center">
 <image src="../assets/gif/MobileLayout.gif"/>
</div>

```html
<!DOCTYPE html>
<html lang="ko">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    overflow-y: hidden;
  }

  .slider {
    font-family: sans-serif;
    scroll-snap-type: x mandatory;
    display: flex;
    overflow-x: scroll;
  }

  section {
    height: 100vh;
    width: 100vw;
    scroll-snap-align: center;
    min-width: 100vw;
  }
</style>

<body>
  <div class="slider">
    <section id="slide-1" style="background-color: blueviolet;">
    </section>
    <section id="slide-2" style="background-color: lightgreen;">
    </section>
    <section id="slide-3" style="background-color: lightblue;">
    </section>
    <section id="slide-4" style="background-color: rgb(226, 43, 144);">
    </section>
  </div>
</body>
</html>
```

## 하단 Dock 내비게이터

앱에서 많이 사용되고 기본이 되는 하단 Dock 내비게이터를 만들기 위해서 CodePen에 있는 오픈 소스를 가져와서 사용하였다.

> [내비게이터 확인하기](https://codepen.io/milanraring/pen/qBEPzKB?utm_campaign=CSS%20Animation%20Weekly&utm_medium=email&utm_source=Revue%20newsletter)

해당 소스를 가져와서 입맛에 맞게 수정하여 하단에 배치하고 꾸며보았다.

<div align="center">
 <image style="border: 1px solid black" src="../assets/gif/MobileDock.gif"/>
</div>

모든 아이콘은 HTML5에서 지원하는 SVG로 만들어졌으며 애니메이션 효과는 CSS의 Transform을 사용해서 구현되어있다. 

이 2가지의 방법만 사용하게 되면 사용자 친화적인 인터렉티브하게 구현 가능하다.

이렇게 2가지의 모양을 만들었다면 이제 2개의 다른 화면을 연동하는 작업을 해주어야 한다.

## JS를 사용해서 연결시켜주기

페이지를 이동할 방법은 2가지가 있다.

1. 슬라이드 움직여 Dock 맞추기
2. Dock 메뉴를 눌러 화면 맞추기

### 1. 슬라이드 움직여 Dock 맞추기

슬라이드를 하여 해당 화면이 보이면 하단의 Dock 아이콘이 활성화되도록 구현하였다. 모든 화면을 `IntersectionObserver`을 사용하여 감시하고 있다가 화면의 90%가 보이게 되면 input box을 체크하여 활성화를 시켜주었다.

모든 슬라이드에는 고유의 idx를 넣어주어 하단 Dock과 idx를 맞춰주었다.

```js
const sliders = document.querySelectorAll('section')
let targetIdx = 1

const interselect = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if (targetIdx === parseInt(entry.target.id.split('-')[1], 10)) {
        return
      }
      targetIdx = parseInt(entry.target.id.split('-')[1], 10)

      const targetId = 'tab-0' + targetIdx
      const targetEl = document.getElementById(targetId)

      targetEl.checked = true
    }
  })
}, {
  threshold: 0.9
})

sliders.forEach((slider) => {
  interselect.observe(slider)
})
```

### 2. Dock 메뉴를 눌러 화면 맞추기

Dock 아이콘을 눌러서 페이지를 이동하는 기능을 구현하였다.

문제가 있다면 `scroll-snap-type`을 사용하게 되면 원하는 scroll 위치를 이동하는 데 있어 문제가 발생하게 된다. 어떤 값을 주더라도 한 번에 1페이지씩 이동이 되지 않는 것이 문제가 되었다.

그래서 해당 인덱스 간 비교를 하여 해당 수 만큼 반복문을 돌려서 `scrollBy`로 이동하였다.

```js
const sliderC = document.querySelector('.slider')
const tabs = document.querySelector('.tabs')
let targetIdx = 1

tabs.addEventListener('click', function (e) {
  if (e.target.tagName === "INPUT") {
    const clickedIdx = parseInt(e.target.id.split('-')[1], 10)
    const move = clickedIdx - targetIdx

    for (let index = 0; index < Math.abs(move); index++) {
      sliderC.scrollBy(move, 0)
    }

    targetIdx = clickedIdx
  }
})
```

## 후기

웹에서 모바일 앱과 같은 모양을 만들어서 비슷한 기능까지 넣어보았다.

생각보다 디자인이 이쁘게 나오며 애니메이션이 잘 구현되어있다면, 이번에 구현된 모양보다는 더더욱 좋을 것으로 생각된다.

한가지 문제가 있다면 웹에서 슬라이드를 했을 때 더뎌보이는 문제가 보였으나 모바일로 보게 되면 훨씬 부드워러진 것을 보았다.

모바일용이라고 생각한다면 생각보다 좋았다. 그리고 CSS가 단순한 스타일만 아니라 더욱 멋있고 이쁘고 인터렉티브하고 만들어질 수 있는 요소라는 게 느껴졌으면 한다.

아래의 참고를 보고 이 대단한 CSS를 감상해보자

#### Reference

- [Best Practices To Use Scrolling Effects (With Examples)](https://uxplanet.org/best-practices-to-use-scrolling-effects-with-examples-a448ac761bb9)
- [Snowfall](https://codepen.io/shubniggurath/full/WgJZJo?utm_campaign=CSS%20Animation%20Weekly&utm_medium=email&utm_source=Revue%20newsletter)
- [Push to Hide](https://codepen.io/eliortabeka/pen/wXwPeb?utm_campaign=CSS%20Animation%20Weekly&utm_medium=email&utm_source=Revue%20newsletter)
- [CSS Pentagonal Bipryamid Gallery (Hover to navigate)](https://codepen.io/jh3y/pen/PowLmMX?utm_campaign=CSS%20Animation%20Weekly&utm_medium=email&utm_source=Revue%20newsletter)
- [Card Hover Animation (Cookie Run)](https://codepen.io/richard_w_here/pen/eYmXZMN?utm_campaign=CSS%20Animation%20Weekly&utm_medium=email&utm_source=Revue%20newsletter)
- [Insta-hearts](https://codepen.io/chrisgannon/details/BaNyWyd?utm_campaign=CSS%20Animation%20Weekly&utm_medium=email&utm_source=Revue%20newsletter)
- [Cut/Copy/Paste](https://codepen.io/cobra_winfrey/full/abzqxVr?utm_campaign=CSS%20Animation%20Weekly&utm_medium=email&utm_source=Revue%20newsletter)
- [Animated Night Hill Illustration - Pure CSS](https://codepen.io/aybukeceylan/pen/OJJzXde?utm_campaign=CSS%20Animation%20Weekly&utm_medium=email&utm_source=Revue%20newsletter)
