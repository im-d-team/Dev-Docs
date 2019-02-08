# JavaScript의 this

<br/>

자바스크립트에서 `this`의 바인딩은 함수의 호출 방식에 따라 결정된다.

- **객체의 메서드 호출**
- **일반 함수 호출**
- **생성자 함수의 호출**
- **`call`과 `apply`를 이용한 `this` 바인딩**

<br/>

## 객체의 메서드 호출

```js
var obj = {
    organization : 'Im-D',
    sayHello : function() {
        return 'Welcome to ' + this.organization;
    }
}

console.log(obj.sayHello());
```

객체의 메서드를 호출할 때 `this`는 **해당 객체에 바인딩**된다.

<br/>

## 일반 함수 호출

```js
var organization = 'Im-D';

function sayHello() {
    var organization = 'Kyonggi';
    return 'Welcome to ' + this.organization
}

console.log(sayHello());
```

일반 함수를 호출할 때, 자바스크립트의 `this`는 **전역 객체(window 객체)에 바인딩** 된다.

<br/>

## 생성자 함수의 호출

```js
function Organization(name, country) {
    this.name = name;
    this.country = country;
}

var imD = new Organization('Im-D', 'South Korea');
var kyonggi = Organization('Kyonggi', 'South Korea');

console.log(imD);

console.log(kyonggi);
```

생성자 함수를 `new`키워드를 통해 호출할 경우, **새로 생성되는 빈 객체에 바인딩** 된다. 단, `new`키워드를 사용하지 않으면 `thsi`는 전역객체에 바인딩된다.

<br/>

## `call`과 `apply`를 활용한 `this`바인딩

```js
function Organization(name, country) {
    this.name = name;
    this.country = country;
}

var obj = {};

Organization.apply(obj, ['ImD', 'South Korea']);

console.log(obj);

Organization.call(obj, 'Kyonggi', 'South Korea');

console.log(obj);
```

`call`과 `apply`을 사용할 경우 **특정 객체에 `this`를 바인딩** 시킬 수 있다.

```js
function sayHello() {
    console.log(arguments);
    var args = Array.prototype.slice.apply(arguments);
    console.log(args);
}    

sayHello('Im-D', 'South Korea');
```

또한 `call`이나 `apply`메서드를 활용하여 **유사배열 객체를 일반 배열로 바꿀 수도 있다.**

<br/>

## ES6의 등장

<br/>

### 화살표 함수

---

```js
var obj = {
    organization : 'Im-D',
    outerFunc : function() {
        var that = this;
        console.log(this.organization);

        innerFunc = function() {
            console.log(that.organization);
            console.log(this.organization);
        }

        innerFunc();
    }
}

obj.outerFunc();
```

```js
var obj = {
    organization : 'Im-D',
    outerFunc : function() {
        console.log(this.organization);

        innerFunc = () => {
            console.log(this.organization);
        }

        innerFunc();
    }
}

obj.outerFunc();
```

`ES5`에서는 원래 내부 함수에서의 `this`는 `window`객체에 바인딩 되었기 때문에 `var that=this;`와 같이 선언하여 `that`에 `this`를 할당하고 내부 함수에서는 `that`을 활용하는 방식을 사용했었다.

하지만, `ES6`에서 등장한 **화살표 함수에서는 this가 무조건 상위 스코프의 this를 가리킨다.**<br/>
이에 따라 내부함수에서 `var that=this;`와 같은 구문을 사용할 필요가 없다.<br/>
이처럼 정적으로 `this`가 바인딩되기 때문에 **`Lexical this`**라고 한다.

<br/>

### Spread Operator

---

`this`와는 크게 관계없지만 위에서 `apply`를 이용하여 유사배열객체인 `arguments`객체를 배열로 바꾸는 예제를 `ES6`에서는 좀 더 쉽게 구현할 수 있다.

```js
function sayHello() {
    console.log(arguments);
    const args = [...arguments];
    console.log(args);
}    

sayHello('Im-D', 'South Korea');
```

위와 같이 **`ES6`의 `Spread Operator(...)`를 사용하면 굳이 `call`과 `apply`같은 함수를 사용하지 않고도 유사배열객체를 배열로 변환**할 수 있다.

---

#### Reference

- [함수의 호출과 this](https://bkdevlog.netlify.com/posts/this-of-js)
