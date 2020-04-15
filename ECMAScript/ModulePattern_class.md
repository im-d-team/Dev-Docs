# Module Pattern과 class

## Module Pattern

캡슐화는 객체 지향 프로그래밍(OOP; Object Oriented Programming)의 대표적인 특징 중 하나로 **정보 은닉**의 개념을 포함한다.
하지만, 대개 객체 지향 언어는 객체 내의 은닉하고자 하는 정보와 그렇지 않은 정보를 `private`과 `public`과 같은 접근제어자를 통해 구분한다. 그러나 자바스크립트에서는 이와 같은 접근제어자를 제공하지 않으며, 대신 아래와 같은 방법을 이용해 캡슐화를 구현할 수 있다.

```js
//ES5
'use strict';
var Person = (function() {
    //생성자 함수 정의
    function Person(name, job) {
        this.name = name;
        this.job = job;
    }

    Person.prototype.sayInfo = function() {
        console.log('Name : ' + this.name + ', Job : ' + this.job);
    }

    return Person;
}());

var bkJang = new Person('BKJang', 'Developer');

bkJang.sayInfo(); //Name : BKJang, Job : Developer
```

마지막 출력 값을 보면 **인스턴스인 `bkJang`의 프로토타입 객체가 `Person.prototype` 객체임을 알 수 있고 이는 상속을 구현할 수 있음을 의미**한다.

## class

**자바스크립트는 기본적으로 `Prototype`기반의 객체지향 언어**다. 그리고 `Module Pattern`을 통해 자연스럽게 이해할 수 있을 것이다. 하지만 `ES5`의 `Module Pattern`을 사용하면 기본적으로 JS의 실행 컨텍스트, 클로저 등과 같은 개념을 정확히 알아야 구현이 가능하다. 물론, 실행 컨텍스트나 클로저 같은 개념을 몰라도 된다는 것은 아니지만 `ES6`의 `class`문법을 사용하면 우리가 좀 더 쉽게 익숙한 문법으로 캡슐화를 구현할 수 있다.  

즉, `ES6`의 `class`또한 프로토타입을 기반으로 동작하며 이는 기존의 자바스크립트에서 객체지향적으로 설계할 때의 방식을 좀 더 편하게 보완한 `Syntatic Sugar`다.

## 클래스의 정의

`ES6`에서 `class`가 생기기 전 우리는 위와 같은 방식으로 생성자 함수와 프로토타입을 이용해 객체지향 프로그래밍을 진행했었다. 위와 같은 코드를 `ES6`의 `class`를 사용하여 구현하면 아래와 같이 좀 더 간결하게 구현할 수 있다.

```js
//ES6
class Person {
    constructor(name, job) {
        this.name = name;
        this.job = job;
    }

    sayInfo() {
        console.log(`Name : ${this.name}, Job : ${this.job}`);
    }
}

const bkJang = new Person('BKJang', 'Developer');

bkJang.sayInfo(); //Name : BKJang, Job : Developer
```

클래스는 기본적으로 위와 같이 **`class Person {}`으로 정의하며, 흔치는 않지만 `const Person = class Myclass {};`처럼 함수 표현식으로도 정의 가능**하다.

둘의 또 다른 차이점은 생성자 함수를 이용하여 선언하면 `window`에 할당되지만, **`class`를 이용하여 선언하면 `window`에 할당되지 않는다.**

또한 **`class` 안에 있는 코드는 항상 [strict mode](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Strict_mode) 로 실행**되기 때문에 "use strict" 명령어가 없더라도 동일하게 동작한다.

```js
function Person() {}
class Developer {}

console.log(window.Person); //ƒ Person() {}
console.log(window.Developer); //undefined
```

## 인스턴스의 생성과 호이스팅

`class`를 사용하여 인스턴스를 생성할 때는 반드시 `new`를 이용해 호출해야하며 `new`를 사용하지 않으면 `Type Error`가 발생한다.

```js
class Foo {

}

const foo = Foo(); //Uncaught TypeError: class constructor Foo cannot be invoked without 'new'
```

`ES6`의 `class`는 [let, const](https://bkdevlog.netlify.com/posts/let-const)와 마찬가지로 호이스팅이 일어나지만, **선언이 일어나고 할당이 이뤄지기 전 `TDZ(Temporary Dead Zone)`에 빠지기 때문에 할당 이전에 호출하면 `Reference Error`가 발생**한다.

```js
const foo = new Foo(); //Uncaught ReferenceError: Foo is not defined

class Foo {

}
```

## constructor

`constructor`는 인스턴스를 생성하고 `class`의 `property`를 초기화한다. `ES5`에서는 생성자 함수를 이용해 `property`를 초기화하고 **생성자 함수를 반환**함으로써 객체지향을 구현했었다. 

### class는 constructor를 반환하며 생략할 수 있다.

**`const foo = new Foo()`와 같이 선언했을 때 `Foo`는 `class`명이 아닌 `constructor`다.**

```js
class Foo {

}

const foo = new Foo();

console.log(Foo == Foo.prototype.constructor); //true
```

위의 코드에서 볼 수 있듯이 `new`와 함께 호출한 `Foo`는 `constructor`와 같음을 확인할 수 있다.

또 확인할 수 있는 것은 `class Foo`내부에 `constructor`를 선언하지 않았음에도 인스턴스의 생성이 잘 이뤄지는 것을 볼 수 있다. 이는 **`class`내부에 `constructor`는 생략할 수 있으며 생략하면 `class`에 `constructor() {}`를 포함한 것과 동일하게 동작**하기 때문이다. 즉, 빈 객체를 생성하기 때문에 `property`를 선언하려면 인스턴스를 생성한 이후, `property`를 동적 할당해야 한다.

```js
console.log(foo); //Foo {}

foo.name = 'BKJang';

console.log(foo); //Foo {name: "BKJang"}
```

### class의 property는 constructor 내부에서 선언과 초기화가 이뤄진다.

`class`의 몸체에는 메서드만 선언 가능하며, `property`는 `constructor`내부에서 선언하여야 한다.

```js
class Foo {
    name = ''; //Syntax Error
}
```

```js
class Bar {
    constructor(name = '') {
        this.name = name;
    }
}

const bar = new Bar('BKJang');
console.log(bar); //Bar {name: "BKJang"}
```

> `constructor`내부에서 선언한 `property`는 `class`의 인스턴스를 가리키는 `this`에 바인딩 된다.

## getter, setter

`class`의 프로퍼티에 접근하기 위한 인터페이스로서, `getter`와 `setter`를 정의할 수 있다.

```js
class Person {
    constructor(name) {
        this.name = name;
    }

    //getter
    get personName() {
        return this.name ? this.name : null;
    }

    //setter
    set personName(name) {
        this.name = name;
    }
}

const person = new Person('BKJang');

console.log(person.personName); //BKJang
person.personName = 'SHJo';
console.log(person.personName); //SHJo
```

## Static 메서드

`class`에서는 정적 메서드를 정의할 때, `static` 키워드를 사용하여 정의한다. **정적 메서드는 인스턴스를 생성하지 않아도 호출가능하며, 인스턴스가 아닌 `class`의 이름으로 호출한다.** 이와 같은 특징 때문에 애플리케이션을 위한 유틸리티성 함수를 생성하는데 주로 사용한다.

또한 **정적 메서드 내부에서는 `this`가 `class`의 인스턴스가 아닌 `class`자기 자신을 가리킨다.**

```js
class Person {
    constructor(name) {
        this.name = name;
    }

    //getter
    get personName() {
        return this.name ? this.name : null;
    }

    //setter
    set personName(name) {
        this.name = name;
    }

    static staticMethod() {
        console.log(this);
        return 'This is static';
    }
}

console.log(Person.staticMethod()); 
/*
class Person { ... }
This is static
*/

const instance = new Person('BKJang');

console.log(instance.staticMethod()); //Uncaught TypeError: instance.staticMethod is not a function
```

위에서 볼 수 있듯이 인스턴스로는 `class`의 정적 메서드를 호출할 수 없다. 

또한 **정적 메서드는 `prototype`에 추가되지 않는다.**

```js
console.log(Person.staticMethod === Person.prototype.staticMethod); //false
console.log(new Person().personName === Person.prototype.personName); //true
```

## 클래스의 상속

`class`를 이용하여 `OOP`의 특징 중 하나인 상속을 구현할 수 있다.`class`의 상속을 위해서는 `extends`와 `super` 키워드에 대해서 알아야 한다.

```js
class Person {
    constructor(name, sex) {
        this.name = name;
        this.sex = sex;
    }

    getInfo() {
        return `Name : ${this.name}, Sex : ${this.sex}`;
    }

    getName() {
        return `Name : ${this.name}`;
    }

    getSex() {
        return `Sex : ${this.sex}`;
    }
}

class Developer extends Person { //extends를 사용하여 Person 클래스 상속
    constructor(name, sex, job) {
        //super메서드를 사용하여 부모 클래스의 인스턴스를 생성
        super(name, sex);
        this.job = job;
    }

    //오버라이딩
    getInfo() {
        //super 키워드를 사용하여 부모 클래스에 대한 참조
        return `${super.getInfo()} , Job: ${this.job}`;
    }

    getJob() {
        return `Job : ${this.job}`;
    }
}

const person = new Person('SHJo', 'Male'); 
const developer = new Developer('BKJang', 'Male', 'Developer');

console.log(person); //Person {name: "SHJo", sex: "Male"}
console.log(developer); //Developer {name: "BKJang", sex: "Male", job: "Developer"}

console.log(person.getInfo()); //Name : SHJo, Sex : Male

console.log(developer.getName()); //Name : BKJang
console.log(developer.getSex()); //Sex : Male
console.log(developer.getJob()); //Job : Developer
console.log(developer.getInfo()); //Name : BKJang, Sex : Male , Job: Developer

console.log(developer instanceof Developer); //true
console.log(developer instanceof Person); //true
```

위의 소스를 기준으로 중요한 특징을 정리하자면 다음과 같다.(대부분의 객체 지향 언어에서 상속의 특징과 거의 동일하다.)

- **부모 클래스(슈퍼 클래스)의 메서드를 사용할 수 있다.**

- **부모 클래스의 메서드를 오버라이딩(Overriding)할 수 있다.**

- **`super` 키워드를 통해 부모 클래스의 메서드에 접근**할 수 있다.

- **`super` 메서드**(위의 Developer 클래스의 constructor내부에 선언)**는 자식 클래스의 `constructor` 내부에서 부모 클래스의 constructor(`super-constructor`)를 호출**한다.

---

### Reference

- [자바스크립트 객체지향 프로그래밍](https://poiemaweb.com/js-object-oriented-programming)
- [MDN Web Docs - Classes](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Classes)
- [[ES6] 6. Class sugar syntax](https://jaeyeophan.github.io/2017/04/18/ES6-6-Class-sugar-syntax/)
- [Class 클래스](https://poiemaweb.com/es6-class)
