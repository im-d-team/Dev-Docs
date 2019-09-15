# 객체

연관된 속성의 집합을 객체라고 한다.

객체지향 프로그래밍에서는 클래스가 반환한 객체 인스턴스를 통해 메서드에 접근하고, 이 메서드를 통해 속성들을 제어한다.

이 경우 복잡한 구조를 모듈화 시켜서 사용할 수 있는 장점이 있다. 연관된 작업끼리 분류하여 묶은 뒤 호출하여 사용하는 것이다.

자바스크립트에서도 객체를 사용한다. 원시타입을 제외한 모든 타입은 객체이다.

> 자바스크립트의 원시타입(primitive type)은 Number, String, Boolean, Symbol(ES6~), Undefined 이다.

<br/>

객체 생성방법에는 세 가지가 있다.

- 리터럴 표기 사용
- 생성자 함수 사용
- Object.create() 메소드 사용

<br/>

## 객체 리터럴

자바스크립트의 객체는 매우 간단한 구조로 되어있다. 키와 밸류로 구성된 해시 맵 구조의 형태이다. 이러한 자바스크립트의 객체 표기법을 객체 리터럴이라고 한다. 객체 리터럴은 다음과 같이 만들고 접근할 수 있다.

```js
var objectExample = {
  propertyExample: "value", // 쉼표로 구분(세미 콜론이 아니다.)
  methodExample: function() {
    console.log(objectExample.propertyExample);
  }
};

console.log(objectExample.propertyExample); // value
console.log(objectExample["propertyExample"]); // value
objectExample.methodExample(); // value
```

객체의 프로퍼티(property; 속성)는 숫자, 배열, 오브젝트 등 모든 타입을 표현할 수 있고, 중첩시켜서 표현할 수 있다. 프로퍼티의 값이 함수일 경우 메소드(method)라고 표현한다.

> 프로퍼티를 정의하지 않으면 빈 객체가 생성된다. 또한 객체를 생성한 이후 프로퍼티를 동적으로 추가하거나 삭제할 수도 있다.

대괄호(`[]`) 를 이용하여 프로퍼티를 호출할 경우, 동적 호출이 가능하다.

> `objectExample[someObject]` 혹은, `objectExample["val"+"ue"]` 와 같이 호출이 가능하다.

<br/>

객체의 구성요소는 `객체.속성` 와 같이 `.` 을 표기하여 접근할 수 있다.

객체지향 언어에서 필드 혹은 멤버 변수에 직접 접근하는 것은 좋지 않은 방법인데, 자바 스크립트에서도 마찬가지로 값을 할당하는 프로퍼티에 직접 접근하는 것은 좋지 않은 방법이다. 다음과 같은 패턴으로 해결할 수 있다.

```js
const obj = {
  //name : name 을 다음과 같이 축약할 수 있다(ES6~)
  name,
  //getName : function(){ ... }을 다음과 같이 축약할 수 있다(ES6~).
  getName() {
    return this.name;
  },
  setName(name) {
    this.name = name;
  }
};

obj.setName("Name");
const result = obj.getName();
```

<br/>

## 생성자 함수

- `new` 연산자와 생성자를 사용하여 객체 생성 및 초기화를 하는 방법이다.
- 자바스크립트에서 제공하는 생성자 혹은 직접 작성한 생성자를 사용할 수 있다.
- 해당 생성자의 프로토타입(prototype)을 상속 받는다.

<br/>

### 자바스크립트에서 제공하는 생성자 사용

```js
var objectConstructor = new Object(...;)
```

> 객체 리터럴은 `new Object()` 로 객체를 생성한 것과 같다.

위와 같은 방식은 인자(argument)를 지정할 수 있다. 이는 안티패턴으로 분류되는데, 인자의 타입에 따라 원하는 결과와 다른 결과가 나올 수 있기 때문이다.

```js
var obj = new Object(1);

console.log(obj); // Number {1}

obj.str = "String";
console.log(obj); // Number {1, str: "String"}
```

<br/>

### 생성자 작성

```js
function ConstructorExample(a, b, c) {
  this.a = a;
  this.b = b;
  this.c = c;
}

var objectExample = new ConstructorExample(1, 2, 3);
```

객체지향 언어에서 사용하던 생성자와 같은 패턴이다.

주의할 점은 생성자 함수 또한 함수라는 것이다. 때문에, 다른 함수와 구분을 위해 첫 글자를 대문자로 작성해준다.

<br/>

## Object.create()

프로토타입으로 지정하고 싶은 객체와 프로퍼티를 인자로 넣어 객체 생성을 할 수 있다.

```js
function Obj(){};

var obj = Object.create(Obj, {
    ...;//생략가능
});
```

다른 방법들과는 다르게 객체자체가 프로토타입이 된다.

따라서, 객체에 직접 프로퍼티를 넣어야 참조하는 객체에서 프로퍼티를 사용 할 수 있다.

```js
Obj.newMethod = function() {
  console.log("newMethod");
};
obj.newMethod(); //newMethod
```

`Object.create()` 를 사용하면 보다 기존의 객체지향 언어와 가깝게 느껴진다.

ES6에서는 이를 보완한 `class` 를 사용한다.

> 클래스 알아보기 - [Class](https://github.com/Im-D/Dev-Docs/blob/master/Javascript/B_Class.md)

<br/>

---

#### References

- [[자바스크립트 패턴] ① 리터럴을 이용한 객체 생성 패턴 - IT 마이닝](https://itmining.tistory.com/73)
- [객체 리터럴과 this - 부스트코스](https://www.edwith.org/boostcourse-web/lecture/16779/)
