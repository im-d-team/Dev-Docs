# non-blocking

Non-blocking은 os와 알고리즘에 대한 것이다. 공유자원을 안전하게 동시 사용할 수 있도록 하는 방법론이다.

Non-blocking은 하나의 작업이 실패하거나 정지하더라도 다른 스레드에 영향을 주지 않도록 한다. 이를 위해 Non-blocking 알고리즘은 [lock-free](https://en.wikipedia.org/wiki/Non-blocking_algorithm#Lock-freedom) 특성과 [wait-free](https://en.wikipedia.org/wiki/Non-blocking_algorithm#Wait-freedom) 특성을 포함한다. lock-free는 wait-free를 포함하는 개념이다. 이로인해 non-blocking은 동시성(concurrency)을 갖는다.

> 동시성 : 프로그램을 실행할 때 단 하나의 실행 순서를 갖도록 하는 제약을 없애고 각 부프로그램이 다른 부프로그램과 병렬적으로 동시에 실행되는 것

lock-free 알고리즘이라는 것은 하나의 작업이 시작되어도, 시스템 전체의 진행이 보장되는 것이다.(A non-blocking algorithm is lock-free if there is guaranteed system-wide progress)<br/>
wait-free 알고리즘은 각 스레드의 진행이 각각 보장되는 것(A non-blocking algorithm is wait-free if there is also guaranteed per-thread progress)이다. <br/>
![non-blocking i/o](/assets/images/non-blocking.png)
blocking 모델은 요청이 동작 가능할때까지 스레드가 블록된다. 반면, non-blocking 모델은 요청이 동작 불가능하다는 것을 알려주어 블록상태 없이 계속해서 진행가능하다. 즉, 다른 스레드의 작업을 기다리지 않는다. 이를 통해 대기 상태 없이 공유 자원에 접근할 수 있다.

> Java의 멀티 스레드 어플리케이션에서 Synchronized를 시키는 것은 BlockingQueue Interface를 구현하는 것이라고 생각하면 된다. 당연히 non-blocking은 이와 반대다.

<br/>

## Non-blocking I /O

Non-blocking I/O 는 I/O와 관계없이 프로세스가 계속해서 진행되는 것을 뜻한다. 기존 방식(blocking 혹은 synchronous한 I/O모델)에서는 I/O처리를 시작하면 작업이 끝날 때 까지 기다려야한다. 즉 프로그램이 block된다. 반면, Non-blocking I/O 모델에서는 입,출력을 외부에 맡겨 I/O의 진행 상황과 관계없이 프로그램이 진행된다.

<br/>

## Asynchronous Programming과 Non-blocking I/O

프로그램의 주 실행흐름을 멈추거나, 대기 상태 없이 즉시 다음 작업을 수행할 수 있도록 하는 것이 asynchronous 방식이다.

Ansynchronous programming은 언어 차원에서 지원하거나, 함수 전달을 통해 처리하는 방식을 통해 구현한다.<br/>언어차원에서 지원하는 방식은 future, promise와 같이 객체 형태의 결과를 돌려받거나 특정 문법을 이용하여 구현할 수 있다.<br/>함수 전달을 통해 처리하기 위해서는 함수를 값처럼 사용(일급 함수)를 지원하는 언어에서 Callback을 전달하여 결과를 처리할 수 있다. 

non-blocking 알고리즘과, non-blocking I/O 모델의 관점이 다른 것 처럼, Asnychronous programming은 Asynchronous I/O 와 다르다. 따라서 Asnychronous programming과 Non-blocking I/O는 서로 바라보는 관점이 다르다. Event-loop를 사용하여 동시성을 확보하였어도 I/O 작업이 blocking될 수 있기 때문이다.

<br/>

만약 I/O 모델들의 조합을 알아보고 싶다면 다음을 참고하길 바란다. - [Asynchronous IO 개념 정리 - Uno's Blog](https://djkeh.github.io/articles/Boost-application-performance-using-asynchronous-IO-kor/)

---

#### Refereces

- [Non-blocking Algorithms - jenkov.com](http://tutorials.jenkov.com/java-concurrency/non-blocking-algorithms.html)
- [Blocking and Non-Blocking Algorithms - modernescpp](https://www.modernescpp.com/index.php/blocking-and-non-blocking)
- [Non-Blocking Algorithms in Java - netjs.blogspot.com](https://netjs.blogspot.com/2016/06/non-blocking-algorithms-in-java.html)
- [Non-blocking algorithm - wikipedia](https://en.wikipedia.org/wiki/Non-blocking_algorithm)
- [멈추지 않고 기다리기(Non-blocking)와 비동기(Asynchronous) 그리고 동시성(Concurrency) - Peoplefund Tech](https://tech.peoplefund.co.kr/2017/08/02/non-blocking-asynchronous-concurrency.html)
