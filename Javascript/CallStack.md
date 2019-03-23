# Basic_CallStack

### 기본 정리 내용들

- [x]  Heap
- [x]  Call Stack
- [x]  Web API
- [x]  Queue
- [x]  Event Loop
- [x]  Execution Context

## Intro

먼저 들어가기에 앞서 우리가 사용하려는 언어는 스크립트 언어로 이름은 **자바스크립** 이다.

그렇다면 우리가 사용할 언어가 어떻게 실행되는지 알아보기 위해서는 엔진에 대해서 알아야 한다.

우리가 사용할 엔진은 **자바스크립트 엔진** 이다.

## **V8 Engine**

요즘에 많이 사용하고 좋다고 생각하는 브라우저는 **크롬** 이다. 크롬에서 사용되는 자바스크립트 엔진은 구글의 **V8 엔진** 이다. 

이 엔진에서의 2가지 Main Components가 있다.

1. Memory Heap : 메모리의 할당이 일어나는 곳.
2. Call Stack : Stack Frame이 실행되는 곳. 쉽게 말해서 우리가 작성한 코드가 실행되는 곳.

## **Call Stack**

Call Stack은 **LIFO** (Last In, First Out) 원리를 사용하여 함수 호출을 임시 저장하고 관리하는 데이터 구조

> LIFO : Last In, First Out의 데이터 구조 원칙에 따라 호출 스택이 작동한다. 스택으로 푸시 된 마지막 함수가 처음으로 튀어 나옴을 의미한다.

:point_right: **자바스크립트에서**

Call Stack은 주로 함수 호출에 된다. Call Stack이 하나이기 때문에 함수 실행은 위에서 아래로 한 번에 하나씩 수행된다.

기본적으로 자바스크립트는 싱글 쓰레드 프로그래밍 언어이다. 이 말은 싱글 Call Stack을 가지고 있다는 것을 의미한다. 다른말로 하자면 한 번에 한가지의 일만 한다는 것이다.

```javascript
  function multiply(x, y) {
      return x * y;
  }
  function printSquare(x) {
      var s = multiply(x, x);
      console.log(s);
  }
  printSquare(5);
```

위와 같은 코드가 있다고 한다면 `printSquare(5) ⇒ multiply(x, x) ⇒ console.log(s) ⇒ printSquare(5)` 으로 쌓이고 실행이 된다는 것을 의미한다.

> 각각의 한 줄을 `Stack Frame`이라고 한다.

```javascript
  function foo() {
      throw new Error('SessionStack will help you resolve crashes :)');
  }

  function bar() {
      foo();
  }

  function start() {
      bar();
  }

  start();
```

위와 같은 코드를 크롬에서 실행을 한다면 당연하게 에러가 떨어지면서 Stack형태를 자세히 볼 수있다.

다른 경우로는 Call Stack의 사이즈를 넘어서서 쌓이는 경우도 발생한다.

```javascript
  function foo() {
      foo();
  }

  foo();
```

위와 같은 코드를 사용하면 안되겠지만 위와 같은 경우는 브라우저에서 계속 쌓아가다가 **16000개가** 넘어가는 순간에 Stack Size가 넘쳤다고 나올 것이다.

싱글 쓰레드는 멀티 쓰레드보다 다루기는 쉽다. (Deadlock_교착상태 같은 일이 발생하지 않으므로)

그러나 역시 제한적이다.

예시로 내가 버튼을 눌러서 서버에서 사진을 가져오려고 할 때. 버튼을 누르고 사진을 가져올 때까지 브라우저는 멈춘 상태가 되어 버린다.

이에 대안으로 **Asynchronous Callbacks** 이다.

## **Web API**

우리가 사용하는 자바스크립트에도 제공이 되지않는 것들이 있다. 가령 우리가 비동기를 사용하기 위해서 사용하는 `setTimeOut()`, `setInterval()` 등등은  브라우저에서 제공하는 API라고 생각하면 된다. 

간략하게 지원하는 API로는 

1. DOM
2. AJAX(==XMLHttpRequest)
3. setTimeOut
4. 등등

이 있다. 

> 브라우저 웹 API : DOM 이벤트, XMLHttpRequest, setTimeout 등과 같은 비동기 이벤트를 처리하기 위해 C ++로 구현 된 **브라우저로 만든 쓰레드**

## **Queue(Message Queue || CallBack Queue)**

자바스크립트 런타임에는 처리할 메시지 목록과 콜백 함수인 메시지 Queue이 있다. 현재 Stack의 용량이 충분하다면 Queue에서 메시지를 가져와서 처리된 것의 CallBack function을 실행한다.

기본적으로 이러한 메시지는 콜백 기능이 제공되면 외부 비동기 이벤트에 대한 응답을 한다. 예를 들어 사용자가 버튼을 클릭하고 콜백 함수가 제공되지 않은 경우 아무런 메시지도 Queue에 추가되지 않게 되는 것이다.

## **Event Loop**

네크워크는 느리다. 그래서 사진을 불러오는 것은 느리다. 이에 사용하는 것이 우리가 흔히 `AJAX` 라고 부르는 **비동기 함수** 이다. 만약 이러한 작업이 동기라면 위와 같이 멈추는 현상이 일어날 것이다.

가장 쉬운 해결책이 **비동기 Callbacks** 이다. 위에서 언급한 **Web API** 에서 제공하는 것에 **비동기 Callbacks**이다.

`console.log()`와 다르게 바로 실행이 되지 않는다. 그렇다면 이런 것들은 어떻게 되는 것인가?

응답에서 호출자를 분리하면 비동기 작업이 완료되고 콜백이 시작될때까지 기다리는 시간동안 자바스크립트 런타임에서는 다른 작업을 할수 있다. 

Web API에서 요청한 작업을 완료한 후 Callbacks을 실행해야한다. 그러나 만약 작업이 완료가 되고 직접 Web API쪽에서 Call Stack에 실행코드를 넣을 수 있다면 마음대로 바로 나타날 것이다. 

그래서 있는 것이 **Queue** 이다. Web API에서 요청한 작업을 완료한 후에 **Queue** 에 넣어 준다. 

**Event Loop는 이제 Call Stack이 비었을 때 Queue에서 들어온 Callbacks를 수행한다.**

## **Execute Context**

실행 컨텍스트는 자바 스크립트 코드가 평가되고 실행되는 환경의 추상적인 개념이다. 자바 스크립트에서 코드를 실행할 때마다 실행 컨텍스트 내에서 실행된다.

기본적으로 자바스크립트 내에는 3가지 타입의 실행컨텍스트가 있다고 한다.

1. Global 
2. Functional
3. ~~Eval Function~~

그러나 중요한 것은 **1번과 2번**이다.

### Execution Stack

실행 스택은 우리가 위에서 보았다. Call Stack의 개념이다.

> LIFO (Last In, First Out) 원리를 사용하여 함수 호출을 임시 저장하고 관리하는 데이터 구조이다.

:point_right: 어떻게 실행 컨텍스트를 만드는가?

실행컨텍스트를 만드는데 2개의 단계가 있다.

1. Creation 단계
2. Execute 단계

#### Creation 단계

한국말로는 만드는 단계이다. 먼저 2가지를 만든다.

1. **LexicalEnvironment**
2. VariableEnvironment

기본적인 형태는 아래와 같다.
```javascript
  ExecutionContext = {
    LexicalEnvironment = <ref. to LexicalEnvironment in memory>,
    VariableEnvironment = <ref. to VariableEnvironment in  memory>,
  }
```

#### Lexical Environment

Lexical Environment은 **식별자, 변수 맵핑**을 가지고 있는 구조이다. 

>여기서 식별자는 변수/함수의 이름을 가리키며 변수는 실제 객체 [함수 객체 및 배열 객체 포함] 대한 참조입니다.

```javascript
  var a = 20;
  var b = 40;
  function foo() {
    console.log('bar');
  }
```

위와 같은 코드가 있다고 하면

Lexical Environment은

```javascript
  lexicalEnvironment = {
    a: 20,
    b: 40,
    foo: <ref. to foo function>
  }
```

위와 같이 만들어 질 것이다.

여기에는 3가지의 정보를 가지고 있다.

1. **Environment Record** : 변수 및 함수 선언이 Lexical Environment 내에 저장되는 장소
2. **Reference to the outer environment** : 외부 환경에 대한 참조
3. **This binding** : `this`가 결정되거나 설정된다.

#### Environment Record

기본적으로 2가지 정보를 담고 있다.

- **Declarative environment record**(선언적 환경 정보) : 변수 및 함수 선언을 저장합니다.
- **Object environment record**(객체 환경 정보) :  전역 코드의 Lexical Environment에는 객체 환경 레코드가 포함되어 있다. 변수 및 함수 선언 외에 객체 환경 레코드는 전역 바인딩 개체 (브라우저의 창 개체)도 저장합니다. 따라서 각 바인딩 객체의 속성에 대해 새 항목이 레코드에 만들어진다.

함수 코드의 경우 Environment Record에는 함수에 전달 된 인덱스와 인수 사이의 매핑과 함수에 전달 된 인수의 길이가 포함 된 `arguments` 객체도 포함이 된다. 

예를 들어, 아래 함수에 대한 인수 객체는 다음과 같습니다.

```javascript
  function foo(a, b) {
    var c = a + b;
  }

  foo(2, 3);

  // argument object
  Arguments: {0: 2, 1: 3, length: 2},
```

#### Reference to the Outer Environment

외부 환경에 대한 참조는 outer environment에 액세스 할 수 있음을 의미한다. 즉, 자바 스크립트 엔진은 현재 lexical environment에서 찾을 수 없는 경우 outer environment에서 변수를 찾을 수 있다.

#### This Binding

여기에는 어렵고도 중요한 개념인 `this`가 결정되거나 설정된다.

전역 실행 컨텍스트에서이 값은 전역 개체를 참조합니다.

함수 실행 컨텍스트에서이 값은 함수가 호출되는 방식에 따라 다르게 `this`가 나온다. 객체 참조에 의해 호출되면 `this` 값은 해당 객체로 설정되고, 그렇지 않으면이 값은 전역 객체로 설정되거나 정의되지 않는다.

```javascript
  const person = {
    name: 'peter',
    birthYear: 1994,
    
    calcAge: function() {
      console.log(2018 - this.birthYear);
    }
  }

  person.calcAge(); 
  // 'this' refers to 'person', because 'calcAge' was called with //'person' object reference
  
  const calculateAge = person.calcAge;
  calculateAge();
  // 'this' refers to the global window object, because no object reference was given
```

#### Variable Environment

이것은 위에서 봐왔던 LexicalEnvironment와 같다.

ES6에서 LexicalEnvironment 구성 요소와 VariableEnvironment 구성 요소의 차이점 중 하나는 함수 선언과 변수 (`let` 및 `const`)바인딩을 저장하는데 사용되는 반면, 후자는 변수 (`var`)바인딩만 저장하는 데 사용된다.

#### Execute 단계

이 단계에서 모든 변수에 대한 할당이 완료되고 코드가 최종적으로 실행된다.

```javascript
  let a = 20;
  const b = 30;
  var c;
  
  function multiply(e, f) {
   var g = 20;
   return e * f * g;
  }
  
  c = multiply(20, 30);
```

```javascript
GlobalExectionContext = {
  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Object",
      // Identifier bindings go here
      a: < uninitialized >,
      b: < uninitialized >,
      multiply: < func >
    }
    outer: <null>,
    ThisBinding: <Global Object>
  },
  
  VariableEnvironment: {
    EnvironmentRecord: {
      Type: "Object",
      // Identifier bindings go here
      c: undefined,
    }
    outer: <null>,
    ThisBinding: <Global Object>
  }
}
```

```javascript
GlobalExectionContext = {
    
  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Object",
      // Identifier bindings go here
      a: 20,
      b: 30,
      multiply: < func >
    }
    outer: <null>,
    ThisBinding: <Global Object>
  },
    
  VariableEnvironment: {
    EnvironmentRecord: {
      Type: "Object",
      // Identifier bindings go here
      c: undefined,
    }
    outer: <null>,
    ThisBinding: <Global Object>
  }
}
```

```javascript
  FunctionExectionContext = {
  LexicalEnvironment: {
      EnvironmentRecord: {
        Type: "Declarative",
        // Identifier bindings go here
        Arguments: {0: 20, 1: 30, length: 2},
      },
      outer: <GlobalLexicalEnvironment>,
      ThisBinding: <Global Object or undefined>,
    },
  VariableEnvironment: {
      EnvironmentRecord: {
        Type: "Declarative",
        // Identifier bindings go here
        g: undefined
      },
      outer: <GlobalLexicalEnvironment>,
      ThisBinding: <Global Object or undefined>
    }
  }

```

```javascript
  FunctionExectionContext = {
  LexicalEnvironment: {
      EnvironmentRecord: {
        Type: "Declarative",
        // Identifier bindings go here
        Arguments: {0: 20, 1: 30, length: 2},
      },
      outer: <GlobalLexicalEnvironment>,
      ThisBinding: <Global Object or undefined>,
    },
  VariableEnvironment: {
      EnvironmentRecord: {
        Type: "Declarative",
        // Identifier bindings go here
        g: 20
      },
      outer: <GlobalLexicalEnvironment>,
      ThisBinding: <Global Object or undefined>
    }
  }
```

함수가 완료된 후 반환 값은 c 안에 저장된다. 그래서 글로벌 Variable Environment이 업데이트된다. 그 후, 전역 코드가 완료되고 프로그램이 완료가 된다.

`let` 및 `const` 정의 변수는 생성 단계에서 연관된 값이 없지만 `var` 정의 변수는 `undefined` 로 설정된다.

이는 생성 단계에서 함수 선언이 환경에 전체적으로 저장되는 동안 변수 및 함수 선언에 대해 코드가 검색되고 변수가 초기에 `undefined` (`var`의 경우)로 설정되거나 초기화되지 않은 상태로 유지되기 때문이다. `let`과 `const`의 경우).

이것이 `var` 정의 변수가 선언되기 전에 (정의되지는 않았지만) `var` 정의 변수에 액세스 할 수 있지만 `let` 및 `const` 변수가 선언되기 전에 액세스 할 때 참조 오류가 발생하는 이유이다.

실행 단계에서 자바스크립트 엔진이 `let` 변수의 값을 소스 코드에서 선언된 실제 위치에서 찾지 못하면 정의되지 않은 값을 할당합니다.