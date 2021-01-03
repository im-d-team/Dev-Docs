이번 시간에는 TCP 통신에서 쓰이는 `3-way handShaking`과 `4-way handShaking`을 정리해보았다.

# TCP
TCP는 OSI 7계층 중 **전송 계층**에서 사용하는 프로콜로서, 장치들 사이에 논리적인 접속을 위한 연결을 설정하여 **신뢰성을 보장**하는 연결형 서비스이다.
> OSI 7계층에 대한 설명은 [이곳](https://github.com/im-d-team/Dev-Docs/blob/master/Network/OSI7%20Layer.md)을 참고하길 바란다.

## TCP의 특징
- 인터넷상에서 데이터를 메시지의 형태로 보내기 위해 `IP`와 함께 사용하는 프로토콜이다.
- 연결형 서비스로 흐름제어 및 혼잡제어를 제공한다.
> 연결형 서비스란 `3-way handshaking`과정을 통해 연결을 설정하고, `4-way handshaking`을 통해 연결을 해제하는 것을 의미한다.
- 높은 신뢰성을 보장한다.
- UDP보다 속도가 느리다.
> TCP와 달리, UDP는 연결설정과 연결해제과정, 흐름제어를 해주지 않기 때문에 속도가 빠름
- 전이중(Full-Duplex), 점대점 방식(Point to Point)이다.
> 전이중이란 전송이 양방향으로 동시에 일어날 수 있는 것을 의미하고, 점대점은 각 연결이 정확히 2개의 종단점을 가지고 있는 것을 의미한다.
- 연속성보다 신뢰성 있는 전송이 중요할 때에 사용된다.

## TCP 헤더
![TCP헤더](https://user-images.githubusercontent.com/43868540/103455518-2a19c400-4d31-11eb-8f3f-a0e4090402bf.jpg)
> [출처 afteracademy](https://afteracademy.com/blog/what-is-a-tcp-3-way-handshake-process)

헤더는 3-way handshaking을 설명하기 위한 일부만 하고 나머지 요소는 @sNyung님의 [TCP와 UDP](https://github.com/im-d-team/Dev-Docs/blob/master/Network/TCP%20%26%20UDP.md) 글을 참고 바람!
-  SYN : Synchronize sequence numbers의 약자로, 연결요청하고 세션을 설정하는 데 사용된다.
-  ACK : Acknowledgment의 약자로, 신뢰성을 보장한다.

여기서 시퀀스 번호를 보내는데, 처음에 시퀀스 번호를 ISN(Initial Sequence Number)이라고 한다. ISN은 난수의 숫자를 생성해 보낸다고 한다. 왜 순차적인 번호가 아닌 난수일까?

연결을 맺을 때 사용하는 포트(port)는 유한 범위 내에서 사용하고 시간이 지남에 따라 재사용된다. 따라서 두 통신 호스트가 과거에 사용된 포트 번호 쌍을 사용하는 가능성이 존재한다. 서버 측에서는 SYN을 보고 패킷을 구분하는데 순차적인 번호가 전송된다면 이전의 connection으로부터 오는 패킷으로 인식할 가능성이 크다. 이러한 가능성을 줄이기 위해 난수로 시퀀스 번호를 설정하는 것이다.

## TCP의 연결설정 및 해제 과정
TCP 통신을 이용하여 데이터를 전송하기 위해서는 네트워크 연결을 설정하는 과정이 필수적이다. 네트워크 연결을 하기 위해서 TCP는 `3-way handShaking`이라는 과정을 거친다.

## 3-way handshaking
`3-way handshaking`이란 `TCP/IP` 프로토콜을 이용해서 통신하는 응용 프로그램이 데이터를 전송하기 전에 정확한 전송을 보장하기 위해 상대방 컴퓨터와 사전에 세션을 수립하는 과정을 의미한다. 

### why 3-way handshaking?
왜 3번의 과정을 거쳐야 할까? 2번의 과정을 거치면 왜 안될까?


Client ------SYN-----> Server

Client <-----ACK------ Server


TCP는 양방향 연결을 지향하기 때문에 3번의 과정을 거쳐야 한다. 과정을 더 자세히 뜯어보면 두 개의 단순연결이 되어있는 것이다. 

위에 사진처럼 2번의 과정을 거치면 무슨 일이 일어날까 생각해보자.

A 친구가 B 친구한테 멀리서 소리친다. "너 잘 들려?"
B 친구는 A 친구한테 소리친다. "응 잘 들려!"
만약 A 친구가 말할 줄만 알고 소리를 못 들으면 B 친구가 아무리 소리쳐봤자 안들린다. B 친구도 A 친구가 잘들리는 지 확인해야 한다. 

통신도 마찬가지로 데이터를 보내기 전에 내가 보낼 데이터를 상대방이 받을 수 있는지 먼저 확인해야 한다.
클라이언트는 SYN을 던져 서버의 상태를 확인하는 패킷을 던진다. 서버는 잘 들린다는 신호인 ACK를 보낸다.
여기서 클라이언트도 잘 들을 수 있는지 확인하기 위해 서버는 SYN을 던진다. 역시 클라이언트도 잘 들린다는 신호인 ACK를 보낸다. 

개시자는 SYN을 보내고 응답자는 ACK를 보낸다. 이것은 하나의 단순 연결이 된다. 따라서 TCP는 두 개의 단순연결이라는 것이다.
`3-way handshaking`을 통해 실제로 데이터 전달이 시작하기 전에 수행하여 논리적인 접속을 성립한다.

![3-way](https://user-images.githubusercontent.com/43868540/103471183-634d4500-4dc0-11eb-8e9c-3e914d8b9e78.jpg)

> [출처 mdpi](https://www.mdpi.com/2076-3417/6/11/358/htm)

1. 클라이언트가 서버에게 연결 요청 메시지를 전송한다. (SYN)
2. 메시지를 수신한 서버는 요청을 수락하며 클라이언트에게 포트를 열어달라는 메시지도 전송한다. (SYN+ACK)
3. 서버가 요청을 수락했다는 메시지를 받은 클라이언트가 수락 확인을 보내 연결을 맺는다. (ACK)

### TCP 상태
|상태|설명|
|------|---|
|LISTEN|SYN을 기다리는 상태|
|SYN-SENT|SYN을 보내고 ACK를 기다리는 상태|
|SYN-RECEVED|SYN+ACK을 보내고 ACK를 기다리는 상태|
|ESTABLISHED|커넥션이 생성된 상태, 데이터를 전송할 수 있다.|

## 4-way handshaking
TCP 연결을 하였다면 연결 해지하기 위해 `4-way handshaking`이라는 과정을 거친다.
이것 또한 왜 여러 번 패킷을 주고받을까? 그 이유도 역시 TCP의 신뢰성을 보장하기 위함에 있다.
그러므로 연결 종료 시에도 양측이 서로 확인하에, 즉 당사자가 연결을 종료하고 싶어하며 종료할 준비가 됐는지 확인한 후에 각자의 종료 과정을 거치게 되는 것이다.

![4-way handshaking](https://user-images.githubusercontent.com/43868540/103454298-f84f3000-4d25-11eb-8e39-6771a1cecd1a.png)

> [출처 hongpossible.tistory](https://hongpossible.tistory.com/entry/TCP-UDP-34-Way-HandShaking)

1. 클라이언트가 연결을 종료하겠다는 메시지를 전송한다 (FIN)
2. 서버는 클라이언트의 메시지를 받고 확인 메시지를 전송하고 통신이 종료될 때까지 기다린다. (ACK)
3. 서버는 데이터를 모두 보내고 연결 해지할 준비 완료되었다는 메시지 전송한다. (FIN)
4. 클라이언트는 서버의 메시지를 확인했다는 메시지를 보내고 기다린다. (ACK)
> 클라이언트가 보낸 ACK가 네트워크 오류 등으로 도착하지 않았을 경우, 서버가 보낸 FIN보다 늦게 데이터가 도착한 경우를 고려한 것이다.
5. 서버는 클라이언트의 확인 메시지를 받고 소켓 연결을 닫는다 (CLOSE)

### 클라이언트 상태
|상태|설명|
|------|---|
|FIN_WAIT 1|클라이언트가 연결 종료 메시지를 보낸 상태|
|FIN_WAIT 2|서버의 연결 해지를 위해 대기하는 상태|
|TIME_WAIT|연결 해지할 준비 완료 되었다는 상태|
|CLOSED|클라이언트의 세션을 닫은 상태|

### 서버 상태
|상태|설명|
|------|---|
|CLOSE_WAIT|클라이언트가 연결 종료 메시지를 보낸 상태|
|LAST_ACK|연결 해지를 위한 준비완료했다는 상태|
|CLOSE|서버의 세션을 닫은 상태|

----
#### Reference
- [3-way handshaking & 4-way handshaking](https://k39335.tistory.com/21?category=653558)
- [why not just 2-way?](https://networkengineering.stackexchange.com/questions/24068/why-do-we-need-a-3-way-handshake-why-not-just-2-way)
- [why randominzed sequence number?](https://asfirstalways.tistory.com/356)
