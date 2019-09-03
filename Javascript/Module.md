# Module

Java나 Python 같은 OOP 언어들에서는 Class라는 이름으로 객체지향 프로그래밍을 구현한다. OOP의 특징으로는 *Encapsulation, Inheritance, Polymorphism*이 있다. 

Javascript의 Module은 OOP 언어에서의 Class와 비슷한 기능을 한다.

Javascript에서는 scope를 기준으로 Encapsulation한다. 예전부터 Javascript는 scope를 이용해서 외부로부터 보호하려는 노력을 해왔다. ES5에서는 **함수가 scope의 기준**이기 때문에 함수의 scope를 이용해서 시도했다. 또한 클로져를 이용해서 내부 속성들을 만들어서 사용하였다.

<br/>

## Module이란?

Module은 구현내용을 캡슐화하고 기능에 따라 Public API로 노출하여 다른 곳에서 쉽게 불러서 사용하며, 재사용이 가능하도록 한 코드뭉치이다.

왜 Module이 필요하게 되었나?

- **추상적인 코드** : 라이브러리에 기능을 위임하여 실제 구현의 복잡성을 이해할 필요가 없도록 하기 위해서
- **코드 캡슐화** : 코드를 변경하지 못하도록 하며, Module 내부의 코드를 숨기기 위해서
- **재사용 코드** : 같은 코드를 계속해서 사용하기 위해서
- **의존성 관리** : 코드를 다시 작성하지 않고 종속성을 변경하기 위해서

<br/>

## Module patterns in ES5

Javascript는 Module을 염두해두고 설계가 된 언어가 아니다. 시간이 지나면서 사람들이 필요에 따라 다양한 패턴을 만들었다.

다양한 패턴의 시작지점인 **IIFE(즉시실행함수 표현식), 노출식(공개) 모듈 패턴**을 살펴보자.

<br/>

## IIFE(Immediately-invoked Function Expression)

IIFE는 ES5 기준 가장 많이 사용되던 패턴 중 하나이다. `Scope Block` 을 만드는 유일한 방법은 함수를 사용하는 것이다. 따라서 아래와 같은 예제는 `ReferenceError` 가 나온다.

```js
(function() {
  var scoped = 42;
}());
    
console.log(scoped); // ReferenceError
```

![ReferenceError](![image](https://user-images.githubusercontent.com/24274424/63151836-5a31cb80-c045-11e9-8686-107cfc6b8dc4.png)

IIFE는 오픈소스라이브러리에서 `Block scope`를 만드는데 사용된다. 아래 예제와 같이 사용하게 되면 공개하는 것과 아닌 것을 구분할 수 있게 된다.

```js
const moduleFunction = (function () {
  // private
  let a = "Hello World";

  function helloWorld(){
    console.log(a);
  }

  // public
  return {
    sayHello: helloWorld
  }
})()

moduleFunction.sayHello();
```

함수를 바로 실행한 후 Object를 반환하여 전역 네임을 한번만 사용하여 scope를 오염시키지 않는다. 외부에서 내부로의 접근을 차단하여 보호한다.  

**다만 의존성관리가 되지 않는다. 코드를 재작성하지 않으면 다른 파일에서 재사용이 불가능하다.**

```js
(function() {
  console.log("I am not an IIFE yet!");
});
```

위의 코드는 함수를 괄호로 감쌌다. 이 함수식은 실행이 바로 되지 않아 즉시 실행 함수가 아니다. IIFE로 바꾸기 위한 2가지의 스타일을 변환이 있다.

```js
// Variation 1
(function() {
  console.log("I am an IIFE!");
}());

// Variation 2
(function() {
  console.log("I am an IIFE, too!");
})();
```

1. Variation 1는 4행에서 호출을 위한 괄호를 안쪽에 넣었다. 다시 바깥 괄호는 함수 밖의 함수 표현식을 만든다.
2. Variation 2는 마지막줄의 괄호는 함수 표현식을 호출하기 위한 괄호로 함수 밖에 위치하고 있다.

두 가지 방법은 널리 사용된다. 후에 핵심부분을 공부하게 되면 2가지의 작동이 다르다는 것을 알 수 있다.

작동하는 예제와 작동하지 않는 두 가지 예제를 살펴보자.

```js
// Valid IIFE
(function initGameIIFE() {
  console.log('valid')
}());
    
// Following two are invalid IIFE examples
function nonWorkingIIFE() {
  console.log('invalid')
}();
    
function () {
  console.log('invalid')
}();
```

위의 예제를 보게되면 왜 괄호가 필요한지 알 수 있다. **IIFE를 만들려면 표현식이 필요하다. 함수 선언, 함수 문장은 필요없다.**

> [함수에 대해 더 알아보기](https://github.com/Im-D/Dev-Docs/blob/master/Javascript/B_Function.md)

<br/>

## 노출식 모듈 패턴

형태는 IIFE와 크게 다르지 않으며 반환값을 변수에 담으면 된다.

```js
const singleton = (function moduleFunction() {
  let a = 3;

  function helloWorld() {
    console.log('Hello');
  }

  return {
    a: a,
    sayHello: helloWorld
  };
})();

singleton.sayHello();
doSomething(singleton.a);
```

IIFE와 클로져를 같이 사용해서 구현을 해보았다. Module 패턴에 대한 기본적인 변형이다. 더 많은 패턴들이 존재하지만 거의 모든 패턴이 IIFE를 사용하여 폐쇄범위를 만든다.

앞서 IIFE의 문제는 의존성 관리가 힘들다는 것이었다. 노출식 모듈패턴 역시 같은 문제가 있다.

<br/>

## NodeJs의 모듈화

의존성 관리 문제 때문에 ES5에서는 AMD, UMD, CommonJS 와 같은 모듈 포맷을 사용했다. 각각에 대해서 알아보자.

- Asynchronous Module Definition (AMD)
- CommonJS
- Universal Module Definition (UMD)
- [추가] System.register

<br/>

### Asynchronous Module Definition (AMD)

AMD 형식은 브라우저에서 사용되며 define를 사용하여 Module을 정의한다.

```js
define(['dep1', 'dep2'], function (dep1, dep2) {
    
  //Define the module value by returning a value.
  return function () {};
});

```

<br/>

### CommonJS format

CommonJS 형식은 Node.js에서 사용되며 `require` 과 `module.exports` 를 사용하여 종속성 및 Module을 정의한다.

```js
module.exports = {
  sum: function() {
    var total = 0;

    for (var idx in arguments) {
        total += arguments[idx];
    }

    return total;
  }
};

// -------------------------

var math = require('./math');

console.log(math.sum(1, 2));
```

내부적으로는 IIFE와 크게 다르지 않다. 내보낼 Module을 파라미터로 하여 IIFE를 실행시키고 반환하는 방식이다. 하지만 파일 외부에서 작성하고 불러온다는 점에서 좋아진 방식이다.

<br/>

### Universal Module Definition (UMD)

UMD는 브라우저와 Node에서 모두 사용이 가능하다.

```js
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
  return {};
}));
```

<br/>

### System.register

`System.register` 형식은 ES5에서 ES6 모듈 구문을 지원하도록 설계되었다.

```js
import { p as q } from './dep1';
    
const s = 'test';
    
export function func() {  
    return q;
}
    
export class C {  
}
```

<br/>

## 모듈 제공의 방향과 ES6

Module 제공 방식의 추세가 AMD vs CommonJS였다면, CommonJS와 ECMAScript Modules로 축약되는 것으로 보인다.

하지만 여전히 일부 라이브러리가 AMD방식을 사용하고 있어 지금도 번들링은 UMD로 하고 있다.

require과 import를 사용하여 모듈을 불러올 때 차이 중 하나는 `Tree-Shaking`을 할 때 알 수 있다.

import를 사용한 방식은 라이브러리의 특정 모듈만을 가져와 번들링할 수 있지만, require 방식으로 가져온 라이브러리는 모듈 전체를 번들링해야한다.

**즉, require 방식으로 가져온 모듈에 대해서는 Tree-shaking을 진행할 수 없다.**

<br/>

## ES6 module format

ES6에서는 Module을 사용하기 위한 내장 문법을 지원한다. 바로 export다.

```js
// some.js
export function helloWorld() {
  console.log('Hello');
}

function somePrivateFunction() {
  // ...
}

// something.js
import { helloWorld as hello } from './some';
// import * from './some' 도 가능하다.

hello();
```

이렇게 하면 파일을 분리하고 그 파일에서 필요한 부분만 반환하여 사용할 수 있게 된다. 또한 재사용성이 극대화되어 의존성 관리도 가능하게 된다.

또한 단일 값을 반환할 경우 `default` 형식을 지원한다. 이 경우 `{}`를 사용하지 않아도 된다.

```js
// Export default function
export default function sayHello(){
  console.log('Hello');
}

// Export non-default function
function sayGoodbye(){
  console.log('Goodbye');
}

const apiUrl = '...';

returnObject = {
    goodbye : sayGoodbye,
    apiUrl : apiUrl
}
export returnObject;

// Export object
export const settings = {
  debug: true
}

import sayHello, { returnObject, settings } from './lib';

sayHello();
returnObject.sayGoodBye();
```

~~아직 브라우저는 ES6문법을 지원하지 않는다. ES6 모듈 포맷을 사용할 수 있지만 브라우저에서 코드를 실제로 실행하기 전에 코드를 **AMD** 나 **CommonJS** 와 같은 **ES5 모듈 형식으로 바꾸기 위해 Babel과 같은 변환기가 필요하게 된다.**~~

이전에는 브라우저가 이것을 지원하지 않아 bundler나 transpiler를 사용해서 ES6 모듈을 사용했었다.

### 브라우저에서 사용

이 버전들부터는 브라우저가 ES6 모듈을 사용할 수 있다.

- Chrome 61 이상
- Firefox 60 이상
- Edge 16 이상
- Safari 11 이상

> 관련 링크 [ES6 Module in Browser](https://github.com/Im-D/Dev-Docs/blob/master/ECMAScript/ES6-module-in-Browser.md#es6-modules)

<br/>

## Module loaders

모듈 로더는 특정 모듈 형식으로 작성된 모듈을 해석하고 load한다.

런타임 시점에 loader를 실행한다.

- 브라우저에서 모듈 로더를 로드한다.
- 모듈로더에게 어느 파일을 로드할 것인지 알려준다.
- 모듈로더가 주파일을 다운로드해서 해석한다.
- 필요한 경우에는 모듈 로더가 파일을 다운로드한다.

널리 사용되는 모듈 로더는 아래와 같이 있다.

- RequireJS : AMD 형식의 모듈용 로더
- SystemJS : AMD, CommonJS, UMD 또는 System.register 형식의 모듈용 로더

<br/>

## Module bundlers

모듈 번들러는 모듈 로더를 대체한다. 그러나 로더와 차이점은 모듈 번들은 빌드시에 실행이 된다.

- 빌드를 할 때 모듈 번들을 실행하여 번들파일을 생성한다.
- 브라우저에서 번들을 로드한다.

널리 사용되는 모듈 번들러는 아래와 같이 있다.

- Browserify : CommonJS 모듈용 bundler
- Webpack : AMD, CommonJS, ES6 모듈용 bundler

<br/>

---

#### Reference

- [B_Module](https://github.com/Im-D/Dev-Docs/edit/master/Deprecated/B_Module.md)
- [Module](https://github.com/Im-D/Dev-Docs/blob/master/Deprecated/Module.md)
- [AMD와 CommonJS](https://github.com/Im-D/Dev-Docs/blob/master/Deprecated/AMD%EC%99%80%20CommonJS.md)
- [Essential JavaScript: Mastering Immediately-invoked Function Expressions](https://medium.com/@vvkchandra/essential-javascript-mastering-immediately-invoked-function-expressions-67791338ddc6)
- [Do ES6 Modules make the case of IIFEs obsolete?](https://hashnode.com/post/do-es6-modules-make-the-case-of-iifes-obsolete-civ96wet80scqgc538un20es0)
- [JavaScript Modules: A Beginner’s Guide](https://medium.freecodecamp.org/javascript-modules-a-beginner-s-guide-783f7d7a5fcc)
- [ES6 modules, Node.js and the Michael Jackson Solution](https://medium.com/dailyjs/es6-modules-node-js-and-the-michael-jackson-solution-828dc244b8b)
- [A 10 minute primer to JavaScript modules, module formats, module loaders and module bundlers](https://www.jvandemo.com/a-10-minute-primer-to-javascript-modules-module-formats-module-loaders-and-module-bundlers/)
- [JavaScript Modules: A Beginner’s Guide](https://medium.freecodecamp.org/javascript-modules-a-beginner-s-guide-783f7d7a5fcc)
