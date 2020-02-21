# 객체 생성 패턴

## 전역 변수 사용
```js
function Parent() {}
function Child() {}

var some_var = 1;
var module1 = {};
var module2 = {};
```
위와 같이 손쉽게 객체 혹은 함수와 변수를 정의할 수 있지만, 이는 바람직하지 못하다. 자바스크립트에서 전역변수를 자주 사용하는 것은 바람직 하지 않다.

크게 네 가지 문제가 있다.

- 암묵적 결합
- 긴 생명 주기
- 스코프 체인 상에서 종점에 존재
- 네임 스페이스 오염

<br/>

### 암묵적 결합

전역 변수는 어느 위치에서든 접근할 수 있다. 다시 말해 언제든 참조하고 변경할 수 있다. 이를 암묵적 결합이라고 한다. 

편리해 보이지만, 다르게 말하면 의도하지 않은 상태 변경이 일어날 위험이 항상 존재한다고 할 수 있다.

### 긴 생명 주기

전역 변수의 생명주기는 애플리케이션이 종료될 때 까지 지속된다. 따라서 이는 리소스의 낭비로 이어질 수 있다.

### 스코프 체인 상에서 종점에 존재

전역 변수는 스코프 체인의 가장 마지막에 존재하기 때문에 가장 마지막에 검색이 된다. 

전역 변수를 사용하는 것은 가장 간단하지만, 가장 느린 방법이다.

### 네임 스페이스 오염

자바스크립트는 파일이 분리되어 있어도, 하나의 전역 스코프를 공유한다. 

또한, 자바스크립트는 변수의 중복 선언을 허용하기 때문에 의도한대로 작동하지 않을 수 있다.

<br/>

## 네임 스페이스 패턴

가장 쉽게 객체를 구현할 수 있는 패턴이다.

전역 변수가 줄어들고, 객체 안에 함수를 정의하여 함수의 이름이 지나치게 길어지는 것을 막아준다.

```js
var MYAPP = {}; // 객체는 일반적으로 대문자로 선언한다.
MYAPP.Parent = function() {};
MYAPP.Child = function() {};

MYAPP.some_var = 1;

MYAPP.modules = {};
MYAPP.modules.module1.data = {a:1, b:2};
MYAPP.modules.module2 = {};
```

하지만, 모든 변수와 함수에 접두어를 붙여야하기 때문에 코드량이 많아지며 파일의 크기가 증가한다. 

또한, 전역 인스턴스가 하나이기 때문에 부분이 수정되면 다른 인스턴스도 모두 수정된다. 

뿐만 아니라, 이름이 길어지기 때문에 검색시간이 길어진다.

<br/>

## 범용 네임스페이스 함수

네임 스페이스를 사용할 때, 프로그램의 크기가 커지면 다음과 같은 점검을 해주는 것이 바람직하다.

```js
var MYAPP = {};
// 1. 기본
if (typeof MYAPP === "undefined") {
  var MYAPP = {};
}
// 2. 축약
var MYAPP = MYAPP || {};
```

위의 코드를 이용하여 네임 스페이스를 생성하는 함수를 만들 수 있다.

```js
var MYAPP = MYAPP || {};

MYAPP.namespace = function(ns_string) {
  var parts  = ns_string.split('.'),
      parent = MYAPP,
      i;

  if (parts[0] === "MYAPP") {
    parts = parts.slice(1);
  }

  for (i = 0; i < parts.length; i += 1) {
    if (typeof parent[parts[i]] === "undefined") {
      parent[parts[i]] = {};
    }
      // 참조를 변경한다. ( parent -> MYAPP 에서 parent -> MYAPP.parts[i]로 변경)
      parent = parent[parts[i]];
  }

  return parent;
}

MYAPP.namespace("MYAPP.modules.module2");

var module2 = MYAPP.namespace("MYAPP.modules.module2");
module2 === MYAPP.modules.module2; // true
```

`MYAPP.namespace()` 의 결과로 만들어진 객체는 다음의 코드로 만든 객체와 같다.

```js
var MYAPP = {
  modules : {
    module2 : {}
  }
};
```

<br/>

## 의존 관계 선언

```js
var myFunction = function () {
  var event = YAHOO.util.Event,
      dom   = YAHOO.util.Dom;
};
```

함수나 모듈 내의 최상단에 의존 관계가 있는 모듈을 선언하는 것이다.

의존 관계가 명시적이기 때문에, 반드시 포함돼야 하는 파일을 쉽게 알 수 있다.

지역 변수 값을 탐색하는 것이 중첩 프로퍼티(e.g. `YAHOO.util.Event`)를 사용하는 것 보다 훨신 빠르다.

또한 전역 변수명을 수정하는 것은 위험하기 때문에, 고급 Compressor 는 전역변수명을 축약하지 않는다. 반면, 지역변수는 a 등으로 축약한다.

```
// 전역 변수를 그대로 사용한 경우
function test1() {
  alert(MYAPP.modules.m1);
  alert(MYAPP.modules.m1);
}
// 위 코드 압축 결과
// alert(MYAPP.modules.m1);alert(MYAPP.modules.m2);

// 지역 변수를 사용한 경우
function test2() {
  var modules = MYAPP.modules;
  alert(modules.m1);
  alert(modules.m2);
}
// 위 코드 압축 결과 :
// var a=MYAPP.modules;alert(a.m1);alert(a.m2);
```

<br/>

## 비공개 프로퍼티와 메소드

클로저를 이용하여 프로퍼티에 `private` 키워드와 같은 효과를 줄 수 있다.

```js
// 생성자를 이용하는 경우
function Gadget() {
    var name = "iPhone";
    this.getName = function() {
      return name;
    };
}
var toy = new Gadget();
console.log(toy.name); // undefined
console.log(toy.getName()); // "iPhone"

// 객체 리터럴을 이용하는 경우 1
var myobj;
(function () {
  var name = "Android";

  myobj = {
    getName: function() {
      return name;
    }
  };
}());

myobj.getName(); // "Android"

// 객체 리터럴을 이용하는 경우 2
var myobj = (function () {
  var name = "Android";
  return {
    getName: function() {
      return name;
    }
  };
}());

myobj.getName(); // "Android"
 ```

하지만 이와 같은 방법은 새로운 객체를 만들때마다 비공개 멤버가 재생성된다는 단점이 있다. 생성자에 선언하기 때문에 객체를 생성할때마다 코드가 실행되기 때문이다.

이러한 문제는 프로토타입을 이용하여 보완할 수 있다.

```js
// 생성자를 이용
function Gadget() {
  var name = "Android";
  this.getName = function () {
    return name;
  };
}

// 프로토타입을 이용
Gadget.prototype = (function () {
  var browser = "Mobile";
  return {
    getBrowser : function() {
      return browser;
    }
  };
}());

var toy = new Gadget();
console.log(toy.getName()); // 객체 인스턴스의 비공개 멤버
console.log(toy.getBrowser()); // 프로토타입의 비공개 멤버
 ```

> 이 경우 프로토타입에 새로운 프로퍼티를 추가하는 것이 아닌 프로토타입 자체를 수정하는 것이기 때문에, <br/> `newToy` 의 `__proto__` 는 생성자 `Gadget()` 을 가리키지 않는다.<br/>
> 참고 - [프로토타입 객체의 수정과 변경](https://github.com/Im-D/Dev-Docs/blob/master/Javascript/prototype.md#%ED%94%84%EB%A1%9C%ED%86%A0%ED%83%80%EC%9E%85-%EA%B0%9D%EC%B2%B4%EC%9D%98-%EC%88%98%EC%A0%95%EA%B3%BC-%EB%B3%80%EA%B2%BD)

> 하지만, `newToy` 가 `Gadget()` 의 인스턴스라는 것은 변함이 없으며, `Gadget()` 은 변경된 프로토타입을 참조한다.

<br/>

---

#### References

- [전역변수를 왜 지양해야 하는가](https://www.codeameba.com/2019/05/10/js-no-more-global-variable/)
- [Javascript Pattern 요약 - 객체 생성 패턴](https://joshua1988.github.io/web-development/javascript/javascript-pattern-object/#%EB%B9%84%EA%B3%B5%EA%B0%9C-%ED%94%84%EB%A1%9C%ED%8D%BC%ED%8B%B0%EC%99%80-%EB%A9%94%EC%84%9C%EB%93%9C)
