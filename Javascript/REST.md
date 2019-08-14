# REST

## REST(REpresentational State Transfer)란

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

```
The GET method requests a representation of the specified resource.
```  

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

### REpresentational State Transfer
HTTP에서의 representation은 REST의 representation에서 도입된 개념이다.   
*REpresentational State Transfer*의 단어를 각각 해석하면 다음과 같다.   
* Representation : 어떤 리소스의 특정 시점에 대한 상태를 반영하고 있는 정보
* State : 웹 애플리케이션(웹 서버에 접속하여 사용자에게 가치를 제공하는 웹 브라우저)의 상태
* Transfer : 서버에서 클라이언트로 리소스의 상태 전송

클라이언트가 `https://example.com/A`에서 `https://example.com/B`로 이동했다고 가정해보자.  
페이지를 이동하면서 새로운 representation이 transfer 되었고, state가 변경되었다. 이를 REpresentational State Transfer, REST라고 한다.  

### 아키텍처 스타일
REST는 자원지향구조(ROA: Resource Oriented Architecture)이다. 웹 사이트의 텍스트, 이미지, DB 내용 등을 전부 하나의 자원으로 파악하여 각 자원에 고유한 HTTP URI를 부여한다. 그리고 해당 자원에 대한 CRUD작업을 HTTP의 기본 명령어인 POST, GET, PUT, PATCH, DELETE를 통해서 처리한다.  

따라서 REST는 HTTP 프로토콜을 활용해 웹의 장점을 극대화시키는 아키텍처 스타일이다. REST(Representational State Transfer)가 소프트웨어 아키텍처 스타일로 제안된 이후, REST는 급속하게 OPEN API를 개발하는 기본이 되었다.

<br/>

## REST API
 
### 중심규칙
REST API는 다음의 중심규칙을 갖는다.  

* URI는 자원을 표현하는 데에 집중한다. 즉, 동사보다 명사를 사용하도록 한다.
    
    ```js
    form.method = "get";
    // bad
    const url = "todo/show/A";
    // good
    const url = "todo/A";

    ```

* 행위에 대한 정의는 HTTP Method를 사용한다.
    
    ```js
    // bad
    form.method = "get";
    const url = "todo/delete/A";
    // good
    form.method = "delete";
    const url = "todo/A";
    ```

### HTTP Method
|Method|Action|역할|
|------|---|---|
|GET|index/retrieve|모든/특정 리소스 조회|
|POST|create|리소스 생성|
|PUT|update all|리소스 전체 갱신|
|PATCH|update|리소스 일부 갱신|
|DELETE|delete|리소스 삭제|

### 제약조건  

* Server-Client 구조 : 일관적인 인터페이스로 분리되어야한다. 
* Cacheable : HTTP 프로토콜을 따라 클라이언트의 응답을 캐싱할 수 있어야한다. 
* Stateless : HTTP 프로토콜을 따라 REST Server 역시 stateless(무상태) 해야한다. 즉, 서버에 클라이언트의 context 정보를 저장하지 않아야 하며 각각의 요청을 별개의 것으로 인식하고 처리해야 한다. 
* Layered System : REST를 사용하면 서버 A에 API를 배포하고, 서버 B에 데이터를 저장하고, 서버 C에 요청을 하는 계층화된 시스템을 구현할 수 있다. 계층화된 시스템에서는 비즈니스 로직을 수행하는 서버의 앞단에서 사용자 인증, 암호화 등의 보안 처리를 할 수 있으며, [로드 밸런싱](https://github.com/Im-D/Dev-Docs/blob/master/Network/%EB%A1%9C%EB%93%9C%EB%B0%B8%EB%9F%B0%EC%8B%B1%20%26%20%ED%81%B4%EB%9F%AC%EC%8A%A4%ED%84%B0%EB%A7%81.md)이나 공유 캐시 기능을 통해 시스템 규모 확장성을 향상시킬 수 있다.  
* Code-On-Demand(optional) : Server는 클라이언트가 실행시킬 수 있는 로직을 전송하여 기능을 확장시킬 수 있다.

### 장점
* HTTP 프로토콜의 인프라를 그대로 사용하므로 REST API 사용을 위한 별도의 인프라를 구축할 필요가 없다.
* HTTP 표준 프로토콜을 따르는 모든 플랫폼에서 사용 가능하다.
* REST API 메시지가 의도하는 바를 명확하게 나타내므로 의도하는 바를 쉽게 파악할 수 있다.
* 서버와 클라이언트의 역할이 명확히 구분된다. REST Server는 API를 제공하고 비즈니스 로직 처리 및 저장을 책임지며 클라이언트는 사용자 인증이나 context 정보를 직접 관리하고 책임진다. 

<br/>

#### Reference
[REST(Representational State Transfer) API](https://poiemaweb.com/js-rest-api)  
[REST의 representation이란 무엇인가](https://blog.npcode.com/2017/04/03/rest의-representation이란-무엇인가/)  
[REST란? REST API란? RESTful이란?](https://gmlwjd9405.github.io/2018/09/21/rest-and-restful.html)  
[REST API Tutorial](https://restfulapi.net/rest-architectural-constraints/#layered-system)