# Promise2

## Promise.resolve()

프로미스는 사실 별게 아니다. 콜백을 넘겨주는 위치를 달리했을 뿐이다. foo()에 콜백을 넘기는 것이 아닌 foo()에서 프로미스를 받은 뒤 이 프로미스에 콜백을 준 것이다.

프로미스가 나오게 된 가장 중요한 점은 믿음이다.
근데 중요한 것은 이 받은 프로미스가 진짜 프로미스가 아니라면? 단지 .then()을 쓸 수 있는 object 라면 어떨까?

이를 책 *You Don't Know JS*에서는 Thenable 이라고 한다.

```js
var p = {
  then: function(foo, err) {
    foo(42);
    err('하이');
  }
};

p.then(
  function resolve(val) {
    console.log(val);
  },
  function rejected(err) {
    console.log(err);
  }
);
```

이 Object p처럼 then()이 있는 thenable은 모두 프로미스처럼 보이게 동작할 수 있다.

이 경우 Promise.resolve()로 해결이 가능하다. Promise.resolve()를 거치면 이 값으로 이루어진 프라미스 객체가 반환된다.

이게 굉장히 중요하다. 프로미스가 등장한 이유가 믿음성인데 이 믿음성을 해결해준다.

```js
var p1 = new Promise(function(resolve, reject) {
  resolve(42);
});
var p2 = Promise.resolve(42);

p1 === p2; // true
```

자 이제 Thenable 한 값을 Promise.resolve()에 들어가면 정규화시켜보자.

```js
Promise.resolve(p).then(
  function resolve(val) {
    console.log(val);
  },
  function rejected(err) {
    console.log(err); // 실행 안됌
  }
);
```

자 그럼 이제 할 일은 아래와 같다. 만일 foo()가 어떤 비동기 행위이며 반환값이 프로미스인지 확신하게끔 만들자.

```js
foo(42).then(function(v) {
  console.log(v); // 멍청
});

Promise.resolve(foo(42)).then(function(v) {
  console.log(v); // 현명
});
```

이러면 어떠한 경우에도 무리가 없다. 믿음이 확실해진다.

## 익숙한 ajax

그럼 자주 사용하는 ajax 에 응용해보자.

가장 중요하게 기억해야 할 것은 기존의 콜백은 백그라운드에서 호출, 프로미스는 호출스택에서 호출한다는 점이다.

```js
function request(url) {
  return new Promise(function(resolve, reject) {
    // ajax의 콜백함수가 일반 함수가 아니라 방금 생성한 promise의 resolve가 된다.
    ajax(url, resolve);
  });
}

request('https://...')
  .then(function(response1) {
    return request('https://.../?q=' + response1);
  })
  .then(function(response2) {
    console.log(response2);
  });
```

자주 사용되는 AJAX 공통 코드를 Promise를 이용해서 더욱 믿음을 가지고 사용할 수 있게 될 것이다.
