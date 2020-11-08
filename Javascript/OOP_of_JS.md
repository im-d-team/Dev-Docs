# JS의 객제지향 프로그래밍



객체지향 프로그래밍은 **현실에 존재하는 객체를 소프트웨어에 표현하기 위해 상태와 행위를 추상화(abstraction)하여 모델링하는 프로그래밍 패러다임**을 말한다. 

다시 말해, 우리가 주변의 사물과 우리의 행위를 프로그래밍에 접목하려는 것을 말한다.



## 클래스 기반



Java나 C++ 같은 클래스 기반의 언어에서는 `class`를 이용하여 **속성(attribute)과 행위(method)를 정의**한다.

`new`를 사용하여 **인스턴스화하는 과정을 통해 객체를 생성**한다.

```java
class Person {
  private String job;

  public Person(String job) {
    this.job = job;
  }

  public void setJob(job) {
    this.job = job;
  }

  public String getJob() {
    return this.job;
  }

  public static void main(String args[]) {
    Person bkjang = new Person("developer");

    String job = bkjang.getJob();
    System.out.println(job); //developer
  }
}
```



## 프로토타입 기반



자바스크립트는 클래스라는 개념이 없다.(ES6에서 class가 생기긴 했지만 **이는 사실 함수이며 프로토타입 기반의 syntatic sugar**다.)

자바스크립트는 대표적인 **프로토타입 기반**의 객체지향 언어이다.

클래스라는 개념이 없지만 자바스크립트에는 3가지의 객체 생성 방법이 있다.

> * 객체 리터럴
> * Object() 생성자 함수
> * 생성자 함수

```javascript
// 객체 리터럴
var obj = {
  name : 'BKJang',
  job : 'Developer'
}


// Object 생성자 함수
var obj = new Object();
obj.name = 'BKJang';
obj.job = 'Developer';


// 생성자 함수
function Person(name, job) {
  this.name = name;
  this.job = job;
}

var obj = new Person('BKJang', 'Developer');
```



## 생성자 함수를 이용한 객체 생성



자바스크립트는 생성자 함수를 이용해 객체를 생성할 수 있다.

```javascript
function Developer(lang) {
  this.lang = lang;

  //메서드 정의
  this.setLang = function(lang) {
    this.lang = lang;
  };

  this.getLang = function() {
    return this.lang;
  };
}

var frontEnd = new Developer('Javascript');
var backEnd = new Developer('Java');

console.log(frontEnd.getLang()); //Javascript
console.log(backEnd.getLang()); //Java

backEnd.setLang('Node.js');

console.log(backEnd.getLang()); //Node.js
```

위 예제에서 볼 수 있듯이 **생성자 함수내에 프로퍼티와 메서드를 정의하고 `new`연산자를 이용해 객체를 생성**한다.

```javascript
console.log(frontEnd); //{lang: "Javascript", setLang: ƒ, getLang: ƒ}
console.log(backEnd); //{lang: "Node.js", setLang: ƒ, getLang: ƒ}
```

하지만 위에서 볼 수 있듯이 `frontend`와 `backend` 객체는 각각 `setLang()`과 `getLang()` 메서드를 가지고 있다.

위의 방식으로 구현하면 객체가 많아질수록 **불필요하게 같은 메서드를 모두 각각** 가지고 있게 되며 이는 **메모리의 낭비**로 이어질 수 있다.

이를 막기 위해 자바스크립트에서는 프로토타입을 이용할 수 있다.



## 프로토타입 체인을 이용한 참조



자바스크립트에서 모든 객체는 **프로토타입이라는 내부 링크**를 갖고 있고 프로토타입을 통해 객체를 연결한다. 이를 [프로토타입 체인](https://github.com/im-d-team/Dev-Docs/blob/master/Javascript/Prototype_Chain.md)이라고 한다.

```javascript
function Developer(lang) {
  this.lang = lang;

  //메서드 정의
  Developer.prototype.setLang = function(lang) {
    this.lang = lang;
  };

  Developer.prototype.getLang = function() {
    return this.lang;
  };
}

var frontEnd = new Developer('Javascript');
var backEnd = new Developer('Java');

console.log(frontEnd.getLang()); //Javascript
console.log(backEnd.getLang()); //Java

backEnd.setLang('Node.js');

console.log(backEnd.getLang()); //Node.js
```

위의 코드를 보면 **생성자 함수 내부에서 `Developer()` 함수의 프로토타입 프로퍼티가 가리키는 `Developer.prototype` 객체에 `setLang()`과 `getLang()`을 정의**한다.

이후 `frontEnd`와 `backEnd`객체에서는 프로토타입 체인을 통해 `[[Prototype]]` 프로퍼티가 가리키는 **즉, 부모 객체인 `Developer.prototype`객체에 정의된 메서드들을 사용**할 수 있다.

```javascript
console.log(frontEnd); //Developer {lang: "Javascript"}
console.log(backEnd); //Developer {lang: "Node.js"}

console.log(frontEnd.__proto__ === backEnd.__proto__); //true
console.log(frontEnd.__proto__ === Developer.prototype); //true
console.log(Developer.prototype); //{setLang: ƒ, getLang: ƒ, constructor: ƒ}
```

위 코드의 출력 값들을 보면 `frontEnd.__proto__`와 `backEnd.__proto__`는 모두 `Developer.prototype` 객체를 가리킨다.

또한 `getLang()`과 `setLang()` 메서드는 **`frontEnd`와 `backEnd` 각각의 객체가 아닌 `Developer.prototype` 객체에만 정의되어 있는 것**을 볼 수 있다.

이를 통해 첫 번째 예제에서 문제가 됐던 메모리 낭비 부분을 없앨 수 있다.



![JavaScript](https://github.com/BKJang/DEVLOG/blob/master/public/assets/img/js_oop1.png?raw=true)


## 의사 클래스 패턴(Pseudo-classical) 상속



의사 클래스 패턴은 **자식 생성자 함수의 프로토타입 객체를 부모 생성자 함수의 인스턴스로 교체하는 방식**이다.

```javascript
var Person = (function() {
  //생성자 정의
  function Person(job) {
    this.job = job;
  }

  //메서드 정의
  Person.prototype.getJob = function() {
    return this.job;
  };

  return Person;
}());

var Developer = (function() {
  //생성자 정의
  function Developer(job, name) {
    this.job = job;
    this.name = name;
  }

  Developer.prototype = new Person();

  //Override
  Developer.prototype.getJob = function() {
    console.log(this.job);
  }

  Developer.prototype.getName = function() {
    console.log(this.name);
  }

  return Developer;
}());

var jsDeveloper = new Developer('web Developer', 'BKJang');

jsDeveloper.getJob(); //web Developer
jsDeveloper.getName(); //BKJang

console.log(jsDeveloper.__proto__); //Person {job: undefined, getJob: ƒ, getName: ƒ}
console.log(Developer.prototype.__proto__ === Person.prototype); //true
console.log(jsDeveloper.constructor); //Person(job)
```

위의 코드를 보면 자식 생성자 함수인 `Developer()`함수의 프로토타입 객체를 Person 생성자 함수의 인스턴스로 교체하고 있다.

그리고 **자식 생성자 함수(`Developer()`)의 `[[Prototype]]`프로퍼티는 부모 생성자 함수(`Person()`)의 프로토타입 객체를 가리키고 있다.**



#### 의사 클래스 패턴의 문제



* **constructor 링크의 파괴**

자식 생성자 함수의 인스턴스인 `jsDeveloper`의 생성자는 원래라면 `Developer()` 생성자 함수여야하지만 **`Developer()` 함수의 프로토타입 객체를 교체하는 과정에서 `constructor`의 연결이 깨지게 된다.**

* **다른 생성자 함수와의 new 연산자를 통한 불필요한 과정**

자바스크립트에서 **객체에서 다른 객체에 직접적으로 연결하여 상속을 구현하는 것**이 아닌 **다른 생성자 함수와 `new` 연산자를 통해 객체를 생성하는 불필요한 과정이 존재**한다.

* **객체리터럴 방식으로 생성한 객체의 상속이 불가능**

의사 클래스 패턴은 기본적으로 생성자 함수를 사용하기 때문에 **객체 리터럴 방식으로 생성한 객체로는 상속을 구현할 수 없다.**

기본적으로 **객체 리터럴로 생성한 객체의 `constructor`는 `Object()` 생성자 함수를 가리키고** 이는 변경할 수 없기 때문이다.



## 프로토타입 패턴(Prototypal) 상속



프로토타입 패턴에서는 `Object.create()` 함수를 사용한다.

Object.create() 함수의 인자로는 상속을 구현할 프로토타입 객체를 전달한다.

코드로 살펴보자.

```javascript
var Person = (function() {
  //생성자 정의
  function Person(job) {
    this.job = job;
  }

  Person.prototype.getJob = function() {
    return this.job;
  };

  return Person;
}());

var jsDeveloper = Object.create(Person.prototype);
jsDeveloper.job = 'Front Developer';

var javaDeveloper = Object.create(Person.prototype);
javaDeveloper.job = 'Back Developer';

jsDeveloper.name = 'BKJang'

//Override
jsDeveloper.getJob = function() {
  console.log(this.job);
}

jsDeveloper.getName = function() {
  console.log(this.name);
}

console.log(javaDeveloper.getJob()); //Back Developer
jsDeveloper.getJob(); //Front Developer
jsDeveloper.getName(); //BKJang

console.log(jsDeveloper); //Person {job: "Front Developer", name: "BKJang", getJob: ƒ, getName: ƒ}
console.log(javaDeveloper); //Person {job: "Back Developer"}
console.log(jsDeveloper.__proto__ === javaDeveloper.__proto__); //true
```

![Javascript](https://github.com/BKJang/DEVLOG/blob/master/public/assets/img/js_protypal_inheritance.png?raw=true)

프로토타입 패턴 상속은 **객체 리터럴 방식으로 생성한 객체도 상속을 구현할 수 있다.**

```javascript
var person = {
  job : 'Front Developer',
  getJob : function() {
    return this.job;
  }
};

var jsDeveloper = Object.create(person);
var javaDeveloper = Object.create(person);

jsDeveloper.name = 'BKJang'

//Override
jsDeveloper.getJob = function() {
  console.log(this.job);
}

jsDeveloper.getName = function() {
  console.log(this.name);
}

javaDeveloper.job = 'Back Developer';


console.log(javaDeveloper.getJob()); //Back Developer
jsDeveloper.getJob(); //Front Developer
jsDeveloper.getName(); //BKJang

console.log(jsDeveloper); //{name: "BKJang", getJob: ƒ, getName: ƒ}
console.log(javaDeveloper); //{job: "Back Developer"}
console.log(jsDeveloper.__proto__ === javaDeveloper.__proto__); //true
```

## 캡슐화(정보 은닉)



캡슐화는 OOP의 대표적인 특징 중 하나로 **정보 은닉**의 개념을 포함한다.
하지만, 자바스크립트는 자바와 같이 `private`과 `public` 같은 키워드를 제공하지 않는다. 따라서 다른 방법으로 구현 가능하다.



## 모듈 패턴(Module Pattern)



```javascript
var Developer = function(arg) {
  var lang = arg ? arg : '';

  return {
    getLang : function() {
      return lang;
    },
    setLang : function(arg) {
      lang = arg;
    }
  
  }
};

var bkjang = new Developer('javascript');

console.log(bkjang.getLang()); //javascript

bkjang.setLang('java');

console.log(bkjang.getLang()); //java
```

위의 코드를 보면 Developer 생성자 함수에서 **`this`가 아닌 `var lang = arg ? arg : '';`으로 선언하면 자바스크립트는 함수형 스코프를 따르기 때문에 private해진다.** 

그리고 `getLang()` 과 `setLang()` 이라는 함수는 **클로저**이기 때문에 외부에서는 `lang`이라는 변수의 값에 접근할 수 있는 인터페이스가 된다.

위와 같이 `getLang()`과 `setLang()`과 같은 public 메서드를 인터페이스로 제공하고 `lang`과 같은 private한 변수에 인터페이스를 통해서만 접근하도록 하는 것이 **모듈 패턴**이다.



그렇다면 private 멤버 변수가 객체나 배열일 경우는 어떻게 될까?

```js
var Developer = function (obj) {
  var developerInfo = obj;

  return {
    getDeveloperInfo: function() {
      return developerInfo;
    }
  };
};

var developer = new Developer({ name: 'BKJang', lang: 'javascript' });

var bkJang = developer.getDeveloperInfo();
console.log('bkJang: ', bkJang);
// bkJang:  {name: "BKJang", lang: "javascript"}

bkJang.lang = 'java'; //인터페이스가 아닌 직접 변경

bkJang = developer.getDeveloperInfo();
console.log('bkJang: ', bkJang);
// bkJang:  {name: "BKJang", lang: "java"}

console.log(Developer.prototype === bkJang.__proto__); //false
```

**일반 변수가 아닌 객체나 배열을 멤버 변수로 가지고 이를 그대로 반환할 경우, 외부에서 이 멤버를 변경할 수 있다.**

왜냐하면, 객체나 배열을 반환하는 경우는 얕은 복사(shallow copy)로 private 멤버의 **참조값을 반환**하게 된다. 

따라서, 반환할 객체나 배열의 정보를 담은 **새로운 객체를 만들어 깊은 복사(deep copy)를 거친 후 반환**해야 한다.



또한, 위처럼 일반 객체를 반환하면 프로토타입 객체는 `Object.prototype` 객체가 되기 때문에 **상속을 구현할 수 없다.** 따라서 **함수를 반환**해야 한다.

```js
var Developer = (function() {
  var lang;

  //생성자 정의
  function Developer(arg) {
    lang = arg ? arg : '';
  }

  Developer.prototype = {
    getLang : function() {
      return lang;
    },
    setLang : function(arg) {
      lang = arg;
    }
  }
  
  return Developer;
}());

var bkJang = new Developer('javscript');

console.log(bkJang.getLang()); //javscript

bkJang.lang = 'java'; //인터페이스를 통해서가 아닌 직접 변경
console.log(bkJang.getLang()); //javscript

bkJang.setLang('java');
console.log(bkJang.getLang()); //java

console.log(Developer.prototype === bkJang.__proto__); //true
```

마지막 출력 값을 보면 **인스턴스인 `bkJang`의 프로토타입 객체가 `Developer.prototype` 객체임을 알 수 있고 이는 상속을 구현할 수 있음을 의미**한다.

#### Reference

- 인사이드 자바스크립트 (송형주, 고형준)
- [자바스크립트 객체지향 프로그래밍](https://poiemaweb.com/js-object-oriented-programming)
