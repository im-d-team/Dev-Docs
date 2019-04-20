# 클래스(class)

기본적으로 자바스크립트는 프로토타입 기반의 객체지향언어다. `ES6`부터 추가된 `class`문법은 기존의 `ES5`까지 사용하던 객체지향 설계 방식의 **Syntatic Sugar**다.

<br/>

## ES5 vs ES6

```javascript
//ES5
var Book = (function() {
    var name = '';
    var category = '';

    //생성자 함수
    function Book(arg1, arg2) {
        name = arg1;
        category = arg2;
    }

    Book.prototype.getInfo = function() {
        console.log('Name : ' + name + ', Category : ' + category);
    }

    return Book;
}());

var dom = new Book('DOM을 깨우치다', 'Web');

dom.getInfo();
```

```javascript
//ES6
class Book {
    constructor(arg1, arg2) {
        this.name = arg1;
        this.category = arg2;
    }

    getInfo() {
        console.log(`Name : ${this.name}, Category : ${this.category}`);
    }
}

var dom = new Book('DOM을 꺠우치다', 'Web');

dom.getInfo();
```

<br/>

## class는 window에 할당되지 않으며 생성자를 반환한다. 생성자는 생략할 수 있다.

```javascript
class Developer {

}

console.log(window.Developer); //undefined
console.log(Developer === Developer.prototype.constructor); //true
```

생성자를 생략하면 빈 객체를 생성하고 `property`를 동적으로 생성할 수 있다.

```javascript
class Developer {

}

const jang = new Developer();

console.log(jang); //Developer {}

jang.nation = 'Korea';

console.log(jang); //Developer {nation: "Korea"}
```

<br/>

## class내부의 몸체에는 메서드만 선언 가능하며 property의 선언과 초기화는 생성자에서 이뤄진다.

```javascript
class Foo {
    const name = ''; //Uncaught SyntaxError: Unexpected identifier
}
```

```javascript
class Bar {
    constructor(name = '') {
        this.name = name;
    }
}

const bar = new Bar('BKJang');
console.log(bar); //Bar {name: "BKJang"}
```

## class에서는 getter와 setter를 구현할 수 있다.

```javascript
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
        this.name = `Developer ${name}`;
    }
}

const person = new Person('BKJang');

console.log(person.personName); //BKJang
person.personName = 'BKJang';
console.log(person.personName); //Developer BKJang
```

- 프로퍼티에 접근하면 `getter`가 호출된다.
- 프로퍼티에 값을 할당하면 `setter`가 호출된다.

<br/>

## Static 메서드를 정의할 수 있다.

- `class`의 **Static 메서드**는 인스턴스로는 접근할 수 없고, 클래스 명으로 접근한다.

```javascript
class Foo {
    constructor(name) {
        this.name = name;
    }

    static staticMethod() {
        console.log(this);
    }
}

const bkjang = new Foo('BKJang');

Foo.staticMethod(); //class Foo { ... }
bkjang.staticMethod(); //bkjang.staticMethod is not a function
```

- `class`의 **Static 메서드**내부에서는 `this`를 통해 property에 접근할 수 없다.

```javascript
class Bar {
    constructor(name) {
        this.name = name;
    }
    
    returnThis() {
        console.log(`returnThis : ${this}`);
    }

    static staticMethod() {
        console.log(`staticMethod : ${this}`);
        console.log(this.name);
    }
}

const bkjang = new Bar('BKJang');

bkjang.returnThis(); //returnThis : [object Object]
Bar.staticMethod();
```

- `class`의 **Static 메서드**는 `prototype`에 추가되지 않는다.

```javascript
class Bar {
    constructor(name) {
        this.name = name;
    }
    
    returnThis() {
        console.log(`returnThis : ${this}`); 
    }

    static staticMethod() {
        console.log(`staticMethod : ${this}`);
        console.log(this.name);
    }
}

const bkjang = new Bar('BKJang');

console.log(bkjang.returnThis === Bar.prototype.returnThis); //true
console.log(Bar.staticMethod === Bar.prototype.staticMehtod); //false
```

<br/>

## class는 상속을 구현할 수 있다.(`extends`, `super`)

```javascript
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

console.log(person); //Person {name: "SHJo", sex: "Male"}
console.log(developer); //Developer {name: "BKJang", sex: "Male", job: "Developer"}

console.log(person.getInfo()); //Name : SHJo, Sex : Male

console.log(developer.getName()); //Name : BKJang
console.log(developer.getSex()); //Sex : Male
console.log(developer.getJob()); //Job : Developer
console.log(developer.getInfo()); //Name : BKJang, Sex : Male , Job: Developer

console.log(developer instanceof Developer); //true
console.log(developer instanceof Person); //true
```
<br/>

---

#### Reference

- [[ES6] 6. 클래스(Class)](https://bkdevlog.netlify.com/posts/class)
- [MDN Web Docs - Classes](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Classes)
