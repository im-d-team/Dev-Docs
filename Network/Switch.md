네트워크 교육을 듣다가 스위치가 layer 계층별로 각각 존재한다는 것을 알게 되었고 더욱 자세히 알고 싶어 정리를 해보았다.

# 스위치(Switch)
스위치란 허브의 확장된 개념으로 기본 기능은 허브와 같지만 전송 중 패킷의 충돌이 일어나지 않도록 패킷의 목적지로 지정할 포트를 직접 전송한다. 소규모 통신을 위한 허브보다 전송 속도가 개선된 것이다. 

간단하게 말해서 아래의 사진처럼 인터넷을 할 수 있는 랜선을 꽂을 수 있는 것을 스위치라고 한다. 하나의 네트워크 라인에 여러 대의 컴퓨터를 연결하는 데 필요한 장치이다.  

![스위치](https://user-images.githubusercontent.com/43868540/104829776-5ea58800-58ba-11eb-8b42-18e63238c6cd.PNG)

> [출처](https://blog.naver.com/PostView.nhn?blogId=wjw1225&logNo=222147131756)

## 허브와 스위치의 차이
허브의 경우 전송대역을 여러 대의 네트워크가 나눠 쓰는 단점이 있다. 반면 스위치의 경우는 같은 속도로 분배해준다는 장점이 있다.

![스위치와 허브](https://user-images.githubusercontent.com/43868540/104828795-5cd6c700-58b0-11eb-9c5c-c18f53c02339.PNG)

> [출처](https://siran.tistory.com/205)

위에 그림을 보면 허브는 모든 노드가 일정 속도를 나누어 쓰게 되고, 스위치는 네트워크를 동시에 사용 가능해 속도 저하가 거의 없다. 따라서 스위치는 각 Port별로 bandwidth를 제공한다.  

### Layer2 스위치(스위치)
Layer 2에서 동작하는 스위치로, MAC 주소를 보고 데이터를 단순전달해주는 기능을 담당한다. 허브와는 다르게 포트별로 bandwidth가 정해져 데이터를 전달하기 때문에 속도에 저하가 없다. 

- 가장 흔히 볼 수 있는 스위칭 방식이며, 원래 스위치의 정의에 가장 부합하는 형태이다. 
- 패킷의 **MAC 주소**를 읽어 스위칭하고, MAC의 OSI 계층 중 2계층에 해당하기 때문에 Layer 2 스위치라 한다. 
- Broadcast 패킷에 의해 성능 저하가 발생한다. 
> Broadcast란 송신 호스트가 전송한 데이터가 네트워크에 연결된 모든 호스트에 전송되는 방식이다.

하지만 L2 스위치는 MAC 주소로만 동작할 뿐 상위 레이어인 3계층에서 동작하는 ip 등을 이해하지 못한다. 따라서 라우팅을 할 수 없다.

### Layer3 스위치(라우터)
데이터를 단순전달만 하는 L2와는 달리, L3는 **라우팅 기능이 있어 외부에 연결된 포트도 데이터를 보낼 수 있다.**
L2 스위치는 서로 다른 네트워크의 경우 통신이 되지 않지만, L3 스위치는 서로 다른 네트워크여도 라우팅하여 통신할 수 있다. 따라서 라우터와의 경계가 모호하다. 
> 라우터와 L3 스위치와의 차이점을 많이 찾아보았지만 결론적으로 거의 같은 의미로 사용한다고 한다. 굳이 기준을 잡고 구분할 수 있겠지만 차이점이 거의 없기 때문에 같은 뜻으로 받아들여도 된다고 한다. 

![L3](https://user-images.githubusercontent.com/43868540/104829794-a2988d00-58ba-11eb-9e89-96ef37d732b4.PNG)

> [출처](https://blog.naver.com/PostView.nhn?blogId=wjw1225&logNo=222147131756)

- 패킷의 **IP 주소**를 읽어 스위칭하고, IP가 OSI 7계층 중 3계층에 해당하기 때문에 Layer 3 스위치라 한다. 
- L2 스위치에 라우팅(Routing) 기능을 추가하고 TCP/IP를 이용한다.

### Layer4 스위치(로드밸런싱)
L4 스위치는 TCP와 UDP의 헤더를 보고 포트를 분별해 적절한 서버로 패킷을 전송한다. 즉, 똑같은 IP여도 포트 번호가 다를 경우 다른 서버로 보낼 수 있다. 
그리고 그것이 FTP인가 HTTP인가 SMTP인가를 보고 어떤 것을 우선시해서 스위칭할지 판단할 수 있다. 또한, 서버나 네트워크의 트래픽을 로드밸런싱을 할 수 있다.
> 로드밸런싱은 여러 대의 서버를 1대처럼 묶을 수 있는 분산기능이다.

실제로 많은 온라인 서비스들은 대부분 최소 2개 이상의 같은 서버들로 분산처리 되게끔 구성되어있다고 한다. 이때 서비스를 분산시켜주는 장비가 L4이다. 이는 부하를 분산하기 위함도 있고 서비스가 죽는 때를 대비하기 위한 것이다. 이로 인해 서버에 트래픽 과부하를 거는 디도스 공격이 불가능해진다는 장점도 있다.

![L4](https://user-images.githubusercontent.com/43868540/104828573-3ca60880-58ae-11eb-8ba1-5e98db78c670.PNG)

> [출처](https://klero.tistory.com/entry/L2-L3-L4-L7-%EC%8A%A4%EC%9C%84%EC%B9%98-%EA%B5%AC%EB%B6%84-%EB%B0%8F-%EA%B8%B0%EB%B3%B8%EC%A0%81%EC%9D%B8-%EC%84%A4%EB%AA%85)

- 패킷의 IP주소와 Port번호를 읽어 스위칭을 하고 Port가 OSI 7계층 중 4계층에 해당하기 때문에 Layer 4 스위치라 한다. 
- L3와 같이 프로토콜을 기반으로 하며, 어플리케이션별로 우선순위를 두어 스위칭이 가능하다.
- 많은 양의 트래픽을 여러 서버로 분산할 수 있다.


## 정리
각 어떤 계층에서 수행되는가에 따라 L2, L3 등 분류된다.
상위 레벨에서 동작하는 스위치는 자신의 하위 레벨 스위치의 기능을 다 갖고 있다. 예를 들어 L4 스위치는 L3, L2 기능도 다 수행할 수 있다.

- L2 스위치는 MAC 정보(MAC Table)를 보고 스위칭을 하는 것이다. (일반적인 스위치의 기능)
- L3 스위치는 IP 정보(Routing Table)를 보고 스위칭을 하는 것이다. (라우팅 기능이 추가됨)
- L4 스위치는 IP+Port(Session or Connection)를 보고 스위칭을 하는 것이다. (로드밸런싱을 위해 사용됨)

----
#### Reference
- [스위치와 L2,L3,L4](https://startingpitcher.tistory.com/8)
- [L1,2,3,4,7](ttps://nhj12311.tistory.com/75)
