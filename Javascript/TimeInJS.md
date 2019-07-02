# Time in JS

js를 사용하여 시간을 측정해야하는 경우가 있다.

예를 들어 내 코드가 얼마만큼의 시간을 사용했는지 알고 싶은 경우다.
또 [쓰로틀링](https://github.com/Im-D/Dev-Docs/blob/master/Javascript/throttling%EA%B3%BC%20rAF.md)처럼 몇 초 동안 이벤트가 한 번만 발생하게 만들어야 하는 경우도 있다.

물론 프론트의 js 코드에서는 엄청 정밀한 시간이 필요한 경우가 많지는 않다.
하지만 정확도 높은 시간을 사용한 코드는 언제 어떻게 실행되어도 동일하게 동작한다는 것을 보장한다. 품질이 좋아진다.

따라서 시간을 측정하는 방법을 알아둘 필요가 있다.

js에서 시간을 측정하는 방법은 크게 4가지가 존재한다.

- Date.now
- console.time
- process.hrtime (nodeJS)
- performance

## Date.now

Date는 가장 고전적이며 쉽게 접근할 수 있는 API다.

Date.now를 사용하면 1970년 1월 1일 0시 0분 0초부터 현재까지 경과된 밀리 세컨드(milliseconds)를 Number 타입으로 반환한다.

특정 코드 이전과 이후에 Date.now를 사용하면 그 코드의 실행 시간을 알 수 있다.

```js
const start = Date.now();

let arr = ['1'];
for (let i = 0; i < 10000000; i++) {
  arr.push('' + i);
}

const end = Date.now();

console.log((end - start) / 1000);
```

Date.now 메서드는 시스템 시간을 기준으로 현재 타임스탬프를 받는다. 그래서 user agent에 따라 다를 수 있어 신뢰성이 떨어진다.

## console.time

이걸 사용하면 Date.now보다 간편하게 이용할 수 있다.

```js
console.time('pushTest');

let arr = ['1'];
for (let i = 0; i < 10000000; i++) {
  arr.push('' + i);
}

console.timeEnd('pushTest');
```

pushTest라는 label을 붙일 수 있다.

하는 일은 동일하다. console 객체에 있는 profile과 같은 메서드를 사용하여 dev tools에서 더 다양한 정보를 볼 수도 있다.

![devtools-profiler](https://user-images.githubusercontent.com/24724691/59844588-4136d200-9396-11e9-9246-202df143ab0f.PNG)

## process.hrtime

nodejs에서는 위의 두가지 방법보다 더욱 정밀한 방법으로 process.hrtime를 제공한다.

이는 nanoseconds까지 정확히 측정가능하며 [clock drift](https://en.wikipedia.org/wiki/Clock_drift) free하다.

```js
const hrstart = process.hrtime();

let arr = ['1'];
for (let i = 0; i < 10000000; i++) {
  arr.push('' + i);
}

const hrend = process.hrtime(hrstart);

console.log(hrend);
//[2, 488580674]
```

hrtime은 반환값이 array인데 각각 [seconds, nanoseconds]다.

## performance

브라우저에서는 μs라고 표기하는 마이크로 세컨드까지 정확한 API를 제공한다. 이 performance는 시스템 clock과는 무관하다.

console.time의 ms는 밀리세컨드로 1s / 1000 이다.
performance에서 제공하는 μs는 1ms / 1000 이다.

사용방법은 Date.now와 동일하다.

```js
const start = performance.now();

let arr = ['1'];
for (let i = 0; i < 10000000; i++) {
  arr.push('' + i);
}

const end = performance.now();

console.log((end - start) / 1000);
```

performance.now의 반환값은 DOMHighResTimeStamp다. 이는 ms(밀리 세컨드)인데 소수점을 포함한다. 따라서 마이크로 세컨드까지 정확하다.

performance.now가 측정되는 시간은 [performance.timing.navigationStart](https://www.w3.org/TR/navigation-timing/#dom-performancetiming-navigationstart)부터다.
이 시간은 이전 document가 unload되며 새로운 document를 fetch하는([fetchStart](https://www.w3.org/TR/navigation-timing/#dom-performancetiming-fetchstart)) 시점이다.

브라우저에서 제공하는 방법들은 web worker를 사용한다. 현재 performance가 그 중에 가장 정확한 시간을 측정할 수 있다.

---

### 참고자료

- [Measurement of Node.js execution time](https://blog.abelotech.com/posts/measure-execution-time-nodejs-javascript/)
- [Measuring Execution Times in JavaScript with console.time()](https://mariusschulz.com/blog/measuring-execution-times-in-javascript-with-consoletime)
- [Discovering the High Resolution Time API](https://www.sitepoint.com/discovering-the-high-resolution-time-api/)
- [When milliseconds are not enough: performance.now](https://developers.google.com/web/updates/2012/08/When-milliseconds-are-not-enough-performance-now)
- [performance.now()-mdn](https://developer.mozilla.org/ko/docs/Web/API/Performance/now)
