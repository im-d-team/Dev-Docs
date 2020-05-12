## 프로토타입 체인

특정 객체의 메서드나 프로퍼티에 접근하고자할 때, **해당 객체에 접근하려고 하는 프로퍼티나 객체가 없다면** 프로토타입 링크(`[[Prototype]]` 프로퍼티)를 따라 **자신의 부모 역할을 하는 프로토타입 객체를 차례로 검색**한다. 이를 프로토타입 체인이라 한다.

```javascript
var developer = {
    name : 'BKJang',
    age : 25,
    sex : 'male'
};

console.log(developer.hasOwnProperty('name')); //true
console.log(developer.__proto__ === Object.prototype); //true
console.log(Object.prototype.hasOwnProperty('hasOwnProperty')); //true
```

`developer`객체에는 `hasOwnProperty()`메서드가 존재하지 않지만 에러가 나지 않는다. 
이는 `developer` 객체의 **부모 객체에 해당하는 `Object.prototype`의 메서드를 검색하기 때문**이다.



## 객체 리터럴 방식으로 생성했을 때 프로토타입 체인

```javascript
var developer = {
    name : 'BKJang',
    age : 25,
    sex : 'male'
};

console.log(developer.__proto__ === Object.prototype); //1.true
console.log(Object.prototype.constructor === Object); // 2.true
console.log(Object.__proto__ === Function.prototype); //3.true
console.log(Function.prototype.__proto__ === Object.prototype); //4.true
```


![JavaScript](https://bkdevlog.netlify.com/assets/img/prototype_literal.png)



`developer` 객체와 `Function.prototype` 객체의 **프로토타입 객체는 `Object.prototype` 객체**다.

> 객체리터럴 방식으로 객체를 생성하면, 해당 객체의 프로토타입 객체는 `Object.prototype` 객체다. 좀 더 자세히 설명하면, 객체리터럴 방식으로 객체를 생성하면 `Object()`생성자 함수를 통해 객체가 생성되기 때문에 해당 객체의 프로토타입 객체는 `Object.prototype`객체가 된다.


## 생성자 함수를 생성했을 때 프로토타입 체인



```javascript
function Developer(name) {
    this.name = name;
}

var web = new Developer('BKJang');

console.log(web.__proto__ === Developer.prototype); //1.true
console.log(Developer.prototype.__proto__ === Object.prototype); //2.true
console.log(Developer.prototype.constructor === Developer); //3.true
console.log(Developer.__proto__ === Function.prototype); //4.true
console.log(Function.prototype.__proto__ === Object.prototype); //5.true
```

`Developer.prototype` 객체와 Developer() 생성자 함수의 프로토타입 객체인 `Function.prototype` 객체의 **프로토타입 객체는 `Object.prototype` 객체**다.



![JavaScript](https://bkdevlog.netlify.com/assets/img/prototype_Func.png)



### 프로토타입 체인의 종점(End of prototype chain)

> 객체 리터럴 방식으로 객체를 생성하든 생성자 함수를 이용해 객체를 생성하든 **결국 모든 객체의 부모 객체(프로토타입 객체)는 `Object.prototype` 객체**다. 이 때 `Object.prototype` 객체를 **프로토타입 체인의 종점**이라 한다.



## 프로토타입 객체의 확장



프로토타입 객체 역시 객체다. 따라서, 객체의 **프로퍼티를 동적으로 추가하거나 삭제할 수 있다.**

```javascript
function Developer(name) {
    this.name = name;
}

var web = new Developer('BKJang');

web.printAge(25); // Uncaught TypeError: web.printAge is not a function
```

위의 코드의 결과를 보면 **web객체에서 `printAge()`라는 메서드가 없기 때문에** 에러가 나는 것을 볼 수 있다.

```javascript
function Developer(name) {
    this.name = name;
}

var web = new Developer('BKJang');

Developer.prototype.printAge = function(age) {
    console.log('The age of this developer is', age);
};

web.printAge(25); // The age of this developer is 25
```

web 객체의 프로토타입 객체(부모 객체)인 `Developer.prototype` 객체에 `printAge(age)`라는 메서드를 추가했다.

이에 따라 **web 객체에서 `printAge(age)`메서드에 접근하면 결과 값을 출력**하는 것을 볼 수 있다.



![JavaScript](https://bkdevlog.netlify.com/assets/img/prototype_extenstion.png)



## 기본 데이터 타입의 확장



자바스크립트에서 **숫자, 문자열과 같은 기본 데이터 타입에서 사용되는 표준 메서드의 경우 `Number.prototype`과 `String.prototype` 객체에 정의**되어 있다.

```javascript
var str = 'hello world';

str.printStr = function(text) {
    console.log(text);
};

str.printStr('This is the test'); //Uncaught TypeError: str.printStr is not a function
```
원시 데이터 타입인 문자열의 경우에는 객체가 아니기 때문에 프로퍼티를 동적으로 추가할 수 없다.

그렇다면, 위에서 str 변수에 printStr 메서드를 동적으로 추가하는 코드에서는 왜 에러가 발생하지 않을까?

그 이유는 **기본 데이터 타입으로 프로퍼티나 메소드를 호출하면 기본 데이터 타입과 연관된 객체로 일시적으로 변환되어 프로토타입 객체를 공유하게 되기 때문**이다.

```javascript
var str = 'hello world';

String.prototype.printStr = function(text) {
    console.log(text);
};

str.printStr('This is the test'); //This is the test
'this is string'.printStr('This is the test'); //This is the test
```
문자열 타입의 경우, `String.prototype` 객체에 표준 메서드가 정의 되어있기 때문에 **해당 객체에 메서드를 추가해주면 기본 데이터 타입에서도 해당 메서드를 사용할 수 있다.**

```javascript
var str = 'hello world';

String.prototype.printStr = function(text) {
    console.log(text);
};

console.log(str.__proto__ === String.prototype); //1.true
console.log(String.prototype.__proto__ === Object.prototype); //2.true
console.log(String.prototype.constructor === String); //3.true
console.log(String.__proto__ === Function.prototype); //4.true
console.log(Function.prototype.__proto__ === Object.prototype); //5.true

str.printStr('This is the test'); //This is the test
```



![JavaScript](https://bkdevlog.netlify.com/assets/img/prototype_extenstion_primitive.png)



## 프로토타입 객체의 변경



자바스크립트에서 특정 객체는 **부모 객체인 프로토타입 객체를 임의로 변경할 수 있다.**

```javascript
function Developer(name) {
    this.name = name;
}

var web = new Developer('BKJang');

Developer.prototype = { age : 25 };

var android = new Developer('YAKim');

console.log(web.age); //undefined
console.log(android.age); //25

console.log(web.constructor); //Developer(name)
console.log(android.constructor); //Object()
```


* **변경 전 :** 파란색 번호
* **변경 후 :** 주황색 번호

![JavaScript](https://bkdevlog.netlify.com/assets/img/prototype_change.png)




**프로토타입 객체를 변경하기 전,** web객체의 `constructor`는 프로토타입 체이닝에 따라 **`Developer()`생성자 함수**를 가리킨다.

**프로토타입 객체를 변경한 후,** android객체의 `constructor`는 **`Object()` 함수**를 가리킨다.

프로토타입 객체가 변경되면서 **`Developer.prototype` 객체의 `constructor` 프로퍼티와 `Developer()` 생성자 함수의 연결이 깨진다.**

이에 따라 **프로토타입 체인이 동작하고** android 객체의 `constructor`는 `Object.prototype` 객체의 `constructor` 프로퍼티가 가리키는 **`Object()` 함수**가 되는 것이다.



> * 프로토타입 객체를 변경하기 전과 후의 프로토타입 링크([[Prototype]] 프로퍼티)는 **각각 다른 프로토타입 객체와 바인딩 된다.**
> * 프로토타입 객체를 변경한 후에는, **프로토타입 객체의 constructor 프로퍼티와 생성자 함수와의 연결이 깨진다.**



## 프로토타입 체인의 동작 조건



> 프로토타입 체인은 객체의 특정 프로퍼티에 접근할 때, 그 프로퍼티가 해당 객체에 없는 경우 동작한다.

```javascript
function Developer(name) {
    this.name = name;
}

Developer.prototype.age = 25;
Developer.prototype.sex = 'male';

var web = new Developer('BKJang');
var android = new Developer('YAKim');

android.sex = 'female';

console.log(web.age); //1.25
console.log(web.sex); //2.male

console.log(android.age); //1.25
console.log(android.sex); //3.female
```


![JavaScript](https://bkdevlog.netlify.com/assets/img/prototype_chaining_condition.png)



> 1. `web` 객체에는 age와 sex 프로퍼티가 없기 때문에 **프로토타입 체인에 따라 `Developer.prototype` 객체의 `age`와 `sex` 프로퍼티에 접근**하고 있다.

> 2. `android` 객체에는 age 프로퍼티는 없지만 sex 프로퍼티는 있기 때문에 **`sex` 프로퍼티의 경우엔 프로토타입 체인이 동작하지 않고 android 객체의 `sex` 프로퍼티 값을 반환**하고 있다.


#### Reference
- [인사이드 자바스크립트 (송형주, 고형준)](http://www.yes24.com/Product/Goods/37157296)