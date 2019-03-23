# String, StringBuilder, StringBuffer

<br/>

## String

`Java`에서 `String`객체의 특성을 알고 있어야 `StringBuilder`와 `StringBuffer`의 차이를 알 수 있다.

`String`객체는 `char[]`배열로 이뤄져있으며, 기본적으로 `immutable(변경불가능)`하다. <br/>`+`나 `concat` 메서드를 이용해 새로운 문자열을 합치려하면 **기존 `String`객체가 가리키고 있던 문자열을 복사하고 새로운 문자열을 덧붙여 새로운 객체를 반환**한다. 이후 기존 객체는 `GC`에 의해 메모리가 회수된다.

이러한 특성 때문에 `String`객체는 메모리의 낭비로 이어질 수 있다는 단점이 있다. 하지만, `immutable`한 특성 때문에 `thread-safe`하다. 즉, `multi-thread`환경에서 동시에 객체에 접근하더라도 변하지 않기 때문에 동기화를 고려하지 않고 내부적으로 데이터를 공유할 수 있다.

<br/>

## StringBuilder vs StringBuffer

`StringBuilder` 와 `StringBuffer`는 `mutable(변경 가능)`하다. 문자열을 덧붙이거나 합칠 시 새로운 객체를 반환하지 않고 기존 객체의 버퍼 크기를 늘리며 문자열을 추가한다.

단, 이 두 가지의 차이점은 `multi-thread`환경에서의 **동기화 문제에 대한 처리**에서 나온다.

<br/>

### StringBuilder

---

`StringBuilder`는 `String`에서 `+`나 `concat`메서드를 통한 연산이 많은 경우 사용하는것이 좋다. 단, **동기화에 대한 처리를 하지 않는다.** 따라서 `StringBuffer`에 비해 성능 면에서 좋고, `multi-thread`환경이 아니라면 `StringBuilder`을 사용하는 것이 좋다.

사실, `jdk1.5`이후 부터 `String`객체는 컴파일 타임에 `StringBuilder`로 변경된다. 즉, `String` 클래스를 이용하여 객체를 생성하더라도 `StringBuilder`로 컴파일되어 동작하기 때문에 `jdk1.5`이후부터는 `StringBuilder`를 사용할 이유가 없어졌다.


### StringBuffer

---

`StringBuffer`는 내부적으로 모든 메소드에 대해 `synchronized` 키워드가 붙어있다. 즉, **동기화 처리를 하고 있고 이 덕분에 `StringBuilder`와 비교해서 `thread-safe`하다.**

하지만, `multi-thread`환경이 아닐 때 사용한다면 `StringBuilder`에 비해 **성능 면에서 떨어질 수 있기 때문에 이 점을 고려하여 사용**해야 한다.

> `Java`의 `synchronized` 키워드는  쉽게 생각하면 **multi-thread로 동시접근되는것을 막는다** 라고 볼 수 있다. <br/>
> 예를 들어, **함수에 synchronized를 걸면 그 함수가 포함된 해당 객체에 lock을 건다**라고 볼 수 있다.

<br/>

---

#### Reference

- [자바가상머신, JVM(Java Virtual Machine)이란 무엇인가?](https://asfirstalways.tistory.com/158)
- [JAVA String, StringBuffer, StringBuilder 차이점](https://jeong-pro.tistory.com/85)

