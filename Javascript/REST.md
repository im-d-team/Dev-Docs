# REST

## REST(Rpresentational State Transfer)란

### HTTP에서의 representation   
HTTP GET 요청에 대한 응답으로 다음을 받았다고 가정해보자.

```html
HTTP/1.1 200 OK  
Content-Length: 6  
Date: Sun, 18 Aug 2019 10:20:47 GMT  
Last-Modified: Sun, 18 Aug 2019 08:00:00 GMT  
Content-Type: text/plain  
Content-Language: en   
    
hello
```  

이 응답을 보고, 요청에 대한 결과로 `hello`라는 resource를 받았다고 표현하는 경우가 흔하다. 하지만 이는 엄밀히 말해 틀린 말이다. `hello`는 resource가 아닌 **representation data** 이기 때문이다.   

GET 메소드 정의는 다음과 같다.  
`The GET method requests a representation of the specified resource.`  
즉, GET 메소드는 특정 리소스에 대한 하나의 representation을 반환한다. 그러므로 `hello를 담고 있는 문서`가 리소스고, `hello`는 representation이다. representation은 representation metadata와 representation data로 구성된다. 위에서 받은 응답을 나눠보면 다음과 같다. 

```html
<!--representation metadata-->
Content-Type: text/plain  
Content-Language: en  
```

```html
<!--representation data-->
hello
```  

### Representational State Transfer
HTTP에서의 representation은 REST의 representation에서 도입된 개념이다.   
*Representational State Transfer*의 단어를 각각 해석하면 다음과 같다.   
* Representation : 어떤 리소스의 특정 시점에 대한 상태를 반영하고 있는 정보
* State : 웹 애플리케이션(웹 서버에 접속하여 사용자에게 가치를 제공하는 웹 브라우저)의 상태
* Transfer : 서버에서 클라이언트로 리소스의 상태 전송

클라이언트가 `https://example.com/A`에서 `https://example.com/B`로 이동했다고 가정해보자.  
페이지를 이동하면서 새로운 representation이 transfer 되었고, state가 변경되었다. 이를 REST라고 한다.  

<br/>

## REST API란
REST API는 일반적으로 HTTP 프로토콜을 통해 데이터를 전달하거나 가져오는 API이다.

<br/>

## RESTful이란
REST의 기본 원칙을 성실히 지킨 서비스 디자인을 **RESTful**이라고 한다.

#### Reference
[REST(Representational State Transfer) API](https://poiemaweb.com/js-rest-api)
[REST의 representation이란 무엇인가](https://blog.npcode.com/2017/04/03/rest의-representation이란-무엇인가/)