# Iteration Protocol

`Iteration Protocol`은 ES6에서 도입되었다. 이는 새로운 구문이 아닌 하나의 프로토콜, 규약이다. 즉, 같은 규칙을 준수하는 객체에 의해 구현될 수 있다. `Iteration Protocol`에는 **Iterable Protocol** 과 **Iterator Protocol** 이 있다.

<br/>

## Iterable

`Iterable`은 `Iterable Protocol`을 준수한 객체다. `Iterable`은 반복 가능한 객체이며 `Symbol.iterator` 메서드를 구현하거나 프로토타입 체인에 의해 상속한 객체를 말한다. `Iterable`은 `for...of`문에서 반복 가능하며 [Spread Operator](https://github.com/Im-D/Dev-Docs/blob/master/ECMAScript/Spread_Operator.md)의 대상이 될 수 있다.

`Iterable`은 `Symbol.iterator`을 가지기 때문에 해당 메서드가 없는 객체는 Iterable 객체가 아니다.

Iterable 객체로는 내장 객체인 `Array`, `Map`, `Set`, `String` 등이 있다.

```js
const iterator = [1, 2, 3][Symbol.iterator]();

iterator.next().value; // 1
iterator.next().value; // 2
iterator.next().value; // 3
iterator.next().done; // true
```

반면, 일반 객체는 `Symbol.iterator` 메서드를 가지고 있지 않다. 따라서 일반 객체는 Iterable 객체가 아니다.

```js
const obj = { a: 1, b: 2 };

console.log(Symbol.iterator in obj); // false

// TypeError: obj is not iterable
for (const item of obj) {
  console.log(item);
}
```

하지만 일반 객체도 `Iterable Protocol`을 준수하도록 구현하면 Iterable 객체가 될 수 있다.

```js
const iterableObj = function (max) {
  let i = 0;

  return {
    [Symbol.iterator]() {
      return {
        next() {
          return {
            value: ++i,
            done: i === max
          };
        }
      };
    }
  };
};

const iterator = iterableObj(10);

for (let item of iterator) {
  console.log(item);
}
```

<br/>

## Iterator

`Iterator Protocol`은 `next` 메서드를 가진다. `next` 메소드를 호출하면 Iterable 객체를 순회하며 `value`, `done` 프로퍼티를 갖는 Iterator Reuslt 객체를 반환한다. 이 규약을 준수한 객체가 Iterator 객체다.

위에서 잠깐 봤던 코드의 일부분을 다시 한 번 살펴보자.

```js
[Symbol.iterator]() {
  return {
    next() {
      return {
        value: ++i,
        done: i === max
      };
    }
  };
}
```

`Symbol.iterator` 메서드를 실행하면 `next` 메서드를 가진 객체를 반환하고 `next` 메서드를 실행하면 `value`, `done` 프로퍼티를 가진 객체를 반환한다. 그렇다. <br/> Iterable 객체가 가진 `Symbol.iterator` 메서드를 실행하면 Iterator 객체를 반환한다.

```js
const array = [1, 2, 3];

const iterator = array[Symbol.iterator]();

console.log('next' in iterator); // true

iterator.next().value; // 1
iterator.next().value; // 2
iterator.next().value; // 3
iterator.next(); // { value: undefined, done: true }
```

Iterator 객체의 `next` 메서드가 반환하는 Iterator Result 객체의 `value` 프로퍼티는 Iterable 객체의 값을 반환하고 `done` 프로퍼티는 Iterable 객체의 반복 완료 여부를 반환한다.

<br/>

## Iteration Protocol이 왜 필요할까?

`for...of`, `Spread Operator`, `Destructuring`, `Map/Set constructor`등을 **데이터 소비자(Data Consumer)** 라고 한다.<br/> 반면, `배열`, `문자열`, `Map`, `Set`, `DOM Data Structure` 등과 같은 Iterable 객체는 **데이터 공급자(Data Provider)** 라고 한다.

만약, 위와 같은 Data Provider인 Iterable 객체들이 각각 다른 방식의 순회 방식을 갖는다면 어떨까? 당연히 효율적이지 못하다.

순회 방식에 대한 하나의 규약을 정해놓고 사용한다면 Data Consumer가 여러 구조의 Iterable을 효율적으로 사용할 수 있을 것이다. 즉, Iteration Protocol은 Data Consumer와 Data Provider를 연결하는 인터페이스 역할을 해주기 때문에 필요하다고 볼 수 있다.

---

### Reference

- [Poiemaweb - 이터레이션과 for...of 문](https://poiemaweb.com/es6-iteration-for-of)
- [wonism.github.io - JavaScript iterables와 iterator 이해하기](https://wonism.github.io/javascript-iteration-protocol/)
- [MDN Docs - Iteration protocols](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Iteration_protocols)
