# 화살표 함수

## 화살표 함수의 선언과 호출

**화살표 함수는 `function` 대신 `=>`를 사용**함으로써 좀 더 간결하게 함수를 선언할 수 있다.

또한 화살표 함수는 익명 함수로만 사용할 수 있기 때문에 **함수 표현식**을 사용한다.

익명함수와 함수 선언식, 표현식의 차이를 알고 싶다면 [다음](https://github.com/im-d-team/Dev-Docs/blob/master/Javascript/%ED%95%A8%EC%88%98%20%EC%84%A0%EC%96%B8.md)을 참고하면 좋을 것 같다.

```js
const foo = () => {...} //매개변수가 없을 때
const foo = x => {...} //매개변수가 하나일 때
const foo = (x, y) => {...} //매개변수가 여러 개일 때

const foo = x => { return x; }
const foo = x => x; // 함수의 블록이 한줄이라면 중괄호와 return을 생략

const sum = (x, y) => {
    return x + y;
}

console.log(sum(1, 2)); //3
```

```js
//ES5
var arr = ['JS', 'Java', 'Go'];
var foo = arr.map(function(element) {
    return { 'Lang' : element };
});

console.log(foo); //[{Lang: "JS"}, {Lang: "Java"}, {Lang: "Go"}]

//ES6
const arr = ['JS', 'Java', 'Go'];
const foo = arr.map(element => {
    return {'Lang' : element};
});

console.log(foo); //[{Lang: "JS"}, {Lang: "Java"}, {Lang: "Go"}]
```



## this 바인딩


`function` 키워드로 선언했을 때와 `=>`로 선언했을 때의 가장 큰 차이는 **`this `바인딩**에 있다.

### function의 this 바인딩

ES5에서 `function`키워드를 사용했을 때 this 바인딩의 경우를 보면 다음과 같다.

* 객체의 메서드를 호출할 때 : this는 해당 **메서드를 호출한 객체**에 바인딩
* 함수를 호출할 때(내부 함수의 this 바인딩) : 함수 내부에서 사용된 **this는 전역객체**에 바인딩
* 생성자 함수를 호출할 때 : this는 일반 함수를 호출할 때와 다르게 **새로 생성되는 빈 객체**에 바인딩
* call과 apply메서드의 사용을 통한 this 바인딩 : 명시적으로 **특정 객체(지정한 객체)** 에 바인딩

```js
var lang = 'Korean';

var obj = {
    lang : 'English',
    outerFunc : function() {
        var that = this;
        console.log('outerFunc : ', this.lang);

        innerFunc1 = function() {
            console.log('innerFunc1 : ', that.lang);

            innerFunc2 = function() {
                console.log('innerFunc2 : ', that.lang);
            }

            innerFunc2();
        }

        innerFunc1();
    }
}

obj.outerFunc();

/*
outerFunc : English
innerFunc1 : English
innerFunc2 : Engilsh
*/
```
위와 같이 객체의 메서드를 호출할 때 그 **메서드 내의 내부 함수의 경우에는 `this`가 전역 객체에 바인딩**된다.

코드를 보면 `obj` 객체에 바인딩된 `this`를 원하므로 **변수 `that`에 `this`를 할당**하고 내부 함수에는 `this`대신 `that`을 사용하여 원하는 값을 출력하고 있다.



### 화살표 함수에서의 this 바인딩

위에서 보았듯이 일반 함수는 **함수의 호출 방식에 따라 this가 동적으로 바인딩**이 이뤄진다.

하지만 화살표 함수에서는 this가 무조건 상위 스코프의 this를 가리킨다.

즉 정적인 방식으로 this가 바인딩이 되는데 이를 **Lexical this** 라고 한다.

위의 소스를 화살표 함수를 이용해서 바꾸면 `var that = this;`라는 구문을 쓸 필요가 없다.

```js
const lang = 'Korean';

const obj = {
    lang : 'English',
    outerFunc() { //ES6의 축약 메서드 표현
        console.log('outerFunc : ', this.lang);

        innerFunc1 = () => {
            console.log('innerFunc1 : ', this.lang);

            innerFunc2 = () => {
                console.log('innerFunc2 : ', this.lang);
            }

            innerFunc2();
        }

        innerFunc1();
    }
}

obj.outerFunc();

/*
outerFunc : English
innerFunc1 : English
innerFunc2 : Engilsh
*/
```


## 항상 화살표 함수일까?



화살표 함수는 위에서 본 것 처럼 정적으로 this를 바인딩(Lexical this)를 지원하기 때문에 콜백 함수로 쓰기 매우 편하다. 하지만, 주의해서 써야할 경우가 몇 가지 있다.


### addEventListener의 콜백 함수 선언

```js
const btn = document.getElementById('submitBtn');

btn.addEventListener('click', () => {
    console.log(this); //Window
});
```

위에서 볼 수 있듯이 `addEventListener`의 **콜백 함수를 화살표 함수로 선언하면 `this`는 `window`에 바인딩되므로 그냥 일반함수를 사용하여 선언**하여야 한다.



### 객체의 메서드에 선언

객체의 메서드를 선언할 때, **화살표 함수를 쓰면 그 객체에 this가 바인딩되지 않고 전역(window)에 바인딩**된다.

```js
var lang = 'Korean';

const obj = {
    lang : 'English',
    foo : () => { 
        console.log('outerFunc : ', this.lang);
    }
}

obj.foo(); //outerFunc : Korean
```

위에선 English가 나온다고 생각할 수도 있다. 하지만, `foo` 선언할 때 화살표 함수를 사용했고 이에 따라 **상위 컨텍스트인 `window`에 `this`가 바인딩** 되기 때문에 결과는 Korean이 나온다.

따라서 원하는 결과가 English라면 축약 메서드 표현법으로 정의하는 것이 맞다.
```js
var lang = 'Korean';

const obj = {
    lang : 'English',
    foo () { 
        console.log('outerFunc : ', this.lang);
    }
}

obj.foo(); //outerFunc : English
```


### 프로토타입 객체의 메서드 선언

프로토타입 객체에 메서드를 화살표 함수로 정의하면 객체의 메서드에 화살표 함수로 선언할 때와 같이 **`this`가 `window`에 바인딩**된다.

```js
const devleoper = {
  name: 'BKJang',
};

Object.prototype.renderData = () => console.log(this.name);

devleoper.renderData(); //undefined
```



### 생성자 함수 선언

결론부터 말하면, **화살표 함수는 `prototype` 프로퍼티를 갖고 있지 않다.** 따라서 생성자 함수를 선언할 때 화살표 함수를 쓰면 인스턴스를 생성할 수 없다.

```js
const Person = (name) => {
    this.name = name;
}

const jang = new Person('BKJang'); //Uncaught TypeError: Person is not a constructor
```

#### Reference

- [화살표 함수](https://poiemaweb.com/es6-arrow-function)
- [화살표 함수(MDN web docs)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/%EC%95%A0%EB%A1%9C%EC%9A%B0_%ED%8E%91%EC%85%98)
