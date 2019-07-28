# Module

**Webpack** 및 **SystemJS**와 같은 도구는 무엇일까? 또는 **AMD**, **UMD**, **CommonJS**는 또 무엇인가? 그것들은 어떻게 관련이 있는건가? 그리고 왜 그걸 왜 필요로 하게 되었을까?
<br/>

## 모듈이란?

모듈은 구현사항을 캡슐화하고 기능에 따라 Public API로 노출하여 다른 곳에서 쉽게 불러서 사용하도록 하며 재사용이 가능하도록 한 코드의 뭉치이다.

그렇다면 왜 모듈이 필요하게 되었을까?

- 추상적인 코드 : 전문 라이브러리에 기능을 위임하여 실제 구현의 복잡성을 이해할 필요가 없도록 하기 위해서
- 코드 캡슐화 : 코드를 변경하지 못하도록 하기 위해 모듈 내부의 코드를 숨기기 위해서
- 재사용 코드 : 같은 코드를 계속해서 사용하기 위해서
- 의존성 관리 : 우리의 코드를 다시 작성하지 않고 쉽게 종속성을 변경하기 위해서

<br/>

## Module patterns in ES5

원래 자바스크립트라는 것은 모듈을 염두해두고 설계가 된 언어가 아니다. 시간이 지나면서 사람들이 필요에 따라 다양한 패턴을 만들게 된 것이다.

우리가 간단하게 볼만한 패턴은 **IIFE와 공개 모듈 패턴**이 있다.
<br/>

## 즉시 실행 함수 표현(Immediately-invoked Function Expression)

IIFE는 ES5기준으로 가장 많이 사용되던 패턴 중 하나이다. `Scope Block` 을 만드는 유일한 방법은 함수이기 때문이다. 따라서 아래와 같은 예제는 `ReferenceError` 가 나온다.

```javascript
(function() {
    var scoped = 42;
}());
    
console.log(scoped); // ReferenceError
```

IIFE는 오픈소스라이브러리에서 Block scope를 만드는데 사용이 되었다. 이렇게 하게 되면 우리가 만들면서 공개하는 것과 아닌것을 구분할 수 있게 된다.

```javascript
var myModule = (function() {
    // private variable, accessible only inside the IIFE
    var counter = 0;
    
    function increment() {
        counter++;
    }
    
    // publicly exposed logic
    return {    
        increment: increment
    }
}());
```

ES6에서는 modules라는 스펙이 추가가 되어 modules를 사용할 수 있다. 현재 이 모듈은 자신의 범위를 선언하고 모듈 내부에서 생성된 변수는 전역객체에서 부를 수 없도록 한다.

```javascript
!function() {
    alert("Hello from IIFE!");
}();
```

위의 예제는 놀랍게도 IIFE이다. 우리가 흔히 알고 있는 모양새와 다르다고 생각해서 아니라고 할 수 있다.  그러나 우리가 사용하는 IIFE에서의 괄호는 표현식으로 나타내는 것에 불가하다. 그래서 표현식으로 나타낼 수 있는 어떤 것이든 생성후 바로 실행이 되도록하는 문장이 될 수 있는 것이다.

```javascript
void function() {
    alert("Hello from IIFE!");
}();
```

또한 `void` 역시 기본적으로 함수가 표현식으로 취급되도록 한다.
<br/>

## 전통적인 IIFE

처음에 예제에서 보았듯이 IIFE 패턴의 핵심은 함수를 표현식으로 바꾸고 즉시 실행하는 것이다.

```javascript
(function() {
    alert("I am not an IIFE yet!");
});
```

위의 코드는 단순하게 함수를 괄호로 감싸고 있다. 그러나 이 함수식은 실행이 바로 되지 않으므로 즉시 실행 함수가 아니다. 이걸 IIFE로 바꾸기 위해서는 2가지의 스타일을 변환이 필요하다.

```javascript
// Variation 1
(function() {
    alert("I am an IIFE!");
}());
    
// Variation 2
(function() {
    alert("I am an IIFE, too!");
})();
```

위의 예제에는 익숙한 문법이 있기도 하고 문법이 이상하다고 생각되는 것도 있다. 이걸 간단하게 살펴보면

1. Variation 1의 4행에서 호출을 위한 괄호를 안쪽에 넣었다. 다시 바깥 괄호는 함수 밖의 함수 표현식을 만드는데 필요하게 된다.
2. Variation 2에서 마지막줄의 괄호는 함수 표현식을 호출하기 위한 괄호가 밖에 위치하고 있다.

두가지 방법은 널리 사용되고 있다. 나중에 핵심부분으로 들어가게되면 2가지의 작동이 다르다. 그러나 상관없이 자신이 원하는 방법을 사용하면 된다.

작동하는 예제와 작동하지 않는 두가지 예제를 보자 익명의 함수를 사용하는 것은 좋은 방법이 아니므로 지금부터는 IIFE의 이름을 적어주자

```javascript
// Valid IIFE
(function initGameIIFE() {
    // All your magical code to initalize the game!
}());
    
// Following two are invalid IIFE examples
function nonWorkingIIFE() {
    // Now you know why you need those parentheses around me!
    // Without those parentheses, I am a function definition, not an expression.
    // You will get a syntax error!
}();
    
function () {
    // You will get a syntax error here as well!
}();
```

위의 예제를 실행하게 되면서 우리가 왜 괄호가 필요한지 알게 될 것이다. IIFE를 만들려고 하면 우리는 표현식이 필요하다. 함수 선언, 함수 문장은 필요가 없다.
<br/>

### IIFEs and private variables

```javascript
(function IIFE_initGame() {
    // Private variables that no one has access to outside this IIFE
    var lives;
    var weapons;
        
    init();
    
    // Private function that no one has access to outside this IIFE
    function init() {
        lives = 5;
        weapons = 10;
    }
}());
```

<br/>

### IIFEs with a return value

```javascript
var result = (function() {
    return "From IIFE";
}());
    
alert(result); // alerts "From IIFE"
```

<br/>

### IIFEs with parameters

```javascript
(function IIFE(msg, times) {
    for (var i = 1; i <= times; i++) {
        console.log(msg);
    }
}("Hello!", 5));
```

<br/>

## Classical JavaScript module pattern

우리는 전체 시퀀스를 손상시키지않도록 작동하는 싱글톤 객체를 구현해보려고 한다.

```javascript
 var Sequence = (function sequenceIIFE() {
        
    // Private variable to store current counter value.
    var current = 0;
        
    // Object that's returned from the IIFE.
    return {
    };
        
}());
    
alert(typeof Sequence); // alerts "object"
```

위의 예제를 간단하게 설명하면 `sequenceIIFE` 라는 이름을 가진 함수를 표현식으로 나타내어 IIFE 패턴을 적용하였으며 private 변수로 `current` 를 선언해서 0을 담았으며 `return` 으로 `Object` 를 반환해서 `Sequence` 라는 변수에 담고 있다. 그러므로 당연하게 그것의 타입은 `object` 가 나오게 된다.

```javascript
var Sequence = (function sequenceIIFE() {
        
    // Private variable to store current counter value.
    var current = 0;
        
    // Object that's returned from the IIFE.
    return {
        getCurrentValue: function() {
            return current;
        },
            
        getNextValue: function() {
            current = current + 1;
            return current;
        }
    };
}());
    
console.log(Sequence.getNextValue()); // 1
console.log(Sequence.getNextValue()); // 2
console.log(Sequence.getCurrentValue()); // 2
```

좀 더 그럴듯하게 꾸며보자. 위의 예제에서 `return Object` 에 `getCurrentValue`, `getNextValue` 2가지의 함수를 만들어서 반환하고 있다. 그리고 후에 반환된 `Object` 의 함수를 실행시켜서 IIFE안쪽에 `current` 값을 바꾸거나 가져오고 있다.

위의 `current` 라는 변수는 IIFE의 전용이므로, 클로저를 통해 접근할 수 있는 함수 외에는 변수를 수정하거나 직접 접근은 불가능하다.

이렇게 IIFE와 클로져를 같이 사용해서 구현을 해보았다. 이것은 모듈패턴에 대한 매우 기본적인 변형이다. 더 많은 패턴들이 존재하지만 거의 모든 패턴이 IIFE를 사용하여 폐쇄범위를 만든다.
<br/>

## When you can omit parentheses

```javascript
var result = function() {
    return "From IIFE!";
}();
```

함수 표현식 주위의 괄호는 기본적으로 함수가 명령문이 아닌 표현식이 되도록 한다. 위의 예에서 `function` 키워드는 명령문의 첫 단어가 아니라서 자바스크립트가 이걸 선언문이나 정의로 취급하지 않는다. 마찬가지로 표현식이라는 것을 알 경우 괄호를 생략할 수 있다.

그러나 다른 개발자들분들도 그렇게 생각할지 모르지만 항상 괄호를 붙이는 것이 가독성에 좋다.

싱글톤 대신 모듈로 구현하여 생성자 함수를 노출할 수도 있다.

```javascript
// Expose module as global variable
var Module = function(){
    
    // Inner logic
    function sayHello(){
        console.log('Hello');
    }
    
    // Expose API
    return {
        sayHello: sayHello
    }
}

var module = new Module();

module.sayHello();  
// => Hello
```

<br/>

## Module formats

기존의 ES6이전에는 자바스크립트에 모듈을 정의하는 공식문법이 존재하지 않았다. 그래서 다양한 모듈을 정의해왔었는데

- Asynchronous Module Definition (AMD)
- CommonJS
- Universal Module Definition (UMD)
- System.register
- ES6 module format

<br/>

### Asynchronous Module Definition (AMD)

AMD 형식은 브라우저에서 사용되며 정의함수를 사용하여 모듈을 정의한다.

```javascript
//Calling define with a dependency array and a factory function
define(['dep1', 'dep2'], function (dep1, dep2) {
    
    //Define the module value by returning a value.
    return function () {};
});
```

<br/>

### CommonJS format

CommonJS 형식은 Node.js에서 사용되며 `require` 과 `module.exports` 를 사용하여 종속성 및 모듈을 정의한다.

```javascript
var dep1 = require('./dep1');  
var dep2 = require('./dep2');
    
module.exports = function(){  
  // ...
}
```

<br/>

### Universal Module Definition (UMD)

UMD는 브라우저와 Node에서 모두 사용이 가능하다.

```javascript
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['b'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('b'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.b);
    }
}(this, function (b) {
    //use b in some fashion.
    
    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    return {};
}));
```

<br/>

### System.register

`System.register` 형식은 ES5에서 ES6 모듈 구문을 지원하도록 설계되었습니다.

```javascript
import { p as q } from './dep';
    
var s = 'local';
    
export function func() {  
    return q;
}
    
export class C {  
}
```

<br/>

### ES6 module format

```javascript
    // lib.js
    
    // Export the function
    export function sayHello(){  
      console.log('Hello');
    }
    
    // Do not export the function
    function somePrivateFunction(){  
      // ...
    }
```

사용하려면 import로 불러서 사용한다.

```javascript
import { sayHello } from './lib';
    
sayHello();  
// => Hell
```

아직 브라우저는 ES6문법을 지원하지 않는다. 이미 ES6 모듈 포맷을 사용할 수 있지만 브라우저에서 코드를 실제로 실행하기 전에 코드를 **AMD** 나 **CommonJS** 와 같은 **ES5 모듈 형식으로 바꾸기 위해 Babel과 같은 변환기가 필요하게 된다.**
<br/>

## Module loaders

모듈 로더는 특정 모듈 형식으로 작성된 모듈을 해석하고 load한다.

런타임 시점에 loader를 실행한다.

- 브라우저에서 모듈 로더를 로드한다.
- 모듈로더에게 어느 파일을 로드할 것인지 알려준다.
- 모듈로더가 주파일을 다운로드해서 해석한다.
- 필요한 경우에는 모듈 로더가 파일을 다운로드한다.

널리 사용되는 모듈 로더는 아래와 같이 있다.

- RequireJS : AMD 형식의 모듈 용 로더
- SystemJS : AMD, CommonJS, UMD 또는 System.register 형식의 모듈 용 로더

<br/>

## Module bundlers

모듈 번들러는 모듈 로더를 대체한다. 그러나 로더와 차이점은 모듈 번들은 빌드시에 실행이 된다.

- 빌드를 할 때 모듈 번들을 실행하여 번들파일을 생성한다.
- 브라우저에서 번들을 로드한다.

널리 사용되는 모듈 번들러는 아래와 같이 있다.

- Browserify : CommonJS 모듈 용 bundler
- Webpack : AMD, CommonJS, ES6 모듈 용 bundler

<br/>

---

#### Reference

- [Essential JavaScript: Mastering Immediately-invoked Function Expressions](https://medium.com/@vvkchandra/essential-javascript-mastering-immediately-invoked-function-expressions-67791338ddc6)
- [Do ES6 Modules make the case of IIFEs obsolete?](https://hashnode.com/post/do-es6-modules-make-the-case-of-iifes-obsolete-civ96wet80scqgc538un20es0)
- [JavaScript Modules: A Beginner’s Guide](https://medium.freecodecamp.org/javascript-modules-a-beginner-s-guide-783f7d7a5fcc)
- [ES6 modules, Node.js and the Michael Jackson Solution](https://medium.com/dailyjs/es6-modules-node-js-and-the-michael-jackson-solution-828dc244b8b)
- [A 10 minute primer to JavaScript modules, module formats, module loaders and module bundlers](https://www.jvandemo.com/a-10-minute-primer-to-javascript-modules-module-formats-module-loaders-and-module-bundlers/)
- [JavaScript Modules: A Beginner’s Guide](https://medium.freecodecamp.org/javascript-modules-a-beginner-s-guide-783f7d7a5fcc)