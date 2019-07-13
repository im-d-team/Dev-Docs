# 인터페이스(Interface)

## 인터페이스는 타입으로 사용할 수 있다.

`Typescript`의 인터페이스는 변수의 타입으로 활용할 수 있다. 즉, 인터페이스에 지정된 프로퍼티를 가진 변수로 지정할 수 있다.

```ts
interface Developer {
    id : number;
    name : string;
    lang : string;
    skill : string;
}

let developer : Developer;

deveoper = { id : 1, name : 'BKJang', lang: 'Korean', skill : 'Typescript'};
```

위와 같이 변수의 타입으로서 인터페이스를 활용할 수 있다. 단, 해당 인터페이스 타입의 변수를 선언하여 값을 초기화 할 때는 해당 인터페이스를 준수하여야 한다.

<br/>

## 인터페이스는 함수의 타입으로 사용할 수 있다.

함수의 인터페이스는 타입이 선언된 파라미터 목록과 반환 타입을 정의한다. `Tyepscript`의 특성상 함수 인터페이스를 구현하는 함수는 인터페이스를 준수하여야 한다.

```ts
interface helloWorld {
    (name : string) : string;
}

const helloWorld : helloWorld = function (name : string) {
    return `${name} Hello!`;
}

console.log(helloWorld('BKJang')) // BKJang Hello!
```

<br/>

## 클래스는 인터페이스를 구현할 수 있다.

`Typescript`에서 클래스가 인터페이스의 구현체가 되는 것은 `Java`와 굉장히 유사하다. 즉, 클래스가 인터페이스를 `implements`하면 지정된 인터페이스를 반드시 구현하여 한다.<br/>
인터페이스는 메서드도 포함할 수 있다. 단, 모든 메서드는 추상 메서드이어야 한다. 클래스는 인터페이스에서 정의한 프로퍼티와 추상 메서드를 반드시 구현하여야 한다.

```ts
interface InterDeveloper {
    name : string;
    lang : string;
    printInfo() : void;
}

class Developer implements InterDeveloper {
    constructor (
        public name: string,
        public lang: string
    ) { }

    printInfo() {
        console.log(`Developer : ${this.name} / ${this.lang}`);
    }
}

function hello(devloper: InterDeveloper): void {
  devloper.printInfo();
}

const bkjang = new Developer('BKJang', 'Korean');
hello(bkjang); // Developer : BKJang / Korean
```

<br/>

## 인터페이스는 프로퍼티를 선택적 프로퍼티를 선언할 수 있다.

`Typescript`의 인터페이스에서 구현된 프로퍼티는 반드시 인터페이스의 형식을 준수하여야 하지만, `?`키워드를 통해 선택적으로 프로퍼티의 구현을 정할 수 있다.

```ts
interface Developer {
    id : number;
    name : string;
    lang : string;
    skill? : string;
}

const bkjang: Developer = {
    id : 1,
    name : 'BKJang',
    lang : 'Korean'
}

console.log(bkjang); // Developer { id : 1, name: BKJang, lang: Korean }
```

<br/>

## 덕 타이핑 (Duck Typing)

`TypeScript`에서는 해당 인터페이스에서 정의한 프로퍼티나 메서드를 가지고 있다면 그 인터페이스를 구현한 것으로 인정한다. 이것을 **덕 타이핑(duck typing)** 또는 **구조적 타이핑(structural typing)** 이라 한다.

```ts
interface Developer {
    helloworld() : void;    
}

class BKJang implements Developer { // 3
    helloworld() {
        console.log('BKJang Hello');
    }
}

class SHJo {
    helloworld() {
        console.log('SHJo Hello');
    }
}

function sayHello(helloworld: Developer): void { // 2
  helloworld.helloworld();
}

sayHello(new BKJang()); // BKJang Hello
sayHello(new SHJo()); // SHJo Hello
```

위의 코드를 보면 `SHJo`클래스는 인터페이스를 상속하고 있지 않지만 `sayHello`메서드를 실행했을 때 정상적으로 작동한다. 이처럼 인터페이스에서 구현된 메서드나 프로퍼티를 가지고 있다면 인터페이스를 구현한 것으로 인정하고 인터페이스의 구현체로서 해당 메서드나 프로퍼티를 실행한다. 이를 **덕 타이핑(Duck Typing)** 이라고 한다.

인터페이스는 개발 단계에서 도움을 주기 위해 제공되는 기능으로 자바스크립트의 표준이 아니다. 따라서 `Typescript`파일을 트랜스파일링하면 인터페이스 코드는 삭제된다.

아래는 위의 코드를 Javascript로 컴파일한 코드이며 인터페이스 코드가 삭제된 것을 확인할 수 있다.

```js
var BKJang = /** @class */ (function () {
    function BKJang() {
    }
    BKJang.prototype.helloworld = function () {
        console.log('BKJang Hello');
    };
    return BKJang;
}());
var SHJo = /** @class */ (function () {
    function SHJo() {
    }
    SHJo.prototype.helloworld = function () {
        console.log('SHJo Hello');
    };
    return SHJo;
}());
function sayHello(helloworld) {
    helloworld.helloworld();
}
sayHello(new BKJang()); // BKJang Hello
sayHello(new SHJo()); // SHJo Hello

```

---

#### Reference

- [Poiemaweb - 인터페이스](https://poiemaweb.com/typescript-interface)
- [Typescript : class vs interface](https://medium.com/front-end-weekly/typescript-class-vs-interface-99c0ae1c2136)
- [Classes vs Interfaces in TypeScript](https://ultimatecourses.com/blog/classes-vs-interfaces-in-typescript)
