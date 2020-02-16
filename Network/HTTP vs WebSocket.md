# HTTP vs WebSocket

대부분의 개발자들이 애플리케이션을 개발하다보면 자연스럽게 HTTP와 Websocket을 경험하게 된다. 다만, 너무 당연히 사용되고 있는 것이다보니 이를 잘 모르고 넘어가는 경우가 많다. 이번 기회에 한 번 짚고 넘어가보자.

<br/>

## Protocol

우선 `Protocol`이란 용어를 알고 넘어갈 필요가 있다. `HTTP`와 `WebSocket`은 많이 들어봤지만 "그래서 이게 뭔데?" 라는 생각이 들 수 있다.<br/>
`HTTP`와 `WebSocket`은 `Protocol`의 일종이며, `Protocol`은 컴퓨터나 원거리 통신 장비사이에 메세지를 주고 받는 양식과 규칙의 체계이다.

송신자와 수신자 사이에 "메세지 구조는 이런식으로하고, 그건 이런 의미로 약속하고 이런 방식으로 보내기로 하자." 등을 약속한 것이다.<br/>
예를 들면, 특정 기업에 이력서를 보낼 때 해당 기업의 이력서 양식에 맞춰 지원을 하는 것이 있을 수 있다.<br/>

즉, `Protocol`은 특정 데이터를 주고 받기 위한 약속이며 이를 통해 클라이언트와 서버 사이에 데이터를 주고 받을 수 있는 것이다.

<br/>

## HTTP

`HTTP`는 **HyperText Transfer Protocol**의 약자이며 말 그대로 하이퍼텍스트 문서를 교환하기 위해 사용된 Protocol이다.

`HTTP`의 큰 특징은 다음과 같다.

### 단방향적 통신 프로토콜

`HTTP Protocol`의 가장 큰 특징은 클라이언트가 요청(Request)를 보내면 서버가 응답(Repsonse)하는 단방향적 통신 프로토콜이라는 것이다. 그렇기 때문에 클라이언트가 Request를 서버로 보내지 않으면 서버는 어떠한 데이터도 넘겨주지 않는다.

아마, 앱이나 웹을 개발하다보면 접하게 될 가장 익숙한 패턴의 프로토콜일 것이다.

### Stateless Protocol

`HTTP Protocol`은 상태를 저장하지 않는다. 이러한 특성 때문에 `HTTP Protocol`을 `Stateless Protocol`이라고 한다.

클라이언트에서 요청을 보내면 서버에서는 그에 대한 응답을 클라이언트로 전송하게 된다. 이 때, 응답을 받는 시점에 어떠한 정보도 남기지 않는다. <br/> 즉, 클라이언트에서 서버로 요청을 보낼 때마다 각각의 접속은 독립적인 트랜잭션으로 취급된다.

각각의 접속이 독립적인 트랜잭션이라는 것은 많은 사용자가 웹 서비스를 사용하더라도 접속 유지는 최소한으로 할 수 있기 때문에 서버에 동시 접속할 수 있는 Connection의 수보다 더 많은 요청을 처리할 수 있게 된다. 하지만, 클라이언트의 상태를 저장하고 있지 않기 때문에 생기는 문제가 있다.

예를 들어, 클라이언트가 로그인 과정에서 인증 요청을 보내고 그에 대한 응답으로 로그인에 성공했다고 가정하자. `HTTP Protocol`은 이와 관련된 정보를 저장하고 있지 않기 때문에 해당 클라이언트가 인증을 완료한 클라이언트인지 구분할 방법이 없다. 따라서 접속할 때마다 재인증을 해야하는 문제가 생긴다.

서버와 클라이언트간의 연결에 있어 이러한 `Stateless`문제를 보완한 것이 `Cookie`와 `Session`이다. 이에 대한 자세한 내용은 [다음](https://github.com/Im-D/Dev-Docs/blob/master/Network/Cookie%EC%99%80%20Session%20%EA%B7%B8%EB%A6%AC%EA%B3%A0%20Redis.md#cookie%EC%99%80-session)을 참고하면 좋을 것 같다.

```js
//Client
// request.js
export const BASE_URL = "http://localhost:8000";

const request = ({ method = "POST", param, data }) => {
  return new Promise(resolve => {
    axios({
      method,
      url: `${BASE_URL}${param}`,
      responseType: "json",
      data
    }).then(response => {
      resolve(response.data);
    });
  });
};

// userApi.js
import request from "./request";

const prefix = "/user";

export const login = data => {
  return request({
    param: `${prefix}/login`,
    data
  });
};
```

```js
//Server
import codes from "../storage/codes";

export async function login(req, res) {
  const { userID } = req.body;

  if (!userID) {
    res.json({
      code: 1001,
      message: codes[1001],
      success: false
    });
    return;
  }

  const isSuccess = loginUser(userID);

  if (!isSuccess) {
    res.json({
      code: 1002,
      message: codes[1002],
      success: false
    });
    return;
  }
  res.json({
    code: 1000,
    message: "Success",
    success: true,
    userID
  });
}
```

<br/>

## WebSocket

`WebSocket`이 `HTTP`와 가장 큰 차이를 보이는 부분이 클라이언트와 서버간의 양방향 통신 환경을 제공해주는 실시간 통신(Realtime Network) 기술이라는 점이다.

사실, `HTTP`를 이용해도 `Polling, LongPolling` 등과 같은 방법으로 실시간 통신 환경을 구축할 수 있다. 하지만, Polling 방식과 다르게 양방향으로 원할때 요청을 보낼 수 있으며 HTTP에 비해 오버헤드가 적으므로 유용하게 사용할 수 있습니다.

`WebSocket`을 이용한 대표적인 예가 채팅 애플리케이션이다. 다른 사용자가 나에게 채팅 문구를 전송했을 때 서버만이 이 사실을 알고 있다. 이 때 서버는 나에게 해당 메세지를 전송하게 되고 이를 받아 클라이언트는 채팅방에 해당 문구를 보여준다.<br/>
또 다른 예는 주식 차트나 암호화폐 거래소 차트를 들 수 있다. 매수와 매도가 일어났을 때 해당 데이터를 모든 사용자에게 보여줘야하고 채팅과 같은 원리로 동작하게 될 것이다.

이처럼 실시간 통신을 가능하게 하는 통신 프로토콜이 `WebSocket`이다.

```js
//Client
//wsApi.js
import io from "socket.io-client";

import { BASE_URL } from "./request";

let socket;

export const connect = async ({ roomID, userID, callback }) => {
  socket = io.connect(`${BASE_URL}/chat`);

  return new Promise(resolve => {
    socket.on("connect", () => {
      socket.on("send:message", ({ roomID, userID, message }) => {
        if (message) {
          callback({ roomID, userID, message, isImage: false });
        }
      });
      socket.on("send:image", ({ roomID, userID, message }) => {
        console.log(message);
        if (message) {
          callback({ roomID, userID, message, isImage: true });
        }
      });
      socket.emit("send:message", message => ({ roomID, message, userID }));
      resolve(true);
    });
  });
};

export const emitMessage = ({ roomID, message, userID }) => {
  socket.emit("send:message", { roomID, message, userID });
};

export const emitImage = ({ roomID, message, userID }) => {
  socket.emit("send:image", { roomID, message, userID });
};

export const leave = () => {
  socket.disconnect();
};
```

```js
//Server
app.io = require("socket.io").listen(server);
app.io.origins("*:*");

const chat = app.io.of("/chat").on("connection", socket => {
  socket.on("send:message", ({ roomID, message, userID }) => {
    socket.join(roomID);
    chat.to(roomID).emit("send:message", { roomID, message, userID });
  });
  socket.on("send:image", ({ roomID, message, userID }) => {
    chat.to(roomID).emit("send:image", { roomID, message, userID });
  });
});
```

---

#### Reference

- [프로토콜이란?](https://asfirstalways.tistory.com/85)
- [[기본]HTTP란?](https://helloworld-88.tistory.com/38)
- [HTTP란 무엇인가?](https://velog.io/@surim014/HTTP%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%B8%EA%B0%80)
- [websocket, socket.io를 이용한 양방향 통신](http://www.secmem.org/blog/2019/08/17/websocket-socketio/)
