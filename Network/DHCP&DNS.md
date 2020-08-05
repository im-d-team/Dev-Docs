# DHCP, DNS 프로토콜

### 이전 글 복습하기

1. [네트워크 기초 - IP](https://github.com/im-d-team/Dev-Docs/blob/master/Network/IP.md)
2. [네트워크 기초 - SubnetMask](https://github.com/im-d-team/Dev-Docs/blob/master/Network/Subnetmask.md)
3. [네트워크 기초 - Types of IP](https://github.com/im-d-team/Dev-Docs/blob/master/Network/TypesOfIP.md)
4. [네트워크 기초 - OSI 7 계층과 TCP/IP 계층](https://github.com/im-d-team/Dev-Docs/blob/master/Network/OSI7%20Layer.md)
5. [네트워크 기초 - TCP & UDP](https://github.com/im-d-team/Dev-Docs/blob/master/Network/OTCP%20%26%20UDP.md)

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
- TCP
    - 연결이 성공해야 통신이 가능하다(연결형 프로토콜).
    - 데이터의 경계를 구분하지 않는다.
    - 신뢰성 있는 데이터 전송이 이루어진다(재전송).
- UDP
    - 비연결 프로토콜이다.
    - 데이터의 경계를 구분한다(데이터그램).
    - 비신뢰성 있는 데이터 전송이 이루어진다.

## DHCP(Dynamic Host Configuration Protocol)

DHCP이란 네트워크상에서 동적으로 IP주소 및 기타  구성정보 등을 부여/관리하는 프로토콜로 해당 호스트에게 `IP 주소`, `서브넷마스크`, `기본 게이트웨이 IP 주소`, `DNS 서버 IP주소`를 자동으로 **일정 시간** 할당 해주는 인터넷 프로토콜이다.

DHCP를 통한 IP 주소 할당은 `임대(Lease)`라는 개념을 가지고 있다. 이는 DHCP 서버가 IP 주소를 영구적으로 단말에 할당하는 것이 아니고 **임대 기간(IP Lease Time)을 명시하여 그 기간 동안만 단말이 IP 주소를 사용**하도록 하는 것이다. 

단말은 임대 기간 이후에도 계속 해당 IP 주소를 사용하고자 한다면 **IP 주소  임대 기간 갱신(IP Address Renewal)** 을 DHCP 서버에 요청해야 하고 또한 단말은 임대 받은 IP 주소가 더 이상 필요치 않게 되면 **IP 주소 반납 절차(IP Address Release)** 를 수행하게 된다.

즉, **유동 IP를 할당한다** 라는 말은 DHCP서버로부터 IP를 DHCP서버에서 설정 해놓은 사용 시간만큼 임대한다.

### DHCP 서버 입장에서

DHCP 서버는 인터넷을 제공해주는 곳의 서버에서 실행되는 프로그램으로 일정한 범위의 IP 주소를 다른 클라이언트에게 할당하여 자동으로 설정해주는 역할을 한다. DHCP 서버는 클라이언트에게 할당된 IP 주소를 변경 없이 유지해 줄 수 있다.

> 참고 : Iptime 공유기를 이용한 DHCP 알아보기 [https://m.blog.naver.com/hello3311/220159169605](https://m.blog.naver.com/hello3311/220159169605)

### DHCP 클라이언트 입장에서

클라이언트들은 시스템이 시작하면 DHCP서버에 자신의 시스템을 위한 IP 주소를 요청하고, DHCP 서버로부터 IP 주소를 부여받으면 TCP/IP 설정이 초기화되고 다른 호스트와 TCP/IP를 사용해서 통신을 할 수 있게 된다.

### DHCP 임대 절차

IP 주소 임대(Lease) 절차에 사용되는 DHCP 메시지는 아래 그림과 같이 **4개의 메시지**로 구성되어 있다.

![DHCP 임대 절차](https://user-images.githubusercontent.com/24274424/88188463-da5baa80-cc72-11ea-9153-bcdf62c111e5.png)

**1. DHCP Discover**

- 패킷 방향 : 클라이언트 -> DHCP 서버
- 브로드캐스트 패킷 : Destination MAC = `FF:FF:FF:FF:FF:FF`
- 의미 : **클라이언트가 DHCP 서버를 찾기 위한 메시지**. LAN상에(동일 subent상에) 브로드캐스팅을 하여 "DHCP 서버 있으면 내게 응답 좀 해 주세요"라고 단말이 메세지를 보낸다. 이 Discover 패킷에는 IP 주소가 필요한 호스트의 MAC 주소가 담겨져 있어서 DHCP 서버가 응답할 때 패킷을 수신할 수 있게 된다.
- 주요 파라미터(패킷 내용)
    - Client MAC : 클라이언트의 MAC 주소

**2. DHCP Offer**

- 패킷 방향 : DHCP 서버 -> 클라이언트
- 브로드캐스트 메시지 : Destination MAC = `FF:FF:FF:FF:FF:FF` 혹은 `Unicast`.

    이는 클라이언트가 보낸 DHCP Discover 메시지 내의 Broadcast Flag의 값에 따라 달라지는데, 이 Flag=1이면 DHCP 서버는 DHCP Offer 메시지를 Broadcast로, Flag=0이면 Unicast로 보내게 된다.

- 의미 : DHCP 서버가 "저 여기 있어요"라고 응답하는 메시지이다. 단순히 DHCP 서버의 존재만을 알리지 않고, 클라이언트에 할당할 IP 주소 정보를 포함한 **다양한 네트워크 정보를** 함께 실어서 클라이언트에 전달한다.
- 주요 파라미터(패킷 내용) :
    - Client MAC: 단말의 MAC 주소
    - Your IP: 단말에 할당(임대)할 IP 주소
    - Subnet Mask (Option 1)
    - Router (Option 3): 단말의 Default Gateway IP 주소
    - DNS (Option 6): DNS 서버 IP 주소
    - IP Lease Time (Option 51): 단말이 IP 주소(Your IP)를 사용(임대)할 수 있는 기간(시간)
    - DHCP Server Identifier (Option 54): 본 메시지(DHCP Offer)를 보낸 DHCP 서버의 주소이다. 2개 이상의 DHCP 서버가 DHCP Offer를 보낼 수 있으므로 각 DHCP 서버는 자신의 IP 주소를 본 필드에 넣어서 단말에 보낸다.

> **Unitcast** : 유니캐스트(Unicast) 전송이란 고유 주소로 식별된 하나의 네트워크 목적지에 1:1로 (one-to-one) 트래픽 또는 메시지를 전송하는 방식을 말한다. - 출처 : 위키백과

**3. DHCP Request**

- 패킷 방향 : 클라이언트 -> DHCP 서버
- 브로드캐스트 메시지 : Destination MAC = `FF:FF:FF:FF:FF:FF`
- 의미: 단말은 DHCP 서버(들)의 존재를 알았고, DHCP 서버가 단말에 제공할 네트워크 정보(IP 주소, subnet mask, default gateway등)를 알았다. 이제 단말은 DHCP Request 메시지를 통해 하나의 DHCP 서버를 선택하고 **해당 서버에게 "단말이 사용할 네트워크 정보"를 요청**한다.
- 주요 파라미터(패킷 내용) :
    - Client MAC: 단말의 MAC 주소
    - Requested IP Address (Option 50): 난 이 IP 주소를 사용하겠다. (DHCP Offer의 Your IP 주소가 여기에 들어감)
    - DHCP Server Identifier (Option 54): 2대 이상의 DHCP 서버가 DHCP Offer를 보낸 경우, 단말은 이 중에 마음에 드는 DHCP 서버 하나를 고르게 되고, 그 서버의 IP 주소가 여기에 들어감. 즉, DHCP Server Identifier에 명시된 **DHCP** **서버에게** **"DHCP Request"** **메시지**를 보내어 단말 IP 주소를 포함한 네트워크 정보를 얻는 것.

**4. DHCP Ack**

- 패킷 방향 : DHCP 서버 -> 클라이언트
- 브로드캐스트 메시지 : Destination MAC = `FF:FF:FF:FF:FF:FF` 혹은 `Unicast`.

    이는 단말이 보낸 DHCP Request 메시지 내의 Broadcast Flag=1이면 DHCP 서버는 DHCP Ack 메시지를 Broadcast로, Flag=0이면 Unicast로 보내게 된다.

- 의미 : DHCP 절차의 마지막 메시지로, DHCP 서버가 단말에게 "네트워크 정보"를 전달해 주는 메시지. 앞서 설명한 DHCP Offer의 '네트워크 정보"와 동일한 파라미터가 포함된다.
- 주요 파라미터(패킷 내용) : DHCP Request 패킷의 파라미터와 동일하다.

### 대여 갱신

1. **대여 기간의 1/2(T1)** 이 경과한 후에 클라이언트는 대여한 서버에게 DHCP Request를 전송한다.
2. 서버는 클라이언트에게 DHCP ACK 또는 DHCP NAK을 전송한다.
    - 만약 DHCP NAK을 수신하면, 클라이언트는 DHCP Discover을 사용하여 새로운 주소를 획득해야 한다.
    - **T2(0.875 * lease_duration** 시간 전에 DHCP ACK를 수신하지 못하면 (Rebinding state), DHCP Request를 브로드캐스트한다.

### DHCP의 장단점

#### 장점

1. 비용 절약 : 네트워크를 사용하는 기기만 IP가 할당되어 고정 IP에 비해 IP 절약 효과가 있다.
2. 효율적인 네트워크 관리 : IP 방식에 비해 사용자 IP망 설계 변경이 자유롭다. 사용자에게 IP를 할당할 경우 네트워크 정보가 바뀌더라도 DHCP 서버에만 네트워크 정보를 변경해주면 반영이 되어 네트워크 정보 변경에 유연하다.

#### 단점

1. 단말은 초기 부팅 시 Broadcast 트래픽(DHCP Discover 메세지)이 발생한다.
    1. 한 개의 설정 범위에 있는 모든 단말에 전송되므로 네트워크의 성능 저하 발생 가능하다.
2. 기기 전원을 OFF할 경우 Lease Time까지 IP가 다른 단말에 할당되지 못하게 되어 IP 주소 낭비가 발생하게 된다.
3. IP를 할당해주는 서버에 전적으로 의존한다.
    1. 서버가 다운되면 IP를 받을 수 없으므로 인터넷을 사용할 수 없게 된다.

## DNS(Domain Name Server)

인터넷에 연결된 모든 네트워크 또는 컴퓨터 서버에도 고유한 주소가 있다. 우리가 자주 방문하는 사이트의 각 IP 주소를 매번 기억하는 것은 사실 불가능한 일에 가깝다. 그래서 우리는 도메인 이름(www.으로 시작하는 주소)을 사용하는데, 사용자가 [https://snyung.com](https://snyung.com) 과 같이 입력한 주소를 `178.128.17.49`와 같은 IP 주소로 변환해주는 일을 바로 DNS가 하는 것이다. 이러한 DNS를 운영하는 서버를 **네임서버(Name Server)** 라고 한다.

### DNS 절차

1. 특정 사이트를 방문하기위해 사용자가 브라우저에 URL을 입력한다.
2. 브라우저는 DNS에 접속하여 입력한 도메인 이름과 관련된 IP 주소를 요청한다.
3. 획득한 IP 주소를 사용하여 브라우저는 그 컴퓨터와 통신하고 사용자로부터 요청된 특정 페이지를 요청할 수 있다.

![DNS 절차](https://d1.awsstatic.com/Route53/how-route-53-routes-traffic.8d313c7da075c3c7303aaef32e89b5d0b7885e7c.png)

## One more thing

- 노트북의 DNS를 변경해보기
- DNS에서 가져온 IP 보기
- 네트워크 유틸리티 살펴보기

#### Reference

- [https://m.blog.naver.com/PostView.nhn](https://m.blog.naver.com/PostView.nhn?blogId=hai0416&logNo=221578608161&proxyReferer=https:%2F%2Fwww.google.com%2F)
- [더-편리한-인터넷을-위해-DHCP-DNS-프로토콜](https://velog.io/@hidaehyunlee/%EB%8D%94-%ED%8E%B8%EB%A6%AC%ED%95%9C-%EC%9D%B8%ED%84%B0%EB%84%B7%EC%9D%84-%EC%9C%84%ED%95%B4-DHCP-DNS-%ED%94%84%EB%A1%9C%ED%86%A0%EC%BD%9C)
