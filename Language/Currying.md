# Currying

Currying은 여러 개의 인자를 가진 함수를 호출할 경우, 파라미터의 수보다 적은 수의 파라미터를 인자로 받으면 누락된 파라미터를 인자로 받는 기법을 말한다.
부분적으로 인자가 적용된 함수를 체인으로 연결하여 값을 처리하는 것이 본질이다.

<br/>

## 함수의 인자를 분리해서 받는다.

```js
function add(x){
    return function(y){
        return x + y
    };
};

// arrow function으로 한다면 이런 형태일 것이다.
var add = x => y => x + y;
var firstAdd = add(10);

add(10); //y => x + y
add(10)(5); //15
firstAdd(5); //15
```

위 코드를 보면 `add(10)`의 결과가 함수를 반환하는 것을 볼 수 있다. 즉, `add`함수의 인자가 2개라고 했을 때 2개의 인자를 모두 받지 않으면 함수는 실행되지 않는다.

위 처럼 함수의 인자를 분리해서 받으면 어떤 이점이 있을까?

- 함수의 실행을 늦출 수 있다.(부분적으로 파라미터를 받게 되면, 모든 파라미터를 받기 전까지 함수는 실행되지 않는다)
- firstAdd 함수처럼 고정적인 부분은 별도로 정의함으로써 재사용이 가능하다.

위의 코드에서는 함수의 인자 개수가 2개로 정해져 있다. 하지만, 함수의 인자가 동적이거나 훨씬 많다면 모든 경우를 생각하여 모든 함수를 각각 만들어줄 수는 없을 것이다. 이때 curry 함수를 구현하여 함수의 인자를 동적으로 받을 수 있다.

```js
Function.prototype.curry = function(one) {
  var origFunc = this;
  var target = origFunc.length;
  var args = [];
  function next(nextOne) {
    args = [...args, nextOne];
    if (args.length === target) {
      return origFunc.apply(null, args);
    } else {
      return nextOne => { return next(nextOne) };
    }
  }
  return next(one);
}

const add = (a, b, c, d) => {
  return a + b + c + d;
}

add.curry(1)(2)(3)(4); //10
```

<br/>

## 합성함수에서의 Currying

[합성함수](https://github.com/Im-D/Dev-Docs/blob/master/Language/%ED%95%A8%EC%88%98%ED%98%95%20%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D.md#%ED%95%A9%EC%84%B1%ED%95%A8%EC%88%98Function-Composition)는 함수형 프로그래밍에서 사용되는 프로그래밍 기법 중 하나로 말그대로 두 가지 이상의 함수가 합성되었음을 뜻한다. 즉, 각각의 역할을 수행하는 함수를 필요에 따라 합성하여 원하는 결과 값을 만들어낸다. 그러려면 합성하는 역할을 하는 함수를 만들어야 하는데 이때 Currying을 사용하여 함수를 구현할 수 있다.


```js
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

const square = num => num * num;
const addTen = num => num + 10;
const minusTen = num => num - 10;

const squareAfterAddTen = compose(square, addTen);
const squareAfterMinusTen = compose(square, minusTen);

console.log(squareAfterAddTen(10)); //400
console.log(squareAfterMinusTen(30)); //400
```

위의 `compose`함수가 2개 이상의 함수를 합성하는 역할을 해주는 함수다. 코드를 보면 합성할 함수들를 받은 다음 뒤에서 부터 순서대로 실행시키고 그 결과 값을 다음 함수의 인자로 전달하고 있다.

합성 함수의 핵심은 여러 함수를 원하는 경우에 따라 합성하여 사용하고 내부적으로 각각의 함수들이 어떤 로직을 수행하는지에는 관심이 없다는 것이다. 즉, 각각의 함수의 역할만 알고 있으면 이를 상황에 따라 합성하여 사용할 수 있기 때문에 재사용성을 높일 수 있다. 그리고 이러한 장점을 가진 합성 함수를 사용하는데 있어 Currying은 필수적으로 알고 있어야할 개념 중 하나기 때문에 알아둘 필요가 있다.

Currying이 함수형 프로그래밍을 위해서 있는 것이 아니며 최근 함수형 프로그래밍에 대한 관심이 높아지면서 Currying의 개념이 다시 한 번 나타나게 된걸로 생각하면 좋을 것 같다.

<br/>

---

#### Reference

- [Zero Cho Blog - Currying(커링) vs Partial application](https://www.zerocho.com/category/JavaScript/post/579236d08241b6f43951af18)
- [JavaScript에서 커링 currying 함수 작성하기](https://edykim.com/ko/post/writing-a-curling-currying-function-in-javascript/)
- [Lazysoul Medium - Currying(커링)](https://medium.com/@lazysoul/currying-%EC%BB%A4%EB%A7%81-b7af0b2aaef1)
