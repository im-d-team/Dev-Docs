# Spread Operator

## 전개 연산자

ES2015인 ES6부터 새롭게 추가된 연산자다. 배열을 각 요소로 확장하는 연산자다. 생긴건 `...` 이렇게 생겼다. 말로 설명하자면 좀 복잡하고 개발자답게 코드로 보는 것이 가장 쉽다.

그런데 대표적인(typically) 예가 좀 애매하다. 이 전개 연산자는 여러가지를 대체할 수 있기 때문이다. 그래서 몇가지 예시 찾아봤다.

## 기존의 문제점

```js
var midArr = [3, 4];
var arr = [1, 2, midArr, 5, 6];

console.log(arr); // [1, 2, Array(2), 5, 6]
```

우리가 원한건 이게 아니다.

## concat의 확장

위의 문제를 해결하는게 원래 concat과 같은 메서드다. 다만 concat은 앞뒤를 이어주기만 하지 중간으로 들어갈 수가 없다.

```js
let a = [1, 2, 3];
let b = ['foo', 'bar'];

let c = a.concat(b);
console.log(c); // [1, 2, 3, "foo", "bar"]
```

단순히 앞뒤를 더해 새로 만드는 것은 concat이 성능적으로 조금 더 좋다. 다만 중간에 추가하는 다음과 같은 경우는 spread를 사용한다.

```js
let a = [1, 2, 3];
let b = ['foo', 'bar', ...a];

console.log(b); // ["foo", "bar", 1, 2, 3]
// let c = [...a, ...b] 이 코드는 그다지 좋지 않다.
```

`...`을 사용하면 기존 `[1,2,3]`의 배열이 `1 2 3`으로 변경된다. 말그대로 spread다.

이걸 조금 더 강력하게 사용할 수 있는 점은 중간에 넣을 수도 있다는 것이다.

```js
let a = [1, 2, 3];
let b = ['foo', ...a, 'bar'];

console.log(b); // ["foo", 1, 2, 3, "bar"]
```

## 인자의 배열 대체

함수의 인자에 들어가는 배열을 대체할 수 있다.

함수호출은 그냥 `함수명()`으로 실행한다. 아래와 같은 상황에서 사용될 수 있다.

```js
let arr = [1, 2, 3, 4, 5];
let arr2 = [1, 2, 3];
let sum = (a, b, c, d, e) => a + b + c + d + e;

let sumArr = sum(...arr);
let sumArr2 = sum(...arr2, 10, 100);

console.log(sumArr); // 15
console.log(sumArr2); // 116
```

## 배열복사

배열 복사는 사실 코딩하다보면 꽤나 많이 쓰이는 기능이다. 기존의 배열에 영향을 주지 않고 어떤 기능을 하기 위해서 많이 쓰인다.

그냥 간단하게 사용하면 된다.

```js
let arr = [1, 2, 3, 4];
let arr2 = [...arr];
```

## String to Array

사실상 구체적으로 보자면 배열복사와 크게 다르진 않지만 쉽게 쓰이는 트릭이다. 흔히들 문자열을 배열로 만드려면 `str.split("")`이렇게 사용하지만 좀 더 명확하게 spread operator를 사용할 수 있다.

```js
let str = 'helloWorld!';
let strArr = [...str];

console.log(strArr); //["h", "e", "l", "l", "o", "W", "o", "r", "l", "d", "!"]
```

## object 복사(할당)

object는 iterable 객체는 아니지만 값을 할당할 때는 spread operator를 사용할 수 있다. react의 setState에서 사용하는 기술과 동일하다.

```js
let obj1 = {
  '1': 'a',
  '2': 'b'
};

let obj2 = {
  ...obj1,
  '3': 'c'
};

console.log(obj2); // { '1': 'a', '2': 'b', '3': 'c' }
```
