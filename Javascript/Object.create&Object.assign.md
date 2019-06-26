# Object.create() & Object.assign()

## Object.create()

```js
Object.create(prototype_object, propertiesObject)
```

`Object.create()`는 기준이 되는 Object를 prototype으로 만들고 **새로운 객체를 생성**한다.

`Object.create()`는 주로 객체를 상속하기 위해 사용하는 메서드다. 첫 번째 인자를 상속하며, 두 번째 인자의 속성들을 추가로 구성한다.

<br/>

### 두번째 인자 - 속성의 구성요소

공통의 구성요소는

1. **`configurable`** 속성의 값을 변경할 수 있고, 삭제할 수도 있다면 `true`로 설정한다. 기본값은 `false`.
2. **`enumerable`** 속성이 대상 객체의 속성 열거 시 노출이 되게 하려면 `true`로 설정한다. 기본값은 `false`.

데이터 서술을 하는 데 사용되는 키는

1. **`value`** 속성값. 아무 JavaScript 값(숫자, 객체, 함수 등)이나 가능하다. 기본값은 `undefined`
2. **`writable`** 할당 연산자로 속성의 값을 바꿀 수 있다면 `true`로 설정한다. 기본값은 `false`.

접근자 서술을 하는 데 사용되는 키는

1. **`get`** 속성 접근자로 사용할 함수, 접근자가 없다면 `undefined`. 
   - 속성에 접근하면 이 함수를 매개변수 없이 호출하고, 반환 값이 속성의 값이 된다. 이때 `this` 값은 이 속성을 가진 객체이다. 기본값은 `undefined`.
2. **`set`** 속성 설정자로 사용할 함수, 설정자가 없다면 `undefined`. 
   - 속성에 값을 할당하면 이 함수를 하나의 매개변수로 호출한다. 이때 `this` 값은 이 속성을 가진 객체이다. 기본값은 `undefined`.

**`Object.create()`의 2번째 인자는 `Object.defineProperties()`를 따른다.**

<br/>

---

위의 구성요소는 이전에 사용하던 `Object.defineProperties()`에서 나오는 개념이다. 그 전에 `Object.defineProperties()`의 단일 설정 함수인 `Object.defineProperty()`를 살펴보자

<br/>

### Object.defineProperty()

`Object.defineProperty()`는 객체에 직접 새로운 속성을 정의하거나 이미 존재하는 속성을 수정한 후, **그 객체를 반환한다.**

```js
Object.defineProperty(obj, prop, descriptor)
```

- **`obj`** : 속성을 정의할 객체.
- **`prop`** : 새로 정의하거나 수정하려는 속성의 이름 또는 `Symbol`.
- **`descriptor`** : 새로 정의하거나 수정하려는 속성을 기술하는 객체.

아래의 예제는 자세히 보아야 한다. 여러 개념이 들어가 있는 예제이다.

```js
const obj = {
  age: 27, 
  country : 'seoul'
}
let oldCountry = 'Yongin'

console.log('init str', obj) // init str {age: 27, country: "seoul"}

const descriptor = {
  enumerable: true,
  configurable: true,
  get: function(){
    return '???'
  },
  set: function(value){
    oldCountry = value
  }
}

const newObj = Object.defineProperty(obj, 'country', descriptor) // 기존의 속성에서 새로운 속성을 정의
console.log('obj values => ',obj, obj.age, obj.country) // obj values =>  {age: 27} 27 ???
console.log('newObj values => ',newObj, newObj.age, newObj.country) // newObj values =>  {age: 27} 27 ???
console.log('oldCountry => ', oldCountry) // oldCountry =>  Yongin

newObj.age = 28
newObj.name = 'sNyung'
newObj.country = 'Re Seoul'
console.log('After newObj && obj values are => ', obj, obj.age, obj.country) // After newObj && obj values are =>  {age: 28, name: "sNyung"} 28 ???
console.log('oldCountry => ', oldCountry) // oldCountry =>  Re Seoul
```

<br/>

### Object.defineProperties()

```js
Object.defineProperties(obj, props)
```

`Object.defineProperty()`의 복수 버전이다.

```js
Object.defineProperties(obj, {
  'property1': {
    value: true,
    writable: true
  },
  'property2': {
    value: 'Hello',
    writable: false
  }
});
```
---

### Object.create() - Sample 1

```js
const prototypeObject = {
  fullName: function(){
    return this.firstName + " " + this.lastName		
  }
}

const person = Object.create(prototypeObject, {
  'firstName': {
    value: "sNyung", 
    writable: true, 
    enumerable: true
  },
  'lastName': {
    value: "jo",
    writable: true,
    enumerable: true
  }
})
    
console.log(person) // {firstName: "sNyung", lastName: "jo"}
```

![image](https://user-images.githubusercontent.com/24274424/59965008-b7c50280-9543-11e9-805e-4fcc55430d0e.png)

<br/>

### New VS Object.create()

`Object.create()`와 `new Constructor()`는 꽤 비슷하지만, 다른 점이 있다. 다음은 이 둘의 차이를 보여주는 예제이다.

```js
function Dog(){
  this.pupper = 'Pupper';
};
Dog.prototype.pupperino = 'Pups.';

const maddie = new Dog();
const buddy = Object.create(Dog.prototype);

// Object.create()
console.log(buddy.pupper); // undefined
console.log(buddy.pupperino); // Pups.

// New
console.log(maddie.pupper); // Pupper
console.log(maddie.pupperino); // Pups.
```

성능상으로 new 생성자를 사용하는 것이 좋다고 한다. 확실히 성능 테스트를 해보면 알 수 있다.
<br/>

### 성능 테스트

[https://jsperf.com/snyung-new-vs-object-create](https://jsperf.com/snyung-new-vs-object-create)

```js
function Obj() {
  this.p = 1;
}

Obj.prototype.chageP = function(){
  this.p = 2
};

console.time('Object.create()');
var obj;
for (let i = 0; i < 10000; i++) {
  obj = Object.create(propObj);
}
console.timeEnd('Object.create()');
// Object.create(): 약 12.994140625ms

console.time('constructor function');
var obj2;
for (let i = 0; i < 10000; i++) {
  obj2 = new Obj();
}
console.timeEnd('constructor function');
// new: 약 2.379150390625ms
```

<br/>

### Polyfill

```js
Object.create = (function () {
  function obj() {};

  return function (prototype, propertiesObject) {
    // 첫 번째 인자를 상속하게 한다.
    obj.prototype = prototype || {};

    if (propertiesObject) {
      // 두 번째 인자를 통해 속성을 정의한다.
      Object.defineProperties(obj.prototype, propertiesObject);
    }

    return new obj();
  };
})();

//--------------TEST---------------

const Vehicle = function(){
  this.wheel = 4
}

Vehicle.prototype.getWheel = function() {
  return this.wheel
}

const Motorcycle = Object.create(Vehicle.prototype, {'wheel': {value: 3, writable: true}});
console.log(Motorcycle)
```

<br/>

### Compat Table

![image](https://user-images.githubusercontent.com/24274424/59957350-70525e00-94d2-11e9-97ea-a483763149d1.png)

<br/>

## Object.assign()

`Object.assign()` 메서드는 열거할 수 있는 하나 이상의 출처 객체로부터 대상 객체로 속성을 복사할 때 사용한다. 대상 객체를 반환한다.

- **`target`** : 대상 객체.
- **`sources`** : 하나 이상의 출처 객체.

```js
const obj = { a: 1 };
const copy = Object.assign({}, obj);

console.log(copy); // { a: 1 }
```

`Object.assign()`은 첫 번째 인자로 들어오는 target을 대상으로 두 번째 이후로 들어오는 인자를 병합할 때 사용한다. 
<br/>

### 예시

같은 properties가 들어올 경우 마지막에 들어온 값이 덮어쓰게 된다.

```js
// app.js

let o1 = { a: 21, b: 22, c: 24 };
let o2 = { b: 23, c: 25 };
let o3 = { c: 26 };

let finalObj = Object.assign({}, o1, o2, o3);
console.log(finalObj); // {a: 21, b: 23, c: 26}
```

그러나 안타깝게도 `Object.assign()`는 ES6 문법의 Spread Operator가 나오면서 관심이 많이 줄어들게 되었다.
같은 기능을 포함하고 있는 ES6 문법의 Spread는 숙련도에 따라 다양하게 사용될 수 있다.

가장 많이 사용되는 기능 3가지를 포함하고 있는 예시를 보게 되면,

```js
// Create Function with REST
const add = function(...arg){
  console.log('arg', arg)
  arg.map(e => console.log(e))
}

// Create Object
const obj = { a : 1, b : 2, c: 3, d: 4}
// Create Arr + Spread
const arr = ['a', ...Object.values(obj), 'b', 'c']
console.log(...arr)
add(...arr)

const {a,b, ...rest} = obj
console.log(a, b, rest)
```

위와 같이 `...`은 사용 방법에 따라 다양하게 사용될 수 있다. 더 많은 기능을 찾아보기를 바란다.
<br/>

### Polyfill

```js
Object.defineProperty(Object, "assign", {
  value: function assign(target, varArgs) { // .length of function is 2
    'use strict';
    if (target == null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) { // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  },
  writable: true,
  configurable: true
});
```

<br/>

### Compat Table

![image](https://user-images.githubusercontent.com/24274424/59957367-9ed03900-94d2-11e9-80af-cfcad4784f78.png)

<br/>

#### Reference

- [Object.create() - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
- [Object.create in JavaScript](https://hackernoon.com/object-create-in-javascript-fa8674df6ed2)
- [Object.create(): the New Way to Create Objects in JavaScript](https://www.htmlgoodies.com/beyond/javascript/object.create-the-new-way-to-create-objects-in-javascript.html)
- [Basic Inheritance with Object.create](http://adripofjavascript.com/blog/drips/basic-inheritance-with-object-create.html)
- [Understanding the difference between Object.create() and the new operator.](https://medium.com/@jonathanvox01/understanding-the-difference-between-object-create-and-the-new-operator-b2a2f4749358)
- [JavaScript Object Creation: Patterns and Best Practices](https://www.sitepoint.com/javascript-object-creation-patterns-best-practises/)
- [object-create.md - wonism](https://github.com/wonism/TIL/blob/master/front-end/javascript/object-create.md)
- [Object.assign() = MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
