# Class
 
 ES6에 Class 문법이 추가되었다. Class는 특별하게 새로 만들어진 것이 아니다. 기존에 존재하고 있던 상속과 생성자 함수를 기본으로 한 `Proptotype`의 **syntactic sugar**이다.
 
 Class 문법이 나오기 전 사람들은 JavaScript를 OOP답게 사용하고 싶어 했다. 그래서 다양한 방법을 사용해서 구현했다.

<br/>

## Constructor Function

> constructor function은 일반 function이며, 설명상 명확하게 나타내기 위하여 대문자를 사용하였습니다.

Class 문법이 생기기 전에는 JavaScript에서는 모든 것을 Function으로 만들어야 했다. 그래서 사람들이 Class처럼 사용하기 위해서 Constructor function을 사용해서 비슷하게 사용하였다.

```js
function Vehicle(make, model, color) {
    this.make = make,
    this.model = model,
    this.color = color,
    this.getName = function () {
        return this.make + " " + this.model;
    }
}
```

위와 같이 함수를 선언함으로써 Java에서 사용하는 Class와는 모양새는 다르지만, Class에 좀 더 가까워졌다. 이제 우리는 `Vehicle`이라는 것을 선언했으니 인스턴스를 만들어보자

```js
const car = new Vehicle("Toyota", "Corolla", "Black");
const car2 = new Vehicle("Honda", "Civic", "White");
```

위와 같이 `new` 키워드를 사용해서 인스턴스를 만들 수 있다. 

**그런데 문제가 있다.** 

새로운 `Vehicle()`을 만들 때 JavaScript 엔진은 두 객체의 각각에 대한 Vehicle Constructor 함수 사본을 만든다. 즉 각각의 인스턴스의 공간이 만들어지는 것이다. 또한 속성과 메소드는 `Vehicle()`의 모든 인스턴스에 복사가 된다. 

이게 왜 문제가 되는가? 라고 생각할 수 있다. 문제는 Constructor 함수의 멤버 함수(메서드)가 **모든 객체에서 반복된다는 것이다.**

다른 문제는 **기존의 만든 객체에 새로운 속성이나 메서드를 추가 하지 못한다는 것이다.**

```js
car2.year = "2019"
```

위와 같이 추가를 하더라도 다른 인스턴스에는 새로운 속성이나 메서드는 따로따로 넣어주어야 한다.

```js
function Vehicle(make, model, color, year) {
    this.make = make,
    this.model = model,
    this.color = color,
    this.year = year, // 위와 같이 추가를 해야한다.
    this.getName = function () {
        return this.make + " " + this.model;
    }
}
```

<br/>

## Prototype

JavaScript는 내부적으로 새로운 함수가 만들어지면 JavaScript엔진이 `prototype` 속성을 추가해준다.

![image](https://user-images.githubusercontent.com/24274424/58709477-3b804900-83f5-11e9-882d-f6dbddae0254.png)

`prototype` 중 `__proto__` 속성은 **dunder proto** 라고 불리고, Constructor 함수의 `prototype` 속성을 가리킨다.

생성자 함수의 새로운 인스턴스를 만들어질 때마다 **dunder proto**는 다른 속성, 메서드와 함께 인스턴스에 복사가 된다.

![image](https://user-images.githubusercontent.com/24274424/58709719-b5b0cd80-83f5-11e9-93fc-b5ac236dca0f.png)

`prototype` 객체는 아래와 같이 Constructor 함수의 속성, 메서드를 추가 가능하며 Constructor 함수의 모든 인스턴스에서 사용할 수 있다.

```js
Vehicle.prototype.year = "2019"
```

![image](https://user-images.githubusercontent.com/24274424/58710008-569f8880-83f6-11e9-8754-071bc6f58d3c.png)

이 접근법에는 주의사항이 있다. `prototype` 속성과 메서드는 Constructor 함수의 모든 인스턴스와 공유를 한다. 인스턴스의 기본 속성을 변경되면, 모든 인스턴스가 아닌 해당 인스턴스에서만 변경이 이루어진다.

다른 한 가지는 참조 유형 속성이 모든 인스턴스 간에 항상 공유되는 것이다. 하나의 인스턴스에서 수정하면 모든 인스턴스의 참조 유형 속성이 수정된다.

![image](https://user-images.githubusercontent.com/24274424/58710329-0674f600-83f7-11e9-9d5d-6438ed6eec9c.png)

<br/>

## Class

지금까지 Constructor 함수와 `prototype`에 대해 알아봤다. 이제 Class에 대해 알아보자. 위의 2개를 살펴보면 좀 더 쉽게 이해할 수 있다. Class는 이전의 것들과 크게 차이가 나는 것이 없기 때문이다. 

JavaScript 클래스는 `prototype` 기능을 활용하여 Constructor 함수를 작성하는 새로운 방법일 뿐이다.(**syntactic sugar**)

```js
class Vehicle {
    constructor(make, model, color) {
        this.make = make;
        this.model = model;
        this.color = color;
    }

    getName() {
        return this.make + " " + this.model;
    }
}
```
    
위와 같이 Class를 생성할 수 있다. 

Class도 마찬가지로 우리가 앞서 만든 것과 동일하게 `new` 키워드를 사용하여 인스턴스를 생성한다.

```js
const car = new Vehicle("Toyota", "Corolla", "Black");
```

Class로 만든 것을 기존 방법으로 다시 작성한다면 아래와 같을 것이다.

```js
function Vehicle(make, model, color) {
    this.make = make;
    this.model = model;
    this.color = color;
}

Vehicle.prototype.getName = function () {
    return this.make + " " + this.model;
}
    
const car = new Vehicle("Toyota", "Corolla", "Black");
```
    

이것은 Class가 Constructor 함수를 수행하는 새로운 방법이라는 것을 증명한다. 더욱 실제 Class와 비슷하게 만들기 위해서 도입된 몇 가지 규칙이 있다.

#### 생성자가 작동하려면 `new` 키워드가 필요하다.

```js
const car = new Vehicle("Toyota", "Corolla", "Black");
````

`new`를 사용하지 않고 만들 경우 아래와 같은 에러가 발생한다.

#### Class의 메서드는 non-enumerable 하다. 

JavaScript에서 객체의 각 속성에는 해당 속성에 대해 `enumerable flag` 가 있다. Class는 `prototype`에 정의된 모든 메서드에 대해 이 `flag`를 `false`로 설정한다.

#### Class에 생성자를 추가하지 않으면 기본 빈 `constructor()`가 자동으로 추가된다.

```js
constructor(){ }
```

####  Class 안의 코드는 항상 **`strict` 모드** 이다. 

이것은 오류가 없는 코드를 작성하거나, 잘못된 입력 또는 코드 작성 중 구문 오류 또는 다른 곳에서 참조된 실수로 일부 코드를 제거하여 코드를 작성하는 데 도움을 준다.

#### Class는 호이스팅이 되지 않는다.

![image](https://user-images.githubusercontent.com/24274424/58710983-8059af00-83f8-11e9-91ae-f6b3fb887146.png)

#### Class는 Constructor 함수나 객체 리터럴과 같은 속성 값 할당을 허용하지 않는다. 

함수 또는 `getter/setter` 만 가질 수 있다. `property:value` 할당은 불가능하다.

<br/>

### Class Features

#### `constructor`

`constructor`는 함수 자체를 정의하는 **Class 선언의 특수 함수**이다. 인스턴스를 새로 만들면 `constructor()`가 자동으로 호출된다.

```js
const car = new Vehicle("Honda", "Accord", "Purple"); // call constructor
```

`constructor`는 `super` 키워드를 사용하여 확장된 Class `constructor`를 호출할 수 있다.

**하나 이상의 생성자 함수를 가질 수 없다.**

#### Static Methods

Static Methods는 `prototype` 에 정의된 Calss의 다른 메서드와는 다르게 `prototype`이 아닌 Class 자체의 함수이다.

Static Methods는 `static` 키워드를 사용하여 선언하며 주로 유틸리티 함수를 만드는 데 사용된다. Class의 인스턴스를 만들지 않고 호출 가능하다. 

```js
class Vehicle {
    constructor(make, model, color) {
        this.make = make;
        this.model = model;
        this.color = color;
    }

    getName() {
        return this.make + " " + this.model;
    }

    static getColor(v) {
        return v.color;
    }
}

let car = new Vehicle("Honda", "Accord", "Purple");

Vehicle.getColor(car); // "purple"
```

**정적 메서드는 Class 인스턴스에서 호출할 수 없다.**

#### Getter / Setter

getter/setter를 사용하여 속성값을 가져오거나 속성값을 설정할 수 있다. 

```js
class Vehicle {
    constructor(model) {
        this.model = model;
    }
    
    get model() {
        return this._model;
    }

    set model(value) {
        this._model = value;
    }
}
```

getter/setter는 Class `prototype`에 정의된다.

![image](https://user-images.githubusercontent.com/24274424/58711552-bb101700-83f9-11e9-8298-959c243f3989.png)

#### Subclassing

Subclassing은 Javascript Class에서 상속을 구현할 수 있는 방법으로 `extends` 키워드는 Class의 하위 클래스를 만드는 방법이다.

```js
class Vehicle {
    constructor(make, model, color) {
        this.make = make;
        this.model = model;
        this.color = color;
    }

    getName() {
        return this.make + " " + this.model;
    }
}

class Car extends Vehicle{
    getName(){
        return this.make + " " + this.model +" in child class.";
    }
}

const car = new Car("Honda", "Accord", "Purple");

car.getName(); // "Honda Accord in child class."
```


`getName()`를 호출하면 자식클래스의 함수가 호출된다.

가끔 부모의 함수를 사용해야 할 때가 있다. 그럴 때는 `super` 키워드를 사용하면 된다.

```js
class Car extends Vehicle{
    getName(){
        return super.getName() +"  - called base class function from child class.";
    }
}
```

- 옛날 방식인 `prototype`을 사용해서 상속 구현해보기

```js
function Vehicle(make, model, color) {
    this.make = make;
    this.model = model;
    this.color = color;
}

Vehicle.prototype.getName = function() {
    return this.make + " " + this.model;
};

function Car(make, model, color) {
    this.make = make;
    this.model = model;
    this.color = color;
}
Object.setPrototypeOf(Car, Vehicle);
Object.setPrototypeOf(Car.prototype, Vehicle.prototype);
Car.prototype.getName = function() {    
    return this.make + " " + this.model +" in child class.";
};

const vehicle = new Vehicle("Honda", "Accord", "Purple");
const car = new Car("Honda", "Accord", "Purple");

console.log(vehicle.getName()); // Honda Accord
console.log(car.getName()); // Honda Accord in child class.
```

<br/>

## 팩토리 디자인 패턴 간단히 살펴보기

위의 코드를 아래와 같이 변경을 함으로써 `new` 키워드를 사용하지 않고 매번 새로운 객체를 만들어서 전달받는다. 

```js
const Vehicle = function(make, model, color){
    const newVehicle = {};
    newVehicle.make = make;
    newVehicle.model = model;
    newVehicle.color = color;
    
    newVehicle.getName = function(){
        return this.make + " " + this.model;
    }
    return newVehicle;
};

const vehicle = Vehicle("Honda", "Accord", "Purple");

console.log(vehicle.getName()) //Honda Accord
```

---

#### Reference

- [Understanding Classes in JavaScript](https://www.digitalocean.com/community/tutorials/understanding-classes-in-javascript)
- [How ES6 classes really work and how to build your own](https://medium.com/@robertgrosse/how-es6-classes-really-work-and-how-to-build-your-own-fd6085eb326a)
- [Understand the Factory Design Pattern in plain JavaScript](https://medium.com/front-end-weekly/understand-the-factory-design-pattern-in-plain-javascript-20b348c832bd)
- [Javascript Classes — Under The Hood](https://medium.com/tech-tajawal/javascript-classes-under-the-hood-6b26d2667677)
