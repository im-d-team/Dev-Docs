# 클로저

생성된 함수 객체는 `[[Scopes]]` 프로퍼티를 가지게 된다. 

`[[Scopes]]` 프로퍼티는 **함수 객체만이 소유하는 내부 프로퍼티(Internal Property)로서 현재 실행 컨텍스트의 스코프 체인이 참조하고 있는 객체를 값으로 설정**한다. 



![JavaScript](https://bkdevlog.netlify.com/assets/img/js_scope_property.png)


내부 함수의 `[[Scopes]]` 프로퍼티는 **자신의 실행 환경(Lexical Enviroment)** 과 자신을 포함하는 **외부 함수의 실행 환경과 전역 객체**를 가리킨다.

이 때, 자신을 포함하는 **외부 함수의 실행 컨텍스트가 소멸하여도 `[[Scopes]] `프로퍼티가 가리키는 외부 함수의 실행 환경(Activation Object)은 소멸하지 않고 참조**할 수 있다. 이것이 **클로저**이다.


외부함수에서 내부함수를 반환하는 코드를 보자.

```js
function foo() {
    var x = 'variable of outerFunc';

    function bar() {
        console.log(x); 
    }

    return bar;
}

var innerFunc = foo();
innerFunc(); //variable of outerFunc
```

위의 코드를 보면 외부함수 `foo()`에서 `bar()`를 반환하고 소멸한다.

**외부함수 `foo()`는 실행된 이후, 실행 컨텍스트 스택에서 제거되기 때문에 변수 `x`도 같이 소멸될 것으로 보인다.** 이에 따라 변수 `x`에 접근할 방법이 없어 보인다.
하지만 `innerFunc()`함수를 호출하면 변수 x의 값이 출력되는 것을 볼 수 있다.

이처럼 **클로저는 외부함수(`foo()`) 밖에서 내부함수(`bar()`)가 호출되더라도 외부함수의 지역 변수(`var x`)에 접근할 수 있다.**



![JavaScript](https://bkdevlog.netlify.com/assets/img/js_closure_scope.png)



클로저가 외부함수 밖에서 내부함수가 호출되더라도 외부함수의 지역 변수에 접근할 수 있는 이유를 설명한 그림이다.

외부함수인 `foo()`함수가 종료되면 함수 실행 컨텍스트도 소멸하지만 **`foo()` 함수 실행 컨텍스트의 활성 객체는 유효**하다.

이 때문에 **외부 함수 `foo()`가 실행이 종료되어도 내부 함수 `bar()`에서 접근이 가능한 것**이다.



> 클로저를 사용하면 **클로저에서의 스코프 체인 접근 방식**, **메모리의 부담** 등의 이유로 성능적인 면과 자원적인 면에서 손해를 볼 수 있다. <br/>그렇기 때문에 좋은 구현을 위해서는 충분한 경험을 쌓을 필요가 있다.



## 클로저를 활용한 전역 변수의 사용 억제



클로저를 활용한 대표적인 예로 카운터가 있다.
우선, 전역 변수를 사용한 예를 한 번 살펴보자.

```js
var counter = 0;

function calculator() {
    return console.log(++counter);
}

calculator(); //1
calculator(); //2
calculator(); //3
```

위의 결과는 에상대로 잘 나오고 있지만 전역 변수 `counter`를 쓰고 있다. <br/>
전역 변수는 **어디서든 접근이 가능하기 때문에 값이 변할 수 있고** 이에 따라 오류를 불러올 수 있다.

```js
var outerFunc = (function () {
    var counter = 0;

    function calculater() {
        return console.log(++counter);
    }

    return calculater;
}());

outerFunc(); //1
outerFunc(); //2
outerFunc(); //3
```

위의 코드와 같이 클로저를 이용하면 전역 변수의 사용을 줄일 수 있다.

## 클로저를 이용한 상태 변경

클로저가 가장 유용하게 사용되는 상황 중 하나는 현재 상태를 기억하고 변경된 최신 상태를 유지하는 것이다.

```js
var box = document.querySelector('.box');
var toggleBtn = document.querySelector('.toggle');

var toggle = (function () {
  var isShow = false;

  return function () {
    box.style.display = isShow ? 'block' : 'none';
    isShow = !isShow;
  };
})();

toggleBtn.onclick = toggle;
```

## 루프 안에서의 클로저 활용



클로저를 활용하는데 있어 주의할 사항에 대해 설명할 때 가장 많이 등장하는게 이 경우다.

```js
function count(numberOfCount) {
    for(var i=1; i <= numberOfCount; i++) {
        setTimeout(function(){
            console.log(i);
        }, i*1000)
    }
}

count(4);
```

보면 알겠지만, 위 코드의 의도는 1초 간격으로 1,2,3,4를 출력하는 것이다. 하지만 결과는 예상과 다르게 **5가 4번 1초 간격으로 출력**된다.

그 이유는 **변수 `i`는 외부함수의 변수가 아닌 전역변수이고 `setTimeout()`함수가 실행되는 시점은 `count()`함수가 종료된 이후**다.
이 때는 이미 `i`의 값이 5인 상태이다.

```js
function count(numberOfCount) {
    for(var i=1; i <= numberOfCount; i++) {
        (function (j) {
            setTimeout(function(){
                console.log(j);
            }, i*1000)
        }(i))
    }
}

count(4);
```

즉시 실행 함수를 실행시켜 루프의 `i` 값을 `j`에 복사하고 `setTimeout()`함수에서 사용했다.<br/>
이 때 **`j`는 상위스코프의 자유변수이므로 그 값이 유지**된다.

이러한 문제는 자바스크립트의 함수형 스코프로 인해 for 루프의 초기문에서 사용된 변수는 **전역 스코프**를 가지기 때문에 발생한다.

ES6에서는 `let`을 이용해 **블록 레벨 스코프**를 구현할 수 있다.

```js
function count(numberOfCount) {
    for(let i=1; i <= numberOfCount; i++) {
        setTimeout(function(){
            console.log(i);
        }, i*1000)
    }
}

count(4);
```
첫 번째 코드에서 `var`를 `let`으로만 바꿔주면 위의 코드처럼 깔끔하게 구현할 수 있다.


#### Reference

- 인사이드 자바스크립트 (송형주, 고형준)
- [클로저](https://poiemaweb.com/js-closure)
