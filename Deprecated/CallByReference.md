# Call By Value VS Call By Reference

<div align=center>

![Main_pic](https://github.com/SeonHyungJo/FrontEnd-Dev/blob/master/assets/image/CallByValue.png?raw=true)

</div>

## :speech_balloon: Contents

- 평가전략
- [Parameter, Arguments](#Parameter,-Arguments)
- [Call By Value](#Call-By-Value)
- [Call By Reference](#Call-By-Reference)
- Call By Sharing

<br/>

> [평가 전략(Evaluation Strategy)](https://ko.wikipedia.org/wiki/%ED%8F%89%EA%B0%80_%EC%A0%84%EB%9E%B5_(%EC%BB%B4%ED%93%A8%ED%84%B0_%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D)) 은 프로그래밍 언어에서 함수 호출의 아규먼트(argument)의 순서를 언제 결정하고 함수에 어떤 종류의 값을 통과시킬지 결정하는 것이다.

**함수에 인자로 무엇을 넣는냐에 따라 함수가 어떻게 실행이 될 것인지?**

<br/>
<br/>

## Parameter, Arguments

parameter는 **함수 선언부**에 정의
<br/>
arguments는 **함수 호출부**에서 사용

<br/>

```js
var a = 1;
var func = function(b) { // parameter, formal parameter, 매개변수, 형식 매개변수
  // code...
};
func(a); // arguments, actual parameter, 인자, 실인자
```

<br/>

## Call By Value

### 기본특성

1. Arguments로 값이 넘어온다.
2. 값이 넘어올 때 복사된 값이 넘어온다.
3. Caller(함수를 호출하는)가 인자를 **복사해서 넘겨줬으므로** Callee(함수)에서 해당 인자에 변경을 하고 수정을 한다고 해도 Caller는 영향을 받지 않는다.

<br/>

```js
var value = 1;
var func = function(value) { // callee

    console.log(value) // 1
    value = value + 1;
    console.log(value) // 2
}

func(value); // caller
console.log(value); // 1
```

<br/>

값의 복사본인 함수 인자 `value` 는 해당 수의 **지역변수로 선언되고 정의되었다.**
<br/>

즉, 전역변수로 선언 및 정의된 `value` 는 문자열과는 "+" 연산자를 통해 합쳐지지 않는다.
<br/>

간단한 실험 문자열 비교를 통해 값에 의해서 비교가 되는지 확인할 수 있다.
<br/>

만약 두 문자열이 값에 의해 비교되면 두 문자열은 동일할 것이고 참조에 의해 비교되면 동일하지 않을 것이다.

```js
var s1 = 'hello';
var s2 = 'hell' + 'o';

console.log(s1 === s2); //true

var obj1 = {
    str: 'hello'
}

var obj2 = {
    str: 'hell' + 'o'
}

console.log(obj1.str === obj2.str); //true
```

<br/>

## Call By Reference

### 기본특성

1. Arguments로 reference(**값에 대한 참조 주소, 메모리 주소를 담고있는 변수**)를 넘겨준다.
2. reference를 넘겨서 해당 reference가 가리키는 **값을 복사하지는 않는다.**
3. Caller(함수를 호출하는)가 인자를 복사해서 넘기지 않았으므로 Callee(함수)에서 해당 인자에 변경을 하고 수정을 하면 Caller는 영향을 받는다.

<br/>

```js
var obj = {};
var func = function(obj) { // callee
  obj.a = 1;
}

func(obj); // caller
console.log(obj.a); // 1
```

<br/>

객체를 정의한 `obj` 전역 변수는 함수의 매개변수로 "값" 과 "복사본"이 아닌 값에 의한 **참조가 지역변수로 전달 되었기 때문에** 내부에서 언제든 참조값 수정이 가능하게 되었다.
<br/>

> 기본적으로 자바스크립트는 참조 타입을 arguments로 넘겨주면 call by reference의 형태로 작동한다.

따라서 caller가 객체 `obj` 를 parameter로 넘겼을 때 실제 arguments로 넘어오는 값은 객체 `obj` 에 대한 reference이지 복사된 객체 `obj` 가 아니다.

> 따라서 callee 내부에서 영향을 받기 때문에 조심해서 사용해야한다.라고들 오해하고 있다.

<br/>

## Call By Sharing

```js
var obj = {};
var func = function(obj) { // callee
  obj = 1;
}

func(obj); // caller
console.log(obj); // {}
```

<br/>

참조 타입을 넘겼는데 값이 변하지 않았다.
<br/>

**자바스크립트에서는 무조건 Call By Value로 작동하기 때문이다.**
<br/>

사람들이 참조 타입을 넘기면 Call By Reference로 작동한다고 알고있으나, 위 코드가 그 생각은 잘못됬다는 것을 알려주고 있다.
<br/>

자바스크립트(자바, 루비, 파이썬 등등도 마찬가지…)에서는 참조 타입을 인자로 넘기면 참조값에 대한 복사본을 만들어서 넘긴다.

<br/>

![CallBySharing](https://github.com/SeonHyungJo/FrontEnd-Dev/blob/master/assets/image/CallBySharing.png?raw=true)

<br/>

### Quiz

```js
var a = {};
var func = function(b) {
  b = b.a = 1;
  b.b = 2;

  console.log(b); // ??
  console.log(b.b); // ??
}

func(a);
console.log(a); // ??
console.log(a.b); // ??
```

<br/>

## 결론

- 자바스크립트에서 `Call By Reference`는 존재하지 않고 `Call By Value`만 존재한다.
- 참조 타입을 인자로 넘기면 참조값에 대한 복사본이 넘어간다.
- 혼동을 줄이고자 `call by sharing`이란 용어로 부르기도 한다.

---

#### Reference

- [무하프로젝트](http://mohwaproject.tistory.com/entry/%EC%9E%90%EB%B0%94%EC%8A%A4%EB%A6%BD%ED%8A%B8%EC%97%90%EC%84%9C-%EA%B0%92%EA%B3%BC-%EC%B0%B8%EC%A1%B0%EC%9D%98-%EC%B0%A8%EC%9D%B4)
- [자알쓰](https://blog.perfectacle.com/2017/10/30/js-014-call-by-value-vs-call-by-reference/)

## 번외

아래는 간단한 객체 상속 관계에서 참조값을 다루는 코드예제이다.

```js
function fn(){}
fn.prototype = {'arr': []};
new fn().arr.push(1);

console.log(new fn().arr); // 1
console.log(fn.prototype.arr); // 1
```

왜 [1]이 반환되는 걸까?

- 첫번째 반환 => 또 다시 자식을 new로 생성을 하여 arr값을 가져왔더니 이미 [1]이라는 것이 담겨있었다.

- 두번째 봔환 => 기존에 만들어 놨던 fn(){}에서 protptype.arr만 만들었는데 자식에서 추가를 했음에도 불구하고 fn.prototype.arr에 [1]이 담겨있다.

"자바스크립트" 에서 객체는 참조만 전달되기 때문이다. 즉, 자식( new fn() ) 객체 에서 속성 ({'arr': []})  값을 수정하면 부모 객체 속성 ({'arr': []}) 또한 수정되어 버립니다.