# CORS(Cross-Origin Resource Sharing)

## Same Origin Policy

기본적으로 HTTP 요청은 Cross-Site HTTP Requests가 가능하다.

즉, `<img>`, `<link>`, `<script>` 태그로 **다른 도메인의 이미지, CSS, 자바스크립트 라이브러리를 가져오는 것이 가능**하다.

하지만, `<script></script>`내의 스크립트에서 생성된 HTTP Request는 **Same Origin Policy**가 적용되기 때문에 Cross-Site Http Requests 가 불가능하다. 

**Same Origin Policy**란 다른 출처의 Resource와의 통신을 제한하는 보안 방식이다. 출처가 같다는 것은 현재 페이지와 동일한 프로토콜, 포트, 호스트를 갖는 것을 말한다. 쉽게 말하자면, `<script></script>`내의 스크립트에서 생성된 Http Request는 그 페이지와 같은 서버에 있는 주소로만 전달될 수 있다. 

그러나, `AJAX`가 널리 사용되면서 `<script></script>`로 둘러싸여 있는 스크립트에서 생성되는 **XMLHttpRequest에 대해서도 Cross-Site HTTP Requests가 가능해야 한다는 요구**가 늘어났고 W3C에서 **CORS**라는 이름의 권고안이 나오게 되었다.

<br/>  

## CORS
CORS는 Same Origin Policy에 반해 외부 요청을 허용하는 방식 중 하나이다. 서버에서 외부 요청을 허용함으로써 다른 출처의 스크립트, 문서 등을 주고 받을 수 있다. CORS 요청의 종류 중 하나로 **Preflight**이 있다. 

### Preflight Request

![preflight-process](/assets/images/preflight-process.png)

`Preflight Request`는 사전 요청과 본 요청으로 나뉘어 전송된다. 

요청하는 URL이 외부 도메인일 경우에, **브라우저에서는 서버에 사전 요청을 먼저 보낸다.**

사전 요청(Preflight Request)을 보내 **요청할 수 있는 권한을 확인하는 것**이다.

요청이 허용된 경우 본 요청을 서버에 전송하게 된다.

따라서 서버 측에서는 사전 요청을 처리할 수 있는 기능이 추가되어야 한다.

<br/>

### Request 헤더

---

|           HTTP Header            |          Description           |
| :------------------------------: | :----------------------------: |
|   Origin    |     요청을 보내는 `페이지 출처`     |
| Access-Control-Request-Method |    실제 요청하려는 `메서드`     |
|   Access-Control-Request-Headers   |    실제 요청에 포함된 `헤더` 설정     |


<br/>

### Response 헤더 - 요청 핸들링

---

|           HTTP Header            |          Description           |
| :------------------------------: | :----------------------------: |
|   Access-Control-Allow-Origin    |     접근 가능한 `url` 설정     |
| Access-Control-Allow-Credentials |    접근 가능한 `쿠키` 설정     |
|   Access-Control-Allow-Headers   |    접근 가능한 `헤더` 설정     |
|   Access-Control-Allow-Methods   | 접근 가능한 `http method` 설정 |
|   Access-Control-Max-Age   | 캐시 유지 시간 |


예제
```java
Access-Control-Allow-Origin : *  //(1)
Access-Contorl-Allow-Credentials : true //(2)
Access-Control-Allow-Headers : X-Requested-With, Content_Type, Origin, Accept, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization   
Access-Control-Allow-Methods : GET, POST, DELETE, OPTIONS // (3)
Access-Control-Max-Age : 3600 //(4)
```
(1) * 이면 모든 도메인의 요청을 허용한다.  
(2) request에서 쿠키를 통해 자격 증명을 하는 경우 true로 지정해줘야 요청이 성공된다.  
(3) `GET`, `POST`, `DELETE`, `OPTIONS` 메소드를 허용한다. 특히 `OPTIONS`메소드는 `Preflight request`를 받기 위해 허용해줘야한다.     
(4) `Preflight request` 캐시를 유지할 시간을 말한다. 3600은 1시간으로, 1시간 동안 서버에 재요청을 하지 않아도 된다.

<br/>

위의 **`Request Header` 값을 보고 서버 측에서는 `Response Header`에서 해당 도메인(Origin)에 해당하는 요청 스펙을 알려주면 된다.** 

Spring Framework에서는 Filter나 Interceptor를 이용해 구현하거나 CORS를 서포트 해주는 어노테이션으로 구현할 수 있다.

<br/>

## JSONP(JSON with Padding)

CORS 구현이 안되어 있는 서버로 접근하고자 할 때 Same Origin Policy를 회피할 수 있는 방법 중 하나로 JSONP가 있다.

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

## 

---

#### Reference

- [Cross Origin Resource Sharing - CORS](https://homoefficio.github.io/2015/07/21/Cross-Origin-Resource-Sharing/)
- [JSONP 알고 쓰자](http://kingbbode.tistory.com/26)
- [javascript ajax 크로스 도메인 요청하기(CORS)](http://enterkey.tistory.com/409)
- [CORS 크로스 도메인 이슈 (No 'Access-Control-Allow-Origin' header is present on the requested resource)](http://ooz.co.kr/232)
- [Enabling Cross Origin Requests for a RESTful Web Service](https://spring.io/guides/gs/rest-service-cors/)
- [javascript ajax 크로스도메인 요청-CORS](https://brunch.co.kr/@adrenalinee31/1)
