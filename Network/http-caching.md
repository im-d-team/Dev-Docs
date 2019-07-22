# HTTP caching

웹 자원을 요청할 때 같은 자원을 재요청하지 않기 위해 사본을 만들어 저장하는 데 이를 캐싱이라 한다.

아주 간단한 예로 랜딩 페이지의 로고 같은 것은 랜딩 페이지를 도착할 때마다 요청한다. 이를 캐싱해놓으면 재요청을 보내지 않음으로 네트워크 트래픽을 줄인다.

네트워크 트래픽 말고도 장점이 한 가지 더 있다.
통신은 물리적인 거리와도 연관이 있다. 그 속도마저 너무 빨라 우리 눈에 보이지는 않지만, 거리에 따라 속도가 다르다.

만일 실제 서버와 클라이언트의 물리적인 거리가 멀고 요청하는 자원의 크기가 크고 양이 많다면 속도가 느려질 수 있다.
쉽게 유튜브를 떠올리자.
유튜브의 실제 서버가 미국에 있다고 가정하면 한국 클라이언트들은 미국 클라이언트들보다 현저히 응답 속도가 느릴 수 있다.
이 때 한국에 캐시 서버를 만들어 이 문제를 해결할 수 있다.

## 캐싱의 종류

캐싱에는 public, private로 크게 두 가지 종류가 있다. 거창한 것은 아니다.

### public caching

public caching의 다른 명칭으로는 proxy cache, cache proxy server 등으로도 부른다.

큰 회사나 ISP(Internet Service Provider)의 방화벽에 설치된다.

### private caching

브라우저가 저장하는 캐시다. 브라우저는 자주 쓰이는 자원을 개인용 컴퓨터의 디스크와 메모리에 캐시해 놓은 후 불러온다.

![caching-in-browser](https://user-images.githubusercontent.com/24724691/61453854-32920980-a99a-11e9-91ba-728a2aaf2e18.PNG)

브라우저에서 개발자도구를 열면 위와 같은 화면을 볼 수 있다.

## Cache-control

캐시를 컨트롤하는 방법이다. 이 자원은 필히 캐시 되어야 한다 / 캐시 되면 안된다 / 캐시된 자원을 24시간 동안만 사용하고 그 뒤로는 다시 받아라 등의 명령을 내리는 것이 캐시 컨트롤이다.

현대의 브라우저에서는 이 HTTP-header를 이용하여 캐시 컨트롤을 한다.
header는 HTTP 1.0과 1.1버전에 따라 조금 다르다.

|            | 1.0 req           | 1.0 res       | 1.1 req       | 1.1 req       |
| ---------- | ----------------- | ------------- | ------------- | ------------- |
| validation | If-Modified-Since | Last-Modified | If-None-Match | ETag          |
| freshness  | Pragma            | Expires       | Cache-Control | Cache-Control |

### Cache-control header

cache control의 헤더는 request, response 모두 사용이 가능하다.

`Cache-Control: no-store`
`Cache-Control: no-cache, no-store, must-revalidate`

위와 같이 두 가지 표기법 모두 사용할 수 있다.

- `Cache-Control: no-store` : 캐시 하지 않음. 캐시를 저장(store)하지 않음을 의미하며 사본을 만드는 것을 금지한다.
- `Cache-Control: no-cache` : 사본을 저장은 한다. 즉 캐싱은 발생하지만, 서버와 재검사(revalidation) 과정을 거치고 클라이언트에게 제공된다. 영문으로는 **DO NOT Serve from cache without revalidation** 로 표기하고 있다.
- `Pragma: no-cache` : no-cache와 동일하지만 1.0방식임.

`no-store, no-cache`는 검증되지 않은 캐시가 제공되는 것을 막는다.

- `Cache-Control: private` : private caching에서만 가능
- `Cache-Control: public` : 모두 가능
- `Cache-Control: max-age=<seconds>` : cache가 유효한 시간. 즉 freshness를 보장할 수 있는 시간을 말한다. 요청을 보냈던 시간으로부터 상대적인 시간을 나타내며 초로 표기한다.
- `Cache-Control: s-maxage=<seconds>` : shared(공유)에서만 작동. 즉 public에서 작동함. maxage의 하이픈이 변경된 것에 주의하자.
- `Cache-Control: must-revalidate` : 특정한 상황(네트워크 연결 끊김)일 때 freshness 하지 않아도 캐시 파일을 제공하는 경우가 있다. 이를 막는다.
- `Cache-Control: proxy-revalidate` : shared(proxy)에서 작동하는 revalidate
- `Cache-Control: no-transform` : 이미지와 같은 리소스들에 저장 최적화를 위해 포맷하는 경우를 막는다.

## 캐시 동작 방식

버전이 다르면 동작 방식도 조금 다르므로 모두 알아보자.

### 공통

캐시가 동작하는 공통 로직은 다음과 같다.

최초 요청 후 응답헤더에 `Last-Modified, Etag, Expires, Chach-Control: max-age` 항목이 존재한다면 캐시 한다.

### 1.0

1.0 방식에서는 응답 헤더에 Expires를 받는다.

`Expires: 19 July 2019`

유효기간의 절댓값을 받기 때문에 이 절댓값을 클라이언트의 시간과 비교한다. 기간이 만료되었다면 서버를 거치지 않고 캐시한 자원을 사용한다.

Expires가 지난 경우 validation 작업을 진행한다.

브라우저는 최초 응답 헤더의 Last-Modified 값을 If-Modified-Since의 값으로 설정하여 요청을 보낸다.

> 브라우저 ==== `If-Modified-Since: 10 July 2019` ===> 서버

`10 July 2019`가 Last-Modified 값이다.

서버는 이 요청을 받아 서버 자원의 마지막 수정날짜가 동일하다면 변동되지 않았다고, 동일하지 않으면 변동되었다고 판단한다.
변동되지 않았으면 304(Not Modified)번, 변동되었다면 200번 코드와 함께 새로운 자원을 내려보낸다.

### 1.1

1.1 방식에서는 응답 헤더에 max-age를 받는다.

`Cache-Control: max-age=3600`

상댓값이며 요청 시간(request를 보낸 시간)을 기준으로 계산한다. 기간이 만료되었다면 서버를 거치지 않고 캐시한 자원을 사용한다.

유효 기간이 지났다면 역시 validation 작업을 진행한다.

1.1은 Etag(Entity Tag)를 사용한다.

1.0과 비슷하게 Etag값을 If-None-Match의 값으로 설정하여 요청을 보낸다.

> 브라우저 ==== `If-None-Match: e1qwok/-qwe1` ===> 서버

서버는 자원이 갱신되면 항상 Etag값을 갱신한다. 따라서 값이 같다면 변동되지 않았으므로 304, 다르다면 변동된 파일이므로 200번 값을 응답한다.

### 우선순위

브라우저는 1.1 방식을 우선 탐색한다. 만일 `Cache-Control`과 같은 것이 없다면 1.0방식이 있는지 찾게 된다.

`Cache-Control, Expires`가 모두 없다면 `Last-Modified`를 기준으로 [휴리스틱 방법](https://ko.wikipedia.org/wiki/%ED%9C%B4%EB%A6%AC%EC%8A%A4%ED%8B%B1_%EC%9D%B4%EB%A1%A0)을 이용하여 어림짐작한다.

휴리스틱 추측 중 하나로 LM인자 알고리즘이 있는데 간단하게만 알아보자.

- 캐시된 문서의 `Last-Modified`(변경된 날짜)가 오래전이라면 자주 변경되지 않으므로 조금 더 가지고 있어도 괜찮을 것이다.
- 캐시된 문서가 최근에 변경되었다면 자주 변경되는 문서이므로 짧게 캐시 해야 할 것이다.

이러한 기준을 바탕으로 브라우저마다 조금씩 다르게 유효기간을 정한다.

예를 들어 크롬은 `freshnessLifeTime = (headerDate - lastModified) / 10`을 사용한다.

---

### 참고자료

- [HTTP 캐싱](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching?hl=ko)
- [HTTP caching](https://developer.mozilla.org/ko/docs/Web/HTTP/Caching)
- [Cache-Control](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Cache-Control)
- [알아둬야 할 HTTP 쿠키 & 캐시 헤더](https://www.zerocho.com/category/HTTP/post/5b594dd3c06fa2001b89feb9)
- [더 빠른 웹을 위하여](https://cyberx.tistory.com/9)
- [휴리스틱 이론](https://ko.wikipedia.org/wiki/%ED%9C%B4%EB%A6%AC%EC%8A%A4%ED%8B%B1_%EC%9D%B4%EB%A1%A0)
- HTTP 완벽가이드 - 웹은 어떻게 동작하는가, 인사이트ORIEILLY
