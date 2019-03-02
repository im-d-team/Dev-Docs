# Optional Chaining

## 소개

이 내용은 아직 공식 스펙으로 채택하지 않았다. 다만 추후 추가될만한 소지가 있으며 충분히 매력적이므로 소개해본다.

조건적으로 체이닝을 할 수 있다. 이게 무슨 소릴까? 무슨 조건을 이야기 하는 것일까?

바로 undefined나 null의 경우 선택적으로 체이닝 할 수 있게하는 문법이다. javascript 뿐만아니라 C#, Swift, CoffeeScript 에서도 지원하는 문법이다.

## 기존의 방식

```js
var person = {
  name: {}
};
var certif = person.spec.certification;
console.log(certif); // Cannot read property 'certification' of undefined
```

이런 에러를 받아보는 경우가 상당하다. 보통 object 형식에서 데이터를 받아 온 뒤 그 데이터를 사용해야하는 경우인데, 아직 받아오지 않은 상태에서 작업을 해야하는 경우다.

그래서 보통은 몇 가지 방법으로 방어적인 코드를 사용한다.

```js
var person = {
  name: 'tom'
};

var certif = '';

// 1번
if (person.hasOwnProperty('spec')) {
  certif = person.spec.certification;
}

// 2번
if (!!person.spec) {
  certif = person.spec.certification;
}

// 3번
try {
  certif = person.spec.certification;
} catch (e) {
  certif = '';
}
console.log(certif); // ''
```

나는 개인적으로 3가지 방식 모두 자주 사용하고 있었다.

혹은 `user.name && user.name.lastName` 처럼 null을 체크하는 방식들도 자주 보인다.

그런데 이러한 방식들은 코드의 가독성을 해친다. 또한 자료구조가 조금 복잡해진다면 엄청나게 중요한 코드가 아님에도 생산성이 저하될 수 있다.

## 새로운 방식

방법은 매우 너무나도 간단하다.

```js
var person = {
  name: {}
};
var certif = person?.spec?.certification;
console.log(certif);
```

. 앞에 ? 를 추가해주면 끝이다.

null이나 undefined가 아니라면 그냥 실행하는 방식이다.

```js
const obj = {
  foo: {
    bar: {
      baz: 100
    }
  }
};

const baz = obj?.foo?.bar?.baz; // 100
const baz = obj && obj.foo && obj.foo.bar && obj.foo.bar.baz;
```

이는 babel 공식문서의 소개글의 예시다. 충분히 더 복잡한 자료구조와 씨름할 수 있는 상황이 많다. 따라서 이 문법을 사용한다면 얼마나 편한지 안보고도 알 수 있을 것 같다.

## 한계

현재 babel의 Stage 1에 머물러 있다.

- optional construction: new a?.()
- optional template literal: a?.`{b}`
- constructor or template literals in/after an Optional Chain: new a?.b(), a?.b`{c}`
- optional property assignment: a?.b = c

이러한 이유들 때문이다. 사용 케이스가 있긴 하지만 아직 불안정하기 때문에 지원하지 않는다고 한다.

---

### 참고자료

- [Optional Chaining for JavaScript](https://github.com/tc39/proposal-optional-chaining)
- [@babel/plugin-proposal-optional-chaining](https://babeljs.io/docs/en/next/babel-plugin-proposal-optional-chaining.html)
- [Javascript Optional Chaining](https://dev-momo.tistory.com/entry/Javascript-Optional-Chaining)
- [Optional Chaining Operator in JavaScript](https://www.youtube.com/watch?v=FKRVqtP8o48)
- [9 Tricks for Kickass JavaScript Developers in 2019](https://levelup.gitconnected.com/9-tricks-for-kickass-javascript-developers-in-2019-eb01dd3def2a?gi=4624a912a47f)
