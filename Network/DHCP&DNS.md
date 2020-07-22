# DHCP, DNS 프로토콜

### 이전 글 복습하기

## DHCP ( Dynamic Host Configuration Protocol )

네트워크상에서 동적으로 IP주소 및 기타  구성정보 등을 부여/관리하는 프로토콜로 해당 호스트에게 IP 주소, 서브넷마스크, 기본 게이트웨이 IP 주소, DNS 서버 IP주소를 자동으로 일정 시간 할당 해주는 인터넷 프로토콜.

DHCP를 통한 IP 주소 할당은 `임대(Lease)`라는 개념을 가지고 있는데 이는 DHCP 서버가 IP 주소를 영구적으로 단말에 할당하는 것이 아니고 **임대 기간(IP Lease Time)을 명시하여 그 기간 동안만 단말이 IP 주소를 사용**하도록 하는 것이다. 단말은 임대 기간 이후에도 계속 해당 IP 주소를 사용하고자 한다면 **IP 주소  임대 기간 갱신(IP Address Renewal)**을 DHCP 서버에 요청해야 하고 또한 단말은 임대 받은 IP 주소가 더 이상 필요치 않게 되면 **IP 주소 반납 절차(IP Address Release)**를 수행하게 된다.

즉, 유동 IP를 할당한다 == DHCP서버로부터 IP를 DHCP서버에서 설정 해놓은 사용 시간만큼 임대한다.

### DHCP 주요 구성 정보 및 동적 할당

#### 구성 정보

- 기본 정보 : IP, 서브넷마스크, 기본 게이트웨이
- 추가 정보 : 네임서버(DNS)의 IP주소, 홈 에이전트, 기본  도메인 네임 등

#### 동적 할당

제한된 수량의 IP주소를 재사용, 한시적 사용, 자동 재활용 가능

### DHCP 운용의 장단점

#### 장점

1. cost 절약 : 사용자 중 PC를 켠 사용자만 IP가 할당되어 고정 IP에 비해 IP 절약 효과가 있다.
2. 효율적인 네트워크 관리 : IP 방식에 비해 사용자 IP망 설계변경이 자유롭다. 사용자에게 DHCP IP를 할당할 경우 네트워크 정보가 바뀌더라도 DHCP 서버에만 네트워크 정보를 변경해주면 되므로 네트워크 정보 변경이 유연하다.

#### 단점

1. DHCP 요구 단말은 초기 부팅 시 broadcast 트래픽(DHCP Discover 메세지)을 유발
    1. 한 개의 VLAN의 설정 번위에 있는 모든 단말에 전송되므로 네트워크의 성능 저하 발생 가능
2. PC 전원을 OFF할 경우 Lease Time까지 IP가 다른 단말에 할당되지 못하게 되어 IP 주소 낭비가 발생하게 된다.
3. IP를 할당해주는 서버에 전적으로 의존한다.
    1. 서버가 다운되면 IP 를 받을 수 없으므로 인터넷을 사용할 수 없게 된다.

### DHCP 서버

DHCP 서버는 인터넷을 제공해주는 곳의 서버에서 실행되는 프로그램으로 일정한 범위의 IP 주소를 다른 클라이언트에게 할당하여 자동으로 설정하게 해주는 역할을 한다.DHCP 서버는 클라이언트에게 할당된 IP 주소를 변경 없이 유지해 줄 수 있다.

iptime 공유기를 이용한 DHCP 알아보기 [https://m.blog.naver.com/hello3311/220159169605](https://m.blog.naver.com/hello3311/220159169605)

### DHCP 클라이언트

클라이언트들은 시스템이 시작하면 DHCP서버에 자신의 시스템을 위한 IP주소를 요청하고, DHCP 서버로부터 IP주소를 부여받으면 TCP/IP 설정은 초기화되고 다른 호스트와 TCP/IP를 사용해서 통신을 할 수 있게 된다.

즉, 서버에게 IP를 할당받으면 TCP/IP 통신을 할 수 있다.

### DHCP 임대 절차

IP 주소 할당(임대) 절차에 사용되는 DHCP 메시지는 아래 그림과 같이 **4개의 메시지**로 구성되어 있다.

![DHCP 임대 절차](https://user-images.githubusercontent.com/24274424/88188463-da5baa80-cc72-11ea-9153-bcdf62c111e5.png)

1. **DHCP Discover**

- **패킷 방향 :** 클라이언트 -> DHCP 서버
- **브로드캐스트 패킷** : Destination MAC = FF:FF:FF:FF:FF:FF
- **의미** : 클라이언트가 DHCP 서버를 찾기 위한 메시지. 그래서 LAN상에(동일 subent상에) 브로드캐스팅을 하여 "거기 혹시 DHCP 서버 있으면 내게 응답 좀 해 주세요"라고 단말이 메세지를 보낸다. 이 Discover 패킷에는 IP 주소가 필요한 호스트의 MAC 주소가 담겨져 있어서 DHCP 서버가 응답할 때 패킷을 수신할 수 있게 된다.
- **주요 파라미터(패킷 내용) :**
    - Client MAC : 클라이언트의 MAC 주소

2. DHCP Offer

- **패킷 방향 :** DHCP 서버 -> 클라이언트
- **브로드캐스트 메시지 :** Destination MAC = FF:FF:FF:FF:FF:FF 혹은 유니캐스트.

    이는 클라이언트가 보낸 DHCP Discover 메시지 내의 Broadcast Flag의 값에 따라 달라지는데, 이 Flag=1이면 DHCP 서버는 DHCP Offer 메시지를 Broadcast로, Flag=0이면 Unicast로 보내게 된다.

- **의미**: DHCP 서버가 "저 여기 있어요~"라고 응답하는 메시지. 단순히 DHCP 서버의 존재만을 알리지 않고, **클라이언트에 할당할 IP 주소 정보를 포함한 다양한 "네트워크 정보"를 함께 실어서 클라이언트에 전달한다.**
- **주요 파라미터(패킷 내용) :**
    - Client MAC: 단말의 MAC 주소
    - Your IP: 단말에 할당(임대)할 IP 주소
    - Subnet Mask (Option 1)
    - Router (Option 3): 단말의 Default Gateway IP 주소
    - DNS (Option 6): DNS 서버 IP 주소
    - IP Lease Time (Option 51): 단말이 IP 주소(Your IP)를 사용(임대)할 수 있는 기간(시간)
    - DHCP Server Identifier (Option 54): 본 메시지(DHCP Offer)를 보낸 DHCP 서버의 주소. 2개 이상의 DHCP 서버가 DHCP Offer를 보낼 수 있으므로 각 DHCP 서버는 자신의 IP 주소를 본 필드에 넣어서 단말에 보냄.

3. **DHCP Request**

- **패킷 방향:** 클라이언트 -> DHCP 서버
- **브로드캐스트 메시지 :** Destination MAC = FF:FF:FF:FF:FF:FF
- **의미**: 단말은 DHCP 서버(들)의 존재를 알았고, DHCP 서버가 단말에 제공할 네트워크 정보(IP 주소, subnet mask, default gateway등)를 알았다. 이제 단말은 DHCP Request 메시지를 통해 하나의 DHCP 서버를 선택하고 **해당 서버에게 "단말이 사용할 네트워크 정보"를 요청**한다.
- **주요 파라미터(패킷 내용) :**
    - Client MAC: 단말의 MAC 주소
    - Requested IP Address (Option 50): 난 이 IP 주소를 사용하겠다. (DHCP Offer의 Your IP 주소가 여기에 들어감)
    - DHCP Server Identifier (Option 54): 2대 이상의 DHCP 서버가 DHCP Offer를 보낸 경우, 단말은 이 중에 마음에 드는 DHCP 서버 하나를 고르게 되고, 그 서버의 IP 주소가 여기에 들어감. 즉, DHCP Server Identifier에 명시된 **DHCP** **서버에게** **"DHCP Request"** **메시지**를 보내어 단말 IP 주소를 포함한 네트워크 정보를 얻는 것.

4. **DHCP Ack**

- **패킷 방향:** DHCP 서버 -> 클라이언트
- **브로드캐스트 메시지 :** Destination MAC = FF:FF:FF:FF:FF:FF 혹은 유니캐스트.

    이는 단말이 보낸 DHCP Request 메시지 내의 Broadcast Flag=1이면 DHCP 서버는 DHCP Ack 메시지를 Broadcast로, Flag=0이면 Unicast로 보내게 된다.

- **의미**: DHCP 절차의 마지막 메시지로, DHCP 서버가 단말에게 "네트워크 정보"를 전달해 주는 메시지. 앞서 설명한 DHCP Offer의 '네트워크 정보"와 동일한 파라미터가 포함된다.
- **주요 파라미터(패킷 내용) :** DHCP Request 패킷의 파라미터와 동일

## 대여 갱신

1. 대여 기간의 1/2 (T1)이 경과한 후에 클라이언트는 대여한 서버에게 DHCP Request를 전송한다.
2. 서버는 클라이언트에게 DHCP ACK 또는 DHCP NAK을 전송한다.
    - 만약 DHCP NAK을 수신하면, 클라이언트는 DHCP Discover을 사용하여 새로운 주소를 획득해야 한다.
    - T2(0.875 * lease_duration(;지속)) 시간 전에 DHCP ACK를 수신하지 못하면 (Rebinding state), DHCP Request를 브로드캐스트한다.

---

## DNS 프로토콜

> 도메인 네임과 IP 주소의 대응 관계를 데이터베이스로 구축해 사용하는 인터넷 프로토콜

위에서 배웠듯 클라이언트에게 DNS (Domain Name Server)를 제공하는 것은 DHCP 서버의 책임이다. DNS는 **브라우징을 단순화하는 매우 특별한 목적을 수행하는 인터넷 상의 또 다른 컴퓨터**라고 볼 수 있다.

네트워크의 각 컴퓨터에는 고유한 IP 주소가 있고, 이는 인터넷에서도 마찬가지이다. 인터넷에 연결된 모든 네트워크 또는 컴퓨터 서버에도 고유한 주소가 있다. 우리가 자주 방문하는 사이트의 각 IP 주소를 매번 기억하는 것은 사실 불가능한 일에 가깝다. 그래서 우리는 도메인 이름(www.으로 시작하는 주소)을 사용하는데, 사용자가 [https://velog.io/@hidaehyunlee](https://velog.io/@hidaehyunlee) 과 같이 입력한 주소를 125.209.222.141와 같은 IP 주소로 변환해주는 일을 바로 DNS가 수행하는 것이다. 이러한 DNS를 운영하는 서버를 네임서버(Name Server)라고 한다.

### DNS 절차

1. 특정 사이트를 방문하기위해 사용자가 브라우저에 URL을 입력한다.
2. 그러면 브라우저는 DNS에 접속하여 입력한 도메인 이름과 관련된 IP 주소를 요청한다.
3. 획득한 IP 주소를 사용하여 브라우저는 그 컴퓨터와 통신하고 사용자로부터 요청된 특정 페이지를 요청할 수 있다.

![DNS 절차](https://d1.awsstatic.com/Route53/how-route-53-routes-traffic.8d313c7da075c3c7303aaef32e89b5d0b7885e7c.png)

#### Reference

- [https://m.blog.naver.com/PostView.nhn](https://m.blog.naver.com/PostView.nhn?blogId=hai0416&logNo=221578608161&proxyReferer=https:%2F%2Fwww.google.com%2F)
- [더-편리한-인터넷을-위해-DHCP-DNS-프로토콜](https://velog.io/@hidaehyunlee/%EB%8D%94-%ED%8E%B8%EB%A6%AC%ED%95%9C-%EC%9D%B8%ED%84%B0%EB%84%B7%EC%9D%84-%EC%9C%84%ED%95%B4-DHCP-DNS-%ED%94%84%EB%A1%9C%ED%86%A0%EC%BD%9C)