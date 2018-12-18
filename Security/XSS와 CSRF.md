# XSS와 CSRF

<br/>

## XSS(Cross-Site-Scripting)

XSS의 **공격 대상은 홈페이지 이용자**다. 서버에는 직접적인 영향을 주지 않지만 사이트 변조의 위험이 있는 공격이다.
**스크립트 태그 사용이 가능한 게시판에 스크립트를 불러오거나 직접 작성하여 클라이언트에서 오작동이 발생하도록 한다.**

<br/>

## XSS의 유형

### 저장 XSS

---

XSS 취약점이 있는 웹 서버에 공격용 스크립트를 입력시켜 놓고, **악성 스크립트가 삽입되어 있는 페이지를 방문하는 순간** 방문자의 브라우저를 공격하는 방식이다.

가장 일반적인 방법은 자극적인 제목을 가진 글을 게시판에 스크립트 태그를 포함하여 게시하는 것이다.

```js
<script>alert(document.cookie)</script>
```

예를 들어, 게시글 내용 중에 저런 코드를 삽입한다고 하면 게시글을 열었을 때 사용자의 쿠키 정보가 `alert`될 것이다. 물론, 공격자는 훨씬 복잡한 코드를 넣을 것이다.

### 반사 XSS

---

악성 스크립트가 포함된 **URL을 사용자가 클릭하도록 유도하고 클릭시** 클라이언트를 공격하는 것이다. 반사형 XSS는 전체적인 XSS 공격 중 가장 빈번한 공격 유형이다.

```js
192.168.0.115/news.php?title=1<script>alert('111')</script>

192.168.0.115/news.php?title=1<script>href.location("해커사이트")</script>

192.168.0.115/news.php?title=1<iframe src="해커사이트" width=400 height=400></iframe>
```

이런식의 URL을 배포하여 클라이언트가 클릭하면 취약사이트에 반사되어 XSS공격이 클라이언트에게 일어난다.

### DOM 기반 XSS

---

**DOM 환경에서 공격 URL을 통해** 사용자의 브라우저를 공격하는 것이다.

DOM 기반 XSS 공격은 **페이지 자체는 변하지 않으나, 페이지에 포함되어 있는 브라우저측 코드가 DOM 환경에서 악성코드로 실행**된다.

앞의 유형들과 차이점은 DOM 기반 XSS는 **서버와 관계없이** 브라우저에서 발생하는 것이 차이점이다.

<br/>

## XSS 방어 방법

### 인코딩

---

사용자의 입력값을 HTML 인코딩하여 반환한다.
방식은 악의적인 사용자가 삽입한 스크립트가 다른 사용자에게 실행 가능한 형태로 전달되지 않는다.

`<c:out>`과 `${}`의 차이를 보면 알 수 있다.
`<c:out>` 으로 출력할 경우 <, >가 `&lt;` `&gt;` 로 자동변환되지만 `${}`를 이용한 출력은 그렇게 되지 않는다.

### 시큐어 코딩

---

클라이언트에서 서버에서 내려준 변수에 대해서 스크립트가 포함된 태그인지 아닌지 판단한 뒤 렌더링하는것이다.

`jstl`을 예로 들어보자.

```jsp
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<%
 String securecoding = "hello, boanit!";
 request.setAttribute("securecoding", securecoding);
%>

<!-- With escapeXml() Function: -->
${fn:escapeXml(securecoding)}
```

<br/>

## CSRF(Cross-Site Request Forgery / XSRF)

XSS 공격과 CSRF(Cross-site request forgery)는 피해자의 브라우저를 목표로 하는 비슷한 공격이다. 
가장 큰 차이점은 **CSRF는 사용자의 인증된 세션을 악용**하며(예를 들어, 은행 계좌 로그인), XSS는 인증된 세션이 없어도 공격 효과를 거둘 수 있다는 점이다.

```html
<form action="http://www.bank.com/sendmoney.do?from=you&to=hacker&amount=5000" method="POST">
  <button type="submit">여기를 누르면 공짜 돈을 드립니다!</button>
</form>
```
만약, 은행사이트에 로그인이 된 상태에서 어떤 게시판의 있는 위의 링크를 클릭했다고 하자.
은행의 보안 방식에 따라 다르겠지만 5000달러가 날아갈 수 있는 위험이 있다.

<br/>

## CSRF 방어 방법

### Security 토큰

---

토큰 값을 이용해 사용자를 검증하는 방식이다.

<br/>

1. 사용자가 로그인시 서버에서는 **임의의 토큰 값을 세션에 저장하고 이를 클라이언트로 같이 보낸다.**
```java
session.setAttribute("CSRF_TOKEN",UUID.randomUUID().toString());
```

2. 클라이언트 측에서 **Request를 보낼 때 토큰 값을 같이 보낸다.**\
```html
<input type="hidden" name="_csrf" value="${CSRF_TOKEN}" />
```

3. 세션에 저장된 토큰 값과 **파라미터로 넘어온 토큰 값을 서버에서 검증**한다.
4. **일치하지 않으면 reject처리**한다.
```java
String param = request.getParameter("_csrf"); 

if (request.getSession().getAttribute("CSRF_TOKEN").equals(param)) {
    return true; 
} else { 
    response.sendRedirect("/");
    return false; 
}

```

<br/>

### Double Submit Cookie

---

Security Token 검증의 한 종류로 **세션을 사용할 수 없는 환경에서 사용할 수 있는 방법**이다.

웹브라우저의 Same Origin 정책으로 인해 자바스크립트에서 타 도메인의 쿠키 값을 확인/수정하지 못한다는 것을 이용한 방어 기법이다.

<br/>

1. 스크립트 단에서 요청 시 토큰 값을 생성하여 쿠키에 저장한다.
```js
var generateCsrfToken = function() { 
    function generateRandomString(length) { 
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; 
        for(var i = 0; i < length; i++) { 
            text += possible.charAt(Math.floor(Math.random() * possible.length)); 
        } 
        return text; 
    }; 
return btoa(generateRandomString(32)); 
} 

var setCookie = function (cname, cvalue) { 
    document.cookie = cname + "=" + cvalue + ";path=/"; 
}
```

2. 동일한 토큰 값을 요청 파라미터(혹은 헤더)에도 저장하여 서버로 전송합니다.
```js
jQuery.ajaxSetup({ 
    beforeSend: function(xhr, settings) { 
        if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) { 
            var csrfToken = generateCsrfToken(); 
            setCookie('CSRF_TOKEN', encodeURIComponent(csrfToken)); 
            xhr.setRequestHeader("_csrf", csrfToken); 
        } 
    } 
});

```

3. 서버에서 쿠키의 토큰 값과 파라미터의 토큰 값이 일치하는지 검증한다.
```java
String paramToken = request.getHeader("_csrf");
String cookieToken = null; 
for (Cookie cookie : request.getCookies()) { 
    if ("CSRF_TOKEN".equals(cookie.getName())) {
        cookieToken = URLDecoder.decode(cookie.getValue(), "UTF-8");
        cookie.setPath("/"); 
        cookie.setValue(""); 
        cookie.setMaxAge(0); 
        response.addCookie(cookie); 
        break; 
    } 
} 

if (cookieToke.equals(paramToken)) { 
    return true; 
} else {
    return false;
}
```

<br/>

---

#### Reference

* ["공격자와 방어자 모두가 따기 쉬운 열매"…XSS 공격의 이해](http://www.itworld.co.kr/insight/109025#csidx0ce7009c86eb9c1b9337ff337806d45)
* [크로스 사이트 스크립팅(XSS)
공격 종류 및 대응 방법](http://www.kisa.or.kr/uploadfile/201312/201312161355109566.pdf)
* [CSRF 공격이란? 그리고 CSRF 방어 방법](http://itstory.tk/entry/CSRF-%EA%B3%B5%EA%B2%A9%EC%9D%B4%EB%9E%80-%EA%B7%B8%EB%A6%AC%EA%B3%A0-CSRF-%EB%B0%A9%EC%96%B4-%EB%B0%A9%EB%B2%95)