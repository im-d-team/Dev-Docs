# underscore와 lodash 그리고 native

`underscore`와 `lodash`는 자바스크립트 개발을 진행하다보면 많이 듣게 되는 라이브러리다.<br/> 이 둘은 모두 자바스크립트의 **유티릴리성 라이브러리**로서 개발 중 자주 사용하게 되는 함수들을 정의하고 있다. 또한 Native 즉, 일반적으로 `ECMAScript`에서 지원해왔던 함수에도 유틸리성 함수는 존재한다.

<br/>

## underscore / lodash

---

`underscore`는자바스크립트의 함수형 프로그래밍에 초점을 맞춘 유틸리티성 라이브러리로 `Backbone`에 의존성을 가지고 있다.<br/>`lodash` 또한 자바스크립트 유틸리티성 라이브러리로 크로스환경에 더 안전성을 주고자 하는데 목적이 있다.

현재는 `underscore`의 superset 형태로 함수, 문서, 유닛 테스트, 성능이 더 뛰어나다고 한다.

`lodash`는 `underscore`의 API를 구현함과 동시에 `underscore`에 존재하지 않는 함수들도 추가로 개발하였다. `lodash`의 성능이 `underscore`보다 더 좋다고들 한다.

이 두 라이브러리는 모두 `_func()`의 형태로서 배열을 예로 들어보자.

```js
//lodash
_.forEach([4, 8], console.log(n * n)); //16, 64

//underscore
_.each([4, 8], console.log(n * n));
```

<br/>

## Native

---

위와 같은 예를 자바스크립트의 기본 메서드만 활용하여 구현해보면 다음과 같다.

```js
[4, 8].forEach(item => console.log(item * item);); //16, 64
```

코드로만 봤을때는 별 차이가 없지만 중요한 차이는 `lodash`와 `underscore`에서느 배열을 인자로 전달한다는 것이다.

기본적으로 `arr.forEach()`의 경우에 **`arr`가 배열이 아닌 경우 에러가 발생**한다. **하지만 `lodash`와 `underscore`에서는 에러가 발생하지 않는다.** 즉, 스크립트가 뻗지 않는다.

예를 들어, `document.getElementByClassName()`으로 얻은 값은 배열이 아닌 유사배열객체이기 때문에 `forEach`를 돌렸을 때 에러가 발생할 것이다. 하지만, 위 2개의 라이브러리는 에러를 발생시키지 않고 정상적으로 동작한다.

```js
document.getElementsByClassName('className').forEach(item=>{ console.log(item) }); 
//Uncaught TypeError: document.getElementsByClassName(...).forEach is not a function
```

당연히 개발자가 위와 같은 에러가 발생하지 않도록 예외 처리를 잘해줘야 겠지만, `lodash`나 `underscore`를 사용하면 이런 예외 처리를 해줄 필요가 없다.

<br/>

## underscore / lodash vs Native

`underscore`나 `lodash`는 다양한 용도의 메서드가 제공된다. 이 부분은 `JS`의 내장함수로는 얻을 수 없는 명확한 이점이다. 또한 **두 라이브러리는 다양한 객체 타입에서도 사용 가능하기 때문에 데이터 처리를 하는데 있어서 유용**하다. 이에 따라 상당한 **생산성 향상**으로 이어질 수 있다.

하지만 기본 JS 내장함수를 사용하는 것이 **성능 상 유리**하고 **협업시 라이브러리의 사용보다는 기본 내장 함수를 사용하는 것이 유지보수 측면에서도 유리**할 것이다.<br/> 또한 브라우저와의 **호환성 문제**도 무시할 수는 없을 것이다. `lodash`의 경우에는 V8엔진에서만 지원하기 때문이다.

또한 JS는 ES6의 등장으로 ES5의 한계를 많이 극복했다.

```js
[...document.getElementsByClassName('className')].forEach(item=>{ console.log(item) });
```

위와 같이 ES6의 `Spread`를 이용하여 충분히 유사배열객체를 배열로 쉽게 변환할 수 있다.

<br/>

---

#### Reference

- [underscore Docs](https://underscorejs.org/)
- [lodash Docs](https://lodash.com/docs/4.17.11)
- [native vs lodash vs underscore in javaScript(>ES5)](http://blog.kazikai.net/?p=180)
