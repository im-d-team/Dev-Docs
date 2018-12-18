# **Head Meta**

**HTML** `<meta>` 요소는...
<br/>

`<base>, <link>, <script>, <style>` 또는 `<title>`과 같은 다른 메타관련 요소로 나타낼 수 없는 메타데이터를 나타낸다.
<br/>

메타데이터는 **데이터를 설명하는 데이터**이다.
<br/>

## 인코딩 셋팅

`<meta charset="utf-8">`
<br/>

이 요소는 문서의 `character incoding` 에 대해서 간단히 표시한다.
당연히 요즘에는 `utf-8` 을 사용하는게 좋다. 그렇게 대부분이 사용한다.
<br/>

```html
// html5이전
<meta http-equiv="Content-Type" content="text/html; charset=IANAcharset">
```

**Naver와 Google** 역시 `<head>` 최상단에 선언하고 있다.
<br/>

많은 `<meta>` 요소가 `name` 과 `content` 속성을 가진다:
<br/>

- `name` 은 메타 요소의 형태를 알려준다. 이것이 어떤 타입의 정보를 가지고 있는지.
  - 이 속성은 문서 레벨의 메타데이터의 이름을 정의한다. `itemprop, http-equiv` 또는 `charset` 속성 중 하나라도 설정이 된 경우에는 설정할 수 없다.
  - `application-name` : 웹 페이지 내에서 실행될 어플리케이션의 이름을 정의한다.
  - `author` : 문서의 작성자를 정의한다.
  - `description` : 페이지의 내용에 대한 짧고 정확한 요약을 담고 있다. Firefox나 오페라와 같은 여러 브라우저에서는 이를 즐겨 찾기 페이지의 기본 설명으로 사용한다.
  - `generator`:페이지를 생성한 소프트웨어의 식별자를 담고 있다.
  - `keywords` : 콤마(`,`)로 구분된 페이지의 내용과 관련된 단어를 담고 있다.
  - `referrer` : 문서에서 전송된 요청에 첨부된 `HTTP` 헤더의 참조자(Referer)를 제어한다.(Naver : 문서의 Origin을 전송)
  - `creator` : 문서를 만든사람을 정의.
  - `googlebot` : `robot`과 비슷하지만 구글봇이 수집한다.
  - `publisher` : 문서 게시자의 이름을 정의.
  - `robots` : 협동 크롤러 또는 `robot`이 페이지와 함께 사용해야하는 동작을 정의.
  - `slurp` : 야후 검색을 위한 크롤러에서 사용
  - `viewport` : 뷰포트의 초기 크기 크기에 대한 힌트를 제공한다. 휴대 기기에서만 사용됨.

- `http-equiv` : 이 속성은 속성의 이름(`http-equiv(alent)`)에서 알 수 있듯이, `HTTP` 헤더의 이름을 값으로 가질 수 있다. 이 속성의 값으로 서버나 사용자 에이전트의 작동방식을 변경할 수 있는 지시를 정의할 수 있다. 지시 값은 `content` 속성 안에 정의하는데 다음 중 하나 일 수 있다:
  - `content-security-policy` :  이 값을 이용해 현재 페이지에 대한 컨텐트 정책(content policy)를 정의할 수 있다. 컨텐트 정책은 주로 허용된 `server origins`과 `script endpoints`를 명시함으로써 `cross-site scripting` 공격을 막는 것을 돕는다.
  - `refresh`
    - `content` 속성에 양의 정수 값이 설정된 경우, 페이지가 재로딩될 때까지의 시간(초)을 의미한다.
    - `content` 속성이 양의 정수 값을 가지고 그 값의 뒤에 `;url=` 문자열과 함께 유효한 URL이 설정된 경우, 다른 페이지로 리디렉션될 때까지의 시간(초)을 의미한다.
  - `X-UA-Compatible` : 마이크로소프트는 `X-UA-Compatible` 태그로 웹의 호환성을 지정할 수 있도록 하였다.(익스플로러 버전별 호환성 쿼크 설정)

- `content` : 이 속성은 `http-equiv` 또는 `name` 속성 중 어떤 것이 사용되느냐에 따라 해당 속성의 값을 갖는다.

```html
<meta name="author" content="Chris Mills">
<meta name="description" content="The MDN Learning Area aims to provide
complete beginners to the Web with all they need to know to get
started with developing web sites and applications.">
```

## 특정사이트에 사용하는 메타태그

웹 사이트에서 볼 수있는 기능들은 특정 사이트 (예 : 소셜 네트워킹 사이트)에 사용할 수있는 특정 정보를 제공하도록 설계된 독점 제작물이다.

### Facebook

`Open Graph Data` 는 `Facebook`이 웹 사이트에 더 풍부한 메타 데이터를 제공하기 위해 발명한 메타 데이터 프로토콜이다.

```html
<meta property="og:image" content="https://developer.cdn.mozilla.net/static/img/opengraph-logo.dc4e08e2f6af.png">
<meta property="og:description" content="The Mozilla Developer Network (MDN) provides
information about Open Web technologies including HTML, CSS, and APIs for both Web sites
and HTML5 Apps. It also documents Mozilla products, like Firefox OS.">
<meta property="og:title" content="Mozilla Developer Network">
```

### Twitter

```html
<meta name="twitter:title" content="Mozilla Developer Network">
```

---

#### Reference

- [MDN](https://developer.mozilla.org/ko/docs/Learn/HTML/Introduction_to_HTML/The_head_metadata_in_HTML)
- [MDN](https://developer.mozilla.org/ko/docs/Web/HTML/Element/meta)