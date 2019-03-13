# Java Garbage Collection(GC)

<br/>

## Garbage란?

프로그램을 실행하다보면 `Garbage` 즉, 쓰레기가 발생하게 되는데 이는 쉽게 말하자면 **정리되지 않은 메모리**, **유효하지 않은 주소**다.

```java
int[] arr = new int[3];

arr[0] = 1;
arr[1] = 2;
arr[2] = 3;

arr = new String[3];

arr[0] = "Java";
arr[1] = "JavaScript";
arr[2] = "Node.js";
```

위의 코드를 보면 `int`타입의 배열 `arr`를 사용하다가 `String`타입의 배열을 만들고 `arr`가 이를 가리키도록 하고 있다.

여기서 처음 생성했던 `int`타입의 배열은 **사용할 수 없는 메모리**가 되고 이를 **프로그래밍 언어로는 `Dangling Object`, 자바에서는 `Garbage`라고 한다.**

<br/>

## GC(Garbage Collector)의 구조

`Garbage Collector`가 담당하는 메모리 영역은 [JVM](https://github.com/Im-D/Dev-Docs/blob/master/Java/JVM(Java%20Virtual%20Machine).md)에서 `Heap`영역을 다룬다.

`Young`, `Tenured`, `Permanent` 세 영역으로 나뉘게 되며 이를 세분화 하면 총 4개의 영역으로 나뉘게 된다.

- **Young** : `Eden`, `Survivor`
- **Old** : `Old`
- **Permanent** : `Permanent(이하 Perm)`

<br/>

## GC(Garbage Collector)의 작동 원리

GC의 역할의 공통적인 원리는 `Heap`내의 객체 중 `Garbage`를 찾아 이를 처리하고 메모리를 회수한다는 것이다.

이 과정에서 객체가 `Garbage`인지 아닌지를 판단하기 위해 `reachability`개념을 사용한다. 보통 하나의 객체는 다른 객체를 참조하고 그 객체는 또 다른 객체를 참조하게 되는데 여기서 **최초에 참조한 객체를 `Root Set`이라고 한다.**

![java_gc_object](/assets/images/java_gc_object.png)

위의 그림과 같이 각각의 객체가 서로 참조하면서 참조 사슬이 형성되는데 `Root Set`에서 참조 사슬에 의해  `Unreachable`한 객체들은 **Garbage Collection**의 대상이 된다.

<br/>

## GC(Garbage Collector)의 종류

![java_gc_heap](/assets/images/java_gc_heap.png)

`Garbage Collector`는 크게 `Minor GC`와 `Major GC`가 있다.

<br/>

### Minor GC

`Minor GC`는 `Young` 영역에서 발생하는 GC다.

**새롭게 생성된 객체는 주로 `Eden`영역**에 위치하게 된다. <br/>`Eden`영역에서 `Garbage Collection`이 발생하고 **남은 객체는 `Survivor`영역**으로 넘어가게 된다. <br/>이 과정을 반복하게 되며 **계속해서 남아 있는 객체는 `Old`영역**으로 넘어간다.

이를 정리하면 다음과 같다.

- **객체 생성** : `Eden`영역에 위치.
- **Garbage Collection 발생** : 남은 객체는 `Survivor`영역으로 이동.
- **위 과정을 반복** : 계속해서 남아 있는 객체는 `Perm`영역으로 이동.

### Major GC

`Magejor GC`는 `Old` 영역에서 발생하는 GC다. Old 영역의 데이터가 가득 찼을 때, 발생된다.

`Old` 영역에 있는 **모든 객체들을 검사하여 참조되지 않고 있는 모든 객체들을 한 번에 삭제**한다.<br/>
이 과정은 시간이 오래 걸리고 실행 중 프로세스가 정지된다.(Stop the world)

`Major GC`가 발생하면 GC를 실행하는 쓰레드를 제외한 나머지 쓰레드는 모두 작업을 멈춘다.

<br/>

## GC(Garbage Collection)의 방식

빈번한 `Garbage Collection`의 수행은 성능에 영향을 줄 수 있고 이 때문에 `Garbage Collection`의 수행 타이밍은 별도의 알고리즘을 기반으로 수행된다.

<br/>

### Serial GC

**적은 메모리와 CPU의 코어 갯수가 적을 때 적합한 방식**으로 운영 서버에서는 사용하지 않는 방식이다.

`Young`영역에서는 위에서 설명한 `Minor GC`에서 사용하던 방식을 사용하고 `Old`영역에서는 `mark-sweep-compact`라는 알고리즘을 사용한다.

- Old 영역에서 살아있는 객체를 마크(Mark)한다.
- `Heap`의 앞 부분부터 확인하여 살아 있는 것만 남긴다.(Sweep)
- 각 객체들이 연속되게 쌓이도록 다시 `Heap`의 앞부분부터 채워 넣는다.(Compaction)

### Parallel GC(Throuhput GC)

`Serial GC`와 기본적인 알고리즘은 같지만 GC를 처리하는 쓰레드가 여러 개다. 즉, 더 빠르게 `Garbage Collection`을 수행할 수 있다. 코어의 갯수가 많고 메모리가 충분하면 유리한 방식이다.

### Parallel Old GC

JDK 5 update 6부터 제공한 GC 방식이다. 이름에서 알 수 있듯이 `Parallel GC`와 비교하면 `Old`영역에서 알고리즘이 다르다. `Mark-Summary-Compaction`이라는 알고리즘을 사용하는데 **`Sweep` 단계가 아닌 `Summary` 단계를 거치게 된다.**

`Summary` 단계는 앞서 GC를 수행한 영역에 대해서 별도로 살아 있는 객체를 식별하며 좀 더 복잡한 단계를 거친다.

> Java 7 Update 4 이후부터는 `XX:+UseParallelGC` 사용시에도 `-XX:+UseParallelOldGC`를 **default**로 사용하게 된다.<br/>
> Java 7 Update 4 이상이면 `UseParallelGC`와 `UseParallelOldGC` 중 어느 하나만 사용해도 결국 `UseParallelOldGC` 처럼 동작한다. <br/>
> `-XX:+UseParallelGC`만 쓰면 되고, `UseParallelOldGC`에 의해 수행되었던 역할을 굳이 끄고 싶을 때만 `XX:-UseParallelOldGC`을 사용하라고 한다.

- [CMS GC, G1 GC](https://d2.naver.com/helloworld/1329)

<br/>

#### Parallel vs CMS

- `Parallel`은 최대 처리량을 위한 GC 방식이며 `Mark`, `Sweep`, `Compaction` 단계가 동시에 일어나기 때문에 상대적으로 멈춤(pause) 시간이 크다.

- `CMS`는 `Full GC`시 멈춤 시간이 짧은 편이지만 `Parallel`에 비해 처리량이 적고 더 많은 자원을 사용한다.

<br/>

---

#### Reference

- [Naver D2 - Java Garbage Collection](https://d2.naver.com/helloworld/1329)
- [Java :: 가비지 컬렉터(Garbage Collector)란](https://wanzargen.tistory.com/15)
- [#가비지 컬렉션(Garbage Collection) / JVM 구동원리에 이어서](https://asfirstalways.tistory.com/159?category=660807)

