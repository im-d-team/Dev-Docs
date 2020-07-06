# SOAP API
API를 사용하면서 여러 종류의 API가 있다는 사실을 알게 되었다. 가장 대표적인 두 가지 방식으로는 SOAP와 REST가 있다. 두 가지 방식은 비슷하지만 본질적으로 다른 기술이다. [SOAP는 프로토콜이고, REST는 아키텍처 스타일](http://blog.wishket.com/soap-api-vs-rest-api-두-방식의-가장-큰-차이점은/)이기 때문이다.

SOAP와 REST는 일반적으로 웹 서비스라고 불린다. 이러한 서비스는 서로 다른 컴퓨터에서 네트워크를 통해 데이터를 주고받는 통신이라고 생각하면 된다. 

저번 시간에는 [REST API](https://github.com/im-d-team/Dev-Docs/blob/master/Network/REST%20API.md)에 대해 자세히 알아보았으니 이번 시간에는 SOAP에 대해서 자세히 알아보는 시간을 가지자.

## SOAP API?
SOAP는 Simple Object Access Protocol의 약자이며 HTTP, HTTPS, SMTP 등을 통해 `XML 기반`의 메시지를 분산된 컴퓨터 네트워크 환경에서 교환하는 `프로토콜`이다.
보안이나 메시지 전송 등에 있어서 많은 표준들이 정해져있기 때문에 REST API보다 조금 더 복잡하다.

SOAP는 SSL을 지원하고 WS-Security라는 자체 표준의 보안 기능을 가지고 있기 때문에 보안 수준이 엄격하다. 

> SSL는 보안 소켓 계층(Secure Socket Layer)이며 클라이언트와 서버 간의 데이터 전송 시 암호화하여 보안을 유지한다.

> WS-Security는 웹서비스에 보안을 적용하기 위하여 SOAP 메시지에 보안을 강화한 것이다.

따라서 은행용 모바일 앱, 신뢰할 수 있는 메시징 앱 등 보안 수준이 높아야 하거나 또는 ACID(원자성, 일관성, 고립성, 지속성)를 준수해야 하는 경우라면 SOAP 방식이 더욱 선호된다.

> **원자성**: 작업들이 부분적으로 실행되다가 중단되지 않는 것을 보장하는 능력이다.

> **일관성**: 트랜잭션이 실행을 성공적으로 완료하면 일관성 있는 데이터베이스 상태를 유지하는 것을 의미한다.

> **고립성**: 트랜잭션 실행 시 다른 트랜잭션이 끼어들지 못하도록 보장하는 것을 의미한다.

> **지속성**: 성공적으로 실행된 트랜잭션은 영원히 반영되어야 함을 의미한다.  

## SOAP 아키텍처
SOAP는 일반적으로 UDDI 레지스토리를 통해 웹 서비스를 `등록(Publish)`하고, `탐색(find)`하고, `바인딩(Bind)`하여 사용한다. 

### 동작원리

![SOAP 동작원리](https://user-images.githubusercontent.com/43868540/84564061-1ad62780-ad9b-11ea-862f-9ca9563e6c57.png)
> [출처](https://devkingdom.tistory.com/12)

1. 서비스 요청자가 SOAP로 인코딩하여 웹 서비스 요청을 서비스 제공자에게 전달한다.
2. 서비스 제공자는 이를 디코딩하여 적절한 서비스 로직을 수행시켜서 결과를 얻는다.
3. 로직을 수행시켜서 얻은 결과를 SOAP로 인코딩하여 반환한다. 

여기서 WSDL(Web Services Description Language)과 UDDI(Universal description, discovery, and integration)의 개념이 모호할 것이다. 
웹 서비스가 제공하는 서비스에 대한 정보를 기술하기 위한 XML 기반의 마크업 언어가 `WSDL`이다. WSDL은 웹 서비스를 기술하고 웹 서비스가 실제 어디에 위치하고 있는 지와 웹 서비스를 이용하기 위한 Biding정보를 담고 있는 문서이다. 이 WSDL은 서비스 제공자가 기술한다. WSDL 정보를 해석하면 soap를 사용해 필요한 웹 서비스를 사용할 수 있다.
그렇다면 WSDL은 어디에 저장되어 있을까?

이러한 WSDL이 위치한 저장소가 `UDDI 레지스토리`이다. 
이러한 저장소에 있는 자료를 꺼내기 위해 실행 프로토콜인 `SOAP`를 사용한다. 

**한번 발행된 WSDL은 UDDI(레지스토리)에 저장이 되며 잠재적인 사용자가 원하는 기능의 웹서비스가 구현되었는지 검색하는데 사용된다.**
SOAP을 사용해 필요한 웹서비스의 대한 정보를 UDDI를 통해 탐색, 선택을 하면 선택된 웹 서비스의 WSDL을 파싱하여 SOAP 메시지로 인코딩하여 반환한다. 

더욱 자세한 설명이 필요하다면 [이곳](http://www.nextree.co.kr/p11842/)을 참고하길 바란다. 

그렇다면 SOAP의 메시지 구조를 한번 살펴보자.

![SOAP 메시지 구조](https://user-images.githubusercontent.com/43868540/84564122-a780e580-ad9b-11ea-9f6d-e4803e1c9a6e.jpeg)
> [출처](https://mygumi.tistory.com/55)

크게 `HTTP Header`와 `SOAP part`, `Attachment` 3개로 나누어 진다.

`HTTP Header`에는 송수신하면서 필요한 정보들(시간, 인터넷 호스트와 포트, 상태 코드, 인코딩 등)을 표시한다. 

요청과 응답에 대한 코드의 상세한 설명은 [이곳](http://egloos.zum.com/tequiero35/v/1026372)를 참고하길 바란다.

<img width="570" alt="스크린샷 2020-06-14 오전 12 12 21" src="https://user-images.githubusercontent.com/43868540/84572270-d87d0c80-add3-11ea-8817-d81df090eb4f.png">

> [출처](https://www.slideshare.net/yjaeseok/soap-rest)

`SOAP Part`안에는 위의 사진처럼 xml 형태로 데이터가 들어가 있다. 

SOAP 봉투(envelope), SOAP 헤더(header), SOAP 바디(body)로 구성된 하나의 xml 문서로 표현된다. 

`<env:Envelop>`는 루트 엘리먼트로, SOAP 메시지를 위한 네임스페이스이다. 충돌 방지와 호출을 위한 네임스페이스를 지정해 주어야 한다. 

`<env:Body>`는 web service를 이용하기 위한 실제 메시지를 기술하는 곳이다. 

서비스를 호출하고 응답에 관한 내용을 적는다. 위의 사진은 요청자에게 응답할 id와 password가 기술된 메시지이다. 

또한, `<env:Body>`는 에러가 있을 때 SOAP Fault를 기술하는 곳이기도 하다. 

`<env:Fault>`는 `<env:Body>` 엘리먼트의 하위 엘리먼트로, SOAP 문서 처리할 때 에러가 발생한 경우, 그 내용을 기술한다.

각각의 엘리먼트와 예제 등 자세한 내용은 [이곳](http://egloos.zum.com/tequiero35/v/1026372)를 참고하길 바란다. 

이러한 복잡한 구성으로 인해 HTTP 상에서 전달되기 무겁고, 메시지 인코딩/디코딩 과정 등 웹 서비스 개발의 난이도가 높아 개발 환경의 지원이 필요하다. 


## SOAP의 장점과 단점
###장점
- SOAP는 플랫폼과 프로그래밍 언어에 **독립적**이다.
> 어떤 언어로 작성되더라도 SOAP만 준수된다면 플랫폼 독립적이라 데이터 통신이 가능함
- SOAP는 웹 서비스를 제공하기 위한 **표준(WSDL, UDDI, WS-Security)이 잘 정립**되어 있다.
- SOAP는 **에러 처리**에 대한 내용이 기본으로 내장되어 있다.
- SOAP는 **분산 환경**에 적합하다.

###단점
- REST에 비해 구조가 복잡하기 때문에 상대적으로 **무겁고 속도도 느리다**.
- 메시지 인코딩/디코딩 과정 등 **개발 난이도가 높아 개발 환경의 지원이 필요하다**.

#### Reference
- [SOAP vs REST](http://blog.wishket.com/soap-api-vs-rest-api-두-방식의-가장-큰-차이점은/)
- [ACID](https://goodgid.github.io/ACID/)
- [SOAP](https://mygumi.tistory.com/55)
- [WDSL, UDDI](https://beatz.tistory.com/entry/SOAP-WSDL-UDDI)
