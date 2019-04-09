# **Function**

## **목차**

- [x] Global Scope
- [x] Local Scope
- [x] Functional Scope
- [x] Block Scope
- [x] Lexical Scope 
- [x] Function
    - [x] Function Declaration
    - [x] Function Expression
    - [x] Named Function Expression
- [x] IIFE(Immediately Invoked Function Expression)

자바스크립트에서의 Scope는 크게 2가지로 보면 된다.

- **Global Scope**
- **Local Scope**

함수안에서 정의가 된 변수들은 기본적으로 **Local Scope** 에서 선언이 되었다고 하며, 함수 외부에 정의된 변수는 **Global Scope** 에서 선언이 되었다고 한다. 함수 외부라고 하면 단순하게 중첩된 함수에서의 외부가 아닌 **함수 1개가 있다는 기준에서의 외부** 이다. 이렇게 완전한 외부를 우리는 **Window** 라고 하자.

또한 각각의 함수들은 실행이 되면 내부적으로 New Scope를 생성하고 가지게 된다.
<br/>

## **Global Scope**

우리가 자바스크립트를 실행하게 되면 이미 **Global Scope** 안에 있는 것이다. 그래서 우리가 Function 안쪽에서 선언하지 않고 기본적으로 선언하는 것들은 **Global Scope** 에서 선언하는 것이다.

```javascript
// 이 부분이 바로 기본값인 Global Scope이다.
const name = 'sseon';
const age = '27';
```

Global로 선언한 변수는 다른 Scope 어디에서든 접근이 가능하다.

```javascript
const name = 'sseon';
    
console.log(name); // 같은 Scope에서의 호출은 된다. => logs 'sseon'
    
function logName() {
    console.log(name); // 'name' 이라는 변수가 어디서든 접근이 가능하다.
}
    
logName(); // logs 'sseon'
```

<br/>

## **Local Scope**

함수안에 선언한 변수는 **Local Scope** 안에 있는 것이다. 우리는 같은 변수의 이름을 다른 함수안에서 각각 정의를 할 수 있는데, 해당 변수가 서로 다른 Scope에 바인딩이 되어 각각의 함수에서는 접근이 불가능하게 된다.

```javascript
// Global Scope
function someFunction() {
    // Local Scope #1
    function someOtherFunction() {
        // Local Scope #2
    }
}
    
// Global Scope
function anotherFunction() {
    // Local Scope #3
}
// Global Scope
```

위와 같이 코드가 짜였다고 한다면 **Local Scope#1** 에서 선언한 변수는 **Local Scope#2** 에서는 접근이 가능하지만 **Local Scope#3** 에서는 접근이 불가하다. 마찬가지로 **Local Scope#3** 에서 선언된 변수는 **Local Scope#1**, **Local Scope#2** 에서 접근이 불가하다. **Local Scope#2** 에서 **Local Scope#1** 접근이 가능한 이유는 뒤에서 다룰 것이다.
<br/>

## **Functional Scope**

자바스크립트는 위에서 본 것과 같이 **함수를 단위로 Scope를 구분한다.** 즉 같은 함수안에서 선언된 변수들은 같은 Level의 Scope를 가지게 되는 것이다. 각각의 함수는 독립적인 Scope를 가지게 되어 다른 함수의 Scope에 접근을 할 수 없다.

```javascript
// Global Scope
function someFunction() {
    if (true) {
        var name = 'sseon'; 
    }
}
```

위와 같이 Global Scope에 `someFunction()` 을 선언하고 내부에 if문 괄호 안에 선언한 변수는 **someFunction function Scope** 에 붙게 되는 것이다.
<br/>

## **Block Scope**

Block Statement는 우리가 많이 보는 if문, switch문, for, while문이다. 이러한 문장들은 괄호로 감싸진 부분이 존재하지만 새로운 Scope를 만들지는 않는다. Block Statement 안에서 정의한 변수는 가장 가까운 함수의 Scope에 붙게 된다.

```javascript
if (true) {
    // this 'if' conditional block doesn't create a new scope
    var name = 'sseon'; // name is still in the global scope
}
    
console.log(name); // logs 'sseon'
```

ECMAScript 6에서 `let`, `const`가 추가 되었다. 이 2개는 `var` 대용으로 사용된다. 그러나 그보다 더 중요한 개념이 들어간다. 바로 **Block Level Scope** 라는 것이다. 기존의 자바스크립트는 위에서 본 것처럼 **Functional Scope** 이다. 그러나 `let`, `const` 를 사용하게 되면 **Block Level Scope** 지원이 가능하다. 아래의 예제를 보자

```javascript
if (true) {
    // this 'if' conditional block doesn't create a new scope
    var name = 'sseon'; // name is still in the global scope
    let likes = 'Coding';
    const skills = 'Javascript';
}
    
console.log(name); // logs 'sseon'
console.log(likes); // Uncaught ReferenceError: likes is not defined
console.log(skills); // Uncaught ReferenceError: skills is not defined
```

`var`와는 다르게 `let`, `const`는 Block Statement내에서 **Local Scope** 를 지원한다. 즉 이제 Scope가 가장 가까운 function에 붙는 것이 아닌 해당 Block에 붙게 되는 것이다.

**Global Scope는 응용 프로그램이 살아있을 때까지 유효하며, Local Scope은 함수가 호출되고 실행되는 한 유지가 된다.**

<br/>

## **Lexical Scope**

**Lexical Scope** 는 중첩된 함수에서 내부 함수는 부모 Scope의 변수와 다른 자원에 접근이 가능하다. 즉, 하위 함수는 부모의 실행 컨텍스트에 바인딩된다. **Lexical scope** 는 때때로 **Static Scope** 라고도 불린다.

```javascript
function grandfather() {
    var name = 'sseon';
        // likes is not accessible here
    function parent() {
            // name is accessible here
            // likes is not accessible here
        function child() {
            // Innermost level of the scope chain
            // name is also accessible here
            var likes = 'Coding';
        }
    }
}
```

<br/>

## **Function**

함수는 자바스크립트에서 중요한 컨셉이다. 자바스크립트에서 함수는 1급 객체이다. 

1. **Function Declaration(함수 선언식)**
2. **Function Expression(함수 표현식)**
3. **Named Function Expression(이름이 있는 함수 표현식)**

<br/>

## **함수 선언식**

```javascript
function [name](param1, param2, ...param3) {
    // Function Body & Logic
}
```

`[function name]` 앞에 `[function keyword]` 를 붙인다. 항상 앞에 function으로 시작하며 함수에 맞는 이름을 지어주어야한다. 그리고 선언식의 주요한 개념은 전체기능이 **호이스팅** 이 된다는 것이다. 

**이러한 호이스팅으로 인해서 함수를 선언하기전에 함수를 실행하는 코드를 넣어도 작동하는 것이다.**

이러한 선언 방법은 일부 논리를 함수 본문으로 추상화를 하고 나중에 실제 구현이 완료될때 유용하다.

```javascript
var num1 = 10;
var num2 = 20;
var result = add(num1, num2); // ==> 30 [Executing before declaring]

function add(param1, param2) {
    return param1 + param2 ;
}
```

그러나 이러한 코드는 좋지 못하다. 항상 호이스팅을 이용하는 것이 아닌 함수를 먼저 선언을 하고 실행하는 습관을 들이는 것이 좋다.
<br/>

## **함수 표현식**

어떤 값을 다른 변수에 할당하는 명령문은 표현식으로 간주된다.

```javascript
var a = 100;
var b = 'Hello World';
```

함수표현식의 경우 이름이 없이 함수를 작성을 하며 변수에 할당을 한다.

```javascript
var [name] = function(param1, param2, ...param3) {
    // Function Body & Logic
}

foo(1,3,4);
```

함수 선언식과 다르게 정의될 때까지 함수를 사용할 수 없다. 즉 호이스팅이 일어나지 않는다는 것을 의미한다. 정확하게 보면 변수는 호이스팅이 일어나지만 할당이 이루어지는 행위는 호이스팅이 안된다고 보는 것이 좋을 듯 하다.

```javascript
var num1 = 10;
var num2 = 20;
var result = add(num1, num2);  
// Uncaught TypeError: add is not a function
var add = function(param1, param2) {
    return param1 + param2 ;
}
```

위와 같은 코드는 작동하지 않는다. 아래와 같이 작성을 하여야한다.

```javascript
var num1 = 10;
var num2 = 20;
var add = function(param1, param2) {
    return param1 + param2 ;
}
var result = add(num1, num2); // ==> 30
```

### 함수 표현식의 장점

선언식보다 표현식이 더 유용하게 사용되는 몇가지 이유

- As closures
- As arguments to other functions
- **As Immediately Invoked Function Expressions (IIFE)**

<br/>

## **이름이 있는 함수 표현식 - 두 가지 접근 방식의 결합**

선언식과 표현식의 차이점을 보고 두가지를 섞으면 어떻게 되는지 살펴보자.

```javascript
var num1 = 10;
var num2 = 20;
var addVariable = function addFunction(param1, param2) {
    return param1 + param2 ;
}
```

위에 코드를 보게 되면 표현식이 더이상 익명이 아니고 `addFunction` 이라는 이름을 가지고 있다. 또한 `addVariable` 이라는 변수명에 할당을 하였다.

우리가 함수의 이름으로 `addFunction` 을 추가했다고 실행할 수 있는 것은 아니다.

```javascript
var result = addFunction(num1, num2); 
// ==> Uncaught ReferenceError: addFunction is not defined
```

우리가 할당한 `addVariable` 변수로만 사용이 가능하다.

```javascript
var result = addVariable(num1, num2); 
// ==> 30
```

**고려해야할 사항**

1. `addFunction` 이 `addVariable` 보다 콜스택상 먼저 나오게 된다.
2. 외부에서 `addFunction` 을 호출하게 되면 에러가 나오게 된다.
    1. 그러나 내부에서는 `addFunction` 을 사용할 수 있다.

```javascript
    var num1 = 10;
    var num2 = 20;
    var addVariable = function addFunction(param1, param2) {
       var res = param1 + param2;
       if (res === 30) {
            res = addFunction(res, 10);
       }
       return res;
    }
    var result = addVariable(num1, num2); // ==> 40
```

결과가 30이 아니라 내부적으로 `addFunction` 이 한번 더 호출되어 40이 나오게 된다.

3. IE8이하에서는 이름이 있는 함수 표현식을 사용하게 되면 심각한 이슈가 발생하게 되는데, 바로 완전히 다른 두개의 함수객체를 생성한다는 것이다.(**Double take**).

**IE8을 지원해야하는 일이 있으면 익명의 표현식을 사용하는 것을 추천한다.**

<br/>

## **Statements, Expressions**

**Expressions** 는 단일 값이 되는 자바스크립트 코드 Snippets이다. 표현식은 원하는만큼 길게 사용이 가능하지만 단일 값이다.

```javascript
2 + 2 * 3 / 2
    
(Math.random() * (100 - 20)) + 20
    
functionCall()
    
window.history ? useHistory() : noHistoryFallback()
    
1+1, 2+2, 3+3
    
declaredVariable
    
true && functionCall()
    
true && declaredVariable
```

위의 예제들은 모두 표현식이다. 흔히 값을 원할때 어디서든 사용하는 방법이다. 그래서 아래의 예제에서도 값이 단일값으로 나오게 된다.

```javascript
console.log(true && 2 * 9) // 18
```

**표현식은 상태를 변경하지 않는다.**

```javascript
var assignedVariable = 2; //this is a statement, assignedVariable is state

assignedVariable + 4 // expression
assignedVariable * 10 // expression
assignedVariable - 10 // expression

console.log(assignedVariable) // 2
```

위의 예제들은 표현식임에도 할당된 값은 마지막까지 2로 남는다. 함수 호출은 표현식이지만 함수 상태를 변경할 수 있는 문장은 필수적이다.

```javascript
const foo = () => {
    assignedVariable = 14
}
```

`foo()` 는 표현식이지만 undefined나 다른 값을 반환한다. 그러나 이렇게 사용하게 됨으로써 상태를 변화시킬 수 있다. 

```javascript
const foo = () => {
  return 14 //explicit return for readability
}

assignedVariable = foo()
```

더 좋은 방법은 아래와 같이 작성하는 것이다.

```javascript
const foo = foo () => {
  return 14 //explicit return for readability
}
    
assignedVariable = foo()
```

```javascript
const foo = foo (n) => {
    return n//explicit return for readability
}

assignedVariable = foo(14)
```

이렇게 작성을 하면 코드가 읽기 쉽게 구성이 가능하며 표현식과 명령문을 명확하게 구분할 수 있다. 이런 것이 선언적 자바스크립트의 근본이다.
<br/>

## **Statements**

명령문은 함수형 프로그래밍의 근간이다. 기본적으로 문장은 행동을 수행한다. 

자바스크립트에서 값이 필요한 곳에서는 명령문을 사용할 수 없다. 그래서 함수의 인수, 할당의 오른쪽, 연산자, 피연산자, 반환값으로 사용할 수 없다.

```javascript
foo(if () {return 2}) //js engine mind = blown
```

명령문의 종류

1. if
2. if-else
3. while
4. do-while
5. for
6. switch
7. for-in
8. with (deprecated)
9. debugger
10. variable declaration

브라우저 콘솔창에서 아래와 같이 입력을 치게 되면,

```javascript
if (true) {9+9}
```

18을 반환한다. 그러나 원하는 곳에 사용은 할 수 없다. 명령문은 아무것도 반환하지 않기를 바란다. 우리가 그것을 사용할 수 없다면 반환된 값은 쓸모가 없어지기 때문이다.
<br/>

## **IIFE(Immediately Invoked Function Expression)**

우리가 흔히 **즉각 실행함수** 라 부르는 패턴이다. 이것을 사용하면 함수는 새로운 Scope를 만들게 된다. **IIFE** 는 단순하게 함수 표현식이다. 인터프리터가 즉각적으로 실행한다.

익명함수의 표현식과 비슷하게 생겼다. 

```javascript
var foo = 'foo';
    
(function bar () {
  console.log('in function bar');
})()
    
console.log(foo);
```

위에서 간단하게 보면 `foo` 가 출력되기 전에 `bar()` 를 호출하지 않았는데 **in function bar** 가 출력이 되었다. 

- `(` 괄호를 사용해서 함수를 감싸서 선언식이 아닌 표현식이 된다.
- 마지막에 `()` 괄호를 다시 써서 표현식을 즉시 실행하는 구문이 된다.

ES6 이전에는 IIFE를 사용해서 외부에서 접근하지 못하도록 변수를 숨기고 제한하는데 사용이 되었다. 또한 비동기 작업을 실행하고 IIFE 범위에서 변수상태를 보존하려는 경우에도 매우 유용하다. 

```javascript
for (var i = 0; i < 5; i++) {
    setTimeout(function () {
    console.log('index: ' + i);
    }, 1000);
}
```

위에 코드는 흔히 발생하는 잘못된 코드이다. 이와 같은 코드를 IIFE를 사용해서 해결할 수 있다.

```javascript
for (var i = 0; i < 5; i++) {
    (function logIndex(index) {
        setTimeout(function () {
            console.log('index: ' + index);
        }, 1000);
    })(i)
}
```

그러나 ES6+를 사용한다면 **Block Level Scope** 를 지원하는 `let` 또는 `const` 를 사용하면 된다.
<br/>

## **부록**

### **Semi-colon vs Comma operator**

세미콜론을 사용함으로써 표현식을 표현식 문장으로 변환 시킬 수 있다. `2+2` 자체는 표현식이지만 완전한 라인은 문장이다.

```javascript
2+2 // on its own is an opposition
    
foo(2+2) //so you can use it anywhere a value is expected
    
true ? 2+2 : 1 + 1
    
function foo () {return 2+2}
    
2+2; //expression statement
foo(2+2;) //syntaxError
```

세미콜론을 사용하면 여러줄을 한줄로 표현이 가능하다.

```javascript
const a; function foo () {}; const b = 2
```

쉼표 연산자를 사용하면 여러 표현식을 연결하여 마지막 표현식만 반환이 가능하다.

```javascript
console.log( (1+2,3,4) ) //4
    
console.log( (2, 9/3, function () {}) ) // function (){}
    
console.log( (3, true ? 2+2 : 1+1) ) // 4
```

모든 표현식은 왼쪽에서 오른쪽으로 계산이 되고 마지막 표현식이 반환된다.
<br/>

---

#### Reference

- [Understanding Scope in JavaScript](https://www.telerik.com/blogs/understanding-scope-in-javascript)
- [Understanding Scope in JavaScript](https://scotch.io/tutorials/understanding-scope-in-javascript)
- [Understanding Scope in JavaScript](https://www.telerik.com/blogs/understanding-scope-in-javascript)
- [JavaScript Scope and Closures](https://css-tricks.com/javascript-scope-closures/)
- [JavaScript Functions — Understanding The Basics](https://codeburst.io/javascript-functions-understanding-the-basics-207dbf42ed99)
- [All you need to know about Javascript's Expressions, Statements and Expression Statements](https://dev.to/promhize/javascript-in-depth-all-you-need-to-know-about-expressions-statements-and-expression-statements-5k2)
- [Quick Tip: Function Expressions vs Function Declarations](https://www.sitepoint.com/function-expressions-vs-declarations/)
- [JavaScript Function — Declaration vs Expression](https://medium.com/@raviroshan.talk/javascript-function-declaration-vs-expression-f5873b8c7b38)
- [Function Declarations vs. Function Expressions](https://medium.com/@mandeep1012/function-declarations-vs-function-expressions-b43646042052)