# 프로미스 패턴

두개 이상의 프로미스를 사용한 비동기 흐름을 제어할 때 사용한다. 예를들어 a 와 b 라는 비동기 작업이 모두 완료되면 c 라는 비동기 작업을 진행해야 한다고 하면 이 경우 어떻게 해야할까를 정의한 것이 프로미스 패턴이다.

## All 과 Race

### Promise.all([])

---

관문패턴이다. 프로세스를 모두 나중으로 미뤄 모두 준비가 되면 시작한다.

```js
// request는 promise 패턴의 비동기 사용자 정의 함수라고 가정
var p1 = request('https://');
var p2 = request('https://');

Promise.all([p1, p2])
  .then(function(value) {
    return request('http://');
  })
  .then(function(msg) {
    console.log(msg);
  });
```

이 배열 안의 값은 promise, thenable, 즉시값 모두 가능하다. 현재는 비동기 처리 후 프로미스가 들어간다. 다만 어떠한 값이 들어가도 상관없다. 그 이유는 Promise.resolve()로 정규화를 하기 때문이다.

여기서 중요한 점은 배열안의 값이 버림처리되면(reject) 모든 결과가 무효처리 되어 버린다. 그렇기 때문에 꼭 에러 처리기를 붙이도록 하자.

### Promise.race([])

---

걸쇠 혹은 경합이라고 불리는 패턴이다. 먼저 온 것만 실행된다. 배열 안의 값은 어떤것이 들어가도 상관없다. 즉시값이 들어가도 되지만 즉시값은 순서가 1 순위라 의미가 없다.

사용법은 all 과 동일하다.

### 타임아웃 경합

---

경합 패턴을 사용하면 타임아웃 패턴을 구현할 수 있다.

```js
function timeoutPromise(time) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject('타임아웃');
    }, time);
  });
}

Promise.race(foo, timeoutPromise(3000)).then(
  function() {
    //
  },
  function(err) {
    // err
  }
);
```
