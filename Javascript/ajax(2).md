# Ajax (Asynchronous Javascript And XML)
- JavaScript 라이브러리인 Jquery의 기능 중 하나이며, Asynchronous Javascript And Xml의 약자이다.
- 전체 페이지를 새로 고치지 않고 페이지의 일부만을 위한 데이터를 로드하는 기법이다.  JavaScript를 사용한 비동기 통신, 클라이언트와 서버 간에 XML 데이터를 주고받는 기술이다. 이는 동적인 화면 처리를 가능하게 해준다.
즉, 자바스크립트를 사용하여 서버에 데이터를 요청하는 것이다.

#### 비동기 방식이란?

- 비동기 방식이란 요청을 보냈을 때 그에 따른 응답이 올 때까지 기다리는 것이 아닌 다른 작업을 할 수 있는 방식을 말한다.
- 비동기 방식을 이용하면 클라이언트가 데이터 요청을 보냈을 때 다른 작업을 하면서 데이터를 받는 것이므로 데이터가 올 때마다 부분 로딩이 된다. 따라서 시간 낭비를 줄여 속도가 빠른 장점이 있다.


## Ajax를 사용하는 이유
- 기본적으로 [HTTP 프로토콜](https://github.com/Im-D/Dev-Docs/blob/master/Network/HTTP%20vs%20WebSocket.md#http)은 클라이언트 쪽에서 Request를 보내면 서버 쪽에서 Response를 보내 페이지 전체가 리로드됨.
따라서 화면의 내용을 갱신하기 위해서는 다시 request, response를 하는 과정을 거쳐 페이지 전체를 갱신해야 한다. 하지만 이럴 경우, 자원낭비와 시간낭비를 초래하게 된다.

- Ajax는 HTML 페이지 전체가 아닌 일부분만 갱신할 수 있도록 JSON이나 XML 형태로 필요한 데이터만 받아 갱신하기 때문에 그만큼의 자원과 시간을 아낄 수 있다.

## Ajax의 장단점
###   Ajax의 장점
- 웹페이지의 속도를 향상시켜준다.
- 서버의 처리가 완료될 때까지 기다리지 않고 처리 가능하다.
- 수신 데이터의 양을 줄일 수 있다.

###   Ajax의 단점
- 연속으로 데이터를 요청하면 서버 부하가 증가할 수 있다.
- Ajax를 이용하면 웹브라우저의 history 기능과 연동이 되지 않아 히스토리 관리가 어렵다.

웹 브라우저는 서버에서 받아온 웹 페이지를 로컬에 저장해둔다. 페이지가 바뀔 때마다 그 웹페이지를 저장해 두고, 만약 사용자가 뒤로 가기 버튼을 누르면, 서버와의 통신 없이 자신의 로컬에 저장해 둔 웹페이지 화면을 보여준다. 이것을 [history](https://developer.mozilla.org/ko/docs/Web/API/Window/history)기능이라고 한다. 다시 말해 `html`을 `history`에 저장한다. 하지만 브라우저는 'html'만을 히스토리에 저장하고 'XmlHttpRequest'에 의해 받아온 것들은 'history'에 저장하지 않는다. 만약 'Ajax'를 이용하여 데이터를 받아왔다면 사용자가 뒤로 가기 버튼을 클릭하였을 때 히스토리에 남아있지 않기 때문에 아예 첫 화면으로 가버리는 상황이 발생한다.
이 때문에 'history'객체의 관리가 어렵다는 단점이 있다.


## Ajax 구현방식
### 1. XMLHttpRequest 객체
- 서버와 통신하기 위해 XMLHttpRequest 객체를 사용해서 Ajax를 요청하고 전송한다.  
- xml, json, http 등 다양한 포맷을 주고받을 수 있다. 
- XMLHttpRequest를 이용하면 웹 페이지를 전부 로딩하지 않고도 일부만을 갱신하는게 가능해진다.

###  AJAX의 요청 및 응답처리 과정
**1.XMLHTTP request object를 만든다.**
```java
var xhr= new XMLHttpRequest();
```

request를 보낼 준비를 브라우저에게 시키는 과정이다. 
이것을 위해서 필요한 method를 갖춘 object가 필요하다.

**2.Open a request**

```java
xhr.open(‘GET’,”sidebar.html”,true);
```

세 개의 매개변수(HTTP 메서드/요청 처리할 페이지의 URL/비동기 여부)를 정의한다.

post, get메소드에 따라 전송 방식에 차이가 있다. 

- GET 메소드의 경우, URL의 일부분인 쿼리문자열(query string)로 데이터를 서버로 전송한다.
- POST 메소드의 경우, 데이터(페이로드)를 Request Body에 담아 전송한다.

**3.send the request**
```java
xhr.send();
```

준비된 request를 서버에 전송한다.


**4.callback 함수를 만든다.**

```java
xhr. onreadystatechange = function(){
	 if(xhr.readyState===4){
		document.getElementById(‘ajax’).innerHTML= xhr.responseText;   
     }
}
```

- 'onreadystatechange' : 서버에서 response가 와서 변화가 일어났을 때, 이에 대응해서 일어나는 메소드

- 'readyState' : response가 돌아왔는지 아닌지를 추적하는 property

|  숫자  |  상태 |
| ------------ | ------------ |
| 0  | request 가 초기화가 안된 상태  |
|  1 |  서버에 연결이 완료된 상태 |
| 2  | 서버가 request를 받은 상태  |
| 3  | 서버가 request를 처리하는 상태  |
| 4 | request 처리가 끝나고, response가 준비된 상태 |


## 2. $.ajax()메소드 (jQuery 사용)

1. type : get, post 등의 전송 방식을 결정
2. url : 접근할 url을 입력
3. data: 전달할 파라미터 값을 설정
4. dataType : 파싱할 파일 형태를 입력(Ex. json, html, xml)
5. success : 성공할 경우 불러올 콜백함수, 반환되는 코드(html, xml 등등)를 사용가능
6. error : 실패할 경우 불러올 콜백함수
7. complete : 성공 또는 실패 뒤에 실행할 콜백함수
8. jsoncallback : 성공시 불러올 함수

>### 예제
```java
$.ajax({ 
	url:'/study/tmp/test.php', //request 보낼 서버의 경로  
	type:'post', // 메소드(get, post, put 등)  
	data:{'id':'admin'}, //보낼 데이터  
	dataType:'json'  
	success: function(data) {  
		//서버로부터 정상적으로 응답이 왔을 때 실행  
	},   
	error: function(err) {  
		//서버로부터 응답이 정상적으로 처리되지 못했을 때 실행
	}  
})  
	
```
	
####  jquery를 이용해서 Ajax를 사용하는 이유 
일반 javascript로  Ajax를 하게 되면 코딩 양도 많아지고 브라우저별로 구현 방법이 다른 단점이 있다.
jquery를 이용하면 더 적은 코딩 양과 동일한 코딩 방법으로 대부분의 브라우저에서 같은 동작을 할 수 있음




------------




#### Reference 
- [Ajax 기존 구문 및 예제](https://dororongju.tistory.com/96) 
- [Ajax의 과정](https://poiemaweb.com/js-ajax)
- [jquery를 이용하는 이유](https://kdarkdev.tistory.com/26) 

