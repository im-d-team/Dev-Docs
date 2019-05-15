# this 더 알아보기

지난 포스팅에서 [scope 관점에서의 this](https://github.com/Im-D/Dev-Docs/blob/master/Javascript/scope_this.md)에 대해 알아봤다.

이어서 this와 관련해서 어떤 재밌는게 있을까 궁금하여 this를 사용하는 것을 더 찾아봤다.

**`new` operator** , **prototype pattern**, **method chaining** 세가지에 대해 알아봤다.

js의 this는 항상 헷갈려서 어렵게 생각할 수도 있지만 쉬운 내용이라 생각해보자.

## new operator

`new`는 js의 생성자 패턴과 관련된 내용이다.

js는 생성자 패턴을 이용하여 마치 다른 언어의 클래스와 비슷하게 동작하도록 만든다. es6의 class 키워드도 객체지향언어의 클래스처럼 보이지만 사실은 생성자 패턴의 syntatic sugar다.

### 생성자 pattern 설명

```js
const Person = function(name, age) {
  this.name = name;
  this.age = age;
};

const person1 = Person('Jin', 26);
cL;
const person2 = new Person('Jin', 26);
cL;
console.log(person1); // undefined
console.log(person2); // Person {name: "Jin", age: 26}
```

`new` 키워드를 사용하지 않으면 Person은 단순 함수다. 따라서 `person1` 은 값이 `undefined`다.

`new` 키워드를 사용하여 만든 person2는 `__proto__`(dunder proto)가 Person의 prototype을 가리킨다.

MDN문서에서는 `new` 연산자로 객체의 인스턴스를 생성한다고 쓰여있다.

### new가 하는 일

그럼 `new`가 내부적으로 어떻게 실행되길래 인스턴스를 만들 수 있으며 Person이라는 함수의 this가 작동하는 것일까??

생성자 패턴에서 new를 사용하게 되면 다음과 같은 일이 일어난다.

1. 비어있는 새 객체(object)가 만들어진다.
2. 새 객체의 \_\_proto\_\_가 생성자함수.prototype 으로 연결된다.
3. 새로 생성된 객체는 생성자함수 호출 시 **this로 바인딩** 된다.
4. 이 함수가 다른 객체를 반환하지 않는 한 1번의 새로 생성된 객체를 반환한다.

즉 `new`로 만들면 객체 하나가 만들어지고 함수의 실행시 그 객체를 this로 사용하게 한다. 그런 뒤 반환값이 `return this`가 되게 만든다.

3번의 이유로 생성자 함수에서의 this가 새로 만들어진 this가 된다. 그래서 `this.name = name`과 같은 statement가 가능하다. 또한 4번의 결과로 반환된 this객체가 person2에 할당된다.

## 프로토타입에서의 this

`new`의 연장선이니 위에 주제가 이해 됐다면 조금은 편한 마음으로 보자.

```js
const Person = function(name, age) {
  this.name = name;
  this.age = age;
};

Person.prototype.getName = function() {
  return this.name;
};

Person.prototype.setFullName = function(FamilyName) {
  const personName = this.getName();
  this.fullName = personName + FamilyName;
};

const person1 = new Person('Jin', 26);

// #1
console.log(person1.getName === Person.prototype.getName);
console.log(person1.getName());
console.log(Person.prototype.getName());

// true
// Jin
// undefined

// #2
console.log(person1.setFullName === Person.prototype.setFullName);

person1.setFullName('Kang');
Person.prototype.setFullName('Kang');

console.log(person1.fullName);
console.log(Person.prototype.fullName);

// true
// JinKang
// undefinedKang
```

다음은 프로토타입 패턴으로 객체의 메서드를 정의하였다.

\#1에서 person1로 실행한 것과 Person.prototype을 실행한 메서드는 동일하지만 결과 값이 다르다.

[이전에 소개했던 포스팅](https://github.com/Im-D/Dev-Docs/blob/master/Javascript/scope_this.md) 의 객체 this바인딩 원칙에 따라 각각 인스턴스, 프로토타입 객체가 this가 된다.

\#2에서도 역시 같은 원리로 this.getName()을 내부적으로 실행하지만 결과가 다르다. person1으로 실행한 것은 this.getName()이 `person1.getName()`이 되며, prototype은 `Person.prototype.getName()`이 된다.

같은 코드의 내부의 this가 다르게 바인딩되는 dynamic scope 규칙처럼 작동하는 this 덕분에 프로토타입 패턴이 가능하게 되었고, 이는 자바스크립트에서도 OOP가 가능하게 만든 핵심이다.

JS에서의 OOP 구현은 프로토타입이 굉장히 핵심적이고 중요하다. 하지만 dynamic scope를 지원하는듯한 this가 있어 인스턴스와 클래스의 개념을 비슷하게 만들 수 있게 되었다.

## method chaining

메서드 체이닝이란 객체에 연속적으로 메서드를 호출하는 패턴을 말한다.

`myobj.method1('hello').method2().method3('world').method4();`

이런식으로 체인할 수 있는 것을 말한다. 이러한 패턴은 가독성에 매우 큰 도움이 된다.

현대 프로그래밍은 성능보다도 가독성이 훨씬, 정말 수십배는 중요하다. 프로그램에서 제일 중요한 것은 유지보수이며 유지보수에 도움을 주는 것은 성능만 좋은 엉망인 코드보다 성능이 조금 안좋더라도 가독성있는 코드다.

이러한 가독성 좋은 메서드 체이닝은 어떻게 가능한 것일까? 바로 this다.

### 기존의 함수방식

[1, 2, 3, 4, 5]를 2배 곱하고 3씩 더하여 [5, 7, 9, 11, 13]로 만들어보자.

```js
const arr = [1, 2, 3, 4, 5];

function multi(arr, N) {
  const newArr = [];

  for (let i of arr) {
    newArr.push(i * N);
  }

  return newArr;
}

function add(arr, N) {
  const newArr = [];
  for (let i of arr) {
    newArr.push(i + N);
  }

  return newArr;
}

console.log(add(multi(arr, 2), 3)); // [5, 7, 9, 11, 13]
```

pure function을 이용하여 의존성을 낮춘 코드지만 함수 호출부를 보자니 조금 지저분해진다.

### 의존성 주입패턴

```js
function CustomArray(arr) {
  this.arr = arr;
}

CustomArray.prototype.multi = function(N) {
  const newArr = [];

  for (let i of this.arr) {
    newArr.push(i * N);
  }

  this.arr = newArr;
};

CustomArray.prototype.add = function(N) {
  const newArr = [];

  for (let i of this.arr) {
    newArr.push(i + N);
  }

  this.arr = newArr;
};

const arr = [1, 2, 3, 4, 5];
const customArray = new CustomArray(arr);

// =================여기===================
customArray.multi(2);
customArray.add(3);
// ====================================

console.log(arr); // [1, 2, 3, 4, 5]
console.log(customArray.arr); // [5, 7, 9, 11, 13]
```

프로토타입을 만들고 pure functionc처럼 의존성을 낮추기 위해 DI를 적용시켜 원본 배열 수정을 막았다.

그런데도 문제는 `여기`라고 표시된 부분이 길어지면 한눈에 보기 힘들어 진단 점이다.

### 메서드 체이닝 방식

```js
function CustomArray(arr) {
  this.arr = arr;
}

CustomArray.prototype.multi = function(N) {
  const newArr = [];

  for (let i of this.arr) {
    newArr.push(i * N);
  }

  this.arr = newArr;

  return this;
};

CustomArray.prototype.add = function(N) {
  const newArr = [];

  for (let i of this.arr) {
    newArr.push(i + N);
  }

  this.arr = newArr;

  return this;
};

const arr = [1, 2, 3, 4, 5];
const customArray = new CustomArray(arr);

customArray.multi(2).add(3);

console.log(customArray.arr);
```

위 코드에서 `return this`만 추가해주면 이렇게 메서드 체이닝이 구현된다. 그런데 이 경우도 조금 아쉬운 점은 메서드가 내부적으로 원본 데이터(this.arr)를 수정한다는 점이다.

그래서 체이닝을 지원하는 map, filter, reduce, some, every 등의 메서드는 다음과 같은 방식으로 구현된다.

```js
function CustomArray(arr) {
  this.arr = arr;
}

CustomArray.prototype.multi = function(N) {
  const newArr = [];

  for (let i of this.arr) {
    newArr.push(i * N);
  }

  return new CustomArray(newArr);
};

CustomArray.prototype.add = function(N) {
  const newArr = [];

  for (let i of this.arr) {
    newArr.push(i + N);
  }

  return new CustomArray(newArr);
};

const arr = [1, 2, 3, 4, 5];
const customArray = new CustomArray(arr);

const resultArr = customArray.multi(2).add(3);

console.log(resultArr.arr);
```

### 참고자료

- [MDN-new](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/new)
- [Jaehee's WebClub - Chaining Pattern of JavaScript](https://webclub.tistory.com/528)
- [Understanding Method Chaining In Javascript](https://medium.com/backticks-tildes/understanding-method-chaining-in-javascript-647a9004bd4f)
- [자바스크립트 메소드 체이닝패턴](http://blog.saltfactory.net/javascript-method-chaining-pattern/)
- You Dont Know JS this와 객체 프로토타입, 비동기와 성능, 카일 심슨, 한빛미디어, 이일웅 옮김
- [JavaScript : 프로토타입(prototype) 이해](http://www.nextree.co.kr/p7323/)
- [Poiemaweb - 프로토타입](https://poiemaweb.com/js-prototype)
