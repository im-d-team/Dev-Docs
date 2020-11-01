# WebRTC

WebRTC(Web Real-Time Communication)는 Google이 시작한 오픈소스 프로젝트로 별도의 플러그인이나 소프트웨어 없이 Web과 Android, iOS 등에서 p2p 방식으로 음성, 영상 혹은 텍스트 같은 데이터를 주고받을 수 있게 만든 기술이다.

WebRTC 이전에 Real-time Communication에 사용되던 HLS(HTTP Live Streaming)의 경우 보안이 취약하고 Latency가 느린 문제가 있었다.  Active X, Flash 또한 여러 단점들이 존재했다. WebRTC는 이렇듯 기존에 사용되던 기술들의 문제점을 해결하기 위해 탄생하였다.

WebRTC의 라이센스는 BSD이며 국제 인터넷 표준화 기구 프로토콜 표준화 작업을, W3C가 API정의를 진행하였다.

WebRTC는 서로 상호 작용하는 API들과 Protocol들로 구성되어 있다. Google에서 제공하는 [Adapter.js](https://github.com/webrtcHacks/adapter) 라이브러리를 사용하게 되면 플랫폼 간 WebRTC 구현의 차이점으로 인한 호환성 문제가 해결된 상태로 개발할 수 있다. 해당 라이브러리는 [npm package](https://www.npmjs.com/package/webrtc-adapter) 형태로도 제공된다.

## WebRTC API

WebRTC에는 다음과 같은 세 종류의 API가 구현되어 있다.

- MediaStream(GetUserMedia)
   - 카메라와 마이크에 접근하여 하나의 스트림으로 비디오, 오디오의 Track들을 동기화해주는 역할
- RTCPeerConnection
   - 각 Peer 간 오디오, 비디오 통신을 활성화하고 신호처리, 코텍 관리, P2P 통신, 보안, 대역폭 관리 등을 수행
   - 각 Peer 간의 커넥션은 해당 인터페이스를 이용하여 수신자와 발신자를 등록하여 MediaStream과 RTCDataChannel을 커넥션에 연결할 수 있음
   - 각 Peer 간의 데이터를 효율적이고 안정적으로 통신하게 처리하는 기능을 제공
- RTCDataChannel
   - 각 Peer 간에 데이터(JSON/text)를 처리하는 채널을 추상화하여 API 형태로 제공
   - 웹 소켓 API와 유사한 메소드와 이벤트로 설계된 유연하고 강력한 솔루션

## WebRTC 동작 흐름

### 1. Fetching

MediaStream(GetUserMedia) API를 사용하여 영상 및 음성 정보를 가져온다.

### 2. Signaling

Signaling은 서로 다른 네트워크에 있는 각 peer끼리 Session Description 정보를 교환하여 p2p가 형성되도록 연결하는 과정이다. 이를 통해 IP, Port, Video, Audio 코덱 정보를 주고받아서 정상적인 기능을 수행한다.

Signaling은 다음과 같은 세 종류의 정보를 교환한다.

- Network Configuration
   - ICE(Interactive Connectivity Establishment)를 사용해 Candidate(IP, Port)를 찾음
   - IP 주소와 Port 교환
- Media Capabilities
   - SDP(Session Description Protocol) 형식의 blob인 offer와 answer를 주고받음
   - SDP는 p2p로 서로 간 주고받을 코덱 해상도 등의 데이터를 이해하는데 사용되는 메타데이터
   - 웹 브라우저 간 호환 가능한 코덱들과 해상도를 교환
- Session Control Messages
   - 통신의 초기화, 종료 및 Error 리포트를 교환

이러한 프로세스를 Signaling이라고 하며 Signaling을 진행하기 위해서는 Signaling 서버가 필요하다. WebRTC 표준에 Signaling은 정의되어 있지 않아 임의로 개발해야 한다. Signaling 서버의 동작 순서는 다음과 같다.

![](https://www.hellonms.net/upload/image/2016/09/09/17/55/41009_32.PNG)

> 출처: https://www.hellonms.net/blog.do?mode=view&startNo=0&bbs_id=8

#### 2.1 Media Capability(SDP) + Session Control Message 교환

Signaling 프로세스는 call을 하는 유저가 Offer를 만들면서 시작된다. 해당 Offer는 세션 정보를 SDP(Session Description Protocol) 포맷으로 callee에게 전달된다. callee는 caller에게 SDP Description을 포함한 Answer 메시지를 보낸다. 현시점에서 A와 B는 어떤 코덱들과 어떤 Video Parameter들이 사용되는지 알게 된다. 하지만 여전히 미디어 데이터 자체를 전송하지 못한다.

1. B가 RTCPeerConnection.createOffer를 호출해 Offer SDP를 생성
2. B가 Offer SDP를 Signaling Server를 사용하여 전송
3. A는 Signaling Channel에서 Offer SDP를 받아, RTCPeerConnection.setRemoteDescription을 수행
4. A의 RTCPeerConnection 객체는 상대 Session에 대한 정보를 알고 있게 되었고, RTCPeerConnection.createAnswer를 호출하여 Answer SDP를 생성하여 Signaling Channel을 통해 B에게 전달
5. B도 마찬가지로 자신의 RTCPeerConnection.setRemoteDescription을 호출해, 전달받은 Answer SDP를 등록
6. A, B 각 측에서 setRemoteDescription이 성공적으로 수행되었다면, 각 브라우저에서는 서로의 peer에 대해 인지하고 있는 상태이므로 p2p 연결이 성공적으로 완료 

#### 2.2 Network Configuration(ICE Candidate) 교환

상대 Peer와 연결하기 위해 통신할 수 있는 네트워크 정보인 ICE Candidate를 교환해야 한다. ICE(Interactive Connectivity Establishment)는 p2p 간 직접적인 통신을 위한 기술로 서로의 기기와 통신하기 위해 최적의 경로를 찾을 수 있도록 도와준다.

SDP를 결정한 후에는 ICE Candidate들을 교환하기 시작하며 여러 경로 중 최고의 ICE를 결정한다.

ICE는 연결에 사용할 수 있는 모든 가능한 IP 후보군(사설 IP, STUN이 돌려주는 공인 IP)들을 조사하고, Peer 간 직접 연결을 맺을 수 있는지를 확인하는 기술이다. 연결 테스트를 위해 SDP(Session Description Protocol)를 사용하여 미디어 패킷을 흘려보내며 연결 가능 여부를 테스트한다.

각 Peer는 검색되는 순서대로 Candidate를 보내고, 이미 스트리밍이 시작됐다 하더라도 모든 가능한 Candidate가 전송 될 때까지 계속 보낸다.

SDP를 결정한 후에는 ICE Candidate들을 교환하기 시작하며 여러 경로 중 최고의 ICE를 결정하게 한다. 이 과정 때문에 이미 미디어 스트리밍이 시작됐다고 하더라도 연결 초반에는 영상 품질이 낮을 수 있다.

ICE Candidate의 절차는 다음과 같다.

1. RTCPeerConnection Object를 새롭게 생성하고 RTCPeerConnection.onicecandidate 핸들러를 통해 현재 내 Client의 ICE Candidate가 확보되면 실행될 Callback을 전달
2. 내 Client의 ICE Candidate가 확보되면, 중간 매개자인 Signaling 서버를 통해 상대 Peer에게 Serialized 된 ICE Candidate정보를 서로에게 전송
3. 상대 Peer의 ICE Candidate가 도착하면, RTCPeerConnection.addIceCandidate를 통해 상대 Peer의 네트워크 정보를 서로가 각각 등록

### 3. Connection

Signaling으로 상대방의 정보가 포함된 RTCPeerConnection을 얻게 되면 연결이 성공적으로 이루어진 것이다.

### 4. Communication

WebRTC를 통해서 각 Peer 간에 주고받는 데이터는 크게 아래의 두 가지 형태이다.

1. 비디오와 오디오 데이터 Stream
2. 직렬화된 텍스트 데이터

각 Peer들의 연결이 이루어지기 전에 데이터 Stream이나 채널을 미리 준비하고, 연결이 완료되면 데이터를 받았을 때의 callback을 통해 받은 데이터를 처리하게 된다. 조금 더 자세한 내용은 다음과 같다.

#### 4.1 비디오와 오디오의 데이터 Stream

- 전달하는 입장
   - MediaStream(GetUserMedia) API 등으로 비디오와 오디오 데이터 Stream source를 취득해 RTCPeerConnection을 생성할 당시에 데이터 stream 채널을 연결할 수 있도록RTCPeerConnection.addTrack() 사용
   - Signaling을 통한 연결이 이루어지기 전에 미리 설정이 되어야 함

- 받는 입장
   - RTCPeerConnection.ontrack의 callback을 커스텀하게 설정해서, connection이 성공적으로 이루어진 후에 상대방의 Track (비디오와 오디오 Stream)이 감지되면 어떤 동작을 할지 설정할 수 있음
   - 보통 받은 Track의 데이터 Stream을 DOM의 `<video srcObject={[Stream]}/>` 에 연결

#### 4.2 직렬화된 텍스트 데이터

- 전달하는 입장
   - RTCPeerConnection.createDataChannel을 통해 특정 이름의 데이터 전달 채널을 개설할 수 있음
   - Signaling을 통한 연결이 이루어지기 전에 미리 설정이 되어야 함

- 받는 입장
   - RTCPeerConnection.ondatachannel의 callback을 커스텀하게 설정해서, connection이 성공적으로 이루어진 후에 상대방이 Data channel을 통해 어떤 데이터를 보냈을 때의 동작을 설정할 수 있음

## ETC

### 1. Signaling 단계에서의 STUN과 TURN의 역할

보통 클라이언트는 사설 IP주소를 사용하는 내부 호스트인데 P2P로 연결 요청하면 NAT/Firewall에서 막혀서 응답을 받을 수 없다. Signaling 단계에서 이와 같은 상황이 발생할 경우 TURN 혹은 STUN을 이용해 문제를 해결할 수 있다.

![](https://i.stack.imgur.com/rqnKf.png)

> 출처: https://stackoverflow.com/questions/55670149/webrtc-does-server-or-another-peer-see-my-internal-ip-address

#### 1.1 STUN(Session Traversal Utilities for NAT)

![](http://io13webrtc.appspot.com/images/stun.png)

> 출처: http://io13webrtc.appspot.com/images/stun.png

WebRTC의 p2p 연결을 위해 NAT/Firewall 뒷 단의 클라이언트들은 사설 IP를 내부에서 보유하고 있다. 이럴 경우 외부 통신을 위해 자신의 공인 IP 정보를 스스로 파악하여 서로에게 알려주어야 한다. 이때 사설 IP를 보유한 장비들의 공인 IP 정보를 알려주어 접근할 수 있도록 해주는 서버가 STUN(Session Traversal Utilities for NAT)이다.

#### 1.2 TURN(Traversal Using Relays around NAT)

![](https://t1.daumcdn.net/cfile/tistory/2409CF4D58B638E20E)

> 출처: https://www.html5rocks.com/ko/tutorials/webrtc/basics/#toc-rtcpeerconnection

공인 IP 간 연결을 테스트해보고 연결할 수 있으면 WebRTC 클라이언트들은 p2p 연결이 된 것이지만, 만약 연결이 실패한다면 인터넷상의 중계 서버(Relay Server)를 사용해야 하는데, 이 서버가 TURN(Traversal Using Relays around NAT) 서버이다.

TURN 서버는 STUN 서버를 이용한 연결이 실패했을 경우 오디오, 비디오 등의 데이터를 릴레이 해주는 역할을 한다. TURN 서버를 통해 모든 정보를 중계하게 되기 때문에 대안이 전혀 없는 경우에만 사용하는 것이 좋다.

### 2. Web Topologies

![](https://miro.medium.com/max/2000/0*VketTspbtHNGP9ho.png)

> 출처: https://medium.com/@khan_honney/5-reasons-to-prefer-ant-media-server-over-sfu-bbea131807f

#### 2.1 Mesh(p2p)

Mesh Topology 방식은 Session의 각 Peer가 서버를 사용하지 않고 다른 모든 Peer와 직접 연결하는 방식이다. 이런 종류의 연결은 비용이 가장 적고 쉽기 때문에 작은 규모의 화상 회의에서 적절하다. 그러나 컨퍼런스가 커질 경우 CPU 사용량이 많아지거나 네트워크 지연이 발생할 수 있기 때문에 모든 참가자 간의 연결 유지에 어려움을 겪을 수 있다.

#### 2.2 MCU(Multipoint Control Unit)

MCU Topology 방식은 Session의 각 참가자가 다중 연결 제어장치(MCU) 역할을 하는 서버에 연결하는 방식이다. 각 참가자로부터 받은 미디어를 단일 스트림으로 합친 다음 각 클라이언트에게 제공한다. 서버 측면에서 대역폭 사용량과 Downstream 연결에서 CPU 점유율의 여유를 가져올 수 있지만, 오디오와 비디오 미디어를 단일 Stream으로 합치기 위한 CPU 할당이 필요하게 된다.

가장 낮은 대역폭이기 때문에 네트워크 조건이 좋지 않을 때 유리하다. 또한 위상의 제한이 없어 다수의 참가자 연결에 적절하다. 하지만 미디어를 서버에서 다루는 과정에서 Latency가 높아질 수 있다.

#### 2.3 SFU(Selective Forwarding Unit)

SFU Topology 방식은 Session의 각 참가자가 SFU(Selective Forwarding Unit) 역할을 하는 서버에 연결하는 방식이다. 각 참가자는 암호화된 비디오 Stream을 서버에 업로드하고 서버는 Stream을 다른 참가자들에게 전달한다.

클라이언트 측에선 하나의 Upstream 연결만이 존재하므로 Mesh Topology 방식보다 업로드 효율이 높다. 이러한 특징으로 인해 Mesh Topology 방식보다 더 많은 참가자를 수용할 수 있다.

---

#### Reference

- [MDN: WebRTC API](https://developer.mozilla.org/ko/docs/Web/API/WebRTC_API)
- [WebRTC 이해하기](https://usinuniverse.bitbucket.io/blog/webrtc.html)
- [Getting Started with WebRTC](https://www.html5rocks.com/ko/tutorials/webrtc/basics/)
- [2018 webRTC 정리](http://jaynewho.com/post/36)
