# 람다

## 람다 대수(Lambda calculus)

람다의 근간은 수학에서, 그리고 초기 튜링기계에 사용되었던 *람다 대수 or 람다 계산 (Lambda Calculus)*다. 람다 대수는 수학에서의 함수를 단순하게 표현하는 방법이다. 예를들어 f( g(f(x) g(x))) 이런 수학 기호가 람다 대수다.

람다 대수는 다음과 같은 특징이 있다.

1. 람다 대수는 이름을 가질 필요가 없다. (익명 함수)
2. 두 개 이상의 입력이 있는 함수는 최종적으로 1개의 입력만 받는 람다 대수로 단순화 될 수 있다. (커링)

즉 익명함수이면서 커링이 가능하다.

## 익명함수

람다 대수의 영향을 받아 만들어진 함수다. 이름이 없는 함수를 의미한다.

변수 V1이 있는 람다식을 `λV1. V1 x V1`라고 할 때 이를 프로그래밍에서 표현하는 방법은 `x => x * x`다. 이래서 람다 대수의 영향을 받았다고 한다.

```js
var foo = x => x * x;
```

이렇게 쓰던 화살표 함수가 바로 람다대수의 영향을 받은 익명함수다. 다만 자바스크립트에서는 이렇게 사용하지만 언어별로 지원하는 방법이 조금 다르다. 람다 표현식(expression)만 지원하는 경우와 같은 것이 있다. 그러나 공통점은 모두 일급 객체라는 점이다.

## 일급 객체(first class citizen)

일급객체는 쉽게 설명해서 생성, 대입, 연산, 인자 또는 반환값으로서의 전달 등 기본 연산이 가능한 대상을 말한다.

더 쉽게 설명하자면 변수와 같은 것이다.

```js
var x; // 생성
x = 1; // 대입
var y = 2;
x + y; // 연산
foo(x); // 인자
return x; // 반환값
```

변수는 생성, 대입, 연산, 인자 또는 반환값으로서의 전달이 모두 가능하다.

JS에서는 함수도 마찬가지로 모두 가능하다.

즉 함수가 일급 객체를 지원하면 커링이 가능하며, 거기에 익명함수까지 지원한다면 람다 함수라 할 수 있다.

## 함수형 프로그래밍, HOF(고차함수), 일급객체, 람다

이게 사실 다 연관되는 내용이다.

- 일급객체 ⇒ 기본연산이 가능
- 람다 ⇒ 익명 + 커링
- HOF ⇒ 함수를 인수로 취하거나 결과로 반환
- 함수형 프로그래밍 ⇒ 순수함수 + immutable

이렇게 간단하게나마 정리할 수 있다. 4가지의 연결고리는 아래와 같다.

함수가 일급 객체이며, 람다(익명 + 커링) 함수다. 그렇다면 고차함수가 될 수 있다. 고차함수가 되게 함수를 만들고 사용한다면 함수형 프로그래밍에 가까워진다.

## 람다의 특징

코드가 간결해진다. 람다는 불필요한 루프문에 대한 정의를 삭제한다.

iteration 방식과 다르다. 0부터 9까지 1씩 증가하면서 실행해라고 명령하는 것이 아니라 그냥 여기 있는거 다 해라고 설명하는 방식이다.

그래서 함수형 프로그래밍과 HOF와 철학이 비슷한것이다.

```js
for (var i = 0; i < 10; i++) {
  console.log(i);
}

[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(console.log);
```

아래의 방식이 바로 람다 방식이다.

---

### 참고자료

- [람다, 익명 함수, 클로저 블로그 글](<[https://hyunseob.github.io/2016/09/17/lambda-anonymous-function-closure/](https://hyunseob.github.io/2016/09/17/lambda-anonymous-function-closure/)>)
- [람다식 나무위키](<[https://namu.wiki/w/람다식](https://namu.wiki/w/%EB%9E%8C%EB%8B%A4%EC%8B%9D)>)
- [람다대수 위키](<[https://ko.wikipedia.org/wiki/람다_대수](https://ko.wikipedia.org/wiki/%EB%9E%8C%EB%8B%A4_%EB%8C%80%EC%88%98)>)
- [Functinonal Programming](https://github.com/Im-D/Dev-Docs/blob/master/Language/Funtional.md)
- [Higher Order Functions](https://github.com/Im-D/Dev-Docs/blob/master/Language/Higher_Order_Functions.md)
