# 구조 분해 할당

```js
const { store } = this.props;
```

오른쪽의 객체에서 원하는 부분만 뽑아 사용하는 저런 구문을 react에서 처음 접했다. 처음엔 신기해서 그냥 쓰다가 어느 순간 궁금해지기 시작하여 이번에 다루어 봤다.

위처럼 오른쪽의 특정 값을 해체하여 왼쪽에 할당하는 표현식(expression)을 destructuring assignment라고 한다.

이 표현식은 ES6부터 추가 되었으며 배열이나 객체의 속성을 분해하여 다룰 수 있다.

## 배열

```js
var x = [0, 1, 2, 3, 4, 5];
var [a, b, , c] = x;
console.log(a, b, c); // 0 1 3
```

말로 설명해야 할까 싶을 정도로 단순하다. line 2의 코드의 우변의 배열에서 각각 해당하는 요소들을 우변의 변수에 할당해준다.

이는 파이썬과 같은 언어들에서 찾아 볼 수 있다.

### 응용

---

이를 응용하는 방식으로는 대표적으로 변수의 값 교환(swap)하는 알고리즘을 간단히 바꿀 수 있다.

```js
var x = 1;
var y = 2;
var tmp = x;

x = y;
y = tmp;

console.log(x, y);
```

보통의 경우 swap은 간단하게 이렇게 구현한다. 그런데 구조 분해 할당을 이용하면 매우 간결해진다.

```js
var x = 1;
var y = 2;

[x, y] = [y, x];
console.log(x, y);
```

조금 더 나아가 sperad operator를 함께 사용할 수도 있다.

```js
var [x, ...y] = [1, 2, 3];
console.log(x); // 1
console.log(y); // [2, 3]
```

## 객체

```js
var x = { a: 1, b: 'hello' };
var { a, b } = x;

console.log(a, b); // 1, 'hello'
```

배열을 잘 이해했다면 딱히 어려움 없이 이해할 수 있다. `x.a`와 `x.b`를 각각 전역스코프 변수 a와 b에 할당한다.

### 응용

---

위와 같이 사용하면 변수의 이름은 a와 b밖에 사용하지 못한다. 전역스코프의 변수명을 다르게 하고 싶다면 아래와 같이 사용 가능하다.

```js
var x = { a: 1, b: 'hello' };
var { a: count, b: text } = x;

console.log(count, text); // 1, 'hello'
```

또한 객체에서도 마찬가지로 sperad operator를 사용할 수 있습니다.

```js
var x = { a: 1, b: 'hello', c: 2, d: true };
var { a, b, ...rest } = x;

console.log(a, b, c); // 1, 'hello', {c: 2, d: true}
```
