# 자바스크립트의 동작 원리 - 변수 객체(Variable Object)
[자바스크립트의 동작 원리 - 실행 컨텍스트(Execution Contexts)]()에 이어서...

## 변수 객체(Varaiable Object; VO)

**변수 객체**는 **실행 컨텍스트의 프로퍼티**로, **실행에 필요한 정보**(어디에 어떤 데이터가 저장되고, 어떻게 호출할 수 있는지)를 담고 있다. 
또한, 변수 객체는 코드가 실행될 때 **엔진에 의해 참조**되며 **코드에서는 접근할 수 없다**. 

> 변수 객체의 구성요소

- 변수(variable declaration)
- 함수 선언(function declaration; FD)
- 매개변수(formal parameters)와 인수정보(arguments)

<br/>

## 데이터 선언(Data Declaration)

**변수나 함수를 선언**하는 것은 **변수 객체에** 변수의 이름과, 이름에 할당된 값을 갖는 **새로운 프로퍼티를 만드는 것**과 같다.

```js
var a = 10;
     
function test(x) {
  var b = 20;
};
     
test(30);

// 전역 콘텍스트의 변수 객체
VO(globalContext) = {
  a: 10,
  test: <reference to function>
};
     
// test 함수 콘텍스트의 변수 객체
VO(test functionContext) = {
  x: 30,
  b: 20
};
```

<br/>


## 변수 객체의 value

**변수 객체는** 프로퍼티이기 때문에 **값을 갖는데,** 이 값은 **다른 객체를 참조**한다. 
이 때, 전역 컨텍스트와 함수 컨텍스트는 **참조하는 객체가 다르다**. 전역코드와 함수 코드의 내용이 다르기 때문이다. 
하지만, 모든 종류의 실행 컨텍스트에서 공통적으로 동작하는 작업이 있다.

> e.g. 변수 초기화, 변수 객체의 동작
> 
- "From this viewpoint it is convenient to present the **variable object as an abstract base thing"**
```js
AbstractVO // generic behavior of the variable instantiation process
║
╠══> GlobalContextVO // 전역 컨텍스트의 변수 객체는 전역 객체이다.
║ (VO === this === global) 
║
╚══> FunctionContextVO // 함수 코드의 실행 컨텍스트에서 변수 객체는 활성 객체이다.
  (VO === AO // <arguments> object and <formal parameters> are added
```
> ES5에서는 변수객체, 활성화 객체의 개념이 어휘적 환경(lexical enviroments)모델로 대체되었다.

<br/>

## 전역 컨텍스트의 변수 객체

전역 컨텍스트의 변수 객체는 전역 객체를 참조한다. 따라서, 전역 컨텍스트의 변수 객체는 전역 객체이다.

```js
var x = 'xxx';
    
function foo () {
  var y = 'yyy';

  function bar () {
    var z = 'zzz';
    console.log(x + y + z);
  }
  bar();
}
foo();
```

![ec-vo-global](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/4d04926a-02d8-441a-8a0b-0f7458e98d65/ec-vo-global.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAT73L2G45KK2GYH5R%2F20190525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20190525T131046Z&X-Amz-Expires=86400&X-Amz-Security-Token=AgoJb3JpZ2luX2VjEOL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICpOsfUz1CPK1D65zkc8u9hafV8Iv07PKDeOy%2FkLzkNtAiBqEDls4HELllnKXPeGLZlv8FfVFskKX5bR%2BUNWjdrE1CrjAwjr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDI3NDU2NzE0OTM3MCIMcZT7l7vvSLSqV1l8KrcD9dV5u8xMb2pkxwKeVOXfBhmVbvCCyM0pFZAtRJk2GjVzkxBVxP8LaZa8pklFu8d64f56Ny1zz6mTehBq6g1YRGy6WSBFTmETSduze9MCR7lI0LJn1%2B5m2W7A1aSzheDCzuxDL%2FU%2FxG6ringqpQt%2FU2r76s5EDQQpY%2BCJyl3C9YDLS2pCZRMuAnIGFYIcgvp%2B%2B7YVpBFt1LdrR9HaDSNvsJtcJw0xRIBph5XlOk6aRr2Ss2Gbknw55s0R6P5GzpcMN2FuRt0RgnkzwM3%2B%2BrucMVS8Gc5cOGinV4NLz8qlEn9OBvPb8KFNt4LWirc069ZG0m1qhnMC3tKjoDpNibB5s%2FjsszPwnhdGvR84Gx96xNp1%2F4cyhLbi1DZRWGAywWvNKcTIEwVLeAsnz63YPBZ9z9SfqqrxapQ7vB%2Fiovg2icRud0VMMbA7dx3xe8cwlI2x7Ow8i2Eb4K5SvaU4O1mR1xYY5hR9H%2BDYg7rd%2BCaV6XCis2NZcHt7fENfnPyi%2Fo84iX5R1XImkZuy4l2enaX2gsEZqb%2FZYM%2BXPZcb6Dub%2Fken%2BRjscNbN01Ki4vguCj6f7xhapPXKUzCfk6TnBTq1AQffTGcQNldDAD46FY9QGM%2BzOzeH3Sjmu70bqB%2F9N8SlEIn7C6uUNzsLdxD%2FZ5HOuxPDKwPodRTBxKBKqHAj0OV%2BknRncQD7UPKi05NzAC83G7emqnfmUdUpi0gEYPAdTGNHOr5qQVHeJEds70Tq6w6R2CWtMB5meAoHt6ncSj2XSfk8FDrlzY0QPnhc2ftBVFvyeSXswOOZ7cDCUVc8mDYSEJI%2BDwIaFF4TNLuXO9QJRHsztwM%3D&X-Amz-Signature=633a520f56d081a8e1fb180d2ad7a7a3883faaf4d8380166266d38fccd92b682&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22ec-vo-global.png%22)

변수객체는 코드에서 **직접(directly) 접근이 불가능**하다. 하지만, 전역 컨텍스트의 변수 객체에 있는 변수(variable)는 간접적으로 참조 가능하다. 전역 컨텍스트의 변수 객체는 전역 객체이다. 즉, **전역 객체(GO)에 있는 변수만 간접적으로 참조 가능**(위의 예제에서 `foo`, `x`)하다. 변수를 선언하는 것은 VO에 프로퍼티를 만드는 것이기 때문에 **변수 객체의 프로퍼티명을 통해서 참조 가능**하다.  따라서, 전역 컨텍스트에서 변수를 선언하면 변수 객체의 프로퍼티를 통해서 간접적으로 접근할 수 있다.

```js
// 위의 예제에 이어서
alert(x); // VO(globalContext)에 직접적으로 접근한다. "xxx" 출력 
alert(window['x']); // 전역 객체 === VO(globalContext)인 점을 이용해서 간접적으로 접근한다. "xxx" 출력
alert(x === this.x); // true 

var key = 'x';
alert(window[key]); // 동적인 프로퍼티 명으로 간접적으로 접근. "xxx" 출력
```

<br/>

## 함수 컨텍스트의 변수 객체

마찬가지로, 함수 코드의 실행 컨텍스트에서 **변수 객체는 직접 접근이 불가능**하다. 
전역 객체에서는 변수 객체를 간접적으로 참조하여 접근하지만, 함수 컨텍스트에서 이 역할은 활성화 객체(Activation objcet; AO)가 수행한다.

```js
var x = 'xxx';

function foo () {
  var y = 'yyy';

  function bar () {
    var z = 'zzz';
    console.log(x + y + z);
  }
  bar();
}
foo();
```

![ec-vo-foo](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/339c4880-e854-4327-9077-d4fdcf99a82b/ec-vo-foo.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAT73L2G45F3FYW6EI%2F20190525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20190525T131259Z&X-Amz-Expires=86400&X-Amz-Security-Token=AgoJb3JpZ2luX2VjEOL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDC0pw0hiRk%2F77IjvScAiEhUrXY1pUFuQ4znsFHBnBIwAiAwfehU7%2BIrxknd05ZPi%2BS%2F%2BXNrXcg2uZg3NUeUsqWCICrjAwjr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDI3NDU2NzE0OTM3MCIMXzhtWBY2bblxqkC4KrcD0GUAeN6JafXO35kuEfrq%2B%2FzOEOtb%2FSRG619CyDfFeFXr%2FNopVQAK5cBhBI4fFiDhgLWnsV4EEjtO6aZPNNg6b70DMwR%2FELrZrMmA32Y10P2Vmsgb94LV7xVKAp6jTZ0SujPavHadHpA2U5NLt5U0UObwZGxLMsN7viuRsOPOghiSN3zXmG46WHFuX13pMHFjE0lfmnD0i0vXjB%2BOHDnRsmm4bbg40xEtvCKhn8DKqdUMsc33FADaUDF0ZtHh0xRyDql5RU91PQaabNq35zDTuazrP3LBZSEmnkQV%2Fwg7TsZc8fCuz%2Fk8sAxSKZMI4QO2UPgW7Oxy8eaYwC6aT8t%2FgwvApXqWKwCXhpg1B4T5yfbAms0qPIrnQiFFkak%2BoTW7HClmKFwk56pgtz2z8BpLfI3x4MXCTXdXDoBTgunyVMeWU2oM7NvzXXamKNE2rBhXLHoZ70btEaBlfO%2BnRev8Yt%2BNjEybHncbfA6MaXv25j%2F2YOew3cz6Fk%2Bkmb6Zi%2FplLyfK9ILhgecAU5Jm7Ee2PlGczM7FAO3Znwq96LWXfq3wnaG0s1Lc9LCZEbX0VNiwzX8ffqMmzjDNoaTnBTq1ARJPX2l4Fe3SDP6Q8kIHSFxcFYc6HTch0JhN03JSQnF2GpK8s3nTQcZBqGqsfjweKdMMxkmp8geAZrOa39UdQJktz9GY0NDOjP5KhYRg55aB5Wa%2BnkMOyTXe3Md3J6lefIg9xU%2B29GA4plZswFvJu51LQi3fvuVWSdTwdIt3pDOy5O3HgDcUvyNZj5gvPZ14j6%2BHFO1jk9YGldprK8VsR1F2MNY6emJsBXcHz7GjubBcMm5PTJ0%3D&X-Amz-Signature=fc5f8e5b948bc43f0aee8b901108a9c20ae377faad98646040f5526655361095&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22ec-vo-foo.png%22)

<br/>

## 활성화 객체(Activation Object)

활성화 객체는 함수 코드의 컨텍스트로 진입할 때 생성되고, 값이 `Arguments` 객체인 `arguments` 프로퍼티로 초기화된다.
```js
AO = {
  arguments: <ArgO>
};
```
> 활성화 객체의 프로퍼티
- Arguments 객체는 활성화 객체의 프로퍼티
- callee - 현재 함수에 대한 참조
- length - 실제로 전달된 인자의 수
- properties-indexes("num")
    - 함수 매개 변수의 값(왼쪽부터 오른쪽 까지 매개 변수의 리스트)
    - arguments.length와 개수가 같다.
    - arguments객체의 properties-indexes와 제공된 형식 매게 변수는 실제로 전달된 값을 공유한다.

```js
foo(10, 20);

function foo(x, y, z) {

  alert(foo.length); // 정의된 함수 매개변수 x,y,z의 수량 : 3 
  alert(arguments.length); // 실제로 전달된 매개변수(x, y)의 수량 : 2
  alert(arguments.callee === foo); // 함수 자신에 대한 참조 : true
 
  // 매개변수 공유
  alert(x === arguments[0]); // true
  alert(x); // 10
 
  arguments[0] = 20;
  alert(x); // 20
 
  x = 30;
  alert(arguments[0]); // 30
 
  // 전달되지 않은 매개변수 z는 공유되지 않는다.  
  z = 40;
  alert(arguments[2]); // undefined
 
  arguments[2] = 50;
  alert(z); // 40 
}
```

<br/>

## 컨텍스트 코드 실행 단계(Phases of processing the context code)

실행 컨텍스트 코드의 실행은 두 단계에 걸쳐서 이루어진다.

1. 실행 컨텍스트 진입
2. 코드 실행

이 단계에서 변수 객체의 프로퍼티가 채워지며, 값이 할당된다.

<br/>

## 실행 컨텍스트 진입

실행 컨텍스트로 들어가면 VO는 아래의 프로퍼티로 채워진다.

- 함수의 매개 변수를 위한 프로퍼티(함수 컨텍스트의 경우)
    - 매개변수(formal parameter)의 이름과 값을 갖는 변수 객체의 프로퍼티
    - 값(인수; arguments)이 전달되지 않으면 값이 undefined
- 함수 선언을 위한 프로퍼티(FunctionDeclaration; FD)
    - 함수 객체의 이름과 값을 갖는 변수 객체의 프로퍼티
    - 이미 같은 이름의 변수가 있으면, 새로운 값으로 교체
- 변수 선언을 위한 프로퍼티(VariableDeclaration; var)
    - 변수의 이름과 undefined 값을 갖는 변수 객체의 프로퍼티
    - 변수의 이름이 이미 선언된 매개변수나 함수의 이름과 같다면, 변수 선언은 무시된다.

> 실행 컨텍스트에 진입 하는 단계에서 VO에 프로퍼티는 설정되지만, 값이 할당되지는 않는다.(호이스팅)

```js
function test(a, b) {
  var c = 10;
  function d() {}
  var e = function _e() {};
  (function x() {});
}
 
test(10); // 호출
```

test의 함수 컨텍스트
```js
AO(test) = {
  a: 10,
  b: undefined,
  c: undefined,
  d: <reference to FunctionDeclaration "d">
  e: undefined
};
```

함수 `x`는 선언식이 아니라, 함수 표현(FunctionExpression; FE)이기 때문에 VO에 영향을 주지 않는다.

함수 `_e` 또한 표현식이지만, 변수 e에 할당되기 때문에 e를 통하여 접근할 수 있다.

<br/>

## 코드 실행

코드가 해석되는 동안 AO/VO의 프로퍼티가 변경된다.

> 실행 컨텍스트로 진입하면 AO/VO가 프로퍼티로 채워지지만, 모든 프로퍼티에 실제 값이 할당되어있지는 않다.

```js
// 위의 예제에 이어
AO['c'] = 10;
AO['e'] = <reference to FunctionExpression "_e">;
```

표현식 `_e` 가 선언된 변수`e` 에 저장되어 있기 때문에 메모리에 존재한다. 반면, 함수 `x`는 존재하지 않는다. 
`x`를 호출하여도 `"x" is not defined`라는 에러가 나오게 된다. 
변수에 저장하지 않은 표현식은 정의된 곳에서 호출하지 않으면, 재귀적인 방법으로만 호출할 수 있기 때문이다.

> 예시, 코드가 해석되기 전과 후의 차이

```js
alert(x); // function
 
var x = 10;

alert(x); // 10
 
x = 20; 

function x() {} 

alert(x); // 20
```

> 참고 - [Hoisting(MDN Docs)](https://developer.mozilla.org/ko/docs/Glossary/Hoisting)

<br/>

## 변수의 경우

변수는 오직 `var` 키워드를 이용하여 선언한다. 따라서, `var` 키워드를 이용하지 않으면 전역변수가 된다는 것은 틀린 말이다. 
`var` 키워드를 이용하지 않고 값을 할당하는 것은 전역 객체에 새로운 프로퍼티(변수가 아닌)를 추가하는 것이다.

> 변수가 아니라는 것은 값을 할당하고 변경하고 참조하는 등이 불가능하다는 것이 아니다.  ECMAScript에서 말하는 변수의 개념이 아니라는 뜻이다.

```js
alert(a); // undefined
alert(b); // "b" is not defined
 
b = 10;
var a = 20;
```

b는 변수가 아니므로, VO안에 없다(호이스팅이 이루어지지 않는다).

```js
VO = {
  a: undefined
}; 
```

```js
a = 10;

alert(window.a); // 10 
alert(delete a); // true 
alert(window.a); // undefined
 
var b = 20;
alert(window.b); // 20 
alert(delete b); // false 
alert(window.b); // 여전히 20
```

또한, 변수는 `DontDelete` 속성을 가지고 있다. 반면, 단순 프로퍼티는 그렇지 않기 때문에 `delete` 연산자를 이용하여 삭제할 수 있다.

> ES5에서 `DontDelete` 는 `Configurable` 로 이름이 변경되었고 `Object.defineProperty` 메서드를 이용해서 수동으로 조작할 수 있다.

<br/>

## eval의 경우

```js
eval('var a = 10;');

alert(window.a); // 10 
alert(delete a); // true 
alert(window.a); // undefined
```

변수에 `DontDelete` 속성이 설정되지 않는다.

> Firebug는 콘솔에서 코드를 실행하기 위해 `eval` 을 사용한다. 따라서 변수를 `delete` 로 삭제할 수 있다.

---

#### Reference

- [ECMAScript Language Specification (HTML version) - Bob Clary](https://bclary.com/2004/11/07/ecma-262.html)
- [ECMA-262-3 in detail. Chapter 2. Variable object - Dmitry Soshnikov](http://dmitrysoshnikov.com/ecmascript/chapter-1-execution-contexts/)
- [ECMA-262-3 in detail. Chapter 2. Variable object 번역 - 개발왕 김코딩](https://huns.me/development/159)
- [실행 컨텍스트와 자바스크립트의 동작 원리 - poiemaweb](https://poiemaweb.com/js-execution-context)
