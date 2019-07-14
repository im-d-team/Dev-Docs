# ES6 Module in Browser

## module

모듈은 쉽게 생각하면 코드 뭉치다. 코드를 chunk로 만들어 재사용하거나 추상화한다.

JS 모듈에 관한 글은 여기저기 많다. 아래의 링크로 간단한 모듈의 정의와 역사는 대체한다.

- [B_Module](https://github.com/Im-D/Dev-Docs/blob/master/Javascript/B_Module.md)
- [javascript의 module](https://github.com/Im-D/Dev-Docs/blob/master/Javascript/Module.md)
- [AMD와 CommonJS](https://github.com/Im-D/Dev-Docs/blob/master/Javascript/AMD%EC%99%80%20CommonJS.md)

이 글에서는 현재 브라우저에서 최신모듈을 어떻게 사용하는지 알아보도록 하자.

## js module의 역사

위의 링크들에도 잘 나와 있지만 간단하게만 짚고 넘어가자. 궁금한 단어들은 위의 링크에서 찾아보자.

### 기본

가장 기본은 모듈을 파일별로 구분하고 파일을 모두 불러오는 것이다.

```html
<script src="some.js"></script>
<script src="another.js"></script>
<script src="other.js"></script>
```

이 경우 단점은 전역변수 사용, 의존성 관리 불가, request 수 증가 등등 다양할 것이다.

### Module patterns

즉시 실행 함수 표현식(IIFE)을 통해 chunk끼리 분리하여 작동하게 만들어 기존의 단점을 보완하였다.

### Module 경쟁과 종말

JS에서 공식 스펙으로 채택한 모듈이 없었고 따라서

- commonJS
- AMD
- UMD

이러한 방식들이 등장해 서로 경쟁하였다.

ES2015의 등장과 함께 ES6 Modules라는 표준 방식이 등장하였다.

## ES6 Modules

ES6 모듈의 스펙과 사용법은 다음과 같다.

- private가 기본값이다.
- strict mode로 실행된다.
- 노출하고자 하는 것은 `export` 키워드를 사용한다.
- `import` 키워드를 사용해 불러온다.

이전에는 브라우저가 이것을 지원하지 않아 [bundler나 transpiler](https://github.com/Im-D/Dev-Docs/blob/master/Javascript/Javascript_BuildTool.md)를 사용해서 ES6 모듈을 사용했었다.

### 브라우저에서 사용

[이 버전들](https://caniuse.com/#feat=es6-module)부터는 브라우저가 ES6 모듈을 사용할 수 있다.

- Chrome 61 이상
- Firefox 60 이상
- Edge 16 이상
- Safari 11 이상
- IE는 불가

#### 사용 방법

```html
<script type="module" src="./app.js" />
```

```html
<script type="module">
  import * as lib from './lib.js';

  lib.parse("12abc345");
<script>
```

`type="module"`을 script 태그 안에 넣어주게 되면 뒤의 script를 module로 취급하여 실행한다.

#### 비동기처리

`type="module"` 로 불러오게 되면 defer가 기본값이다. defer는 script를 비동기로 불러온 뒤 HTML parsing이 완료되면 script가 실행되는 속성이다.

관련 자료는 [이곳](https://blog.asamaru.net/2017/05/04/script-async-defer/)에서 보자.

비동기처리가 기본 속성이므로 script 파일 간의 순서를 보장해야 하는 경우 잘 고려해서 사용하자.

```html
<!-- runs SECOND -->
<script type="module">
  // this is inline
  // do something...
</script>

<!-- runs THIRD -->
<script defer src="c.js"></script>

<!-- runs FIRST -->
<script src="a.js"></script>

<!-- runs FOURTH -->
<script type="module" src="b.js"></script>
```

#### feature detect

browser가 module을 지원하지 않는다면 `type="module"`을 설정한 코드의 src를 무시해버린다.
따라서 실행이 안 된다.

그래서 지원하는 것이 nomodule 속성이다.

```html
<script type="module" src="app.js"></script>
<script nomodule src="classic-app.js"></script>
```

module을 인식하는 브라우저라면 윗 코드를, 구식 브라우저라면 아랫 코드를 실행한다.

관련 스펙은 [이 곳](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-nomodule)에서 확인할 수 있다.

## 미래를 대비하자.

이제 브라우저에서도 ES6 모듈을 사용할 수 있다.

물론 현대적인 방식의 대다수 개발에선 번들러를 사용하며 그 중 webpack이 가장 인기있다.

js 뿐만 아니라 css의 의존성 관리, image 관리, transpiling 등을 한꺼번에 처리할 수 있는 webpack은 매우 강력하다.

그렇지만 영원한 승리자는 없다. 이미 무거워져버린 webpack을 어떻게 대체할 것인가에 대해 많은 이야기가 나오고 있다.

webpack이 아니더라도 표준 방식으로 ES6 모듈을 사용할 수 있음을 기억해두자.

---

### 참고자료

- [B_Module](https://github.com/Im-D/Dev-Docs/blob/master/Javascript/B_Module.md)
- [javascript의 module](https://github.com/Im-D/Dev-Docs/blob/master/Javascript/Module.md)
- [AMD와 CommonJS](https://github.com/Im-D/Dev-Docs/blob/master/Javascript/AMD%EC%99%80%20CommonJS.md)
- [javascript build tool](https://github.com/Im-D/Dev-Docs/blob/master/Javascript/Javascript_BuildTool.md)
- [module can i use](https://caniuse.com/#feat=es6-module)
- [script의 async와 defer 속성](https://blog.asamaru.net/2017/05/04/script-async-defer/)
- [html spec(whatwg)](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-nomodule)
- [Understanding ES6 Modules](https://www.sitepoint.com/understanding-es6-modules/)
