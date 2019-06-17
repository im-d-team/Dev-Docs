# GET & POST

GET과 POST는 HTTP프로토콜을 이용해서 서버에 무언가를 전달하는 방법(method)이다.

<br/>

## 들어가기 전에...

HTTP프로토콜은 클라이언트와 서버가 소통하기위해 만들어진 프로토콜로, HTTP메세지를 서로 주고 받는다.

![get&post](/assets/images/get&post.png)

<br/>

## GET Method

GET은 서버에 있는 **정보를 조회**할때 사용된다. 따라서 전송되는 정보는 요청(request)을 위한 것이다.

데이터를 Body에 담지 않고 **URL형태(쿼리 스트링)로 표현**한다. 따라서, URL형식에 맞지 않은 데이터는 인코딩하여 전달하여야 한다.
> URL은 [퍼센트 인코딩](https://ko.wikipedia.org/wiki/%ED%8D%BC%EC%84%BC%ED%8A%B8_%EC%9D%B8%EC%BD%94%EB%94%A9)을 한다.
> 예시는 다음과 같다.
> ```html
> https://ko.wikipedia.org/wiki/퍼센트_인코딩 <!-- 아래와 같이 인코딩 된다.-->
> https://ko.wikipedia.org/wiki/%ED%8D%BC%EC%84%BC%ED%8A%B8_%EC%9D%B8%EC%BD%94%EB%94%A9
> ```

<br/>

데이터를 쿼리스트링으로 표현하여 전송하기 때문에, **body가 빈 상태**로 전송된다. 또한 헤더에 content-type이 들어가지 않는다. 

```
http://example.com/date.html?key=value&key=value
```

`?` 뒤에 key와 value의 쌍을 전송하고, `&`구분자를 통해 데이터를 나열한다.

> content-type : 데이터 설명 및 타입 명시

### 특징

* 캐싱이 가능하다.

* 브라우저 기록에 남는다.

* 북마크 될 수 있다.

* 절대  민감한 데이터를 다루면 안된다.

* 길이 제한이 있다.

* 데이터 요청에 사용된다(수정불가)

<br/>

## POST Method

POST는 서버의 리소스를 **생성하거나 수정**하기 위해 데이터를 보내는 것이다. **데이터는 body에 저장되어 전송**된다.

```
POST /target.html HTTP/1.1
Host: example.com
Content-Type: text/html; charset=utf-8
name1=value1&name2=value2
```

헤더필드에 content-type이 들어간다.

### 특징

* 캐싱 사용 불가

* 브라우저 기록에 남지 않는다.

* 북마크 될 수 없다.

* 데이터 길이제한이 없다.

<br/>

## 언제 써야하는가?

### GET은 가져오는 것

GET은 sql에 비유하면, SELECT적인 성향을 가진다. GET은 서버에서 데이터를 가져와서 보여주고 싶을 때 사용하는 것이다. 서버의 값이나 상태등을 바꾸지 않는다. 검색을 하거나 게시판의 글을 볼 때 주로 사용된다.

<br/>

### POST는 수행하는 것

서버의 값이나 상태를 바꾸기 위해 사용된다. 예를들어, 글쓰기를 하면 글의 내용이 서버에(DB) 저장되고, 수정을 하면 서버의 값이 수정되는 것이다.

<br/>

### 더 나아가서

기본적으로 두 방식 모두 클라이언트 측에서 볼 수 있기때문에 보안을 위해서는 암호화 해야한다.

GET방식의 요청은 캐싱(데이터저장)때문에 더 빠르다.

하지만, 비밀번호와 같은 민감한 정보의 경우 GET방식 대신 POST를 사용하여야 한다. 정보가 URL에 그대로 드러나는 문제도 있다. 또한, get방식은 requset를 통해 보낸 parameter가 브라우저에 기록에 남아 있는 방식이다. 반면, post는 parameter가 브라우저 기록이나 웹 서버 로그에 남지 않는다.

위와 같은 이유로 GET방식은 새로고침과 무관하지만, POST방식은 새로고침이나 뒤로가기한 뒤 페이지에 새로 접근하게되면 데이터가 다시 제출된다.

<br/>

------

#### Reference

* <https://blog.outsider.ne.kr/312>
* <https://mommoo.tistory.com/60>
* <http://www.ktword.co.kr/abbr_view.php?m_temp1=4884>
* <https://www.w3schools.com/tags/ref_httpmethods.asp>
