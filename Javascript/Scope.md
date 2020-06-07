# 스코프

## 함수형 스코프

자바스크립트는 기본적으로 **함수형 스코프**를 가진다.(EcmaScript6에서부터는 `let`과 `const`를 이용하여 블록 레벨 스코프를 사용할 수 있다.)

```javascript
var x = 10;

if(true) {
    var y = 100;
    console.log('local x :', x); //local x : 10
    console.log('local y :', y); //local y : 100
}

function test() {
    var x = 100;
    var z = 200;
    console.log('Function Level x:', x);
    console.log('Function Level z:', z);
}

console.log('global x:', x); //global x: 10
console.log('global y:', y); //global y: 100
test(); 
/*
Function Level x: 100
Function Level z: 200
*/
console.log('global z:', z); //Uncaught ReferenceError: z is not defined
```

보통 Java의 경우에는 if문(블록)안에서의 변수 선언은 지역 변수를 가지기 때문에 지역 스코프를 가진다.

하지만 **자바스크립트에서 `var` 선언을 이용해 변수를 선언할 경우, 함수형 스코프를 가지기 때문에 위에서의 y는 전역 변수 z는 `test()` 함수의 지역 변수**가 된다.

여기서 let을 잠깐 소개하자면, let은 위에서도 말했지만 **블록 스코프**를 가진다고 했다.

```javascript
let x = 10;

if(true) {
    let y = 100;
    console.log('local x :', x); //local x : 10
    console.log('local y :', y); //local y : 100
}

console.log('global x:', x); //global x: 10
console.log('global y:', y); //Uncaught ReferenceError: y is not defined
```

즉, **x는 전역 스코프, y는 if문 안에서의 지역 스코프**를 가지기 때문에 마지막 결과는 에러가 발생한다.

## 내부함수의 스코프

```javascript
var x = 'g';

function outerFunc() {
    var x = 'l';
    console.log('outerFunc :', x);

    function innerFunc() {
        console.log('innerFunc :', x);
    }

    innerFunc();
}

outerFunc();

console.log('global :', x);

/*
outerFunc : l
innerFunc : l
window : g
*/
```

> **내부 함수는 자신을 포함하고 있는 외부 함수의 변수에 접근할 수 있다.**

내부함수인 `innerFunc()`에서 참조하는 변수 x는 `outerFunc()`에서 선언된 지역변수이다. 이는 **실행 컨텍스트의 스코프 체인에 의해 `innerFunc()`에서 참조하는 순위에서 전역변수 x가 밀렸기 때문**이다.

실행 컨텍스트에 대한 내용은 이어질 포스팅에서 다룰 예정이다.

## 렉시컬 스코프(Lexical Scope)

자바스크립트는 렉시컬 스코프를 지원한다.

우선적으로, 자바스크립트 엔진에서 코드를 컴파일 하는 과정을 보면 다음과 같다.

> * **토크나이징/렉싱** - 코드를 잘게 나누어 토큰으로 만든다.
> * **파싱** - 나눈 토큰을 의미있게 AST(Abstract Syntax Tree)라는 트리로 만든다.
> * **코드생성** - AST를 기계어로 만든다.

렉시컬 스코프란 1단계에서 발생하는 즉, 렉싱 과정에서 정의되는 스코프를 말한다. 
**프로그래머가 변수와 스코프 블록을 어떻게 구성하는냐에 따라 렉싱 타임에서 정의되는 스코프를 렉시컬 스코프**라고 한다.

```javascript
var x = 'global'

function test1() {
    var x = 'local';
    test2();
}

function test2() {
   console.log(x);
}

test1(); //global
test2(); //global
```

위의 코드에서 `test2()`함수를 **어디서 호출하는지가 아닌 어디에 선언되어있냐에 집중**할 필요가 있다.

즉, **`test2()`함수의 상위 스코프는 test1()과 전역이 아닌 전역**이다. 이에 따라 `test2()`에서 출력한 값은 'global'이 나올 것이다.

쉽게 말하면, **렉시컬 스코프는 함수를 어디서 호출하는지가 아닌 어디서 선언했는지에 따라 결정**된다. 이러한 특성때문에 **정적 스코프(Static Scope)** 라고도 한다.

## 전역 변수의 최소화

전역 변수를 많이 쓰면 안좋다고 흔히들 말한다.
그 이유를 알 수 있는 간단한 예를 보자.

```javascript
var x = 100;

function test() {
    x = 10;
    console.log('10이 나오겠지?', x);
}

test();
console.log('100을 출력해볼까 ?', x);

/*
10이 나오겠지? 10
100을 출력해볼까 ? 10
*/
```

**지역 스코프에서 전역변수를 참조할 수 있으므로** 전역변수의 값도 변경할 수 있다.

**내부 함수의 경우에는, 전역변수는 물론 상위 함수에서 선언한 변수에 접근/변경이 가능**하다.

프로젝트가 클수록, 협업이 이루어질수록 전역 변수가 많아지면 원하는 결과가 아닌 다른 결과가 나타날 수 있다.

그렇다면 전역 변수를 줄이기 위한 방법에는 어떤 것들이 있을까?

### 네임스페이스 패턴(Namespace Pattern)

네임스페이스 패턴은 **말 그대로 이름 공간을 선언하여 다른 공간과 구분하는 패턴**이라고 보면 된다.

```javascript
var APP_GLOBAL = {
    name : 'BKJang',
    age : '25',
    getInfo : function() {
        console.log('name :', this.name, 'age :', this.age);
    }
}

console.log(APP_GLOBAL); //{name: "BKJang", age: "25", getInfo: ƒ}
console.log(APP_GLOBAL.name, APP_GLOBAL.age); //BKJang 25
APP_GLOBAL.getInfo(); //name : BKJang age : 25
```

이처럼 **전역 변수 사용을 위해 전역 객체 하나를 만들어 사용**하는 것이다.

### 즉시 실행 함수 표현식(IIFE, Immediately-Invoked Function Expression)

즉시 실행 함수를 사용하면 **함수가 실행되고 전역에서 사라진다.** 이 방법으로 라이브러리를 많이 만들곤 한다.

```javascript
(function moduleFunction() {

  var a = 3;
  
  function helloWorld(){
    console.log('Hello');
  }

  helloWorld(); //Hello
})();

helloWorld(); //Uncaught ReferenceError: helloWorld is not defined
```

즉시실행함수가 실행되고 전역에서 사라지기 때문에 그 밖에선 출력 값이 에러가 발생하는 것을 볼 수 있다. 

```javascript
var singleton = (function () {

  var a = 3;
  
  function helloWorld(){
    console.log('Hello');
  }

  return {
    a : a,
    sayHello: helloWorld
  }
})();

singleton.sayHello(); //Hello
console.log(singleton.a); //3

```

위와 같이 **반환 값을 변수에 담아 전역 변수를 한 번 만 사용**하여 전역 변수의 사용을 줄일 수도 있다.

#### Reference
- [JavaScript: 네임스페이스 패턴(Namespace Pattern) 바로 알기](http://www.nextree.co.kr/p7650/)
