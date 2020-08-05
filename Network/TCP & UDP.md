# TCP와 UDP

### 이전 글 복습하기

1. [네트워크 기초 - IP](https://github.com/im-d-team/Dev-Docs/blob/master/Network/IP.md)
2. [네트워크 기초 - SubnetMask](https://github.com/im-d-team/Dev-Docs/blob/master/Network/Subnetmask.md)
3. [네트워크 기초 - Types of IP](https://github.com/im-d-team/Dev-Docs/blob/master/Network/TypesOfIP.md)
4. [네트워크 기초 - OSI 7 계층과 TCP/IP 계층](https://github.com/im-d-team/Dev-Docs/blob/master/Network/OSI7%20Layer.md)

- 네트워크 : 두 대 이상의 컴퓨터가 논리적 또는 물리적으로 연결되어 통신이 가능한 상태(PAN, LAN, MAN, WAN).
- IP 주소 : 네트워킹이 가능한 장비를 식별하는 주소.
- IPv4, IPv6
- A, B, C 클래스 : 네트워크 영역과 호스트 영역을 구분한 기준
  - A : `0.0.0.0` ~ `127.255.255.255`
  - B : `128.0.0.0` ~ `191.255.255.255`
  - C : `192.0.0.0` ~ `223.255.255.255`
- 네트워크 주소 : 호스트 부분이 모두 0인 경우
- 브로드캐스트 주소 : 호스트 부분이 모두 1인 경우
- 서브넷마스크 : 네트워크와 호스트 영역을 구분하기 위한 값
- 서브네팅 : 네트워크 관리자가 네트워크 성능을 향상하기 위해, 자원을 효율적으로 분배하는 것
- 공인 IP : 인터넷 사용자의 로컬 네트워크를 식별하기 위해서 ISP에서 제공하는 IP 주소. 즉, 외부에 공개된 IP 주소.
- 사설 IP : 전체 IP 대역 중 특수한 목적으로 사용하는 대역. 아래의 대역이 사설 IP 대역.
  - A : `10.0.0.0` ~ `10.255.255.255`
  - B : `172.16.0.0` ~ `172.31.255.255`
  - C : `192.168.0.0` ~ `192.168.255.255`
- 고정 IP : 고정적으로 부여된 IP로 한번 부여되면 IP를 반납하기 전까지는 다른 장비에 부여할 수 없는 IP 주소
- 동적 IP : 장비에 고정적으로 IP를 부여하지 않고 컴퓨터를 사용할 때 남아 있는 IP 중에서 돌아가면서 부여하는 IP 주소.
- OSI 7계층 : OSI는 `Open Systems Interconnection`의 약자로 개방형 시스템이라는 뜻이다. OSI 7계층은 네트워크에서 통신이 일어나는 과정을 7단계로 나눈 것.
  - 물리, 링크, 네트워크, 전송, 세션, 표현, 응용
- TCP/IP 4계층 : 네트워크 전송 시 데이터 표준을 정리한 것이 ISO 7계층이라고 한다면, 이 이론을 실제 사용하는 인터넷 표준에서 사용하는 계층.
  - 네트워크 엑세스(물리, 링크), 인터넷, 전송, 응용(세션, 표현, 응용)

## 도입 

우리는 이전 시간에 OSI 7계층과 TCP/IP 계층에 대해서 배웠다. 이번에는 TCP에 대해서 알아보면서 TCP가 속한 전송계층의 다른 프로토콜에 대해서 비교해보면서 배워보자.

> 전송계층은 IP에 의해 전달되는 패킷의 오류를 검사하고 재전송 요구 등의 제어를 담당하는 계층이다.

## TCP (Transmission Control Protocol)

TCP는 네트워크 계층 중 전송 계층에서 사용하는 프로토콜로서, 장치들 사이에 접속을 위하여 연결을 설정하여 **신뢰성을 보장**하는 연결형 서비스다. 기본적으로 TCP와 IP를 함께 사용하는데, IP가 데이터의 배달을 처리한다면 TCP는 패킷 추적 및 관리를 한다.

### TCP의 특징

1. 연결형 서비스
  - 연결형 서비스로 [**가상회선 방식**](#가상회선-패킷-교환-방식)을 제공한다.
  - [**3-way handshaking**](#tcp-connection-3-way-handshake) 과정을 통해 연결을 설정한다.
  - [**4-way handshaking**](tcp-disconnection-4-way-handshake) 을 통해 연결을 해제한다.

2. 흐름제어(Flow control)
  - 데이터 처리 속도를 조절하여 수신자의 버퍼 오버플로우를 방지한다.
  - 송신하는 곳에서 감당이 안되게 많은 데이터를 빠르게 보내 수신하는 곳에서 문제가 일어나는 것을 막는다.
  - 수신자가 `윈도우 크기(Window Size)` 값을 통해 수신량을 정할 수 있다.
  
3. 혼잡제어(Congestion control)
  - 네트워크 내의 패킷 수가 넘치게 증가하지 않도록 방지한다.
  - 정보의 소통량이 과다하면 패킷을 조금만 전송하여 혼잡 붕괴 현상이 일어나는 것을 막는다.
   
4. 신뢰성이 높은 전송(Reliable transmission)
  - Dup [ACK](#ack-제어비트) 기반 재전송
    - 정상적인 상황에서는 [ACK](#ack-제어비트) 값이 연속적으로 전송되어야 한다. 그러나 [ACK](#ack-제어비트)값이 중복으로 올 경우 패킷 이상을 감지하고 재전송을 요청한다.
  - Timeout 기반 재전송
    - 일정 시간동안 [ACK](#ack-제어비트) 값을 수신하지 못할 경우 재전송을 요청한다.

5. 전이중, 점대점 방식
    - 전이중 (Full-Duplex) : 전송이 양 방향으로 동시에 일어날 수 있다.
    - 점대점 (Point to Point) : 각 연결이 정확히 2개의 종단점을 가지고 있다.

### TCP Header 정보

![TCP header](https://user-images.githubusercontent.com/24274424/88392336-c50f8900-cdf6-11ea-8d4b-018481dbb96d.png)

> 출처 : [transmission-control-protocol-tcp-header](https://www.gatevidyalay.com/transmission-control-protocol-tcp-header/)

| 필드 | 내용 | 크기(bit) | 
|-----|-----|-----|
|송수신자의 포트 번호|송수신 프로세스에 할당되는 포트 주소| 16 |
|데이터 오프셋(Data Offset)|TCP 세그먼트의 시작 위치를 기준으로 데이터의 시작 위치를 표현(TCP 헤더의 크기)|4|
|시퀀스 번호(Sequence Number)|송신자가 지정하는 순서 번호, 전송되는 바이트 수를 기준으로 증가. SYN = 1 : 초기 시퀀스 번호가 된다. ACK 번호는 이 값에 1을 더한 값. SYN = 0 : 현재 세션의 이 세그먼트 데이터의 최초 바이트 값의 누적 시퀀스 번호	|32|
|응답 번호(ACK Number)|수신 프로세스가 제대로 수신한 바이트의 수를 응답하기 위해 사용.|32|
|예약 필드(Reserved)|사용을 하지 않지만 나중을 위한 예약 필드이며 0으로 채워져야한다.|6|
|제어 비트(Flag Bit)|SYN, ACK, FIN 등의 제어 번호 -> [아래 표 참고](#제어-비트flag-bit-정보)|6|
|윈도우 크기(Window)|수신 윈도우의 버퍼 크기를 지정할 때 사용. 0이면 송신 프로세스의 전송 중지|16|
|체크섬(Checksum)|TCP 세그먼트에 포함되는 프로토콜 헤더와 데이터에 대한 오류 검출 용도|16|
|긴급 위치(Urgent Pointer)|긴급 데이터를 처리하기 위함, URG 플래그 비트가 지정된 경우에만 유효|16|

### 제어 비트(Flag Bit) 정보

|종류|내용|
|-|-|
|URG|긴급 위치를 필드가 유효한지 설정|
|ACK|응답 번호 필드가 유효한지 설정. 클라이언트가 보낸 최초의 SYN 패킷 이후에 전송되는 모든 패킷은 이 플래그가 설정되어야 한다. 자세한 내용은 아래 추가 설명 참조|
|PSH|수신 애플리케이션에 버퍼링된 데이터를 상위 계층에 즉시 전달할 때|
|RST|연결의 리셋이나 유효하지 않은 세그먼트에 대한 응답용|
|SYN|연결 설정 요구. 동기화 시퀀스 번호. 양쪽이 보낸 최초의 패킷에만 이 플래그가 설정되어 있어야 한다.|
|FIN|더 이상 전송할 데이터가 없을 때 연결 종료 의사 표시|


### ACK(Acknowledgement code) 제어비트

- ACK는 송신측에 대하여 **수신측에서 긍정 응답**으로 보내지는 전송 제어용으로 사용된다.
- ACK Number를 사용하여 패킷이 도착했는지 확인하며, 송신한 패킷이 제대로 도착하지 않았으면 **재송신**을 요구한다.

### TCP Connection (3-way handshake)

TCP 통신을 이용하여 데이터를 전송하기 위해 네트워크 연결을 설정(Connection Establish) 하는 과정

1. 먼저 open()을 실행한 클라이언트가 `SYN(a)`을 보내고 `SYN_SENT` 상태로 대기한다.
2. 서버는 `SYN_RCVD` 상태로 바꾸고 `SYN(b)`과 응답 `ACK(a+1)`를 보낸다.
3. `SYN(b)`과 응답 `ACK(a+1)`을 받은 클라이언트는 `ESTABLISHED` 상태로 변경하고 서버에게 응답 `ACK(b+1)`를 보낸다.
4. 응답 `ACK(b+1)`를 받은 서버는 `ESTABLISHED` 상태로 변경한다.

![3-way handshake](https://user-images.githubusercontent.com/24274424/87865615-a2264480-c9b2-11ea-881e-1aa5f9e68f1c.png)

> 출처 : [TCP 3 Way-Handshake](https://sleepyeyes.tistory.com/4)


### TCP Disconnection (4-way handshake)

1. 먼저 close()를 실행한 클라이언트가 FIN flag를 보내고 `FIN_WAIT1` 상태로 대기한다.
2. 서버는 `CLOSE_WAIT`으로 바꾸고 응답 ACK를 전달한다. 동시에 해당 포트에 연결되어 있는 어플리케이션에게 close()를 요청한다.
3. ACK를 받은 클라이언트는 상태를 `FIN_WAIT2`로 변경한다.
4. close() 요청을 받은 서버 어플리케이션은 종료 프로세스를 진행하고 `FIN`을 클라이언트에 보내 `LAST_ACK` 상태로 바꾼다.
5. FIN을 받은 클라이언트는 ACK를 서버에 다시 전송하고 `TIME_WAIT`으로 상태를 바꾼다. `TIME_WAIT`에서 일정 시간이 지나면 `CLOSED`된다. ACK를 받은 서버도 포트를 `CLOSED`로 닫는다.

> 주의 : 반드시 서버만 CLOSE_WAIT 상태를 갖는 것은 아니다. 서버가 먼저 종료하겠다고 FIN을 보낼 수 있고, 이런 경우 서버가 FIN_WAIT1 상태가 됩니다. 누가 먼저 close를 요청하느냐에 따라 상태가 달라질 수 있다.

![4-way handshake](https://user-images.githubusercontent.com/24274424/87865669-1e208c80-c9b3-11ea-8dba-fb42753c0da8.png)

> 출처 : [TCP 4 way handshake 내용 정리](https://sjlim5092.tistory.com/37) 

## UDP(User Datagram Protocol)

UDP는 네트워크 계층 중 전송 계층에서 사용하는 프로토콜로서, 장치들 사이에 접속을 위하여 연결을 설정하여 **신뢰성보다는 연속성이 중요한** 비연결형 서비스다. 여기서 데이터그램이란 **독립적인 관계**를 지니는 패킷이라는 뜻이다.

### UDP 특징

- 비연결형 서비스로 데이터그램 방식을 제공한다.
- 정보를 주고 받을 때 정보를 보내거나 받는다는 신호절차를 거치지 않는다.
- UDP헤더의 CheckSum 필드를 통해 최소한의 오류만 검출한다.
- 신뢰성이 낮다.
- TCP보다 속도가 빠르다.

UDP는 비연결형 서비스이기 때문에, 연결을 설정하고 해제하는 과정이 없다. 서로 다른 경로로 독립적으로 처리함에도 패킷에 순서를 부여하여 재조립을 하거나 흐름 제어, 혼잡 제어와 같은 기능도 처리하지 않기에 TCP보다 속도가 빠르며 네트워크 부하가 적다는 장점이 있지만, 신뢰성있는 데이터의 전송을 보장하지 못한다. 그렇기 때문에 신뢰성보다는 연속성이 중요한 서비스인 실시간 서비스(streaming)에 자주 사용된다.

### UPD Header 정보

응용 계층으로부터 데이터를 받은 UDP도 UDP 헤더를 추가한 후에 이를 IP(네트워크 계층)로 보낸다.

![UDP Header](https://user-images.githubusercontent.com/24274424/87857099-03242d00-c95f-11ea-80c5-af06d8821799.png)

|필드|내용|크기(bit)|
|--|---|--------|
|송수신자의 포트 번호|데이터를 보내는 받는 애플리케이션의 포트 번호|16|
|데이터의 길이|UDP 헤더와 데이터의 총 길이|16|
|체크섬(Checksum)|데이터 오류 검사에 사용|16|

TCP 헤더와 다르게 UDP 헤더에는 포함된 정보가 적다. 이는 UDP는 수신자가 데이터를 받는지 여부에 대해 관심이 없기 때문이다. 즉, 신뢰성을 보장해주지 않지만 간단하고 속도가 빠른 것이 특징이다.

## 결국

|TCP(Transfer Control Protocol)|UDP(User Datagram Protocol)|
|-|-|
|연결이 성공해야 통신 가능(연결형 프로토콜)|비연결형 프로토콜(연결 없이 통신이 가능)|
|데이터의 경계를 구분하지 않음(Byte-Stream Service)|데이터의 경계를 구분함(Datagram Service)|
|신뢰성 있는 데이터 전송(데이터의 재전송 존재)|비신뢰성 있는 데이터 전송(데이터의 재전송 없음)|
|일 대 일(Unicast) 통신|일 대 일, 일 대 다(Broadcast), 다 대 다(Multicast) 통신|

## One more thing

패킷 교환 방식은 접속 방식에 따라서 데이터 그램 방식과 가상회선 방식이 있다.

### 가상회선 패킷 교환 방식

데이터를 전송하기 전에 논리적 연결이 설정되는데, 이를 가상회선이라 한다.(**연결 지향형**) 각 패킷에는 가상회선 식별 번호(VCI)가 포함되고, 모든 패킷을 전송하면 가상회선이 해제되고 패킷들은 전송된 순서대로 도착한다.

데이터 그램은 패킷마다 라우터가 경로를 선택하지만, 가상회선 방식은 경로를 설정할 때 한 번만 수행한다.

### 데이터그램 패킷 교환 방식

데이터를 전송하기 전에 논리적 연결이 설정되지 않으며 패킷이 독립적으로 전송된다. 이를 `데이터그램`이라 한다.

패킷을 수신한 라우터는 최적의 경로를 선택하여 패킷을 전송하는데 하나의 메시지에서 분할된 여러 패킷은 서로 다른 경로로 전송될 수 있다.(**비연결 지향형**)

**송신 측에서 전송한 순서와 수신 측에 도착한 순서가 다를 수 있다.**

### 비교

정해진 시간 안이나 다량의 데이터를 연속으로 보낼 때는 **가상회선 방식**이 적합하다. 짧은 메시지의 일시적인 전송에는 **데이터그램 방식**이 적합하다. 네트워크 내의 한 노드가 다운되면 **데이터그램 방식**은 다른 경로를 새로 설정하지만, **가상회선 방식**은 그 노드를 지나는 모든 가상회선을 잃게 된다.

#### Reference

- [https://mangkyu.tistory.com/15](https://mangkyu.tistory.com/15)
- [https://madplay.github.io/post/network-tcp-udp-tcpip](https://madplay.github.io/post/network-tcp-udp-tcpip)
- [https://woovictory.github.io/2018/12/28/Network-Packet-Switching-Method/](https://woovictory.github.io/2018/12/28/Network-Packet-Switching-Method/)
- [https://www.slideshare.net/bluem31/tcp-47441568?qid=04ddad59-7ebb-4557-99d7-50435e9a5f92&v=&b=&from_search=5](https://www.slideshare.net/bluem31/tcp-47441568?qid=04ddad59-7ebb-4557-99d7-50435e9a5f92&v=&b=&from_search=5)
- [https://m.blog.naver.com/PostView.nhn?blogId=ksg7514&logNo=220772997742&proxyReferer=https:%2F%2Fwww.google.com%2F](https://m.blog.naver.com/PostView.nhn?blogId=ksg7514&logNo=220772997742&proxyReferer=https:%2F%2Fwww.google.com%2F)
- [https://gmlwjd9405.github.io/2018/09/19/tcp-connection.html](https://gmlwjd9405.github.io/2018/09/19/tcp-connection.html)
