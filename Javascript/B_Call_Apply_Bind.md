# Call Apply Bind 

## Function vs Method

한가지 예제를 살펴보고 `console.log()`가 어떻게 출력이 되는지 확인해보자. 

```js
// 함수
const greeting = () => {
  console.log(this);
}

const module = {
  greeting() {
    console.log(this);
  }
}

greeting(); // window object

module.greeting(); // module object
```

흔히 사람들이 실수하는 코드 중 하나이다.

여기서 제일 유심히 보아야 하는 것은 `this`가 다르다는 것이다. Java나 다른 언어에서의 `this`와는 다르게 작동하고 있다.

`this`에 대한 더 많은 내용은 아래의 참고 글을 읽어보길 바란다. 

> 참고 <br/>
> [scope this](https://github.com/Im-D/Dev-Docs/blob/master/Javascript/scope_this.md) <br/>
> [JavaScript의 this](https://github.com/Im-D/Dev-Docs/blob/master/Javascript/JavaScript%EC%9D%98%20this.md)

```js
function Module(name) {
    this.name = name;
}

Module.prototype.getName = function() {
  var changeName = function() {
    console.log(this); // window
    return this.name + '입니다.';
  }
    return changeName();
}

const module = new Module('sNyung');

console.log(module.getName());
```

위와 같이 메서드 내부에서 함수를 정의하고 `this`를 사용하게 되면 Module이라고 생각하지만 `window`를 바라보고 있다. 그리고 이걸 해결하는 방법으로 흔히 `self` 또는 `that`을 사용한다.

```js
function Module(name) {
    this.name = name;
}

Module.prototype.getName = function() {
  const self = this;
  // const that = this;
  
  const changeName = function() {
    console.log(self); // Module
    return self.name + '입니다.';
  }
    return changeName();
}

const module = new Module('sNyung');

console.log(module.getName());
```

또는 ES6에서 추가가 된 화살표 함수(Arrow Function)를 사용해서 해결 가능하다.

```js
function Module(name) {
    this.name = name;
}

Module.prototype.getName = function() {
  const changeName = () => {
    console.log(this); // Module
    return this.name + '입니다.';  
  }
    return changeName();
}

const module = new Module('sNyung');

console.log(module.getName());
```

<br/>

## call()

자바스크립트에서 object를 효율적으로 사용하면서 재사용 패턴까지 구현할 수 있는 유용한 방법으로 `Function.prototype.call()` 함수가 있다. 

call은 ES6에서 화살표 함수가 나오기 전 `self` 또는 `that`를 사용하지 않고 `this`까지 해결할 수 있는 방법이다.

```js
 function Module(name) {
    this.name = name;
}

Module.prototype.getName = function() {
  const changeName = function() {
    console.log(this);
    return this.name + '입니다.';
  }
  // return changeName.call(this, 1,2,3,4);
  return changeName.call(this);
}

const module = new Module('sNyung');

console.log(module.getName());
```

call은 호출하는 즉시 Function을 실행시킨다.  

```js
fun.call(thisArg[, arg1[, arg2[, ...]]])
```

<br/>

## apply()

이번에는 call과 매우 유사한 apply를 보자. 

```js
function Module(name) {
    this.name = name;
}

Module.prototype.getName = function() {
  const changeName = function() {
    console.log(this);
    return this.name + '입니다.';
  }
  
    // return changeName.apply(this, [1,2,3,4]);
  return changeName.apply(this);
}

const module = new Module('sNyung');

console.log(module.getName());
```

apply도 호출하는 즉시 Function을 실행시킨다.  

```js
fun.apply(thisArg, [argsArray])
```
    
call과 apply는 첫 번째 인자의 `this`를 실행할 함수의 `this`로 설정해준다. apply는 call과 같이 첫 번째 인자로 `this`를 받는 건 똑같지만 뒤에 넘겨줄 값을 `[1,2,3,4,5]`처럼 배열 형태로 넘겨준다. (`call` 같은 경우에는 `1,2,3,4,5`처럼 배열이 아닌 `,`로 전달한다)

<br/>

## bind()

call과 apply는 실행할 함수의 `this`로 설정하고 바로 실행한다. bind는 함수를 실행하지는 않고 this를 재정의한 새로운 함수를 반환한다.

```js
function Module(name) {
    this.name = name;
}

Module.prototype.getName = function() {
  const changeName = function() {
    console.log(this);
    return this.name + '입니다.';
  }
  let bindChangeName = changeName.bind(this);
    return bindChangeName();
}

const module = new Module('sNyung');

console.log(module.getName());
```

---

#### Reference

- [https://blog.feruden.com/blog/call-apply-bind-in-javascript](https://blog.feruden.com/blog/call-apply-bind-in-javascript)
- [https://wayhome25.github.io/javascript/2017/02/18/js-oop-1/](https://wayhome25.github.io/javascript/2017/02/18/js-oop-1/)
