# Preload, Preconnect, Prefetch

## 브라우저는

인터넷을 통해서 브라우저에 전송되는 모든 자원들이 동일하게 중요한 것은 아니다. 

브라우저들은 가장 중요한 리소스를 우선 로드(예: 스크립트나 이미지보다 CSS 우선)하기 위해 최선을 다해서 추측을 하고 가져오려고 노력한다.
<br/>

### 브라우저의 우선순위 기본값

기본적으로 `head` 태그안에 있는 `script` 태그는 크롬에서 높은 우선 순위(가장 높은 CSS 다음이라고 함)로 로드된다. `defers` 속성이 있다면 `script` 태그가 낮음으로 우선 순위가 변경된다.

![defer](https://user-images.githubusercontent.com/24274424/61136241-3a672f00-a4fe-11e9-8172-5aa84121752a.png)

> defer를 사용하지 않는 경우

![no-defer](https://user-images.githubusercontent.com/24274424/61136318-61256580-a4fe-11e9-9e56-4b4c05ed9367.png)

> defer를 사용하는 경우

우선 순위를 쉽게 찾아볼 수 있는 곳은 Chrome Dev Tool Network이다.

자신이 원하는 우선 순위와 다르게 우선 순위가 표시된 리소스를 찾았다면 어떻게 해야할까?

오늘의 주제인 세 가지 방법이 있다. 

리소스가 사용자 환경에 필수적이지만 너무 낮은 우선순위로 로드된다면, preload나 preconnect 두 가지 방법 중 하나로 수정할 수 있고, 브라우저가 다른 모든 작업을 끝낸 후 일부 리소스를 가져오도록 하고 싶다면, prefetch를 사용하면 된다.
<br/>

## Preload

기본적인 모양새

```html
<link rel="preload">
<link rel="preload" as="script" href="super-important.js">
<link rel="preload" as="style" href="critical.css">
```

브라우저에게 로딩 중인 리소스의 유형을 알려줌으로써 올바르게 처리되도록 한다. 브라우저는 as 속성이 없을 경우 preload 된 리소스를 사용하지 않는다. 

리소스는 다른 때와 동일한 우선 순위로 로드되지만, 브라우저에게 미리 알기 때문에 다운로드가 더 일찍 시작되는 것을 허용한다는 점이 다르다.

preload 방법에 있어서 실수로 두 번 가져오거나, 필요하지 않는 것을 가져오기 않도록 신중하게 작업을 해야한다.

`<link rel="preload">`를 작성하였지만, 현재 페이지에서 3초 내에 사용되지 않으면 콘솔에 경고가 뜬다.

![error](https://user-images.githubusercontent.com/24274424/61136703-06d8d480-a4ff-11e9-9af4-134c4a45f493.png)

<br/>

### Font(FOUC 방지)

font 반드시 가져와야 하는 리소스의 좋은 예이다. font는 한 페이지가 로드하는 여러 CSS파일의 맨 아래에 위치하는 경우가 많다. 

사용자가 사이트의 텍스트 콘텐츠를 기다리는 시간을 감소시키고, 시스템 font과 선호 font이 충돌하여 발생하는 플래시를 방지하기위해 `<link rel="preload">`를 HTML에 사용하면 font이 필요하다는 것을 브라우저가 즉시 알 수 있다.

```html
<link rel="preload">
```

여기서 `crossorigin`을 사용하는 것이 매우 중요하다. 이 속성가 없다면, 브라우저가 preload 된 font를 무시하고 새로 가져온 항목이 그 자리를 차지한다. 통상 브라우저를 통해 익명으로 가져오며, preload 요청은 `crossorigin` 속성 사용을 통해서만 익명을 처리할 수 있기 때문이다.

> Caution: Google Fonts와 같은 CDN을 사용 중이라면 미리 로딩한 font 파일이 CSS에 있는 것과 일치하는지 확인해야 한다. 유니코드 범위, 두께, 다양한 font로 인해 이 작업이 어려울 수 있다. font은 또한 정기적으로 업데이트될 수 있으며, 새로운 버전에 대해 CSS를 사용할 때 이전 버전을 미리 로드했다면 동일한 font을 두 번 다운로드하여 사용자의 대역폭을 낭비하는 결과를 낳게 될 수 있습니다. 손쉬운 유지관리를 위해 `<link rel="preconnect">`를 대신 사용하는 것을 고려해 보세요.

<br/>

### CSS 및 자바스크립트 주요경로

페이지 성능에 관해 이야기할 때의 중요한 개념으로 주요 경로라는 것이 있다. 주요 경로란 초기 렌더링 전에 반드시 로드되어야 하는 리소스를 일컫는다. 이러한 리소스(예를 들어 CSS)는 사용자 화면의 첫 픽셀을 얻는 데 매우 중요하다.

이전에는 콘텐츠를 HTML에 인라인 처리하는 것이 권장되었다. 그러나 페이지 수가 많고 서버 측에서 렌더링되는 경우 이렇게 하면 바이트 낭비가 심해지게 된다. 주요 코드의 변경이 인라인 처리된 모든 페이지를 무효화하기 때문에 버전 관리도 더욱 어렵게 된다. 

`<link rel="preload">`는 개별 파일 버전 관리 및 캐싱의 이점을 유지하면서도 리소스를 가능한 한 빠르게 요청하는 메커니즘을 선사한다.

```html
<link rel="preload" as="script" href="super-important.js">
<link rel="preload" as="style" href="critical.css">
```

`preload` 이용에는 한가지 단점이 있다. 추가적인 왕복에 영향을 받는다는 것이다. 이러한 추가적인 왕복은 브라우저가 우선 HTML을 가져온 다음에야 다음 리소스에 대해 알 수 있다는 점에 기인한다.

추가적인 왕복을 피하는 방법 중 하나는 HTML을 전송하는 것과 동일한 연결을 통해 선점적인 주요 자산을 첨부하는 경우, HTTP/2 푸시를 대신 사용하는 것이다. 이 방법을 이용하면 사용자의 브라우저가 HTML을 가져오고 주요 자산의 다운로드를 시작하는 사이의 다운타임이 없다. 그러나 **HTTP/2** 를 이용할 때는 주의해야 한다. 사용자의 대역폭 사용을 매우 강제적으로 제어하는 방법이며 브라우저가 이미 캐시에 있는 파일을 가져오지 않는 등의 자체 결정을 내릴 수 있는 여지를 거의 남기지 않기 때문이다.
<br/>

## Preconnect

`<link rel="preconnect">`는 브라우저에 여러분의 페이지가 다른 출발지에 연결하도록 구축되었다는 것과, 가능한 한 빠르게 처리를 시작하고자 한다는 것을 알린다.

느린 연결에서는 연결 구축에 보통 상당한 시간이 소요되며, 특히 보안 연결의 경우에는 DNS 룩업 리디렉션, 사용자의 요청을 처리하는 최종 서버로의 여러 차례 왕복이 관여할 수 있으므로 더욱 그러하다. 이 모든 것을 미리 처리하면 대역록 사용에 대한 부정적인 영향이 없이 사용자에게 애플리케이션이 빠르다는 인상을 줄 수 있다. 연결 구축에 걸리는 시간 대부분은 데이터 교환이 아니라 기다리는 데 소요되기 때문이다.

```html
<link rel="preconnect" href="https://example.com">
```

위와 같은 경우는 [https://example.com에](https://example.com에) 연결하고 여기에서 콘텐츠를 가져오려 한다는 것을 알린다.

`<link rel="preconnect">`에는 꽤 적은 비용이 들긴 하지만 여전히 상당한 CPU 시간을 차지할 수 있으며, 보안 연결의 경우 더욱 유념해야한다. 이것은 특히 연결이 10초이내로 사용되지 않아 브라우저가 닫히면, 이전의 모든 연결 작업을 낭비하기 때문에 좋지 않다.
<br/>

### 사용 사례: 미디어 스트리밍

연결 단계에서 시간을 절약하려 하지만 반드시 콘텐츠를 바로 가져올 필요는 없는 경우가 있다.

페이지가 스트림된 콘텐츠를 처리하는 방법에 따라 스크립트가 로드되고 스트림을 처리할 준비가 될 때까지 기다리고 싶을 수 있다. preconnect는 일단 가져오기를 시작할 준비가 되면서 단일 왕복으로 대기 시간을 줄이는 데 도움이 된다.
<br/>

## Prefetch

`<link rel="prefetch">` 는 중요한 것이 더 빠르게 일어나도록 하는 것이 아니라 기회가 있으면 중요하지 않은 것을 먼저 발생시키려 한다는 점에서 위의 2개와 다르다.

이 작업은 향후 탐색이나 사용자 상호작용에 필요할 수 있는 리소스를 브라우저에게 알림으로써 수행된다. 이러한 리소스는 현재 페이지가 로딩을 마쳤으며 사용가능한 대역폭이 있을 때 Chrome에서 가장 낮은 우선순위로 가져온다.

즉 prefetch는 사용자가 다음에 할 행동을 선점하여 준비하는데 가장 적합하다는 것을 의미한다. 예를 들어 결과 목록에서 첫 번째 제품 상세 페이지를 가져오거나 페이지 번호가 있는 콘텐츠의 다음 페이지를 가져오는 것이 여기에 해당한다.

```html
<link rel="prefetch" href="page-2.html">
```

단 미리 가져오기는 귀납적으로 작동되지 않는다. 위의 예에서 여러분은 HTML만 가져왔다. `page-2.html`에 필요한 리소스는 여러분이 명시적으로 미리 가져오지 않는한 다운로드되지 않는다.
<br/>

### 미리 가져오기는 재정의로 사용할 수 없음

기존 리소스의 우선 순위를 낮추는 방식으로 `<link rel="prefetch">`를 이용할 수 없다는 점을 아는 것이 중요하다. 다음 HTML에서 미리 가져오기에 `optional.css`를 선언하면 뒤따르는 `<link rel="stylesheet">`의 우선 순위를 낮출 것이다.

```html
<html>
  <head>
    <link rel="prefetch" href="optional.css">
    <link rel="stylesheet" href="optional.css">
  </head>
  <body>
    Hello!
  </body>
</html>
```

그러나, 사실 이 방법은 스타일 시트를 두 번 가져오도록 하며, 미리 가져오기가 각각의 가져오기에서 실행될 때 한번은 가장 높은 우선순위 기본값, 다른 한 번은 가장 낮은 우선순위로 가져온다.

![image](https://user-images.githubusercontent.com/24274424/61138686-e6ab1480-a502-11e9-9b84-3aa4e762d5dd.png)

<br/>

---

#### Reference

- [Link prefetching FAQ](https://developer.mozilla.org/ko/docs/Link_prefetching_FAQ)
- [리소스 우선순위 지정 - 브라우저의 도움 받기](https://developers.google.com/web/fundamentals/performance/resource-prioritization?hl=ko)
- [Preload, Prefetch And Priorities in Chrome](https://medium.com/@koh.yesl/preload-prefetch-and-priorities-in-chrome-15d77326f646)