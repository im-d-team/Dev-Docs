# Generator와 async-await

`Generator`는 `ES6`에서 도입되었으며 `Iterable`을 생성하는 함수다. `Generator`를 사용하면 `Iteration Protocol`을 사용하여 `Iterable`을 생성하는 방식보다 간편하다.<br/>
`Iteration Protocol`에 대한 자세한 내용은 [다음](https://github.com/Im-D/Dev-Docs/blob/master/ECMAScript/Iteration_Protocol.md)을 참고하길 바란다.

<br/>

## Generator 함수의 정의

`Generator` 함수는 코드 블록을 한 번에 실행하지 않고 함수 코드 블록의 실행을 중지했다가 필요한 시점에 다시 시작할 수 있는 함수다.<br/>
`Generator` 함수는 `function *` 키워드를 사용하며 하나 이상의 `yield` 문을 포함한다.

```js
// 함수 선언문
function* decFunc() {
  yield 1;
}

let genObj = decFunc();

// 함수 표현식
const expFunc = function* () {
  yield 1;
};

genObj = expFunc();

// 메서드
const obj = {
  * objectMethod() {
    yield 1;
  }
};

genObj = obj.objectMethod();

// 클래스 메서드
class GenClass {
  * classMethod() {
    yield 1;
  }
}

const genClass = new GenClass();
genObj = genClass.classMethod();
```

<br/>

## Generator 객체

`Generator` 함수를 호출하면 코드 블록이 실행되는 것이 아니라 `Generator` 객체를 반환한다. `Generator` 객체는 이터러블이면서 동시에 이터레이터다. 따라서 `Symbol.iterator`를 사용하여 이터레이터를 생성할 필요 없다.

```js
function* counter() {
  console.log('First');
  yield 1;
  console.log('Second');
  yield 2;
  console.log('Third');
  yield 3;
  console.log('The end');
}

const genObj = counter();

console.log(genObj.next()) //{value: 1, done: false}
console.log(genObj.next()) //{value: 2, done: false}
console.log(genObj.next()) //{value: 3, done: false}
console.log(genObj.next()) //{value: undefined, done: true}
```

`Generator` 객체는 이터러블이면서 이터레이터이기 때문에 `next()`메서드를 가지고 있다. 따라서 `next()` 메서드를 호출하면 `yield`문까지 실행되고 일시 중지된다. 다시 `next()` 메서드를 호출하면 다음 `yield`문을 만날 때까지 실행된 뒤 일시 중지된다.

<br/>

## Generator 객체를 이용한 이터러블 구현

```js
const genObj = (function* () {
  let i = 0;

  while(true) {
    yield ++i;
  }
}());

for (let item of genObj) {
  if (item === 10) break;
  console.log(item);
}
```

```js
// Generator 함수에 파라미터 전달
const genObj = function* (max) {
  let i = 0;

  while(true) {
    if (i === max) break;
    yield ++i;
  }
}

for (let item of genObj(10)) {
  console.log(item);
}
```

```js
// next 메서드에 파라미터 전달
function* genFunc(n) {
  let res;
  res = yield n;

  console.log(res);
  res = yield res;

  console.log(res);
  res = yield res;

  console.log(res);
  return res;
}
const genObj = genFunc(0);

console.log(genObj.next());
console.log(genObj.next(1));
console.log(genObj.next(2));
console.log(genObj.next(3));

```

<br/>

## Generator를 이용한 비동기 처리

`Generator`의 진면목은 비동기 프로그래밍에서 볼 수 있다. 함수가 실행 도중에 멈춘다니. 언제 응답이 올지 알 수 없기 때문에, callback을 등록하는 비동기 프로그래밍에 응용하면 callback hell을 탈출할 수 있지 않을까?

```js
function getId(phoneNumber) {
    // …
    iterator.next(result);
}

function getEmail(id) {
    // …
    iterator.next(result);
}

function getName(email) {
    // …
    iterator.next(result);
}

function order(name, menu) {
    // …
    iterator.next(result);
}
function* orderCoffee(phoneNumber) {
    const id = yield getId(phoneNumber);
    const email = yield getEmail(id);
    const name = yield getName(email);
    const result = yield order(name, 'coffee');
    return result;
}

const iterator = orderCoffee('010-1234-1234');
iterator.next();
```

<br/>

## async-await를 이용한 비동기 처리

`async-await`를 활용하면 `Generator`를 이용했을 때 처럼 제어권을 다시 `Generator`에 넘기기 위해 각 비동기 함수마다 `next()`를 호출하지 않아도 된다.

```js
async function orderCoffee(phoneNumber) {
    const id = await getId(phoneNumber);
    const email = await getEmail(id);
    const name = await getName(email);
    return await order(name, 'coffee')
}

orderCoffee('011-1234-5678').then(result => {
    console.log(result);
});
```

<br/>

## Generator는 어떻게 구현되어 있을까?

```js
// ES6
function* foo(){
    yield bar();
}

// ES5 Compiled
"use strict";

var _marked = /*#__PURE__*/ regeneratorRuntime.mark(foo);

function foo() {
    return regeneratorRuntime.wrap(
        function foo$(_context) {
            while (1) {
                switch ((_context.prev = _context.next)) {
                    case 0:
                        _context.next = 2;
                        return bar();
                    case 2:
                    case "end":
                        return _context.stop();
                }
            }
        },
        _marked, this
    );
}
```

`Genrator`는 결국 `iterable Protocol`를 구현하는 객체이다. 그러나 프로토콜과 관련된 어느것도 보이지 않는다.

대신 `regeneratorRuntime`이 보인다.

`babel`에서는 `regeneratorRuntime`라이브러리를 사용해서 구현을 했다.

코드의 역사를 따라가다 보면 [facebook/regenerator](https://github.com/facebook/regenerator/blob/master/packages/regenerator-runtime/runtime.js) repository에 도달하게 된다.

이 라이브러리는 2013년 Node.js v0.11.2에서 generator syntax를 지원하기 위해 만들어 졌으며, Babel에서는 이 라이브러리를 사용하여 generator를 구현하고 있다. 실제 코드를 들여다보면 Symbol과 Iterator를 이용해서 Iterable Protocol을 구현하고 있다.

---

### Reference

- [Poiemaweb-Generator와 async/await](https://poiemaweb.com/es6-generator)
- [ES6의 제너레이터를 사용한 비동기 프로그래밍](https://meetup.toast.com/posts/73)
- [MDN Docs-Genenrator](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Generator)
