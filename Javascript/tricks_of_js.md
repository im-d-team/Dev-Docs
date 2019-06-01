# 자바스크립트 꿀팁

js로 개발하면서 엄청 대단한 것은 아니지만 생각보다 소소한 팁을 정리해봤다.

## Array.length

보통 배열의 길이를 구할 때 사용하는 속성이다. 그런데 이 속성을 이용하면 좀 더 재밌는 것을 할 수 있다.

### 빈 배열에 length 속성 할당

```js
const arr = [];
arr.length = 100;
console.log(arr); // (100) [empty × 100]
```

이렇게 만들면 빈 100칸짜리 배열이 만들어 진다.

### 반대로 배열의 length보다 작은 값 할당

```js
const arr = [1, 2, 3, 4, 5];
arr.length = 3;
console.log(arr); // (3) [1, 2, 3]
```

길이를 기준으로 뒤의 원소들을 그냥 지워버린다.

## switch문 대체하기

switch문은 다중 조건문에서 `if-else if-else` 구조보다 코드를 읽기 좋게 만들어준다.

```js
const doit = 'add';

switch (doit) {
  case 'add':
    console.log('this is add');
    break;
  case 'delete':
    console.log('this is delete');
    break;
  case 'update':
    console.log('this is update');
    break;
  case 'get':
    console.log('this is get');
    break;

  // ...

  default:
    console.log('this is nothing');
    break;
}
```

그런데 이 역시도 문제가 있다. 조건이 많아지면 코드가 꽤나 지저분해진다는 점이다. 이를 해결하는 방법이 자바스크립트 객체의 메서드를 이용하는 방법이다. 파이썬에서는 dispatching method라고도 불리는 방법이다.

```js
const obj = {
  add: () => console.log('this is add'),
  delete: () => console.log('this is delete'),
  update: () => console.log('this is update'),
  get: () => console.log('this is get'),
  post: () => console.log('this is post'),
  foo: () => console.log('this is foo')
};

const doit = 'add';

obj[doit]();
```

## filter(Boolean)

Array.prototype.filter() 메서드는 유용하게 사용되는 메서드다. callback의 return value가 true인 것만 반환된다.

사용 예시는 다음과 같다.

```js
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

console.log(arr.filter(x => x > 5)); // (5) [6, 7, 8, 9, 10]
```

그럼 아래와 같은 경우는 어떨까?

```js
const arr = ['', '[', "'abc'", undefined, '', '', undefined, '33', undefined, ' true', ']', ''];

const filteredArr = arr.filter(x => Boolean(x));
console.log(filteredArr); // (5) ["[", "'abc'", "33", " true", "]"]
```

이를 깔끔하게 더 줄이는 것도 가능하다.

```js
const arr = ['', '[', "'abc'", undefined, '', '', undefined, '33', undefined, ' true', ']', ''];

const filteredArr = arr.filter(Boolean);
```

결과는 완전히 동일하다. 비슷한 방식으로 아래와 같은 것도 가능하다.

```js
const stringNumbers = ['1', '2', '3', '4', '5', '6', '7', '8'];
const numbers = stringNumbers.map(Number);
```

- [JavaScript Tip: Remove ?falsy? Items Out of an Array](http://www.devign.me/javascript-tip-remove-falsy-items-out-of-an-array)

## Object.prototype.assign()

개발을 하다보면 객체를 파라미터로 넘겨야하는 경우가 있다. 그리고 심지어 파라미터로 받은 객체의 값을 수정해야 하는 경우도 생긴다.

물론 의존성의 측면에서 이는 매우 좋지 않으며 상태를 직접 변경하기 때문에 side-effect가 발생할 수 있다.

하지만 그런 이론적 배경에도 불구하고 객체를 넘겨야하는 경우가 있다. 그런데 문제는 객체의 값을 할당하기만 하면 포인터만 이동하여 얕은 복사가 된다는 점이다.

그러나 단순 복사가 아니라 깊은 복사가 필요한 경우가 있는데 이 때 assign을 이용하면 내용만 같은 새로운 객체가 만들어진다.

아래는 동작하진 않는 예제 코드다.

```js
const obj = { x: 10, y: 20 };

const changeValue = obj => {
  obj.x = 15;
  doSomething(obj);
};

changeValue(obj);

doAnoter(obj); // bug :  x는 10이어야 합니다.
```

doAnother는 꼭 x가 10이어야 하는 경우다.

이 경우 assign을 이용하여 아예 다른 객체를 넘길 수 있다.

```js
const obj = { x: 10, y: 20 };

const changeValue = obj => {
  obj.x = 15;
  doSomething(obj);
};

changeValue(Object.assign({}, obj));

doAnoter(obj);
```

mdn 문서에 따르면 함수 정의는 다음과 같다.

The Object.assign() method is used to copy the values of all enumerable own properties **from one or more source objects** **to a target object**. It will **return the target object**

Object.assign(target, ...sources)

- target
  - 대상 객체.
- sources
  - 하나 이상의 출처 객체.

핵심은 from sources to target then return target이다.

---

### 참고자료

- [JavaScript Tip: Remove ?falsy? Items Out of an Array](http://www.devign.me/javascript-tip-remove-falsy-items-out-of-an-array)
- [Object​.assign()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
