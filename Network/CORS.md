# CORS(Cross-Origin Resource Sharing)

## Same Origin Policy

일반적인 HTTP 요청은 다른 도메인의 자원을 요청하는 것이 가능하다 이를 Cross-Site HTTP Request라고 한다.

그렇지만 script에서 다른 자원의 요청은 원칙적으로 동일한 도메인에서만 허용한다.
이를 [Same-Origin olicy](https://developer.mozilla.org/ko/docs/Web/Security/Same-origin_policy)라고 한다.

**Same Origin Policy**란 script 내에서 다른 도메인의 script와 상호작용 하는 것을 제한하는 정책이다. 출처가 같다는 것은 같은 도메인, 정확하게는 동일한 protocol, port, host를 말한다.

[XHR](https://developer.mozilla.org/ko/docs/Web/API/XMLHttpRequest), [AJAX](https://ko.wikipedia.org/wiki/Ajax)를 사용하며 개발하게 되면 이 정책을 깨고 자원을 이용하는 경우가 너무 많다.

특히 현대의 SPA방식의 개발은 필수적이다.

이 Same Origin Policy을 깨트리며 통신하는 대표적인 방법으로 CORS, JSONP가 있다.

## CORS

CORS는 크로스 도메인 이슈를 해결하는 사실상의 표준 방법이다. 클라이언트 측에서는 따로 설정할 것이 없다. 서버측에서 HTTP response Header에 허용 가능한 도메인을 설정해주면 된다.

### Preflight Request

![preflight-process](/assets/images/preflight-process.png)

CORS를 이용하면 위의 그림처럼 preflight와 실제 요청으로 나뉘어 총 두 번의 request가 발생한다.

1. 클라이언트가 서버에 자원의 이용 권한이 어떻게 되는지 OPTIONS 메서드를 이용해 Preflight request 보낸다.
2. 서버는 관련 정보를 헤더에 담아 response를 보낸다.
3. 실제 request를 보낸다.

이 때 OPTIONS라는 HTTP method는 body가 없고 header만 주고 받는다.

### Request 헤더

---

|           HTTP Header            |          Description           |
| :------------------------------: | :----------------------------: |
|   Origin    |     요청을 보내는 `페이지 출처`     |
| Access-Control-Request-Method |    실제 요청하려는 `메서드`     |
|   Access-Control-Request-Headers   |    실제 요청에 포함된 `헤더` 설정     |

### Response 헤더

---

|           HTTP Header            |          Description           |
| :------------------------------: | :----------------------------: |
|   Access-Control-Allow-Origin    |     접근 가능한 `url` 설정     |
| Access-Control-Allow-Credentials |    접근 가능한 `쿠키` 설정     |
|   Access-Control-Allow-Headers   |    접근 가능한 `헤더` 설정     |
|   Access-Control-Allow-Methods   | 접근 가능한 `http method` 설정 |
|   Access-Control-Max-Age   | 캐시 유지 시간 |


```http
Access-Control-Allow-Origin : *  //(1)
Access-Contorl-Allow-Credentials : true //(2)
Access-Control-Allow-Headers : X-Requested-With, Content_Type, Origin, Accept, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization   
Access-Control-Allow-Methods : GET, POST, DELETE, OPTIONS // (3)
Access-Control-Max-Age : 3600 //(4)
```
1. \* 이면 모든 도메인의 요청을 허용한다.  
2. 쿠키를 사용하여 인증하는 경우 
3. `GET`, `POST`, `DELETE`, `OPTIONS` 메소드를 허용한다. 특히 `OPTIONS`메소드는 `Preflight request`를 받기 위해 허용해줘야한다. 
4. 캐시를 유지할 시간이며 ms단위.

## JSONP(JSON with Padding)

CORS 등장 이전에 사용되던 방식이다.

위에서도 말했듯이 script 내에서는 다른 도메인의 script를 사용할 수 없다. 

script 내에서는 실행할 수 없지만 html이 `<script>` 태그를 요청하여 실행 것은 여전히 허용된다.

이 점을 이용한 방법이 JSONP방식이다.

client

```js

function myCallback(data){
  // do something
};

const script = document.createElement('script');
script.src = '//test.com/jsonp?callback=myCallback&q=jin' document.getElementsByTagName('head')[0].appendChild(script); // 함수 실행
```

server

```js
const userCallback = request.params.callback;
const query = request.params.q;
const data = model.find(query);
res.send(`${userCallback}(${data})`);
```

1. 클라이언트에서 콜백을 미리 정의한다.
2. script의 url에 콜백 이름을 같이 보낸다.
3. 서버에서는 로직 처리 이후 `callback명(data)` 의 형식으로 함수를 실행하는 string을 보낸다.
4. script태그를 dom에 붙이면 바로 요청-응답이 이루어지며 string을 스크립트처럼 실행시킨다.

이렇게 html의 `<script>` 태그를 이용하여 콜백을 실행시키는 방법이 JSONP다.

W3C의 CORS 등장 이후 CORS가 거의 표준처럼 자리잡은 뒤로는 잘 사용하지 않는다.

---

#### Reference

- [Cross Origin Resource Sharing - CORS](https://homoefficio.github.io/2015/07/21/Cross-Origin-Resource-Sharing/)
- [JSONP 알고 쓰자](http://kingbbode.tistory.com/26)
- [javascript ajax 크로스 도메인 요청하기(CORS)](http://enterkey.tistory.com/409)
- [CORS 크로스 도메인 이슈 (No 'Access-Control-Allow-Origin' header is present on the requested resource)](http://ooz.co.kr/232)
- [Enabling Cross Origin Requests for a RESTful Web Service](https://spring.io/guides/gs/rest-service-cors/)
- [javascript ajax 크로스도메인 요청-CORS](https://brunch.co.kr/@adrenalinee31/1)
