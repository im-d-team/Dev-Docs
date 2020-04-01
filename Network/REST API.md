

# REST API란
문제 정의: Client와 *Web* Server는 어떻게 소통하는가?

<br/>

## REST (REpresentational State Trasfer)
**HTTP** 기반의 **네트워크 아키텍처 원리** 중 하나.   
- **HTTP**: Web 상에서 Data를 주고받을 수 있는 Protocol
- **네트워크 아키텍처 원리**: Resource(자원)을 정의하고 Resource에 대한 URI를 지정하는 방법 전반을 일컫는다.

<br/>

## API (Application Programming Interface)
프로그램과 또 다른 프로그램을 연결해주는 매개체
### 예시
* 내 서비스에 구글 맵을 띄우고 싶을 때, 구글 Map API를 이용해서 구현한다.
* 앱에 카카오톡 로그인을 넣고 싶을 때, 카카오톡 로그인 API를 사용한다.
* 사용자 A에 대한 정보가 필요할 때 DB에 직접 접속하지 않고 getInfo같은 API를 통해 정보를 가져온다.

### API 작성 방법
[작성 방법](https://github.com/yoondo/http-api-design/tree/master/ko)


<br/>

## REST API
REST를 통해 API를 구현한 것. Web에서 사용한다.  

### HTTP Packet(데이터 형식)  
![image](https://user-images.githubusercontent.com/43839938/77837073-ab8b6700-719f-11ea-90ee-ae1d2f4b314f.png)![image](https://user-images.githubusercontent.com/43839938/77837076-be05a080-719f-11ea-91fb-f5bf195875a9.png)  <br>

#### [Request Line]  HTTP METHOD

| METHOD  | Description  |
| ------------ | ------------ |
| GET | 리소스 조회  |
| POST  | 리소스 생성 |
| PUT   | 리소스 수정  |
| DELETE   | 리소스 삭제  |
| PATCH | 리소스 일부 수정 |


```
GET /members/1  #1번 member의 정보 조회
POST /members/2 # 2번 member의 정보 생성(추가)
```

#### [Request Line] 변수 전달 방법

##### 1) Path Variable
> GET /users/14579
> GET /users/:userNo  
> GET /users/{userNo}  
##### 2) Query String(Params)
> GET /users/?age=14&name=%이%

### [HEADER]  
header: meta-data (data에 대한 설명을 제공하는 data)  
<img src="https://user-images.githubusercontent.com/43839938/77837595-d678b980-71a5-11ea-879b-5118474e1d22.png" width="50%">
### [BODY] Data 종류
##### 1) RAW: XML, JSON
	참고: XML에 비한 JSON의 장점 
	1) 저장할 data가 줄어든다. (data와 직접적인 연관이 없는 태그들이 사용되지 않기 때문이다.) 
	2) JSON은 Object 형태이다. 다루기 용이하다. 
##### 2) Form

<br/>

## RESTful 한 API 설계 방법
### REST API 중심 규칙
1) URI는 정보의 자원을 표현한다. (Resource명은 명사로)
> GET /members/delete/1 (잘못됨)
2) 자원에 대한 행위는 HTTP Method로 표현한다.
> DELETE /members/1 (위의 예시를 바르게 표현한 경우)

**즉, [행위(V) - 자원(N)] [Method - URI(Resource)]를 구분함으로써 RESTful한 API를 설계할 수 있다.**

### 주의점
1) 슬래시(/)는 계층 관계를 나타낼 때 사용한다.
> GET /houses/apartments/12345
> GET /animals/mammals/whales/1


2) URI 마지막 문자로 슬래시(/)를 포함하지 않는다.
> GET /houses/apartments/ (X)
> GET /houses/apartments  (0)


3) 밑줄(_)이 아닌 하이픈(-)으로 의미를 구분하자.
> POST /users/14579/blocked-user


4) URI 경로는 소문자가 적합하다.


5) 파일 확장자는 URI에 포함시키지 않는다. 


6) Collection은 복수로 표현하자.
> GET sports/soccer/players/13

### 응답코드
![응답코드](https://user-images.githubusercontent.com/43839938/77838355-2f4c5000-71ae-11ea-85b6-ae1ad5cc8532.JPG)

------------
#### 참고자료
* **REST API 제대로 알고 사용하기**  https://meetup.toast.com/posts/92   
* **REST** https://ko.wikipedia.org/wiki/REST  
* **REST API** https://link.medium.com/SbA8UFpRw4   
* **API 란?**  https://link.medium.com/FDERJUxX83  
* **GET, POST** https://mommoo.tistory.com/60  
* **HTTP** https://withbundo.blogspot.com/2017/07/http-10-http.html?spref=tw
* **Internet과 Web** http://tcpschool.com/webbasic/intro
* **Types of Internet Protocols** http://bitly.kr/AuC7wV  
응용 계층 - 전송 계층 - 인터넷 계층 - 링크 계층 
응용계층: HTTP, HTTPS, FTP, SMTP, MQTT, SSH, TSL/SSL
전송계층: TCP/UDP
*  Internet 구성원으로서의 **Server, Client:** http://tcpschool.com/webbasic/www  
* **URL, URI** 차이 http://bitly.kr/6WSgNSeY  
URL(Uniform Resource Locator): 자원(이 있는 곳)  
URI (Uniform Resource Identifier): 자원 식별자 / 자원에 접근하기 위한 표현 방식.   
URL, URI를 명확하게 구분하는 것 보다 URI는 REST 등장 이후 의미 단위로 구분하기 위한 용어임을 알아두자.
* **SDK, API** 차이
https://hyesunzzang.tistory.com/90
