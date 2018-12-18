# 객체지향 프로그래밍(OOP)

<br/>

## 객체지향 프로그래밍이란?

객체지향 프로그래밍은 **일상 생활에서 데이터를 추상화하여 상태와 행위를 가진 하나의 객체(Object)로 만들고 그 객체들간의 관계성을 통해 로직을 구성하는 프로그래밍 패러다임**이다.

대표적인 특성으로는 **클래스와 인스턴스, 추상화, 상속, 캡슐화, 다형성** 이렇게 5가지가 있다.

객체지향 프로그래밍을 이용하면 **코드의 재사용이 용이**하고 **유지보수가 쉽다**는 장점이 있다.

<br/>

## 클래스와 인스턴스

**클래스는 추상화를 거쳐 속성과 행위를 변수와 메서드로 정의한 것**을 말한다. 자바스크립트(ES5)에서는 클래스가 없지만 객체를 사용하여 클래스처럼 사용할 수 있다.

인스턴스는 **클래스에서 정의한 것을 토대로 만들어진 실제 프로그래밍에서 사용하는 데이터**를 말한다.

```js
function Person(job) {
  this.job = job; //프로퍼티(변수)

  //메서드 정의
  this.setJob = function(job) {
    this.job = job;
  };

  this.getJob = function() {
    return this.job;
  };
}


var bkjang = new Person('Web Developer'); //인스턴스

console.log(bkjang.getJob()); //Web Developer

bkjang.setJob('JS Developer');

console.log(bkjang.getJob()); //JS Developer
```

<br/>

## 추상화

현실 세계에 존재하는 모델의 정보를 모두 표현하기 보다는 불필요한 정보는 제외하고 **요구 사항에 따라 모델의 필요한 정보와 행위만 추려 모델링하는 과정을 추상화**라고 할 수 있다.

예를 들어, 사람은 이름, 나이, 직업, 키 등의 여러 정보가 있지만 **위의 소스 코드에서는 사람의 직업에 대해서만 속성을 뽑아내고 이를 객체로 정의**하였다. 이 과정을 **추상화**라고 한다.

<br/>

## 캡슐화

캡슐화는 **정보의 영역의 한정(limitation of information area)이 목적**이다. 정보(Information, 혹은 Data)를 객체 안에 포함시키고, 그 정보에 대한 직접 접근은 허용하지 않는 대신, 필요에 따라 확인할 수 있는 인터페이스를 외부에 공개하는 방식이다. 

물론, **캡슐화는 모듈화(modularity)의 의미가 더 강하지만 잘된 캡슐화는 정보 은닉의 내용을 포함**한다.

<br/>

## 상속

상속은 **부모 객체의 속성과 행위(메서드)를 자식 객체에서 물려받아 사용하는 것을 말한다.**

실제로 상속을 통해 자주 쓰이는 기능이나 변수를 특정 클래스를 통해 구현해두고 이를 라이브러리 형식으로 많이 쓴다.

```js
function Person(job) {
  this.job = job; //프로퍼티(변수)

  //메서드 정의
  Person.prototype.setJob = function(job) {
    this.job = job;
  };

  Person.prototype.getJob = function() {
    return this.job;
  };
}


var bkjang = new Person('Web Developer'); //인스턴스

console.log(bkjang.getJob()); //Web Developer

bkjang.setJob('JS Developer');

console.log(bkjang.getJob()); //JS Developer
```

<br/>

## 다형성

다형성은 상속을 통해 특정 기능의 일부를 수정하여 재정의하거나 확장함으로서 생기는 객체지향의 특성이다.<br/>
다형성을 말할 때 항상 오버라이딩 오버로딩이 나온다.

### 오버라이딩(Overriding)

---

자식 클래스에 부모 클래스에 정의된 기능을 같은 이름, 같은 인자, 같은 반환 타입으로 재정의하고 확장하는 것을 말한다.

```js
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
```

### 오버로딩(Overloading)

---

오버로딩은 하나의 클래스에서 같은 이름을 가진 메서드를 여러 개 가질 수 있게 한다. 단 인자를 다르게 설정하여 구현한다.

```js
//JS
function sumArgs(a, b, c, d) { 
    var num1 = a;

    if(typeof b !== "undefined") { num1 += b; }
    if(typeof c !== "undefined") { num1 += c; }
    if(typeof d !== "undefined") { num1 += d; }

    return num1;

} 

console.log(sumArgs(10, 20)); // 30 
console.log(sumArgs(10, 20, 30)); // 60 
console.log(sumArgs(10, 20, 30, 40)); // 100 
```

<br/>

---

#### Reference

* [객체 지향 프로그래밍(Object-Oriented Programming)이란?](https://nesoy.github.io/articles/2018-05/Object-Oriented-Programming)
