# javascript의 module

Java나 Python과 같은 OOP 언어들에서는 Class라는 이름으로 객체지향 프로그래밍을 구현해왔다. OOP의 보통 특징으로는 널리 알려져있듯 encapsulation, inheritance, polymorphism이 있다. 그 중 자바스크립트의 scope를 공부하고 있었는데 encapsulation과 관련이 있었으며, 자연스레 class와 비슷한 기능을 하는 자바스크립트의 module을 공부해봤다.

javascript에서는 이 scope를 기준으로 캡슐화를 한다. 그래서 자연스레 이 scope를 이용하여 외부로부터 보호하려는 노력이 있어왔다. ES5에서는 함수가 scope의 기준이기 때문에 당연히도 함수의 scope를 이용해 encapsulation을 시도했다. 또한 자신의 스코프의 참조를 가진다는 클로저를 이용해 내부 속성들을 사용할 수 있게 했다.

## ES 5의 모듈화

크게 세가지가 있었다. IIFE(즉시실행함수표현식), 노출식 모듈 패턴, AMD다. 여기서 AMD는 크게 중요하지 않다고 생각되어 define을 사용한다고만 하고 넘어가겠다.

### IIFE

---

함수를 즉시 호출시켜 스코프를 오염시키지 않는 방식이다.

```js
function moduleFunction() {

  var a = 3;

  function helloWorld(){
    console.log('Hello');
  }

  return {
    a : a,
    sayHello: helloWorld
  }
}()

moduleFunction.sayHello();
doSomething(moduleFunction.a);
```

함수를 바로 실행시킨 뒤 object를 반환하여 전역 네임을 한번만 사용하여 스코프를 오염시키지 않는다. 또한 외부에서 내부 코드로의 접근을 차단하여 보호한다. 모듈의 개념을 잘 이행하고 있다. 다만 의존성관리가 되지 않는다. 코드를 재 작성하지 않으면 다른 파일에서 재사용이 불가능하다.

### 노출식 모듈패턴

---

IIFE와 크게 다르는 않다. 반환값을 변수에 담으면 되는데 singleton 의 패턴이다.

```js
var singleton = (function moduleFunction() {
  var a = 3;

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

비슷하다. 이 역시 문제는 의존성관리가 안된다.

## Node JS의 모듈화

의존성 관리 문제 때문에 ES5에서는 AMD, UMD, CommonJS 와 같은 모듈 포맷을 사용했는데 여기서는 가장 흔히 알려진 CommonJS방식에 대해 알아보자

```js
var dep1 = require('./dep1');
var dep2 = require('./dep2');

module.exports = function() {
  // ...
};
```

와 같은 구조다. 흔히 구글링한 코드에서 찾아볼 수 있는 `require`, `module.exports` 구조다. 외부의 dep1.js를 `module.exports`로 내보내고 `require()`로 불러와 사용하는 방식이다. 사실 내부적으로는 IIFE와 크게 다르지 않다. 내보낼 module을 파라미터로하여 IIFE를 실행시키고 반환하는 방식이다.
하지만 파일 외부에서 작성하고 불러온다는 점에서 많이 나아진 방식이다.

## ES 6 모듈

ES 6에서는 모듈을 사용하기 위한 내장 문법을 지원한다. 바로 `export`다.

```js
// some.js
export function helloWorld() {
  console.log('Hello');
}

function somePrivateFunction() {
  // ...
}

// ===========
// ===========

// something.js
import { helloWorld as hello } from './some';
// import * from './some' 도 가능합니다.

hello();
```

이렇게 하면 파일을 분리하고 그 파일에서 필요한 부분만 반환하여 사용할 수 있게 된다. 또한 재사용성이 극대화되어 의존성 관리도 가능하게 된다.

현재 예제 코드에서는 함수만 반환했지만 당연히 object도 가능하다.

또한 단일 값을 반환할 경우 default 형식을 지원한다. 이 경우 {} 를 사용하지 않아도 된다.

```js
// lib.js

// Export default function
export default function sayHello(){
  console.log('Hello');
}


// Export non-default function
function sayGoodbye(){
  console.log('Goodbye');
}

// Export simple value
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

// app.js
import sayHello, { returnObject, settings } from './lib';

sayHello();
returnObject.sayGoodBye();
```

하지만 현재 이러한 모듈 포맷은 모든 브라우저에서 지원하지 않는다. 따라서 Babel과 같은 변환기를 통해 ES5에서 사용하던 방식인 AMD나 CommonJS 형식으로 코드를 변환한 뒤 사용한다.
