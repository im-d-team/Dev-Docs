# 객체 생성 패턴 - 생성자 패턴

객체를 생성하는 쉽고 단순한 방법에는 `Object` 객체의 인스턴스를 만드는 것과 객체 리터럴을 이용한 방법이 있다.

```js
// Object의 인스턴스 생성
var person = new Object();
person.name = "per";
person.age = 22;
person.getName = function() {
    return this.name;
}

// 객체 리터럴 사용
var person = {
    name : "son",
    age : 28,
    getName : function() {
        return this.name;
    }
}
```

> `var person = {}` 과 `var person = new Object()` 는 같은 동작을 한다.

객체를 하나만 만든다면 상관없지만, 같은 인터페이스를 가지는 객체를 여러개 만들 경우 비효율적이다. 간단한 팩토리를 사용하여 이를 해결할 수 있다.

<br/>

```js
function createPerson(name, age) {
  var obj = {};

  obj.name = name;
  obj.age = age;

  obj.getName= function() {
    return this.name;
  };
  return obj;
}

var person1 = createPerson("per", 22);
var person2 = createPerson("son", 28);

person1.getName(); // per
person2.getName(); // son
 ```

하지만 위의 경우 생성된 객체의 타입이 명확하지 않다.

```js
typeof person1; // object
typeof person2; // object
```

때문에 생성자 패턴을 사용한다.

<br/>

## 생성자 패턴

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.getName = function() {
    return this.name;
  }
}
// new 연산자로 새 객체를 만듭니다.
var person1 = new Person("per", 22);
var person2 = new Person("son", 28);

consol.log(person1 instanceof Person); // true
consol.log(person2.constructor == Person); // true
```

하지만 생성자 패턴만 사용할 경우 문제점이 있다.

### 문제점 1 - 함수로 동작하는 생성자

생성자 함수는 함수 타입이기 때문에 new 연산자를 사용하지 않을 경우 함수와 같은 동작을 한다.

```js
Person("person", 99); // 프로퍼티와 메서드가 window객체에 추가된다.

window.getName() // person
```

### 문제점 2 - 인스턴스마다 새로운 메소드 생성

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
  // 위에서 만들었던 getName 메소드들은 다음과 같다.
  this.getName = new Function('return this.name;');
}

var person1 = new Person("per", 22);
var person2 = new Person("son", 28);

console.log(person1.getName == person2.getName); // false
```

`getName` 메소드는 계속해서 같은 동작을 하지만, 매번 새로 생겨날 것이다. 메소드를 생성자 바깥에 정의하여 해결할 수 있다.

```js
function getName () {
  return this.name;
}

function Person(name, age) {
  this.name = name;
  this.age = age;
  this.getName = getName;
}

var person1 = new Person("per", 22);
var person2 = new Person("son", 28);

console.log(person1.getName == person2.getName); // true
```

이렇게하면 메소드가 새로 생겨나는 것은 막을 수 있겠지만, 전역스코프에 함수를 정의한다는 문제가 있다.

이는 프로토타입을 이용하여 해결할 수 있다.

<br/>

---

Reference

- [객체 생성 - 이지코드](http://ezcode.kr/study/view/203)
