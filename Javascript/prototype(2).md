# Prototype(2)

일반적으로 객체지향 프로그래밍을 할 경우 클래스를 사용해서 객체를 생성한다. 하지만 자바스크립트는 클래스 기반이 아닌 prototype 기반으로 객체를 생성한다. ES6에 클래스가 추가되었지만, 내부적으로는 prototype 을 바탕으로 동작하게 되므로 엄밀히 말하면 클래스로서 동작하는 것이 아니라 클래스를 흉내 낸 것에 가깝다.

따라서 프로토타입에 대해 이해해야 자바스크립트에 더 깊게 다가갈 수 있다. 프로토타입을 간단히 정의하자면 자바스크립트 객체에 [[Prototype]] 으로 명명된 인터널 슬롯(내부 속성, 은닉 속성)이라는 내부 프로퍼티(프로토타입 링크; `__proto__`)가 있고, 다른 객체를 참조하는 레퍼런스로 사용한다.

현재 객체 내의 특정 프로퍼티에 접근할 경우 프로퍼티가 존재하지 않으면 [[Prototype]] 을 따라가 프로퍼티가 존재하는지 탐색하게 된다.

```javascript
const object = { valOne: 1, valTwo: 2 };

console.log(object.valOne); // 1
console.log(object.valTwo); // 2
console.log(object.valThree); // undefined
console.log(object.toString()); // - ??
```

위 코드는 프로토타입 체이닝의 예시이다. `toString()` 메서드는 object에 존재하지 않지만, 메소드로서 호출할 수 있다.

object의 프로토타입 링크가 다른 객체를 참조하고 있고, 그 객체에 `toString()` 메소드가 정의되어 있어 참조가 가능한 것이다.

## 프로토타입을 왜 사용할까?

```javascript
function Car() {
  this.wheel = 4;
  this.body = 1;
}

const truck  = new Car();
const bus = new Car();
console.log(truck.wheel); // 4
console.log(truck.body); // 1
console.log(bus.wheel); // 4
console.log(bus.body); // 1
```

위 예제를 보면 truck과 bus 모두 wheel과 body 프로퍼티에 할당된 값이 같다. 하지만 객체를 계속 생성하게 되는 경우 객체의 개수만큼 변수가 메모리에 할당되기 때문에 비효율적이다. 이 경우 프로토타입을 통해 문제를 해결 할 수 있다.

```javascript
function Car() {}

Car.prototype.wheel = 4;
Car.prototype.body = 1;

const truck  = new Car();
const bus = new Car();
console.log(truck.wheel); // 4
console.log(truck.body); // 1
console.log(bus.wheel); // 4
console.log(bus.body); // 1
```

Car.prototype에 직접 프로퍼티를 할당해 Car 함수로부터 생성된 객체가 프로토타입 체이닝을 통해 프로퍼티를 호출할 수 있다. 이 경우 객체를 계속해서 생성하더라도 메모리에 할당된 변수는 2개이므로 효율적인 코드를 작성할 수 있다.

## 프로토타입 객체(`.prototype`)

다음과 같이 생성자 함수를 이용해 객체를 생성할 수 있다.

```javascript
function Car() {};

const truck = new Car();
```

```javascript
const bus = {};
```

위와 같이 객체 리터럴을 사용하더라도 실제로는 아래와 같이 동작한다.(단, 생성자 함수와 객체 리터럴의 퍼포먼스 차이는 존재한다. - [reference](https://stackoverflow.com/questions/21545687/javascript-vs-new-object-performance))

```javascript
const bus = new Object();
```

생성자 함수는 자바스크립트에서 기본적으로 제공하는 함수이다. 이것을 토대로 알 수 있는 건 객체는 언제나 함수로 생성된다는 것이다. 생성자 함수 외에도 Function, Array 또한 함수로 정의되어 있다. 일반 객체가 [[Prototype]] 만 가지고 있는 것과 달리 함수는 프로토타입 프로퍼티도 가지고 있다.

함수가 정의될 때 아래와 같은 2가지 상황이 발생한다.

<p align="center">
<img width="543" alt="Screen Shot 2020-08-02 at 11 54 32 PM" src="https://user-images.githubusercontent.com/16266103/89126438-a14bf180-d520-11ea-8e1c-511991161135.png">
</p>

### 1. 해당 함수에 Constructor(생성자) 자격 부여

생성자 함수 키워드인 new를 통해 객체를 만들기 위해선 Constructor 자격이 필요하다. 함수를 정의하게 되면 Constructor 자격이 부여되어 new를 사용할 수 있다.

```javascript
const bus = {};
const truck = new bus(); // Uncaught TypeError: bus is not a constructor(...)
```

bus 자체는 함수를 정의하지 않았고 객체 리터럴의 Object함수와 생성자를 사용하여 객체를 만들었으므로 bus는 Constructor를 가지고 있지 않다. 따라서 위와 같이 에러가 발생하게 된다.

### 2. 해당 함수의 Prototype Object 생성 및 연결
<p align="center">
<img width="256" alt="Screen Shot 2020-08-02 at 11 57 56 PM" src="https://user-images.githubusercontent.com/16266103/89126440-a3ae4b80-d520-11ea-870f-d50922e0bc88.png">
</p>

함수를 정의하게 되면 Prototype Object도 생성되게 된다. 생성된 함수는 프로토타입 프로퍼티를 통해 Prototype Object에 접근하게 되고 Prototype Object는 일반적인 객체의 형태로 위와 같이 constructor와 `__proto__`([[Prototype]]) 프로퍼티를 가지고 있다.

Prototype Object는 일반적인 객체이므로 프로퍼티 추가 및 삭제가 가능하다. 따라서 현재 객체에 프로퍼티가 없더라도 프로토타입 프로퍼티가 Prototype Object와 연결되어 있고 Prototype Object의 해당 프로퍼티에 값이 할당되어 있으면 `Car.prototype.something` 형태로 참조해 사용할 수 있다.

## 프로토타입 링크(`[[Prototype]]`)

### 프로토타입 체인
<p align="center">
<img width="544" alt="Screen Shot 2020-08-03 at 12 22 20 AM" src="https://user-images.githubusercontent.com/16266103/89126441-a610a580-d520-11ea-97a5-10fe14d99271.png">
</p>

모든 객체는 [[Prototype]] 을 가지고 있다. [[Get]] 이 객체 내부에 프로퍼티를 찾아 못하면 [[Prototype]] 링크를 따라가 프로퍼티를 탐색한다. 모든 일반 객체의 최상위 프로토타입 체인은 내장 `Object.prototype`이고 이 지점에서도 찾지 못하면 undefined를 반환하며 탐색이 종료된다.

```javascript
const something = {
  value: true
}

const other = Object.create(something);

other.value // true
```

`Object.create(proto[, propertiesObject])`는 아래에서 설명할 프로토타입 메서드의 한 종류로서 [[Prototype]] 이 proto를 참조하는 빈 객체를 만든다. 이렇게 만들어진 other는 something이랑 [[Prototype]] 이 링크된다. other 내부에 value 프로퍼티가 없지만 연결된 something에서 해당 프로퍼티를 찾아 something의 프로퍼티인 value의 값인 true가 반환된 것이다.

`for...in` 루프에서도 객체를 순회할 때 prototype 연결을 통해 탐색 가능한 프로퍼티라면 모두 열거한다.

```javascript
for(let i in other){
  console.log(`${i} 프로퍼티 존재`)
}
```

## 프로토타입 메서드와 `__proto__`가 없는 경우

사실 `__proto__`는 표준이 아니지만 대부분의 브라우저에 구현되어 있기 때문에 사실상 표준(de-facto standard)이 된 케이스이다.

역사적으로 2012년, 표준에 `Object.create` 가 추가되어 프로토타입을 사용해 객체를 만들 수 있게 되었다. 하지만 프로토타입을 얻고 설정하는 것을 할 수 없었기 때문에 `__proto__`라는 비표준 접근자를 구현해 프로토타입을 설정할 수 있도록 했다.

3년 뒤인 2015년에 Object.setPrototypeOf와 Object.getPrototypeOf가 표준에 추가되었기 때문에 `__proto__`가 의도했던 기능을 동일하게 사용할 수 있게 되었다.

### 프로토타입 메서드

프로토타입 메서드는 아래와 같이 세 가지 종류가 있다.(arrow function에서는 동작하지 않는다.)

- [Object.create(proto[, propertiesObject])](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/create) – `[[Prototype]]`이 `proto`를 참조하는 빈 객체를 만들고 이때 프로퍼티 설명자를 추가로 넘길 수 있다. propertiesObject의 경우 immutable 하게 할건지 등을 설정하는 경우에 사용 가능하다.
- [Object.getPrototypeOf(obj)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf) – `obj`의 `[[Prototype]]`을 반환한다.
- [Object.setPrototypeOf(obj, proto)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf) – `obj`의 `[[Prototype]]`이 `proto`가 되도록 설정한다.

`__proto__`가 `Object.getPrototypeOf()`와 `Object.setPrototypeOf()`로 대체된 이유는 유일하게 `"__proto__"`라는 문자열만 key로 사용할 수 없기 때문이다.

```javascript
const obj = {};

let key = prompt("입력하고자 하는 key는 무엇인가요?", "__proto__");
obj[key] = "...값...";

alert(obj[key]); // "...값..."이 아닌 [object Object]가 출력됨
```

위 예제를 실행하고 프롬프트에 `__proto__`를 입력하면 값이 제대로 할당되지 않음을 확인할 수 있다. 문자열은 프로토타입이 될 수 없기 때문에 발생하는 문제이다. `__proto__`는 객체 혹은 null이어야만 한다.

하지만 객체가 할당되는 상황이라면 어떨까? 할당 값이 객체일 경우 프로타입이 바뀔 수 있다. 이렇게 될 경우 예상치 못한 일이 발생하게 된다.

프로토타입이 중간에 바뀌는 시나리오는 버그의 원인을 찾는 것을 더 어려워지게 만든다. 또한 서버 사이드에서 사용 중일 경우에도 취약점으로 작용할 수 있다.

`__proto__`는 객체의 프로퍼티가 아니라 Object.prototype의 접근자 프로퍼티이다. 그렇기 때문에 사실상 `__proto__`는 [[Prototype]] 에 접근하기 위한 방법일 뿐 [[Prototype]] 그 자체는 아니다.

### `__proto__`가 없는 경우

```javascript
const obj = Object.create(null);

let key = prompt("입력하고자 하는 key는 무엇인가요?", "__proto__");
obj[key] = "...값...";

alert(obj[key]); // "...값..."이 제대로 출력됨
```

`Object.create(null)` 처럼 아주 단순한 객체를 만들면 `__proto__`에서 getter와 setter를 상속받지 않는다. 따라서 Object.prototype의 접근자 프로퍼티가 아닌 평범한 프로퍼티로 동작하게 되어 예제가 버그 없이 잘 동작하게 된다.

하지만 Object.prototype에 정의된 `toString()` 같은 메서드는 사용 할 수 없는 단점이 생긴다. 그럼에도 연관 배열로 사용하게 되면 Object.keys(obj) 같이 객체 관련 메서드들은 대부분 Object.something(...) 형태이므로 단점이 문제가 되지 않는다.

무엇보다도 가장 좋은 것은 [[Prototype]] 을 변경하는 상황을 만들지 않는 것이다. 자바스크립트 엔진은 객체를 생성할 때만 [[Prototype]] 을 설정하고 수정하지 않는 것에 최적화되어있다. 따라서 `Object.setPrototypeOf()`나 `obj.__proto__=`를 사용하여 프로토타입을 바꾸는 연산을 하게 되면 최적화를 망치게 되므로 느려지게 된다.

이 모든 상황을 이해하는 경우가 아니라면 [[Prototype]] 을 바꾸지 않는 것이 좋다.

---

**Reference**

- [[Javascript ] 프로토타입 이해하기](https://medium.com/@bluesh55/javascript-prototype-이해하기-f8e67c286b67)

- [prototype methods - 모던 JavaScript 튜토리얼](https://ko.javascript.info/prototype-methods)

