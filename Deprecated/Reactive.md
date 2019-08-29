# Reactive

사람들이 흔히 말하는 리액티브의 3가지 의미

- 리액티브 시스템 (구조 및 설계)
- **리액티브 프로그래밍 (선언적 이벤트 기반)**
- 함수형 리액티브 프로그래밍 (FRP)

<br/>

## 지난 함수형

- 순수함수
- 불변 데이터 타입
- 공유상태, 부작용(side-effect)피하기
- 명령형이 아닌 선언적

> 선언적 언어(declarative language)란 ‘어떻게’ 보다는 ‘무엇’에 대해 기술하는 방식의 컴퓨터 언어

<br/>

## 함수형에서의 side-effect가 없다하는 것은?

> 콜백이나 옵저버 패턴이 스레드에 안전하지 않은 이유는 같은 자원에 여러 스레드가 Race condition(경쟁조건??)에 빠지게 되었을 때 알 수 없는 결과가 나오기 때문이다

<br/>

### 명령형이란 :question:

작성된 코드가 정해진 순서대로 실행됨

### 명령형의 반댓말

Reactive - 데이터 흐름을 먼저 정의하고 데이터가 변경되었을 때 연관되는 **함수나 수식이 업데이트 되는 방식** => pull이 아닌 push
<br/>

## **Reactive Programming**

> 반응형(Reactive) 기술의 아이디어는 1980년대에 논문("On the Development of Reactive System") 이 나왔고,1990년대, 2000년대초반에 이미 저수준은 제공되고 있어왔다. (Select, ePoll, IOCP등 네트워크 비동기화에서 부터 쓰레드의 추상층등) 그런것들을 토대로 자연스러운 데이터흐름을 다루는것에 대한 벽돌이 쌓아 올려져 RxJava, Node.js, Play(Akka Streaming), Microsoft Reactive Extensions 등이 생겨났다.

<br/>

![Reative](http://sculove.github.io/blog/2016/06/22/Reactive-Programming/stream.png)

<br/>

- Reactive Programing은 기본적으로 모든 것을 스트림(stream)으로 본다. 이벤트, ajax call, 등 모든 데이터의 흐름을 시간순서에 의해 전달되어지는 스트림으로 처리한다. **즉, 스트림이란, 시간순서에 의해 전달되어진 값들의 collection 정도로 이해해 보자.**
- 각각의 스트림은 새로 만들어(branch)져서 새로운 스트림이 될 수도 있고, 여러개의 스트림이 합쳐(merge) 질수 있다.
- 스트림은 map, filter과 같은 함수형 메소드를 이용하여, immutable하게 처리할 수 있다.(고차함수 사용)
- 스트림을 listening 함으로써 데이터의 결과값을 얻는다. 이를 subscribe라고 표현한다.

<br/>

**데이터의 흐름과 변화 전파에 중점을 둔 프로그래밍 패러다임이다. (데이터 흐름에 중점을 둔다.)**
<br/>

![Reative](http://sculove.github.io/blog/2016/06/22/Reactive-Programming/rxjs_stream.png)

<br/>

## Reative의 4가지 주요 속성

- [Responsive](#Responsive(응답성)) : 사용자에 대한 반응(React)
- [Scalable(Elastic)](#Scalable(Elastic)(확장성))  : 부하(road)에 대한 반응(React)
- [Resillent](#Resillent(탄력성)) : 실패상황에 대한 반응(React)
- [Event-driven](#Event-driven(이벤트-주도)) : 이벤트에 대한 반응(React)
  
<br/>

### Responsive(응답성)

쉽게 말해서 웹브라우저의 사용자가 한참 기다리지 않게 하는 것이다.
<br/>

즉 정해진 시간안에 반드시 결과를 받아 볼 수 있게 하자는것. 그 결과가 진짜 결과가 아니라 "지금 처리중입니다" 라는 메세지일지라도.
<br/>

추가적으로 우리가 엑셀을 사용 할때 A가 `=SUM(B1,C1)`라면, B1이 3일때, C1 의 값을 97로 변경하면 자연스럽게 A는 100이 될것임을 알 수 있다.
<br/>

이것처럼 우리가 어떤 행동을 했을 때 자연스럽게 사용자에게 반응하기 위한 노력을 하자는 의미로 볼 수 있다.
<br/>

### Scalable(Elastic)(확장성)

규모변경 성질이다.
<br/>

Scalable은 주로 확장의 의미가 있기 때문에 요즘은 확장되었다가 다시 축소도 시킬 수 있다는 의미로 Elastic을 사용하기도 한다.
<br/>

어플리케이션을 수평확장시키는 방식은 여러모로 굉장히 어려운 도전이다.
<br/>
  
### Resillent(탄력성)

버그가없는, 실패하지 않는 소프트웨어를 만드는것은 거의 불가능에 가깝다.  
<br/>

이러한 실패를 피해 완벽한 프로그램을 개발하는 것 보다 reactive 패러다임은 실패를 포함하는 설계를 하도록 한다.
<br/>

즉 충돌하게 내버려둬라는 철학을 가지고 있다.
<br/>

관리자 역할을 하는 액터는 자동으로 실패를 감지하고 원상태로 회복하게 만드는데
<br/>

즉 재앙을 최소화하는것에 관심을 두고 있다.
<br/>

### Event-driven(이벤트 주도)

웹서버에서 동기식 멀티쓰레드로 request 가 대응되는것이 아니라, 비동기식 event 별로 처리를 하게되면 리소스 활용성이 높아진다 (메모리 및 CPU).
<br/>

하지만 공유상태를 나눠갖는것에 있어서 어려움이 생길 수 있다.
<br/>

따라서 그런 어려움을 방어 하기 위해 immutable 상태 지향의 개발, Actor, STM 등의 기술이 함께 따라다닌다.
<br/>

즉 데이터가 흘러감에 있어서 변경가능한 상태에서의 알 수 없는 변화는 지옥의 버그를 창조하므로 자연스럽게 함수형패러다임이 가미가 되는 것이다.
<br/>

![Event_pic](https://github.com/SeonHyungJo/FrontEnd-Dev/blob/master/assets/image/Event_Loop.png?raw=true)

Event 를 처리하는 루프(쓰레드)가 있으며 해당 이벤트를 받기위해 구독을 신청한 노드의 핸들러에게 메세지(이벤트)를 전달해준다.
<br/>

물론 그 이벤트루프에 이벤트를 발생하는 녀석도 있을 것이다.
<br/>

즉
<br/>

- Events : 웹으로 말하면 브라우저에서의 Request 및 미들웨어로의 요청
- Event Loop : Reqeust 를 처리하는 엔진
- Event Handler : Request 를 받아서 비니지스로직을 구현. 이것은 주로 우리가 만드는 것
  
로 이루어져있다.
<br/>

## 그럼 왜 Reactive Programming 인가?

- 함수형으로 만들기 때문에, 하나의 함수는 그 역할 자체에 집중할수 있다.
- Promise의 장점을 극대화할 수 있다.

Reactive Programming에서 갑자기 Promise를 이야기하는 이유는, RxJS의 Observable이 Promise와 개념적으로 유사하다. 차이가 있다면, Promise는 단 하나의 value를 다룰 수 있지만, Observable은 다수의 value를 다룰 수 있다.

```js

myObservable.subscribe(successFn, errorFn);
myPromise.then(successFn, errorFn);

```

> The Promise is an Observable<br/>
> The Observable is not a Promise<br/>
> ES7 스펙에 Observable이 제안되어 있지만 현재는 표준이 아니다. 하지만, Promise는 Promises/A+ 표준이다.

처음 Promise를 접할 때에는 좀 낯설었지만, 실제 구현상의 편리함이나, 로직의 심플함, 비동기 처리를 동기식으로 개발할 수 있는 장점 덕분에, 좀더 알아먹기 쉬운 코딩을 할수 있다. 익숙해지면, Observable은 Promise보다 더 강력하다.

- Observable은 A steam에 의해 B stream이 영향을 받는 경우, A만 바꿔도 B가 자동으로 바꿀 수 있도록 구성할 수 있어서,데이터의 동기화를 간편하게 할 수 있다. 이러한 이유는 A와 B stream 사이의 관계를 선언적으로 선언했기 때문에 가능하다.

## Rx js?

> **RX = OBSERVABLE + OBSERVER + SCHEDULERS**

<br/>

---

#### Reference 

- [찰스의 안드로이드](https://www.charlezz.com/?p=189)
- [한빛미디어](http://www.hanbit.co.kr/media/channel/view.html?cms_code=CMS6076376207)
- [HAMA Blog](http://hamait.tistory.com/761)