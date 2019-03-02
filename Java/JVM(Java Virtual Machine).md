# JVM(Java Virtual Machine)

<br/>

## JVM이란?

`Java`는 기본적으로 `JVM`위에서 작동된다. `JVM`은 `Java`와 OS(운영체제)사이에 중간 역할을 함으로써, **`Java`애플리케이션이 OS에 관계 없이 작동할 수 있도록 해준다.** 즉, `Java`로 작성된 애플리케이션은 Mac이든 Windows든 Linux든 해당 OS에 적합한 `JVM`을 설치해주면 그 위에서 작동하기 떄문에 어떤 OS든 같은 코드로 동작할 수 있다.

`JVM`은 **스택 기반의 가상 머신**이며, 메모리 관리와 GC(Garbage Collector)의 역할을 수행한다.

<br/>

`JVM`은 `Class Loader`, `Execution Engine`, `Runtime Data Areas`로 구성되며 다음과 같은 실행 과정을 거친다.

1. `JVM`은 OS로부터 프로그램을 실행하는데 필요한 메모리를 할당받는다.

2. `Class Loader`를 통해 컴파일된 자바 코드(.class)를 `JVM`으로 로딩한다.

3. `Class Loader`를 통해 로딩된 자바 바이트 코드가 `Runtime Data Areas`로 배치된다.

4. `Runtime Data Areas`에 배치된 바이트코드를 `Execution Engine`에서 해석하고 실행한다.

## Class Loader

`JVM`에 **Runtime 시점**에 동적으로 클래스를 로딩한다. OS에서 할당 받은 메모리 `jar`파일 내의 클래스들을 로딩하며 사용하지 않는 클래스는 메모리에서 삭제한다.

<br/>

## Runtime Data Areas

JVM이 프로그램의 수행을 위해 할당 받은 메모리 공간을 말한다.

![java_Runtime_Data_Areas](/assets/images/java_Runtime_Data_Areas.jpg)

<br/>

![java_runtime_data_area](/assets/images/java_runtime_data_area.png)


<br/>

## Execution Engine

로딩된 클래스 파일들은 `Execution Engine`에 의해서 실행 된다. **`Execution Engine`은 자바 바이트 코드를 해석하고 실행**한다. 그리고 이를 해석하는 방식에는 인터프리터 방식과 JIT(Just In Time)컴파일러에 의한 방식 두 가지가 있다.

<br/>

### 인터프리터

`JVM`이 처음 나왔을 때는 **자바 바이트 코드를 명령어 단위로(한줄씩) 해석하기 떄문에 느리다**는 단점이 있다.

### JIT(Just In Time)

인터프리터 방식의 단점을 해결하기 위해 JIT 방식이 도입되었다. 한줄씩 해석하여 실행하는 것이 아닌 자바 바이트 코드 전체를 한 번에 컴파일하여 Native코드로 변경하여 실행한다. 변경된 코드는 인터프리터에 의한 해석이 필요 없기 때문에 빨라질 수 있다.<br/> 하지만 이처럼 **컴파일 하는데도 비용이 발생하기 떄문에 `JVM`은 모든 코드를 JIT방식으로 컴파일하지 않고 인터프리터 방식으로 해석하다가 일정 기준이 넘어가면 JIT 방식으로 컴파일하고 실행하는 방식**을 사용하고 있다.

<br/>

---

#### Reference

- [자바가상머신, JVM(Java Virtual Machine)이란 무엇인가?](https://asfirstalways.tistory.com/158)
- [JVM 이란?](https://medium.com/@lazysoul/jvm-%EC%9D%B4%EB%9E%80-c142b01571f2)

