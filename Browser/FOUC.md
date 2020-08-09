# FOUC(Flash of Unstyled Content)

`FOUC(Flash of Unstyled Content)`란 브라우저에서 웹 페이지에 접근했을 때, 미처 스타일이 적용되지 못한 상태로 화면이 나타나는 현상을 말한다. 

스타일이 적용되기 전의 상태가 먼저 화면에 렌더링된 후 그 상태에서 스타일이 적용되기 때문에 스타일이 적용되는 과정이 사용자에게 그대로 노출되는 현상이다. 이러한 현상은 사용자의 경험(UX)를 떨어트리게 된다는 문제가 있다.

`FOUC`는 특히 `IE(Internet Explorer)` 브라우저에서 주로 발생되며 `IE11`에서도 여전히 발생되고 있는 문제다.

## FOUC의 발생 원인

`FOUC`의 발생 원인은 다양하지만 몇 가지만 우선적으로 살펴보면 다음과 같다.

### CRP(Critical Rendering Path)

![Webkit](https://user-images.githubusercontent.com/24724691/62412567-bf49f200-b63f-11e9-9ed4-ec8215d04a7d.png)

위처럼 브라우저에서 화면이 그려지기까지의 주요한 과정을 `CRP(Critical Rendering Path)`라고 한다.

1. HTML 마크업을 처리하고 DOM 트리를 빌드한다.
2. CSS 마크업을 처리하고 CSSOM 트리를 빌드한다.
3. DOM 및 CSSOM을 결합하여 Rendering 트리를 형성한다.
4. Rendering 트리에서 레이아웃을 실행하여 각 노드의 기하학적 형태(화면의 위치)를 계산한다.
5. 개별 노드를 화면에 paint한다.

`Render Tree`가 노출된 후 CSS와 JS 파일등으로 변경되면 이 변경 사항들이 화면에 노출될 수 있다. 이 현상이 `FOUC`다.

웹 브라우저의 작동 원리에 대해 좀 더 자세히 알고 싶다면 [다음](https://github.com/im-d-team/Dev-Docs/blob/master/Browser/%EC%9B%B9%20%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80%EC%9D%98%20%EC%9E%91%EB%8F%99%20%EC%9B%90%EB%A6%AC.md)을 참고하길 바란다.

최근의 웹 페이지들은 여러 개의 CSS 파일을 참조하거나 웹 폰트를 사용함으로써 DOM 구조를 변경하기 때문에 더욱 자주 발생할 수 있는 환경이다.

### `@import`를 사용한 CSS 

IE(Internet Explorer)를 제외한 브라우저의 경우, 참조(`@import`)되는 스타일이 적용될때까지 화면에 표시하지 않는다. 하지만, IE의 경우 화면에 노출된 상태로 스타일이 적용되어 FOUC를 유발한다.

### 웹 폰트의 사용

이또한 `@import`를 사용하여 스타일링을 할 때와 같은 원리로 `FOUC`가 발생하게 된다. IE는 웹 폰트를 사용할 경우 기본 폰트를 불러들이고 이를 사용된 웹 폰트로 다시 재변경되게 되는데 이 과정을 그대로 화면에 노출시키게 된다.

## FOUC 해결

### JS import 위치 변경

일반적으로 자바스크립트를 선언할 때는 성능을 위해 `</body>` 태그 바로 위에 위치시키곤 한다.
하지만 이를 `<head>`태그 안으로 위치시킴으로써 `FOUC`를 개선할 수 있다. 하지만 이 방법으로는 웹 폰트나 `@import`를 사용한 CSS로 인한 `FOUC` 발생을 막을 수는 없다.

### FOUC 발생 위치의 컴포넌트 숨기기

`@import` 사용으로 인한, 웹 폰트로 인한 `FOUC`발생을 막기 위해서는 `FOUC`가 발생하는 위치의 컴포넌트를 숨겼다가 웹 폰트 혹은 참조(`@import`) CSS의 로딩이 완료되면 보여주는 방법이 있다. 물론, 숨기는 것은 한 예시일 뿐이고 로딩바를 보여준다거나 스켈레톤 UI를 보여준다거나 할 수 있다.

```html
<html class="no-js">
  <head>
    <style>
      .js #fouc {
        display: none
      }
    </style>
    <script>
      (function (H) {
        H.className = H.className.replace(/\bno-js\b/, 'js')
      })(document.documentElement)
      </script>
  </head>

  <body>
    <div id="fouc">
      FOUC 발생 지점
    </div> <!-- /#fouc -->
    <script>
      document.getElementById("fouc").style.display = "block";
    </script>
  </body>
</html>
```
[소스 출처 - webdir.tistory.com](https://webdir.tistory.com/416)

위 소스에 대해 간단히 설명하면 자바스크립트와 CSS 스타일이 모두 로딩되었을 경우, `fouc` ID를 가진 컴포넌트를 렌더링시켜준다.

`FOUC`의 발생은 최근에는 대부분 `IE`에서 발생하기 때문에 `IE`에 대해서만 분기 처리를 한 후 `FOUC`에 대한 처리를 하는 것도 좋으 방법이 될 수 있다.

---

#### Reference

- [화면 깜빡임(FOUC) 문제해결](https://webdir.tistory.com/416)
- [UZULAB - #3 FOUC, 화면 깜박임 문제](https://uzulab.tistory.com/4)
