# 스코프와 this, 그리고 화살표 함수

ES6에서는 화살표 함수 `() => {}`가 등장했다. 화살표 함수에 없는 것 등을 구글링하면 쉽게 찾아볼 수 있다.

그 중 하나로 this가 있다. 흔히 화살표 함수에는 this가 없다고들 말한다.

그런데 이게 단순히 this가 없다고 말하기에는 너무 아쉬운 점이 많다. 이 this가 없다는 것이 스코프와 어떤 관계일지 생각해보려고 글을 적는다.

## 스코프

스코프는 범위다. 프로그래밍 언어에서는 유효범위라고 해석한다. 정확히는 식별자를 찾아내기 위한 **규칙** 을 따르는 **유효범위** 를 스코프라고 한다.

이 스코프에는 함수레벨 스코프, 블록레벨 스코프, 전역 스코프, 로컬 스코프와 같은 개념들이 있다. 그 중 동적 스코프와 정적 스코프라는 개념도 있다.

### Dynamic, Static Scope

동적, 정적이라는 단어는 서로 반대다. 타입에 관해서도 동적 타입, 정적 타입 언어라고 얘기한다.

흔히 자바, C와 같은 언어는 정적 타입이라 부르고 파이썬, js와 같은 언어는 동적 타입이라 부른다. 실행과 관련해 정해지는 것은 동적, 실행 이전과 관련해 정해지는 것은 정적이라 부른다.

스코프도 마찬가지다. 함수의 실행과 관련없이 코드가 만들어졌을 때, 즉 **어디서 선언 되었는지** 가 기준이면 정적 스코프라 부른다. 반대로 선언과 상관없이 함수가 **어디서 실행 되었는지** 가 기준이면 동적 스코프라고 부른다.

### Lexical Scope

#### 컴파일

js의 정적스코프를 흔히 Lexical Scope라고도 부른다. 그 이유는 컴파일 단계에 있다.

JS는 컴파일과 인터프리터의 장점을 모두 가지기 위해 두가지 단계를 모두 거친다.

컴파일은 아주 많은 단계가 있다. 보통의 컴파일러는 아래와 같은 단계를 가진다.

![컴파일러 단계](/assets/images/compilerDesign.jpg)

이걸 JS로 바꾸어 쉽게 요약해보자

    Source code => Lex => Parse => AST => Code Generator

이런 단계를 거친다.

설명을 좀 해보자면 **소스코드** 를 렉싱한다. 잘게 쪼갠다는 의미다. `var, x, =, 2, ;`이렇게 토큰을 나눈다고 한다.

그리고 이를 파싱하여 AST라는 트리 단계로 만든다. 그런 뒤 즉시 실행코드로 만든다.

#### 렉시컬

중요한 것은 이 Lex 단계다. JS의 스코프의 기준은 이 렉싱타임에 결정난다. 그래서 렉시컬 스코프라고 부르는 것이다.

함수가 어디서 실행되는지는 관심없고 이 렉싱 타임에서 스코프가 결정난다. 그래서 정적이며 렉시컬 스코프라고 부르는 것이다.

## this

### 일반 함수

위의 내용까지는 JS가 가지는 Lexical Scope의 특징에 대해 알아봤다. 기본적으로 JS는 Lexical Scope다. 그런데 Dynamic Scope와 비슷하게 동작하는 것이 바로 이 this다.

```js
var x = 5;

function foo() {
  let x = 50;
  console.log(this.x); // 5
  console.log(x); // 50
}

foo();
```

함수 스코프의 렉시컬과는 다르다. foo()가 실행된 곳은 global이기 때문에 this는 global execution context를 가리킨다.

```js
var obj = {
  x: 5,
  foo: function() {
    console.log(this.x);
  },
  bar: function(fn) {
    fn();
  },
  baz: function() {
    function aa() {
      console.log(this.x);
    }
    aa();
  }
};

var x = 50;
obj.foo(); // 5
obj.bar(obj.foo); // 50
obj.baz(); // 50
```

객체의 메서드의 경우 조금 복잡하다. 객체의 메서드의 this는 객체에 묶인다.(lexical)

콜백은 dynamic이며 내부함수의 경우도 dynamic이다.

그럼 아래와 같은 예시를 보자

```js
var obj = {
  x: 5,
  foo: function() {
    console.log(this.x); // 5
    setTimeout(function() {
      console.log(this.x); // 50
    }, 1000);
  }
};

var x = 50;
obj.foo();
```

foo는 객체의 메서드다. 따라서 this.x는 5다. 그런데 setTimeout의 콜백은 콜백이므로 dynamic으로 작동한다. 따라서 50이다.

### 화살표 함수

이에 화살표 함수가 등장했다. 화살표 함수의 실행컨텍스트는 일반함수와 비슷하다. 하지만 this 바인딩이 일반 함수처럼 작동하지 않는다.

**즉 일반함수의 Dynamic Scope 규칙을 따르지 않는다.**

대신 자신을 둘러싼 Lexical Scope의 this값을 가져온다. 아까의 예시를 다시보자

```js
var obj = {
  x: 5,
  foo: function() {
    console.log(this.x); // 5
    setTimeout(() => {
      console.log(this.x); // 5
    }, 1000);
  }
};

var x = 50;
obj.foo();
```

이번엔 둘 다 5다. foo의 this는 객체의 this라 5다.

콜백의 this는 일반함수라면 dynamic이다. 그러나 화살표함수다. 따라서 this가 자신을 둘러싼 Lexical Scope의 this 즉 객체의 this를 가져오게 된다. 따라서 5다.

## 문제점

화살표 함수는 이렇게 this가 없어졌기 때문에 기존에 지원하던 객체의 메서드의 경우 문제가 생길 수 있다.

```js
const objNormal = {
  x: 3,
  foo: function() {
    console.log(this.x);
  }
};

const objArrow = {
  x: 3,
  foo: () => {
    console.log(this.x);
  }
};

var x = 30;
objNormal.foo(); // 3
objArrow.foo(); // 30
```

원래 지원하던 this를 없애버리는 경우다. 이럴 때는 함수 축약형을 사용한다.

```js
const obj = {
  x: 3,
  foo() {
    console.log(this.x);
  }
};

var x = 30;
obj.foo(); // 3
```

추가적인 예로 프로토타입, 생성자함수, addEventListner의 콜백으로의 사용 등이 있다.

## 결론

화살표 함수는 단순히 this가 없는 것 그 이상의 의미를 가진다.

일반함수의 this는 Lexical, Dynamic Scope 두가지를 혼용하여 사용하였다. 그러나 화살표 함수의 등장으로 this가 통일되게 Lexical Scope의 규칙을 따르게 된다.

이것이 큰 변화다.

그렇지만 단점도 분명히 있기 때문에 잘 알고 사용하는 것이 중요하다.

---

### 참고자료

- [You don't know JS 타입과 문법, 스코프와 클로저], 카일심슨, pp. 279 ~ 282
- [Poiemaweb 6.3 Arrow function 화살표 함수](https://poiemaweb.com/es6-arrow-function)
