# String, StringBuilder, StringBuffer의 차이점과 장단점
String, StringBuilderm, StringBuffer는 문자열 클래스들이다. 모두 문자열을 저장하고 관리하는 클래스인데 무엇이 다를까?

면접 시 자주 나오는 질문 중에 하나이기 때문에 정리를 해보았다.

## String
`String`은 문자열을 대표하는 것으로 문자열을 조작하는 경우 유용하게 사용할 수 있다.

먼저 `String`과 다른 클래스(StringBuffer, StringBuilder)의 차이점은 String은 **immutable**(불변), `StringBuffer`는 **mutable**(변함)에 있다.

`String` 객체는 한번 생성되면 할당된 **메모리 영역이 변하지 않는다**. 

`+연산자` 또는 `concat` 메소드를 통해 기존에 생성된 String 객체 문자열에 다른 문자열을 붙인다고 하자,

기존 문자열에 새로운 문자열을 붙이는 것이 아니라 새로운 String 객체를 만든 후, 새 String 객체에 연결된 문자열을 저장하고 그 객체를 참조하도록 한다.

즉, `String` 클래스 객체는 **Heap 메모리 영역**(가비지 컬렉션이 동작하는 영역)에 생성하고 한번 생성된 객체의 내부 내용을 변화시킬 수 없다.

이렇게 새로운 문자열이 만들어지면 '기존의 문자열'은 가비지 컬렉터에 의해 제거돼야 하는 단점이 있다.

> **heap 메모리 영역**이란 프로그램이 운영체제로부터 할당받는 메모리 공간 중 하나로, 메모리 공간이 동적으로 할당되고 해제된다. 

> **Garbage Collection**란 Heap 영역의 메모리를 JVM이 판단해 더 이상 사용되지 않는 인스턴스는 자동으로 할당된 메모리를 삭제하는 역할을 하는 행위이다.  

이해를 돕도록 아래의 예시를 보자.

<img width="689" alt="String 객체" src="https://user-images.githubusercontent.com/43868540/90954396-e1aee780-e4ae-11ea-8e48-87104b8c0fde.png">
<img width="492" alt="String 객체 특성" src="https://user-images.githubusercontent.com/43868540/90954520-dc05d180-e4af-11ea-9c7a-f4559a2fd088.png">
<img width="577" alt="String 주소값" src="https://user-images.githubusercontent.com/43868540/90955221-b0d2b080-e4b6-11ea-8ca3-4c340a5218ed.png">

> [출처 ifuwanna.tistory](https://ifuwanna.tistory.com/221)

위에 예제에서 "hello"값을 가지고 있던 String 클래스의 참조 변수 str이 가리키는 곳에 "world"문자열을 더해 "hello world"로 변경한 것으로 착각할 수 있다.

하지만 "hello"값이 들어가 있던 String 클래스의 참조 변수 str이 "hello world"라는 값을 가지고 있는 새로운 메모리 영역을 가리키게 변경되고 기존에 "hello"로 값이 할당되어 있던 메모리 영역은 가비지 컬렉션에 의해 사라지게 된다.

이클립스를 사용해 주소값을 출력해보니 가리키는 메모리 영역이 다른 것을 확인할 수 있다.

따라서 `String` 객체는 이러한 이유로 문자열 연산이 많은 경우, 계속해서 문자열 객체를 만들기 때문에 **오버헤드**가 발생해 그 성능이 좋지 않다.

하지만 `String` 객체와 같이 **Immutable**한 객체는 간단하게 사용 가능하고 불변하기 때문에 동기화에 대해 신경 쓰지 않아도 되기 때문에 멀티 스레드 환경에서 사용가능하다. 

### String 클래스가 적절한 경우
결론적으로 `String` 클래스는 문자열 연산이 적고, 자주 참조하는 경우에 사용하면 좋다. 

## StringBuffer와 StringBuilder
그러면 `StringBuffer`와 `StringBuilder` 클래스를 한번 보도록 하자

`StringBuffer`/`StringBuilder`는 `String`과 다르게 동작한다.

`String` 과는 반대로 `StringBuffer/StringBuilder`는 가변성을 가지기 때문에 `.apppend()` `.delete()` 등의 API를 이용하여 동일 객체 내에서 문자열을 변경하는 것이 가능하다.

<img width="701" alt="StringBuffer, StringBuilder" src="https://user-images.githubusercontent.com/43868540/90954550-1a02f580-e4b0-11ea-9881-a103c93c1d8a.png">
<img width="556" alt="StringBuffer 주소" src="https://user-images.githubusercontent.com/43868540/90955243-e7a8c680-e4b6-11ea-9f26-fa5c0d67fa90.png">

> [출처 ifuwanna.tistory](https://ifuwanna.tistory.com/221)

위에 `StringBuffer` 클래스가 참조하는 sb 객체에 "hello"를 저장하고, 이 객체에 `.append()`를 이용해 "world"를 더하면 sb 객체가 가리키는 메모리 영역은 변하지 않는다.
`StringBuilder` 클래스를 사용하는 경우에도 값은 동일했다.

문자열 연산을 할 때, 클래스는 한 번만 만들고 메모리의 값을 변경시켜서 문자열을 변경한다. 문자열 연산(추가, 수정, 삭제)이 자주 있을 때 사용하면 성능이 좋다는 장점이 있다.

그렇다면 두 클래스의 차이점은 무엇일까?
바로 **동기화 여부**이다.

`StringBuffer`는 각 메소드 별로 **Synchronized Keyword**가 존재하여, 멀티 스레드 환경에서도 **동기화를 지원**한다. 

여러 스레드로부터 동시에 접근이 일어나도 프로그램의 실행에 문제가 없는 것을 **thread-safe**라고 한다.

반면, `StringBuilder`는 동기화를 보장하지 않기 때문에 thread-safe 하지 않다.

이러한 특성 때문에 멀티 스레드 환경이라면 값 동기화 보장을 위해 `StringBuffer`를 사용하고, 
단일 스레드 환경이라면 `StringBuilder`를 사용하는 것이 좋다. 무조건 단일 스레드 환경에서는 `StringBuffer`를 사용해라!는 아니지만 동기화 관련 처리로 인해 `StringBilder`에 비해 성능이 좋지 않다.
대신 StringBuilder가 동기화를 고려하지 않기 때문에 단일 스레드 환경에서 StringBuffer에 비해 연산처리가 빠른 장점이 있다.

### StringBuffer, StringBuilder가 적절한 경우
결론적으로 문자열 연산이 많을 때 두 클래스를 사용하지만 멀티 스레드 환경에서는 `StringBuffer`를 사용하면 좋고, 단일 스레드 환경이거나 멀티 스레드여도 굳이 동기화가 필요 없는 경우에는 `StringBuilder`를 사용하는 것이 좋다.

### 정리
- `String` : 문자열 연산이 적고 멀티 쓰레드 환경일 경우
- `StringBuffer` : 문자열 연산이 많고 멀티 쓰레드 환경일 경우
- `StringBuilder` : 문자열 연산이 많고 단일 쓰레드이거나 동기화를 고려하지 않아도 되는 멀티 쓰레드일 경우

----
#### Reference
- [String, StringBuffer, StringBuilder의 차이](https://12bme.tistory.com/42)
- [String, StringBuffer, StringBuilder](https://jeong-pro.tistory.com/85)
