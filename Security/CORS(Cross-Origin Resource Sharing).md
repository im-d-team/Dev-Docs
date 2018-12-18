# CORS(Cross-Origin Resource Sharing)

<br/>

## Same Origin Policy

기본적으로 HTTP 요청은 Cross-Site HTTP Requests가 가능하다.

즉, `<img>`, `<link>`, `<script>` 태그로 **다른 도메인의 이미지, CSS, 자바스크립트 라이브러리르 가져오는 것이 가능**하다.

하지만, `<script></script>`내의 스크립트에서 생성된 HTTP Request는 **Same Origin Policy**가 적용되기 때문에 Cross-Site Http Requests 가 불가능하다.

쉽게 설명하면, **요청을 보내고자 하는 대상과 프로토콜도 같아야 하고, 포트도 같아야 함을 의미**한다.(서브 도메인 네임은 무관)

그러나, `AJAX`가 널리 사용되면서 <script></script>로 둘러싸여 있는 스크립트에서 생성되는 **XMLHttpRequest에 대해서도 Cross-Site HTTP Requests가 가능해야 한다는 요구**가 늘어났고 W3C에서 **CORS**라는 이름의 권고안이 나오게 되었다.

<br/>

## JSONP(JSON with Padding)

위에서도 말했듯이 `<scirpt>`로 받아오는 리소스 파일은 Same Origin Policy에 영향을 받지 않고, 받아올 수 있다. 

이러한 점을 이용해 **서버에서 js 리소스 파일을 읽어오듯이 요청에 대한 결과를 json으로 바꿔주는 방식**이다. 

`Jsonp` 는 Json 데이터가 들어 있는 함수 형태의 데이터를 받아서 내 함수를 호출 하는 방식으로 실행된다.

```js
$.ajax({ 
    url: url, 
    dataType: 'json', 
    data: data, 
    success: 
    callback 
}); 

$.getJSON(url, data, callback); 
```

```js
$.ajax({ 
    url: url, 
    dataType: 'jsonp', 
    jsonpCallback: "myCallback", 
    success: callback 
}); 

$.getJSON(url + "?callback=?", data, callback);
```

여기서 알아야 할 것은 **Callback 함수명으로 감싸주는 것은 클라이언트 단에서 지원하여 처리해주는 것이 아니다.**

서버에서 감싸진 형태의 Text로 내려주어야 한다.

하지만 GET 방법만을 지원하고 보안상 이슈로 인해 CORS 방법을 추천하는 분위기라고 한다.

<br/>

## Preflight Request

![preflight-process](/assets/images/preflight-process.png)

요청하는 URL이 외부 도메인일 경우에, **브라우저에서는 서버에 사전 요청을 먼저 보낸다.**

사전 요청(Preflight Request)을 보내 **요청할 수 있는 권한을 확인하는 것**이다.

서버 측에서는 사전 요청을 처리할 수 있는 기능이 추가되어야 한다.

<br/>

### Request 헤더

---

|           HTTP Header            |          Description           |
| :------------------------------: | :----------------------------: |
|   Origin    |     요청을 보내는 `페이지 출처`     |
| Access-Control-Request-Method |    실제 요청하려는 `메서드`     |
|   Access-Control-Request-Headers   |    실제 요청에 포함된 `헤더` 설정     |

<br/>

### Response 헤더 

---

|           HTTP Header            |          Description           |
| :------------------------------: | :----------------------------: |
|   Access-Control-Allow-Origin    |     접근 가능한 `url` 설정(`*`은 모든 도메인에 대해 요청 허용)     |
| Access-Control-Allow-Credentials |    접근 가능한 `쿠키` 설정     |
|   Access-Control-Allow-Headers   |    접근 가능한 `헤더` 설정     |
|   Access-Control-Allow-Methods   | 접근 가능한 `http method` 설정 |


<br/>

위의 **`Request Header` 값을 보고 서버 측에서는 `Response Header`에서 해당 도메인(Origin)에 해당하는 요청 스펙을 알려주면 된다.** 

Spring Framework에서는 Filter나 Interceptor를 이용해 구현하거나 CORS를 서포트 해주는 어노테이션으로 구현할 수 있다.

<br/>

---

#### Reference

- [Cross Origin Resource Sharing - CORS](https://homoefficio.github.io/2015/07/21/Cross-Origin-Resource-Sharing/)
- [JSONP 알고 쓰자](http://kingbbode.tistory.com/26)
- [javascript ajax 크로스 도메인 요청하기(CORS)](http://enterkey.tistory.com/409)
- [CORS 크로스 도메인 이슈 (No 'Access-Control-Allow-Origin' header is present on the requested resource)](http://ooz.co.kr/232)
- [Enabling Cross Origin Requests for a RESTful Web Service](https://spring.io/guides/gs/rest-service-cors/)

