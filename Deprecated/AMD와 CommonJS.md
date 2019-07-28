# AMD와 CommonJS

## 배경

자바스크립트(ES5 기준)는 파이썬, 루비, 다른 스크립트 언어 계열과 차이점이 존재한다.

바로 **모듈 사용의 표준이 존재하지 않는다는 것**이다.

Node.js를 사용하고 있는 개발자들은 `module.exports`를 통해 모듈을 정의하고 `require()` 함수를 통해 정의한 모듈을 불러와 사용하고 있다.

이러한 방식을 **CommonJS**라고 한다.

프론트엔드에서는 위와 같은 모듈 제공 방식이 없었다.

이에 따라 `window`객체를 이용하여 모듈의 리소스를 전달하는 방식을 이용했었다.

```js
//math.js
var sum = function() {
    var total = 0;
    for (var idx in arguments) {
        total += arguments[idx];
    }
    return total;
};

window.Math = {
    sum: sum
};
```

```js
//main.js
if (typeof Math !== 'undefined') {
    if (typeof Math.sum === 'function') {
        console.log(Math.sum(1, 2));
    } else {
        throw new Error('Math.sum function is not defined.');
    }
} else {
    throw new Error('A module `Math` is undefined.');
}
```

위 소스를 보면 **전역 오브젝트인 `window` 객체를 통해 다른 자바스크립트 파일에 리소스를 전달** 하고 있다.

하지만 이것도 사용하는 HTML에서 불러오는 모듈 파일을 먼저 로드해야한다.

즉, **대상 모듈이 존재할수도, 존재하지 않을 수도 있는 상태**가 된다.

이후 점차 프로젝트 규모가 커지게 되면서 프론트엔드에서 좀 더 효율적인 모듈화를 제공하기 위헤 `AMD`와 `CommonJS` 방식이 생겨나게 됐다.

<br/>

## AMD(Asynchronous Module Definition)

AMD에서는 `define`을 사용한다.

```js
//math.js
define([], function() {
    return {
      sum: function() {
          var total = 0;
          for (var idx in arguments) {
              total += arguments[idx];
          }
          return total;
      }
    };
});
```

```js
//main.js
requirejs.config({
    baseUrl: './'
});

require(['math'], function(Math) {
  console.log(Math.sum(1, 2));
});
```

원래 AMD의 규칙을 따르는 도구를 사용해 모듈을 정의하고 불러와야하지만 위의 코드에선 ReuireJS를 사용했다.

<br/>

## CommonJS

CommonJS 방식은 위에서도 말했듯이 **Node.js에서 사용하고 있는 모듈 방식**이다. 이것이 CommonJS 방식의 제공이 중요한 이유다.

```js
module.exports = {
    sum: function() {
        var total = 0;
        for (var idx in arguments) {
            total += arguments[idx];
        }
        return total;
    }
};
```

```js
var math = require('./math');

console.log(math.sum(1, 2));
```

### CommonJS 방식으로 제공되어야 하는 경우

---

* 프론트엔드 라이브러리일지라도 Node.js 코드를 통해 유닛 테스팅을 하는 경우

* `moment.js`, `underscore.js`처럼 Node.js에서도 사용 가능해야하는 라이브러리 일 경우 

<br/>

## 모듈 제공의 방향과 ES6

이전 Module 제공 방식의 추세가  AMD vs CommonJS였다면, CommonJS와 ES6 타입으로 축약되는 것으로 보인다. 

즉, **AMD 방식은 사양되는 분위기**다.

하지만 여전히 일부 라이브러리가 AMD방식을 사용하고 있어 지금도 번들링은 UMD로 하고 있다.

위의 내용까지는 ES5기준으로 본 모듈 방식의 정의고 ES6기준으로 보면 또 다른 모듈 방식이 존재한다.

**ES6 모듈은 import를 제공하여 모듈을 불러오는 방식**이다.

require.js와 import를 사용하여 모듈을 불러올 때 각각의 차이 중 하나는 **Tree-Shaking**을 할 때 알 수 있다.

**`import`를 사용한 방식은 라이브러리의 특정 모듈만을 가져와 번들링할 수 있지만, `require` 방식으로 가져온 라이브러리는 모듈 전체를 번들링**해야한다.

즉, **`require` 방식으로 가져온 모듈에 대해서는 Tree-shaking을 진행할 수 없다.**

<br/>

---

#### Reference

- [자바스크립트 모듈 제공을 위한 AMD, CommonJS 그리고 RequireJS 소개](https://blog.pigno.se/post/157992405313/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EB%AA%A8%EB%93%88-%EC%A0%9C%EA%B3%B5%EC%9D%84-%EC%9C%84%ED%95%9C-amd-commonjs-%EA%B7%B8%EB%A6%AC%EA%B3%A0-requirejs-%EC%86%8C%EA%B0%9C)
- [JavaScript 표준을 위한 움직임: CommonJS와 AMD](https://d2.naver.com/helloworld/12864)