## 쓰로틀링 vs 디바운싱

함수를 호출할 때 호출이 너무 많이 되어 과부화 됨을 방지하기 위한 기술이다.

함수 호출이 잦은 예로는 브라우저의 이벤트가 있다. `onScroll` 이나 `onChange` 와 같은 이벤트의 콜백으로 함수를 호출하는 경우 굉장히 많은 호출이 발생할 수 있다.

infinite scroll 이나 자동완성 기능의 경우 사용자의 특정 이벤트에 따라 비동기 콜백을 호출하는 방식이다. 이 경우 이벤트가 매우 빈번하게 일어나며 많은 호출을 제어하지 않으면 브라우저가 버티지 못할 것이다. 이 때 사용하는 것이 쓰로틀링과 디바운싱이다.

### 쓰로틀링(Throttling)

Throttle 은 정해진 시간동안 특정 행위를 한 번만 호출하도록 하는 것이다. 예를 들어 스크롤 행위가 1 초에 500 번이 발생한다면 이를 0.2 초에 한 번만 실행하게 만들 수 있다. 

Throttle 처리가 되지 않은 경우 콜백이 500 번 발생한다. 하지만 Throttle 처리가 된다면 5 번만 실행되게 만드는 기술이다.

스크롤 이벤트의 경우 작은 움직임에도 엄청나게 많은 이벤트가 발생한다. 따라서 1 초 미만으로 쓰로틀링을 하여 같은 동작의 여러번 호출을 1 번으로 제어하는 것이 좋다.

```js
var timer;
document.querySelector('#input').addEventListener('input', function (e) {
    // 1. timer 값이 undefined니까 if문 실행
    if (!timer) {
        // 2. timer 에 time함수 설정
        timer = setTimeout(function () {
            // 3. 설정시간에 맞춰 timer 초기화 및 함수 실행
            timer = null;
            console.log('비동기 요청', e.target.value);
        }, 2000);
    }
});
```

### 디바운싱(Debouncing)

Debounce 는 한 행위를 여러 번 반복하는 경우, 마지막 행위 이후 특정 시간이 흐른 뒤에 콜백을 호출하도록 하는 방식이다. 자동완성 즉 autocomplete 를 떠올리면 편하다.

input 의 `onChange`가 일어나면 callback 으로 AJAX 를 이용해 관련 데이터를 긁어온다. 그런데 사용자의 모든 입력에 AJAX 호출을 한다면 브라우저가 견디지 못할 것이다. 
그래서 일정시간동안 Timer 를 만든다. 이 타이머의 시간동안 입력이 발생해 변경이 일어나면 Timer 를 초기화 한다. 
입력이 멈추어 Timer 가 다 되면 AJAX 를 호출한다.

```js
var timer;
document.querySelector('#input').addEventListener('input', function (e) {
    // 1. timer 값이 undefined니까 if문 실행
    if (timer) {
        // 3-1. setTimeout이 끝나기 전에 다시 이벤트 실행 시 time함수 클리어 (이벤트 호출 시 마다 반복)
        clearTimeout(timer);
    }
    // 2. 함수 할당
    // 3-2. 함수 할당 (이벤트 호출 시 마다 반복)
    timer = setTimeout(function () {
        console.log('비동기 요청', e.target.value);
    }, 2000);
    // 4. 설정 시간 지나면 함수 종료
});
```

[Lodash](https://lodash.com/) 와 [Underscore](https://underscorejs.org/)에는 해당 기능들이 구현되어 있다.

---

#### 🙏Reference

- [[JS] 쓰로틀링(Throttling)과 디바운싱(Debouncing)](https://jm-web.tistory.com/33)
- [zerocho blog - 쓰로틀링과 디바운싱](https://www.zerocho.com/category/JavaScript/post/59a8e9cb15ac0000182794fa)
- [CSS-Tricks 의 Throttling 과 Debouncing](https://css-tricks.com/debouncing-throttling-explained-examples/) => 예시가 구현되어 있음
