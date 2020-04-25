# 자바스크립트의 변수

## 자바스크립트의 실행

자바스크립트 파일이 브라우저에서 해석될 때, 해당 자바스크립트 파일이 **얼마나 많은 메모리를 차지하게 될지 계산하는 과정**을 거친다. 즉, 자바스크립트 파일의 **메모리를 확보하는 과정**을 거친다.
이 과정에서 모든 자바스크립트 변수는 [호이스팅](https://bkjang.github.io/Variables_and_DataTypes/) 과정을 거친다.

그렇다면 변수가 선언됐을 때 자바스크립트에서 어떤 과정이 일어나는지 살펴보자.

### 선언

값을 할당하지 않고 **선언만 하는 과정**을 거친다.

`var a;`에서 자바스크립트 엔진은 데이터의 공간을 만들고 그 공간에 a라는 이름을 붙인다.

### 초기화

등록된 변수를 위한 공간을 메모리에 확보한다. 이 단계에서 변수는 `undefined`로 초기화된다.

### 할당

`undefined`로 초기화된 변수에 **값을 할당하는 과정**이다. `var a = '';`에서 **a라는 변수에 ''를 할당한다**고 한다.

## let

### 호이스팅

이쯤에서 **변수의 호이스팅(Hositing)** 의 개념을 알고 넘어갈 필요가 있다.
자바스크립트는 변수의 선언부를 해당 스코프의 가장 위로 끌어올린다.
코드로 살펴보자.

```javascript
console.log(x);

var x = 1000;

console.log(x);

/*
undefined
1000
*/
```
위의 출력 결과를 보면 가장 첫 줄의 `console.log(x)`는 에러가 나야할 것 같지만, undefined로 출력이 된다.
이는 자바스크립트에서의 호이스팅이라는 개념으로 인해 변수의 선언부가 최상위로 끌어올려져서 나타나는 현상이다.
즉, 자바스크립트에서는 위와 같은 코드를 다음과 같이 해석한다.

```javascript
var x;

console.log(x);

x = 1000;

console.log(x);

```

여기서 많은 개발자들이 착각하고 있는 부분이 있다. 

**'`let`으로 선언된 변수는 호이스팅 과정을 거치지 않는다'** 라는 것이다.

하지만 이것은 틀린 말이다. 자바스크립트 파일의 메모리를 할당하는 과정이 필요하기 때문에 호이스팅이 발생한다.

하지만 **`let`으로 선언만 되고 할당되지 않은 변수를 사용하려고 하면 `var`와 달리 `Reference Error`가 발생**한다.

이는 `let`으로 선언된 변수는 할당 되기 전에 **TDZ(Temporal Dead Zone), 일시적 사각 지대**에 빠지게되기 때문이다. 이 때문에 `Reference Error`가 발생하는 것이다.

![ES6](https://bkdevlog.netlify.app/assets/img/TDZ.jpg)

```js
//ES5(var)
console.log(a); //undefined

var a = 1;

console.log(a); //1
```

```js
//ES6(let)
console.log(b); //Reference Error: b is not defined

let b = 1;

console.log(b);
```

위의 예제에서 볼 수 있듯이 `let`으로 선언한 변수를 그 이전에 사용하려고 하면 `Reference Error`가 발생한다. 이를 보면 호이스팅이 발생하지 않는다고 보일 수 있다.

하지만, 호이스팅이 일어나 메모리 공간을 확보한 뒤, **일시적 사각지대(TDZ)** 에 빠져있는 상태이기 때문에 `Reference Error`가 발생하는 것이다.

### 블록레벨 스코프

`var`는 **함수레벨 스코프**라면 `let`은 **블록레벨 스코프**를 지원한다.

즉, `var`로 선언한 변수는 함수 내에 선언하지 않고 `if`나 `for`와 같은 블록 내에서 선언하면 전역(window) 스코프에 할당된다.

반면, `let`으로 선언한 변수는 `if`나 `for`와 같은 블록 내에서 선언을 하면 전역이 아닌 해당 블록 내의 스코프에 할당된다.

```js
//ES5(var)
if(true) {
    var result = 'helloWorld';
}

console.log(result); //helloWorld
```

```js
//ES6(let)
if(true) {
    let result = 'helloWorld';
}

console.log(result); //ReferenceError: result is not defined
```

`if`문 내에서 `let`으로 선언한 변수는 `var`와 다르게 **블록 내의 지역 변수**로 할당 되기 때문에 블록 외부에서는 이를 호출하면 `Reference Error`가 발생하게 된다.

### 변수 중복 선언 불가

`let`으로 선언한 변수는 중복 선언이 불가하다.

`var`로 선언한 변수는 **같은 레벨에서 재할당이 가능**하지만, `let`으로 선언한 변수를 **같은 레벨 내에서 다시 선언하면 에러가 발생**한다.

```js
//ES5(var)
var result = 'hello';
var result = 'world';

console.log(result); //world
```

```js
//ES6(let)
let result = 'hello';
let result = 'world'; 

//Uncaught SyntaxError: Identifier 'result' has already been declared
```

### 클로저(Closure)

`var`를 사용할 때 보다 `let`을 사용할 때 직관적이고 편하다고 생각할 수 있는 대표적인 예가 루프안에서 클로저를 구현할 때다.

```js
//ES5(var)
function count(number) {
    for(var i=1; i <= number; i++) {
        (function (j) {
            setTimeout(function(){
                console.log(j);
            }, i*1000)
        }(i))
    }
}

count(4);
/*
1
2
3
4
/*
```

즉시 실행 함수를 실행시켜 루프의 `i` 값을 `j`에 복사하고 `setTimeout()`함수에서 사용했다.
이 때 **`j`는 상위스코프의 자유변수이므로 그 값이 유지**된다.

위처럼 구현하는 이유는

```js
function count(numberOfCount) {
    for(var i=1; i <= numberOfCount; i++) {
        setTimeout(function(){
            console.log(i);
        }, i*1000)
    }
}

count(4);
/*
5
5
5
5
*/
```
이와 같이 구현했을 때 결과는 예상과 다르게 **5가 4번 1초 간격으로 출력**되기 때문이다.

이는 for 루프의 초기문에서 사용된 변수는 **함수 레벨 스코프**로 인해 **전역 변수로 할당**되기 때문에 문제가 발생하기 때문이다.

```js
//ES6(let)
function count(numberOfCount) {
    for(let i=1; i <= numberOfCount; i++) {
        setTimeout(function(){
            console.log(i);
        }, i*1000)
    }
}

count(4);
/*
1
2
3
4
*/
```

하지만 `let`은 **블록 레벨 스코프**를 가지기 때문에 변수 `i`는 for문 블록 내의 **지역 변수로 할당**이 된다.

따라서 위와 같이 간단하게 원하는 결과를 출력할 수 있다.

## const

### 재할당 불가

`const`는 상수 즉, **변하지 않는 값**을 선언하기 위해 사용한다.

이에 따라 `const`로 선언된 변수는 `var`나 `let`으로 선언된 변수처럼 **재할당이 불가능**하다.

```js
const FOO = 123;

FOO = 234;
//Uncaught TypeError: Assignment to constant variable.
```

위 처럼 `const`로 선언된 변수에 다른 값을 재할당하려하면 에러가 발생한다.

### 블록레벨 스코프

`const`로 선언된 변수 또한 `let`으로 선언된 변수처럼 블록 레벨 스코프를 가진다.

### 객체의 할당

`const`로 선언된 변수는 위에서 말한 것처럼 재할당이 불가능하다.

하지만, `const`로 선언된 변수의 값이 객체로 할당이 된 경우, **객체 자체를 재할당하는 것은 불가능**하지만 **객체의 프로퍼티 값은 보호되지 못한다.**

```js
const Developer = {
    name : 'BKJang',
    age : 25,
    lang : 'Javascript'
}

Developer.lang = 'Java';

console.log(Developer); //{name: "BKJang", age: 25, lang: "Java"}

Developer = {
    name : 'BKJang',
    age : 25,
    lang : 'Java'
}
//Uncaught TypeError: Assignment to constant variable.
```

#### Reference

- [let & const](https://jaeyeophan.github.io/2017/04/18/let-const/)
- [ES6 let,const 알아보기](http://takeuu.tistory.com/86)
- [let, const와 블록 레벨 스코프](https://poiemaweb.com/es6-block-scope)

