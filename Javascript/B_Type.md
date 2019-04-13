# Type

## Primitive Type

한국말로 간단하게 말하면 원시 자료형이라고 하는 자바스크립트의 타입에 대해서 알아보자!

자바스크립트는 자바나 C언어와는 다른게 동적 타입언어라고 불린다. 동적 타입 언어의 자료형은 컴파일시 자료형을 정하는 것이 아니고 실행시에 결정이 된다. 

자바스크립트의 타입의 종류와 사용법에 대해서 알아보자.
<br/>

### 6가지의 기본 Type

ES6 이전에는 기본적으로 5가지의 타입이 있었다. 추가적으로 ES6에서 Symbol 타입이 추가되었다.

- String : 텍스트를 셋팅하는데 사용하는 타입.
- Number : 숫자를 셋팅하는데 사용하는 타입. 기본적으로 소수점도 가능하다.(`infinity`, `-inifinity`, `NaN` 표현이 가능하다.)
- Null : null타입은 정확히는 1개의 값은 가지고 있지만 비어있다는 뜻이다.
- Undefined : 값이 할당되지 않는 것을 나타내는 타입.
- Boolean : `true` 또는 `false` 로 나타내는 타입.
- Symbol : 새로 추가된 타입으로 **unique하고 immutable한 원시값** 으로 사용된다.

위에서 보이듯이 기본적으로 6가지의 형태를 가지고 있으며 나머지는 **Object형** 이라고 통칭한다.

- Array : 우리가 알고 있는 배열, 리스트의 형태를 가지고 있다.
- Function : Javascript에서는 Function Object가 존재하지만 결국 Function도 Object.
- Object  : Map처럼 사용하는 즉, key : value의 형태로 사용하고 있는 Object.

위에서 보았던 6가지 기본타입을 생성하는 방법은 크게 2가지이다.

1. Literal로 생성하기

Literal로 생성한다고 하면 우리가 가장 많이 사용하는 방법이라고 생각된다. 단순하게 변수를 초기화 후 할당하는 방법과 초기화를 하고 나중에 할당을 하는 방법으로 구분을 지을 수 있다.

```javascript
var bol = true;
var str = "hello";
var num = 3.14;
var nullType = null;
var undef = undefined;

var bol2;
var str2;
bo2 = false
str2 = "world"
```

2. Wrapper Object를 사용해서 만들기

Wrapper Object를 사용해서 만든다고 하면 Constructor를 사용해서 만드는 것을 말한다. 쉽게 말하자면 `new` 를 사용해서 만드는 것을 말한다.

```javascript
new Boolean(false);
new String("world");
new Number(42);

Symbol("foo"); //Symbol 타입의 생성방법
```

Literal로 생성하는 방법과 Wrapper Object를 사용해서 만드는 방법은 차이점이 존재한다. 아래의 예제를 보자.

```javascript
typeof true; //"boolean"
typeof Boolean(true); //"boolean"
typeof new Boolean(true); //"object"
typeof (new Boolean(true)).valueOf(); //"boolean"
     
typeof "abc"; //"string"
typeof String("abc"); //"string"
typeof new String("abc"); //"object"
typeof (new String("abc")).valueOf(); //"string"
     
typeof 123; //"number"
typeof Number(123); //"number"
typeof new Number(123); //"object"
typeof (new Number(123)).valueOf(); //"number"
```

중간중간 이상하게 new를 사용하지 않고 사용하는 것들은 `window.Boolean`,  `window.String` 이런것으로 생각하면 되며, 이러한 Function은 해당 타입으로 parse하는 작업을 할 때 사용이 된다.

위에서 보게 되면 Literal로 생성한 것의 타입은 6가지 중 하나로 나오게 된다. 그런데 new를 사용하여 Wrapper Object로 만들게 되면 Object타입이 나오게 된다. 사용을 하려면 valueOf라는 Function을 사용해야만 입력한 값이 나오게 된다.

아래의 예제를 보자. 어떻게 결과가 어떻게 6이 나올 수 있는 것인가?

```javascript
var str = 'string'

str.length // 6
```

위의 예제는 단순하게 str 변수안에 'string'이라는 String 타입의 값을 할당을 했다. 그런데 해당 변수는 Wrapper 객체가 아닌데 어떻게 갯수를 세는 Method를 사용하고 있는 것인가?

```javascript
String.prototype.returnMe= function() {
    return this;
}
     
var a = "abc";
var b = a.returnMe();  
     
a; //"abc" 
typeof a; //"string" (still a primitive)

b; //"abc"
typeof b; //"object"
```

위의 예제를 보게 되면 답이 나오게 된다. 우리가 사용하는 `var str` 를 사용하게 되면 Wrapper 객체로 임시변환이 이루어지고 `returnMe()` 와 같은 함수를 사용하면 다시 Wrapper 객체가 사라지게 된다. 
<br/>

## 심화내용

자바스크립트에서는 신기하게도 숫자타입을 하나로 사용하고 있다. 어떻게 하나의 타입으로 모든 것을 표현할 수 있는 것일까? **Number타입은 국제 표준 부동 소수점 IEEE 754를 따르고 있다.** 기본적으로 컴퓨터가 실수를 표현하는 방식은 2진법에 따라서

- 13 = 8 + 4 + 1 이므로 해당 자리 숫자를 1로 표현하고 나머지는 0으로 표현하게 되고 1101이 된다.
- 0.75 = 0.5 + 0.25 이므로 0.11 로 표현할 수 있다.

일반적으로 소수점을 표현하는 방법은 2가지 방법이 있다. 
<br/>

### **고정 소수점**

- 정수를 표현하는 비트수와 소수를 표현하는 비트수를 미리 정해놓고 해당 비트만큼 사용해서 숫자를 표현하는 방식
- 예) 실수 표현에 4byte(32bit)를 사용하고 그 중 **부호1bit, 정수 16bit, 소수 15bit** 를 사용하도록 약속해 놓은 시스템에 있다. 이렇게 약속된 시스템에서 263.3을 표현하면 (0)0000000100000111.010011001100110 이렇게 표현된다.
- 정수를 표현하는 비트수를 늘리면 큰 숫자를 표현할 수 있지만 정밀한 숫자를 표현하긴 힘들다. 그래서 소수를 표현하는 bit를 늘릴 경우 정밀한 숫자를 표현할 수 있지만 큰 숫자를 표현하지 못한다.

이런 문제를 해결하기 위해서 소수점을 고정하지 않고 표현할 수 있는 **부동 소수점(floating point)** 을 사용하게 되었다.
<br/>

### **부동소수점**

부동 소수점을 표현하는 방식도 정하는 방식에 따라 다를 수 있지만 일반적으로 사용하고 있는 방식은 위에서 언급한 IEEE 754에서 표준으로 제안한 방식을 따른다.

우선 고정 소수점으로 나타낸 263.3을 2진수 부동 소수점 방식으로 변환을 해보면, 100000111.010011001100110... 으로 표현되던 것을 맨 앞에 있는 1 바로 뒤로 소수점을 옮겨서 표현하도록 변환하게 되면 1.00000111010011001100110... * 2^8(2의 8승) 으로 표현된다.

- 2^8의 8을 지수라고 하고 지수 부분에 기록을 하고(IEEE 754 표현 방식에서는 **127 + 지수를 기록한다.** )
- 소수점 이후 숫자열 전체를 가수라고 하고 가수 부분에 기록을 한다.

최종적인 모양을 아래와 같다.

- 부호 비트(1 bit) : 0 (양수)
- 지수 비트(8 bit) : 10000111 (127 + 8 = 135)
- 가수 비트(23 bit) : 00000111010011001100110 
  
이렇게 표현하게 된다.

하지만 여기서도 0.010011001100110은 정확히 0.3을 나타낼 수 없게 된다. 10진수로 나타내 보면 0.29998779296875로 나오게 된다. 그래서 자바스크립트에서 0.1 + 0.2를 하게 되면 0.30000000000000004가 나오는 이유이다.

> 블록체인에서는 부동소수점에서 8자리까지를 사용한다고 한다.

<br/>

## 값타입과 참조타입

기본적으로 원시타입을 값타입이라고 한다면 Object를 참조타입이다. 
<br/>

### 원시타입은 값타입이다.

```javascript
var a = 13         // assign `13` to `a`
var b = a          // copy the value of `a` to `b`

b = 37             // assign `37` to `b`

console.log(a)     // => 13
```

위에서 b에 a의 값을 복사를 했다. 그리고 b의 값을 변경을 했는데 a에는 영향이 가지 않았다. 이유는 당연하게 2개의 값이 저장된 공간이 다르기 때문이다.

```javascript
var a = 5;
var b = a;

a = 10;

console.log(a); // 10
console.log(b); // 5
// string, boolean, null, undefined은 같은 결과가 나온다.
```

<br/>

### Object는 참조타입이다.

```javascript
    var a = { c: 13 }  // assign the reference of a new object to `a`
    var b = a          // copy the reference of the object inside `a` to new variable `b`
    b.c = 37           // modify the contents of the object `b` refers to
    console.log(a)     // => { c: 37 }
```

원시타입과는 다르게 복사한 것을 변경을 했더니 a에도 영향이 간다. 이유는 당연하게 같은 값의 주소를 복사를 하여서 a에 들어있는 주소의 공간이 바뀌었으므로 a로 바뀐값을 불러오는 것이다.

```javascript
    var a = {};
    var b = a;
    a.a = 1;
    console.log(a); // {a: 1}
    console.log(b); // {a: 1}
```

array의 경우에 있어도 예외는 없다.

```javascript
    var a = [];
    var b = a;
    a.push(1);
    console.log(a); // [1]
    console.log(b); // [1]
    console.log(a === b); // true
```

```javascript
    function changeAgeImpure(person) {
        person.age = 25;
        return person;
    }
    var alex = {
        name: 'Alex',
        age: 30
    };
    var changedAlex = changeAgeImpure(alex);
    console.log(alex); // -> { name: 'Alex', age: 25 }
    console.log(changedAlex); // -> { name: 'Alex', age: 25 }
```

```javascript
    function changeAgePure(person) {
        var newPersonObj = JSON.parse(JSON.stringify(person));
        newPersonObj.age = 25;
        return newPersonObj;
    }
    var alex = {
        name: 'Alex',
        age: 30
    };
    var alexChanged = changeAgePure(alex);
    console.log(alex); // -> { name: 'Alex', age: 30 }
    console.log(alexChanged); // -> { name: 'Alex', age: 25 }
```

<br/>

### 문제

```javascript
function changeAgeAndReference(person) {
    person.age = 25;
    person = {
        name: 'John',
        age: 50
    };
        
    return person;
}
    
var personObj1 = {
    name: 'Alex',
    age: 30
};
    
var personObj2 = changeAgeAndReference(personObj1);

console.log(personObj1); // -> ?
console.log(personObj2); // -> ?
```

### **답**

:point_right: [답 확인하기](https://codepen.io/seonhyungjo/pen/qwXMNb)

<br/>

## 명시적 변환, 암시적 변환, 덕 타이핑

### 명시적 변환 vs 암묵적 변환

개발자가 `Number(value)` 와 같은 코드를 작성하여 변환할 의사를 명확하게 표현하는 것을 **명시적 변환**이라고 한다. JavaScript는 약타입 언어이므로 값을 자동으로 여러 유형간에 변환을 자동으로 한다. 이것을 **암묵적 변환** 이라고 한다.

예를 들어 일반적으로 연산자를 다양한 유형의 값에 적용하면 `1 == null`, `2 / '5'`, `null + new Date ()` 또는 `if (value) {...}` 와 같이 문법에 의해 발생할 수 있다.

우리가 가장 많이 사용하는 암시적 타입 변환을 하지 않는 연산자는 `===` 이며, **완전 항등 연산자** 라고 한다. 반면에 **느슨한 항등 연산자** `==` 는 필요하다면 **비교와 타입 강제 변환을 수행** 합니다.

암시적 타입 변환으로 `==` 을 사용하게 되면, 가독성을 잃지 않으면서 적은 코드로 작성할 수있는 유용한 매커니즘이다. 그러나 ES6+를 사용한다면 느슨한 항등 연산자는 사용하지 않는 것을 추천한다. 완전하게 항등연산자를 이해하고 결과값을 예상할 수 있는 경우가 아니라면 내가 생각한 것과 다른 결과가 나올 확률이 매우 높다.

기본적으로 변환은 3가지 유형의 전환이 있다.

- **to string**
- **to boolean**
- **to number**

<br/>

### String 변환

명시적으로 값을 문자열로 변환하려면 `String()` 함수를 사용하면 된다. 암시적 강제 변환은 `binary` 연산자가 아닌것에 `+` 연산자를 사용하면 변환이 이루어진다. 

```javascript
String(123) // 명시적

123 + ''    // 암시적
```

아래의 예제를 보면 예상대로 다 문자열로 변환이 잘 이루어지고 있다.

```javascript
String(123)                   // '123'
String(-12.3)                 // '-12.3'
String(null)                  // 'null'
String(undefined)             // 'undefined'
String(true)                  // 'true'
String(false)                 // 'false'
```

Symbol에 대해서는 생각과는 다르게 나온다.

```javascript
String(Symbol('my symbol'))   // 'Symbol(my symbol)'
'' + Symbol('my symbol')      // TypeError is thrown
```

`Symbol` 변환은 명시적으로만 변환될 수 있고, 암시적 변환은 되지 않는다.
<br/>

### Boolean 변환

명시적으로 값을 Boolean으로 변환하려면 `Boolean()` 함수을 사용하면 된다. 암시적 변환은 논리 Context에서 발생하거나 논리 연산자에 의해 작동을 하게 된다.( `||`, `&&`, `!` )

```javascript
Boolean(2)          // 명시적
if (2) { ... }      // 논리적 문맥 때문에 암시적
!!2                 // 논리적 문맥 때문에 암시적
2 || 'hello'        // 논리적 문맥 때문에 암시적
```

논리 연산자(예 : `||` 및 `&&` )에 따른 Boolean 변환을 내부적으로 수행하지만 Boolean값이 아니더라도 원래 피연산자의 값을 실제로 반환한다. 아래를 보게 되면 Boolean 변환을 해서 검사는 하지만 실제로는 123도  반환되고 있다.

```javascript
// true를 반환하는 것이 아닌 123를 반환하고 있다.
// 'hello' and 123 은 표현식을 계산하기 위해서 Boolean으로 강제 변환을 한다.
let x = 'hello' && 123;   // x === 123
```

Boolean 변환의 결과는  `true`, `false` 2개만 있다. `false` 값 목록은 쉽게 기억이 가능하다.

```javascript
Boolean('')           // false
Boolean(0)            // false     
Boolean(-0)           // false
Boolean(NaN)          // false
Boolean(null)         // false
Boolean(undefined)    // false
Boolean(false)        // false
```

목록에 없는 값 `object`, `function`, `Array`, `Date`, 사용자 정의 유형등은 `true` 로 변환한다.

```javascript
Boolean({})             // true
Boolean([])             // true
Boolean(Symbol())       // true
!!Symbol()              // true
Boolean(function() {})  // true
```

<br/>

### Numeric 변환

명시적 변환의 경우 `Boolean()` 및 `String()` 에서와 마찬가지로 `Number()` 함수를 사용하면 된다. 암시적 변환은 많은 경우에서 작동이 되기 때문에 까다롭다.

- 비교 연산자(`>`, `<`, `<=`,`>=`)
- 비트 연산자( `|` `&` `^` `~`)
- 산수 연산자 (`-` `+` `*` `/` `%` ).
    - 참고로, `+`는 피연산자가 문자열일 때 숫자 변환을 하지 않고 문자열 변환을 한다.
- 단항 연산자(기호로 사용하는) `+`
- 느슨한 비교 연산자 `==` (`!=`).
    - 두 피연산자가 모두 문자열 인 경우 `==` 는 숫자 변환을 하지 않는다.

```javascript
Number('123')   // 명시적
+'123'          // 암시적
123 != '456'    // 암시적
4 > '5'         // 암시적
5 / null        // 암시적
true | 0        // 암시적
```

```javascript
Number(null)                   // 0
Number(undefined)              // NaN
Number(true)                   // 1
Number(false)                  // 0
Number(" 12 ")                 // 12
Number("-12.34")               // -12.34
Number("\n")                   // 0
Number(" 12s ")                // NaN
Number(123)                    // 123
```

문자열을 숫자로 변환할 때 엔진은 먼저 앞뒤의 공백, `\ n`, `\ t` 문자를 제거하고, 문자열이 유효한 숫자를 나타내지 않으면 `NaN` 을 반환한다. `string`이 비어 있으면 0을 반환합니다.

`null`와 `undefined`는 다르게 처리가 되는데 `null`은 0으로 `undefined`는 `NaN`으로 된다.

Symbol은 명시적 또는 암시적으로 숫자로 변환될 수 없다. 또한 `TypeError`는 `undefined`로 발생하는 것처럼 `NaN`으로 자동 변환하는 대신 `throw` 된다.

```javascript
Number(Symbol('my symbol'))    // TypeError is thrown
+Symbol('123')                 // TypeError is thrown
```

기억해야 할 두 가지 특별한 규칙이 있는데

1. `==` 를 `null` 또는 `undefined` 에 적용하면 숫자 변환이 발생하지 않는다. `null` 는 `null`, `undefined`과 동일하다.

```javascript
null == 0               // false, null is not converted to 0
null == null            // true
undefined == undefined  // true
null == undefined       // true
```

2. `NaN`은 그 자체가 동등하지 않다.

```javascript
if (value !== value) { console.log("we're dealing with NaN here") }
```

<br/>

---

## Object 강제 변환

참고: [https://medium.freecodecamp.org/js-type-coercion-explained-27ba3d9a2839](https://medium.freecodecamp.org/js-type-coercion-explained-27ba3d9a2839)

---

<br/>

## 심화

### **덕 타이핑(Duck Typing)이란?**

쉽게 정의를 하자면 사람이 오리처럼 행동하면 오리로 봐도 무방하다라는게 덕 타이핑(Duck Typing)이다. 

이것은 타입을 미리 정하는게 아니라 실행이 되었을 때 해당 Method들을 확인하여 타입을 정한다는 것으로  타입의 변화가 느슨하다.

- 장점
  - 타입에 대해 매우 자유롭다.
  - 런타임 데이터를 기반으로 한 기능과 자료형을 만들어 내는 것
- 단점
  - 런타임 자료형 오류가 발생할 수 있다. 런타임에서, 값은 예상치 못한 유형이 있을 수 있고, 그 자료형에 대한 무의미한 작업이 적용된다.
  - 이런 오류가 프로그래밍 실수 구문에서 오랜 시간 후에 발생할 수 있다
  - 데이터의 잘못된 자료형의 장소로 전달되는 구문은 작성하지 않아야 한다. 이것은 버그를 찾기 어려울 수도 있다.

<br/>

### Reference

- [How numbers are encoded in JavaScript](http://2ality.com/2012/04/number-encoding.html)
- [What Every JavaScript Developer Should Know About Floating Point Numbers](https://blog.chewxy.com/2014/02/24/what-every-javascript-developer-should-know-about-floating-point-numbers/)
- [Here is what you need to know about JavaScript’s Number type](https://blog.angularindepth.com/javascripts-number-type-8d59199db1b6)
- [The Secret Life of JavaScript Primitives](https://javascriptweblog.wordpress.com/2010/09/27/the-secret-life-of-javascript-primitives/)
- [Primitive Types](https://flow.org/en/docs/types/primitives/)
- [(Not) Everything in JavaScript is an Object](http://blog.brew.com.hk/not-everything-in-javascript-is-an-object/)
- [JavaScript data types and data structures - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Primitive_values)
- [Explaining Value vs. Reference in Javascript](https://codeburst.io/explaining-value-vs-reference-in-javascript-647a975e12a0)
- [Primitive Types & Reference Types in JavaScript](https://gist.github.com/branneman/7fb06d8a74d7e6d4cbcf75c50fec599c)
- [Value types, reference types and scope in JavaScript](https://medium.com/@benastontweet/lesson-1b-javascript-fundamentals-380f601ba851)
- [Back to roots: JavaScript Value vs Reference](https://medium.com/dailyjs/back-to-roots-javascript-value-vs-reference-8fb69d587a18)
- [JavaScript Reference and Copy Variables](https://hackernoon.com/grasp-by-value-and-by-reference-in-javascript-7ed75efa1293)
- [(Not) Everything in JavaScript is an Object](http://blog.brew.com.hk/not-everything-in-javascript-is-an-object/)
- [JavaScript type coercion explained](https://medium.freecodecamp.org/js-type-coercion-explained-27ba3d9a2839)