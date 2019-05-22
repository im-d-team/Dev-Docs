# 자바스크립트의 동작 원리 - 실행 컨텍스트(Execution Contexts)

> ES3을 기반으로 설명

<br/>

## 실행 컨텍스트(Execution Contexts)

ECMA-262-3에서는 "**실행 가능한 코드(Executable code; 이하 실행 코드)** 의 유형을 **나누고(형상화)**, **구별**하기 위한 추상적인 개념"으로 정의한다. 실행 코드를 실행하기 위해 **필요한 환경**을 뜻한다.

실행 컨텍스트는 추상적인 개념이지만, **물리적으로는 객체의 형태**이며 **코드 실행에 필요한 정보(변수, 함수 선언, 스코프, this)** 가 들어있다.

> 실행 코드 : 특정 순간의 실행 컨텍스트로 하나의 실행 컨텍스트에서 처리되는 코드의 단위를 뜻한다.

**실행 코드의 종류에 따라** 실행 컨텍스트의 **초기화 과정**이 달라지고, 실행 컨텍스트의 **성격이 결정**된다.

> 실행 코드의 종류 : 전역 코드, 함수 코드, eval 코드

실행코드로 **제어(control)** 가 전달되면 해당 제어는 실행 컨텍스트로 **진입**한다.

> 제어 : 명령어가 적절한 순서로 수행하도록 제어하는 컴퓨터의 구성 장치로, 제어가 전달(이동)된다는 것은 프로그램의 처리 흐름이 이동하는 것이라 생각하면 된다.

<br/>

## 실행 컨텍스트의 구조

실행 컨텍스트들은 논리적으로 **스택(stack)의 형태**를 구성하고 있다.

> 예시

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

![ECStack](/assets/images/javascript의_동작원리-실행컨텍스트(ExecutionContexts)-1.png)

스택의 **바닥(bottom)** 에는 항상 **전역 컨텍스트(global context)** 가 있다.

  > 전역 컨텍스트 : 유일하며, 최상위에 위치하고 모든 전역변수, 전역 함수 등을 포함한다.

  - 전역 컨텍스트는 해당 애플리케이션이 종료될 때(웹페이지에서 나가거나, 브라우저를 닫을 때)까지 유지된다.
- 프로그램 시작(초기화 단계)시 ECstack
  
```js
ECStack = [
    globalContext
  ];
```
  
**꼭대기(top)** 에는 현재 **활성화 된 실행 컨텍스트**가 있다.

> 활성화된 실행 컨텍스트를 활성 객체(activation object; AO)라고 한다.

실행 컨텍스트가 들어오고 나가면서 변경(push/pop)된다. 
새로운 실행 컨텍스트는 직전의 실행 컨텍스트 위에 쌓이고 실행 컨텍스트가 종료되면, 해당 실행 컨텍스트를 파기하고 직전 컨텍스트에 제어를 반환한다.

<br/>

## 전역 코드(Global Code)

- 프로그램 수준에서 실행되는 코드로, 전역 컨텍스트에서 처리된다.
- 로딩된 외부 `.js`파일을 실행하거나, 지역 인라인 코드(`<script>`태그 안쪽)를 만나면 생성된다.
- 함수 body 안의 코드는 전역 코드에 포함되지 않는다. 함수 body의 내용은 함수 코드에 포함되고, 함수 실행 컨텍스트에서 처리된다.

<br/>

## 함수 코드(Function Code)

- 함수가 호출되어 함수 코드로 진입할 때, ECStack에 새로운 활성 객체(AO)가 생성된다.
- 새로 생성된 실행 컨텍스트는 호출된 함수(concrete function)의 코드에 중첩된 내부 함수(inner functions)의 코드를 포함하지 않는다.
- 함수가 종료될 때마다 활성 객체는 제어를 반환하고, ECStack에서 제거된다(일반적인 스택의 동작 방식을 따라서 진행). 이 작업이 끝나면, ECStack에는 globalContext만 남아있다.

> 실행 컨텍스트의 구조에서 함수를 호출하는 예제를 보았다.<br/>
> 재귀 함수의 호출은 어떻게 될지 생각해보자
>
> ```js
> (function foo(flag) {
>     if (flag) {
>        return;
>     }
>     foo(true);
> })(false);
> ```

<br/>

## Eval 코드(Eval Code)

- 호출 컨텍스트(calling context)에서 처리

  > 호출 문맥 : eval 함수가 호출된 문맥

- eval에 의해서 만들어진 변수나 함수 정의는 호출 컨텍스트에 영향을 준다.

```js
// 전역 코드이므로, 전역 컨텍스트에 영향을 준다.
eval('var x = 10');

(function foo() {
  // 함수 안에 선언된 함수 코드이므로, foo 함수안의 지역 컨텍스트에 만들어진다.
  eval('var y = 20');
})();

alert(x); // 10
alert(y); // "y" is not defined
```

```js
ECStack = [
  globalContext
];
 
// eval('var x = 10');
ECStack.push({
  context: evalContext,
  callingContext: globalContext
});
 
// eval exited context
ECStack.pop();
 
// foo funciton call
ECStack.push(<foo> functionContext);
 
// eval('var y = 20');
ECStack.push({
  context: evalContext,
  callingContext: <foo> functionContext
});
 
// return from eval 
ECStack.pop();
 
// return from foo
ECStack.pop();
```

<br/>

## 실행 컨텍스트 생성 과정

1. 전역 코드에 진입
2. 스코프 체인 생성 및 초기화
3. 변수 객체화( VO에 프로퍼티와 값 추가)
4. this 바인딩(this의 value 결정)
5. 코드 실행

<br/>

## 실행 컨텍스트의 프로퍼티

![property of EC](/assets/images/javascript의_동작원리-실행컨텍스트(ExecutionContexts)-2.png)

- 변수객체(Variable Object; VO)
- 스코프 체인(Scope Chain)
- this Value

<br/>

---

#### Reference

- [인사이드 자바스크립트(송형주, 고현준 - 한빛미디어)](https://books.google.co.kr/books?id=gSVJDgAAQBAJ&hl=ko&source=gbs_navlinks_s)
- [ECMA-262-3 in detail. Chapter 1. Execution Contexts. - Dmitry Soshnikov](http://dmitrysoshnikov.com/ecmascript/chapter-1-execution-contexts/)
- [ECMA-262-3 in detail. Chapter 1. Execution Contexts 번역 - 개발왕 김코딩](https://huns.me/development/159)
- [실행 컨텍스트와 자바스크립트의 동작 원리 - poiemaweb](https://poiemaweb.com/js-execution-context)
