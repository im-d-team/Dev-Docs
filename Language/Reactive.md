# Reactive

Reactive Programming의 3가지

- Reactive Programming
- Functional Reactive Programming
- Reactive Extensions(Rx-\*)

## Reactive Programming

> Reactive Programming is programming with asynchronous data streams. You can listen to that stream and react accordingly.

Reactive Programming은 비동기 데이터 스트림을 이용한 프로그래밍이다.

이게 무슨 소리인지 직관적으로 이해가 가진 않는다.

그런데 우리가 가장 많이 사용하고 있는 RP의 개념 중 하나가 button click이다.

![RP-button](https://user-images.githubusercontent.com/24724691/64065845-d8998a80-cc4d-11e9-9620-1d662eed78c5.png)

event는 stream으로 취급하고 이를 클릭하는 처리는 모두 비동기로 진행된다. 바로 감은 오지 않을 것이다. 조금 더 돌아가 보자.

### 역사

반응형(Reactive) 기술의 아이디어는 1980년대에 논문("On the Development of Reactive System") 에서 나왔고, 1990년대, 2000년대 초반에 이미 저수준은 제공되고 있었다.
그것들을 토대로 자연스러운 데이터 흐름을 다루는 벽돌이 쌓아 올려져 Node.js, Play(Akka Streaming), Microsoft Reactive Extensions 등이 생겨났으며 RxJava, RxJs, RxSwift 등의 Rx 시리즈가 등장했다.

### RP 특징

#### Stream

Reactive Programing은 기본적으로 모든 것을 스트림으로 본다. 이벤트, ajax call, 변수, 데이터 등 모든 데이터의 흐름을 시간순에 의해 전달되는 스트림으로 처리한다.
**스트림이란 쉽게 말하자면 시간에 흐름에 의해서 전달된 값들이다.**

다음의 그림처럼 event이외에 다른 점들도 stream이 될 수 있다.

![RP](https://user-images.githubusercontent.com/24724691/64065933-14811f80-cc4f-11e9-9483-a3f6eb4ffdf9.png)

이렇게 모든 것을 데이터의 흐름으로 보고 어떠한 변화를 전파하는 것에 중점을 둔 프로그래밍 패러다임이다.

### Async

Async를 처리하기 위해 RP에서는 Observer Pattern을 채택한다.

비동기를 해결하기 위한 방식으로 callback과 어느 정도 비슷하다.
callback은 특정 행위가 일어나면 callback을 실행한다. observer pattern은 구독이다. 특정 행위가 일어나면 구독자들에게 알린다.

예를 들어 카톡이 왔다고 하자. 카톡을 확인하려고 대화창을 클릭하면 동시에 여러 일이 벌어져야 한다고 하자.

1. 화면에 실제 카톡 내용이 보인다.
2. 알림을 알려주는 badge의 아이콘이 사라진다.
3. 좌측 화면의 카톡 알림이 사라진다.

이걸 옵저버 패턴에서 처리하려면 의사코드는 다음과 같다.

```js
chatView.subscribe(chatViewList, show);
badgeAlram.subscribe(chatViewList, deleteBadge);
alram.subscribe(chatViewList, deleteAlram);

class chatViewList extends Observable
chatViewList.click();

// ...
this.observers = [];
click() {
    observers.map(observer => observer());
    // ...
}
```

카톡내용, 뱃지, 알람 세 뷰는 모두 `chatViewList`를 구독한다. 클릭이 발생하면 구독자들에게 상태가 변경됨을 공지하고 다른 행동을 각자 발생시킨다.

이렇게 프로그램을 비동기 + 스트림으로 처리하는 방식이 RP다. 아직도 이해가 잘 안 되겠지만 마지막에 코드를 보면 조금 더 이해가 잘 될 것이다.

## Functional Reactive Programming

> Functional Reactive Programming is a programming paradigm for reactive programming using the building blocks of functional programming

RP를 FP를 이용하여 만든 것이다.

[함수형 프로그래밍](https://github.com/Im-D/Dev-Docs/blob/master/Language/함수형%20프로그래밍.md) 을 참고하면 함수형의 기본적인 철학은 선언형 프로그래밍이다. 이 점이 RP와 매우 잘 맞는다.

예를 들면 SNS에서 좋아요를 누르면 특정 로직을 거친 후 숫자가 1 올라가고 하트의 색이 변한다. 이를 하나의 스트림과 비동기로 취급하면 RP고 벌써 이야기s했듯 선언적으로 처리하면 FP다.

`like().filter(somthing).addNumber(1).changeColor('red');` 처럼 코드를 짠다면 선언적으로 매우 알아보기 쉽게 만들 수 있을 것이다.

둘의 궁합이 굉장히 좋기 때문에 FRP에 대해 많이 이야기한다.

## Rx-\*

> Reactive Extensions are an API for asynchronous programming with observable streams

옵저버 스트림을 이용한 비동기 프로그래밍을 위한 API다. RP에 대한 특징이 들어가있는 API라고 생각하면 된다.
RP가 대두되면서 RxJava, RxPY, RxSwift, RxJs등등 RP를 쉽게 구현하기 위한 API들이 시리즈로 줄줄이 등장했다.

RP나 FRP는 프로그래밍 기법 혹은 패러다임이다. 문제를 해결하기 위해 프로그램을 설계하는 방법이다. Rx는 이 RP를 쉽게 구현하기 위한 도구다.

```js
const button = document.querySelector(".button");
const clickStream = Rx.Observable.fromEvent(button, "click");
const throttle = 250;

const singleClickStream = clickStream
  .buffer(() => clickStream.throttle(throttle))
  .map(list => list.length)
  .filter(x => x === 1);
```

250ms 이내에 발생한 클릭 이벤트를 리스트에 누적시키는 로직이다.
2번째 줄에서 Rx의 Observable을 사용하였으며 5번째 줄에서는 함수형 프로그래밍을 이용하여 선언적으로 구현했다.

Rx 라이브러리처럼 RP를 구현하기 쉽게 제공하는 API를 Rx-\*로 부른다.

---

### Reference

- [Getting Started with Functional Reactive Programming Using RxJS](https://blog.hax0r.info/2018-05-10/getting-started-with-functional-reactive-programming-using-rxjs/)
- [찰스의 안드로이드](https://www.charlezz.com/?p=189)
- [한빛미디어](http://www.hanbit.co.kr/media/channel/view.html?cms_code=CMS6076376207)
- [HAMA Blog](http://hamait.tistory.com/761)
- [Reactive Programming](https://brunch.co.kr/@oemilk/79)
- [ㅇㅁReactive Programming](http://blog.weirdx.io/post/56004)
- [[번역] 반응형 프로그래밍과 RxJS 이해하기](https://hyunseob.github.io/2016/10/09/understanding-reactive-programming-and-rxjs/)
