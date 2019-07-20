# Cookie와 Session 그리고 Redis

생각보다 개발자들에게 `Cookie`와 `Session`에 대해 물어보면 제대로 대답하지 못하는 경우가 많다. 실제 개발에서도 많이 쓰이는 만큼, 생각보다 이슈가 많이 나는 부분이기도 하기 때문에 정확한 개념 정립이 되어있지 않다면 이슈를 찾기 어려울 수 있다.

<br/>

## Stateless Protocol

`HTTP Protocol`은 상태를 저장하지 않는다. 이러한 특성 때문에 `HTTP Protocol`을 `Stateless Protocol`이라고 한다.

기본적으로 `HTTP`는 요청(Request)과 응답(Response)으로 서버와 클라이언트간에 정보를 주고받을 수 있게 해준다. 클라이언트에서 요청을 보내면 서버에서는 그에 대한 응답을 클라이언트로 전송하게 된다. 이 때, 응답을 받는 시점에 어떠한 정보도 남기지 않는다. <br/> 즉, 클라이언트에서 서버로 요청을 보낼 때마다 각각의 접속은 독립적인 트랜잭션으로 취급된다.

예를 들어, 클라이언트가 로그인 과정에서 인증 요청을 보내고 그에 대한 응답으로 로그인에 성공했다고 가정하자. `HTTP Protocol`은 이와 관련된 정보를 저장하고 있지 않기 때문에 해당 클라이언트가 인증을 완료한 클라이언트인지 구분할 방법이 없다. 따라서 접속할 때마다 재인증을 해야하는 문제가 생긴다.

서버와 클라이언트간의 연결에 있어 이러한 `Stateless`문제를 보완한 것이 `Cookie`와 `Session`이다.

<br/>

## Cookie와 Session

### Cookie

`Cookie`는 웹서버가 브라우저를 통해 클라이언트에 일시적으로 데이터를 저장하는 방식이다.

`Cookie`를 이용하면 다음과 같은 과정으로 매 접속마다 재인증을 피할 수 있다.

1. 클라이언트에서 서버로 최초의 요청을 보낸다.
2. 서버에서는 응답을 보낼 때 `Cookie`값을 저장하고 이를 응답 헤더에 넣어 보낸다.
3. 클라이언트에서는 응답 헤더에 있는 `Cookie`정보를 브라우저에 저장한다.
4. 이후 클라이언트에서는 요청을 보낼 때 해당 `Cookie` 정보를 같이 담아 서버로 보낸다. 이를 통해 서버에서는 인증을 완료한 사용자를 구분할 수 있게 된다.

쿠키는 클라이언트(브라우저)에 위에서 말했듯이 세션에 비해 보안에 취약하다. 따라서 아이디와 비밀번호를 쿠키에 저장하는 것은 치명적일 수 있다.

<br/>

### Session

`Session`은 `Cookie`를 기반으로 하고 있지만 `Cookie`와 다르게 상태를 서버에 저장한다.

서버에서는 클라이언트를 구분하기 위해 각각의 클라이언트에 `Session ID`를 부여한다. 클라이언트가 서버에 접속해서 브라우저를 종료할 때까지 인증상태를 유지하게 된다.

서버에 사용자 정보를 저장하기 때문에 `Cookie`보다 보안에 좋지만 사용자가 많아지게 되면 서버에 부하를 줄 수 있다.<br/>접속 시간에 일반적으로 제한을 두기 때문에 일정 시간 클라이언트로부터 요청이 오지 않는다면 `Session`을 만료시킨다. 이를 통해 부하를 줄일 수는 있지만 동시접속자가 많은 경우라면 서버 메모리를 많이 차지하기 때문에 문제가 될 수 있다.

`Cookie`에는 `SessionID`(우리가 Dev Tools를 통해 흔히 볼 수 있는 `JSessionID`)만 저장하고 이를 이용해 참조된 사용자 정보를 사용하는 것이 방법이 `Cookie-Based Session`이다.

<br/>

## Redis를 이용한 Session 관리

`Redis`는 `Remote Dictionary Server`의 약자로서 'key-value' 구조의 비관계형 데이터를 저장하고 관리하기 위한 `NoSQL`의 일종이다. 휘발성 데이터를 저장하는 용도로 사용되며 디스크 기반이 아닌 메모리 기반의 데이터 저장소다.

명시적으로 삭제나 만료를 설정하지 않으면 데이터는 삭제되지 않는다. 하지만 메모리를 사용하기 때문에 안전한 데이터의 보관을 위해 백업을 권장한다. 다른 서버의 메모리를 사용하거나 디스크에 데이터를 저장하는 방법을 통해 데이터를 백업할 수 있다.

`Redis`를 이용하여 `Session`을 관리하는 이유은 `Session`의 영속적 관리와 복수 서버 환경에서의 `Session` 공유다.

`Redis`를 사용하면 프로세스가 종료되어도 `Session` 정보를 보존할 수 있다.

복수 서버 환경에서는 [Session Clustering](https://github.com/Im-D/Dev-Docs/blob/master/Network/%EB%A1%9C%EB%93%9C%EB%B0%B8%EB%9F%B0%EC%8B%B1%20%26%20%ED%81%B4%EB%9F%AC%EC%8A%A4%ED%84%B0%EB%A7%81.md/#%EC%84%B8%EC%85%98-%ED%81%B4%EB%9F%AC%EC%8A%A4%ED%84%B0%EB%A7%81)을 통해 `Session`을 서버마다 공유하는 방법이 있다. 하지만 `Redis`를 사용하면 `Session`을 `Redis`에서 관리하기 때문에 `Session Clustering` 없이도 복수 서버 환경에서 세션을 공유할 수 있게 된다.

```js
var express = require('express');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var app = express();

// session 설정
app.use(session({
  store: new RedisStore({}),
  secret : 'wjfpowmpRJPOFEJIDphj1435rDJIPF',
  resave: false,
  saveUninitialized: true
}));

// routing 설정
app.get('/connect-session', function(req, res) {
  var session = req.session;
  if (session && session.count) {
    session.count++;
  } else {
    session.count = 1;
  }
  res.send('세션 갯수 : ' + session.count);
});

app.get('/destroy', function (req, res) {
  req.session.destroy();
  res.send('세션 삭제');
});

app.listen(3000, function() {
  console.log('Express server Start - Port : ' + 3000);
});
```

<br/>

---

#### Reference

- [Poiemaweb-MemoryStore를 사용한 Session 관리와 Redis를 사용한 영속적 Session 관리](https://poiemaweb.com/express-session-handling)
- [Redis 개념과 특징](https://goodgid.github.io/Redis/)
- [쿠키와 세션에 대해 알아보자](https://cinabrosite.wordpress.com/2017/01/24/cookie_session/)
