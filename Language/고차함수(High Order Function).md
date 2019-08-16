# 고차함수(High Order Function)

<br/>

## 코드의 복잡성

큰 프로그램은 복잡성이 올라간다. 그 복잡성은 코드를 이해하기 어렵게 만들고 코드 간의 의존성을 높인다. 이러한 코드는 버그를 유발하고 유지보수가 어려워진다.

흔히 프로그래밍을 공부하면 알 수 있는 원론적인 내용이다. 아래 코드를 비교해보자. 순서대로 1번과 2번 코드다.

```js
let total = 0,
  count = 1;
while (count <= 10) {
  total += count;
  count += 1;
}
console.log(total);
```

```js
console.log(sum(range(1, 10)));
```

두개의 코드는 완전히 동일한 기능을 한다. 물론 아래의 코드의 sum이나 range는 정의되지 않았다.
역시 sum이나 range의 내부 코드가 얼마나 복잡하게 구현되어 있는지는 모른다.

2번의 sum이나 range의 구현 코드는 1번의 코드의 loop이나 변수, 조건문이 똑같이 들어 있을 것이다. 따라서 **코드의 길이는 1번이 더 짧을 수 있다.**

그러나 2번째 코드는 훨씬 **직관적** 이다. 1번 코드는 코드를 보면서 실행 플로우를 따라가야 한다. 아래의 코드는 1~10을 sum한다라고 직관적으로 이해할 수 있다.

이렇게 훨씬 단순하게 표현하는 것을 프로그래밍에서 우리는 **추상화** 라 부른다.

## 추상화

> Abstractions hide details and give us the ability to talk about problems at a higher (or more abstract) level. - 자바스크립트 개론(Eloquent JavaScript)

추상화는 상세한 것을 숨겨 문제를 higher level에서 이야기 할 수 있도록 하는 것이다.

CS에서 low level과 high level은 아주 간단하게 말하면 얼마나 복잡하냐를 이야기한다. low-level일수록 더욱 구체적이며 high-level일수록 더욱 추상적이다.

low-level language는 기계어와 가까우며 high-level language는 인간의 언어와 더욱 가깝다.

다시 돌아가서 추상화라는 것은 문제를 higher level에서 이야기 할 수 있게 만든다.

higher level에서 문제를 다룰수록 문제점을 더욱 명확하게 바라볼 수 있고, 단순하게 접근하여 큰 그림을 그릴 수 있게 된다.

## Higher order function

고차함수는 수학에서 온 단어로 아래 **두 조건 중 한 가지를 만족** 하는 함수다.

- 하나 이상의 함수를 인수로 취한다.
- 함수를 결과로 반환한다.

고차함수는 값만이 아니라 동작을 추상화 시킨다. 즉 행위도 추상화에 포함이다.

```js
console.log(sum(range(1, 10)));
```

다시 예시를 가져오자면 이 예시는 1~10까지 나열하는 것, 모두 더하는 것이 추상화 된 결과다.

### javascript 고차함수

자바스크립트에서 함수는 일급객체다. 일급객체는 쉽게 설명해서 생성, 대입, 연산, 인자 또는 반환값으로서의 전달 등 기본 연산이 가능한 대상을 말한다.

바로 위에서 설명하듯 인자 또는 반환값으로 전달이 가능하다.

따라서 자바스크립트의 함수는 위의 두 조건을 만족할 수 있고 만족하게 코딩했다면 고차함수일 수 있다.

## 예시

### 예시-1

repeat 예시를 가져와봤다. 일단 아래 코드를 보자. 0부터 99까지 출력하자.

```js
for (let i = 0; i < 100; i++) {
  console.log(i);
}
```

요구사항이 변경되어 999까지 출력해보자. 그럼 100을 1000으로 변경하면 될 것이다. 근데 요구사항이 또 바뀔수 있지 않은가?

```js
function repeat(n) {
  for (let i = 0; i < n; i++) {
    console.log(i);
  }
}

console.log(1000);
```

근데 요구사항이 출력이 아니라면 어쩔까...? 만약 배열로 만들어달라면 코드를 바꿀수도 있다. 코드를 바꾸자니 `repeat()`을 사용하는 다른 코드가 있을 수 있다. 또 배열과 출력을 동시에 해달라하면 또 바꿀건가??

문제는 의존성을 줄이는 것이다. 이 때 필요한 것이 추상화다. 핵심 로직을 분기하고 변경이 있을 수 있는 부분을 분기한다.

```js
function repeat(n, fn) {
  for (let i = 0; i < n; i++) {
    fn(i);
  }
}

repeat(1000, console.log);

const list = [];
repeat(1000, i => list.push(i));
```

### 예시-2

```js
function unless(test, then) {
  if (!test) then();
}

repeat(3, n => {
  unless(n % 2 == 1, () => console.log(n, 'is even'));
});
// → 0 is even
// → 2 is even
```

이렇게 조건을 함수로 만들 수 도 있다. 만일 조건이 꽤나 복잡하다면 함수를 이용해서 추상화 시킬 수도 있다는 것이다.

### 예시-3

함수를 결과로 반환하는 예시는 자주 사용되는 map, filter, reduce, some, every와 같은 [배열 내장 함수](https://github.com/Im-D/Dev-Docs/blob/master/Javascript/%EB%B0%B0%EC%97%B4%20%EB%82%B4%EC%9E%A5%ED%95%A8%EC%88%98.md)들이다.

```js
function filterExample(arr, fn) {
  let resultArr = [];

  for (let i = 0; i < arr.length; i++) {
    resultArr.push(fn(arr[i]));
  }

  return resultArr;
}

function greaterThan(n) {
  return m => m > n;
}

const arr = [1, 2, 3, 4, 5];

filterExample(arr, greaterThan(3));
```

**위 코드는 실제 filter와는 다르다.** 단순 예제이다.
위의 코드를 실제 `filter`함수로 구현하면 다음과 같다.

```js
function filterExample(arr, fn) {
  return arr.filter(fn);
}

function graterThan(n) {
  return m => m > n;
}

const arr = [1, 2, 3, 4, 5];

filterExample(arr, graterThan(3));
```

위의 두 함수는 무시하고 아래 두 줄에 집중해보자. 실제 `filterExample`함수가 어떻게 구현되어있는지는 중요하지 않다. `arr`을 만들고 3보다 큰지 안큰지만 알려달라고 행동을 추상화 했다. 이처럼 행동을 추상화함으로써 요구사항이 변경되었을 때 해당 로직을 수행하는 함수만 수정해주면 되기 때문에 의존성을 분리시킬 수 있게 된다. 즉, 유지 보수를 좀 더 쉽게 만들 수 있고 이것이 고차함수가 유용한 이유다.

## 추가로...

고차함수는 함수형 프로그래밍과 연관된다. [함수형 프로그래밍](https://github.com/Im-D/Dev-Docs/blob/master/Language/함수형%20프로그래밍.md) 이란 순수함수와 immutable, side effect 최소화와 관련이 있다.

함수형 프로그래밍은 람다 계산법에서 출발했다. 이는 수학의 람다식처럼 함수를 조합한다. 함수가 조합되려면 함수가 인자로 취급되어야 한다. 즉, 고차함수의 형태다.

Javascript는 함수가 일급객체기 때문에 고차함수가 가능하며 고차함수가 가능하기에 함수형 프로그래밍이 가능하다.

---

### 참고자료

- [Eloquent JavaScript - higher order functions](http://eloquentjavascript.net/05_higher_order.html)
- [poiemaweb 고차함수](https://poiemaweb.com/js-array-higher-order-function)
- [Higher-Order Function 이란 무엇인가](https://medium.com/@la.place/higher-order-function-%EC%9D%B4%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%B8%EA%B0%80-1c61e0bea79)
