# 관점(관심) 지향 프로그래밍(Aspect Oriented Programming)

## 관점(Aspect)과 횡단 관심사(Cross-cutting Concern)

관점 지향 프로그래밍은 관점을 기반으로 한 개발 패러다임이다. 여기서 관점이라는 말이 모호한데, 컴퓨팅 용어 **aspect** 를 직역한 표현이라 바로 와 닿지 않는다.

프로그래밍 용어로써 aspect는 프로그램의 다른 부분들과 연결되어있지만, 프로그램의 주요 기능과는 연결되지 않은 부분을 뜻한다. 핵심 관심사(core concerns)를 가로지르는(crosscut) 부분들을 모듈화시킨 것이다. 이때, 핵심 관심사를 가로지르는 부분을 **횡단 관심사(cross-cutting concern)** 라고 한다. 이때 가로지른다는 것은 공통의 관심사를 수직이 아닌 수평적으로 찾아낸다는 것이다. 전통적인 추상화 방식에서는 상위 클래스와 하위 클래스 간의 공통 관심사를 수직적으로 묶지만, 관점 지향 프로그래밍에서는 연관이 없는 클래스들의 공통 관심사를 수평적으로 묶어 캡슐화한다.

![crosscut.png](https://github.com/Dae-Hwa/diagrams/blob/master/aop/crosscut.png?raw=true)

가장 쉬운 예시로는 로그를 쌓고자 하는 경우를 들 수 있다. 클래스 혹은 함수단위의 로그를 쌓고자 하는 경우 해당 객체의 핵심 기능과 별개의 코드가 필요하다.

```java
class NonAspectOrientedSample {
    private void logging() {
        // ...
    }
    
    public void doSomething() {
        logging();
        // ...
    }
    
    public void doOtherthing() {
        logging();
        // ...
    }
}
```

하지만 코드는 계속해서 중복되기 때문에 새로운 추상화가 필요한데 전통적인 개발 방식만으로는 추상화가 모호해질 가능성이 크다. 추상화를 하여 함수를 재정의(overriding)하더라도 해당 클래스에는 핵심 기능과 별개의 코드가 포함되는 것이기 때문이다.

```java
class NonAspectOrientedSample implements Logger {
    @Override
    public void logging() {
        // ...
    }
    
 	public void doSomething() {
        logging();
        // ...
    }
    
    public void doOtherthing() {
        logging();
        // ...
    }
}
```

이처럼 핵심 기능과 별개의 코드가 클래스에 포함되는 것은 엄밀히 따지면 [단일 책임 원칙](https://github.com/im-d-team/Dev-Docs/blob/master/CS/srp.md)을 위반하는 것이다. 이런 경우 횡단 관심사를 분리하여 해결할 수 있다.

## 사용되는 용어들

### Join Point

aspect는 기존 프로그램의 동작과 관계없이 추가, 변경 가능해야 한다. 관점 지향 언어들은 기존 프로그램의 동작과 관계없이 실행 지점을 설정할 수 있도록 지원해주는데 이를 **join point**라고 한다. 메소드 실행(method execution)이나 메소드 콜(method call)과 같은 시스템의 실행을 포인트로 지정하는 것이다. 

### Pointcut

join point를 언어 수준에서 표현한 것이다. 언어 구조 내에서 지원하거나, 쿼리와 유사한 표현식을 사용하여 표현할 수 있다. 

### Advice

pointcut을 만족하는 join point에 도달했을 때 실행할 코드 모음이다. 이때 advice의 종류에 따라 실행 시점이 달라진다. 실행 시점에 따라 다음과 같은 종류가 있다.

-   before advice : 메소드 실행 이전
-   after advice

    -   after returning advice : 메소드가 정상 작동한 이후
    -   after throwing advice : 예외 발생 시
    -   after finally advice : 메소드가 실행 된 이후 반드시 실행
-   around advice : 모든 시점 실행

### Inter-type Declaration(ITD)

클래스 멤버나 클래스 계층을 임의로 변경하는 것이다. 예를 들어, 클래스 실행 시간을 로깅하고 싶지만 해당 클래스에 관련 멤버가 없다면 aspect 실행 시점에 실행시간 필드를 추가할 수 있다.

### Aspect

aspect는 pointcut과 advice, inter-type declaration이 합쳐진 것이다. 즉 하나의 실행 단위이다.

>   spring aop에서는 aspect를 advisor라고 부른다.

### Weaving

Advice를 join point에 합쳐준다. 컴파일 혹은 로드 타임에 바이트 코드를 조작하거나 런타임에 프록시를 생성하여 합치는 방법이 있다.

## AOP는 만능인가?

위에서 본 개념들만 살펴봤을 때는 AOP가 구세주처럼 느껴질 수 있다. 하지만 AOP에도 문제 발생 가능성이 있다. AOP를 사용할 경우 아래 사항들을 인지한 뒤 도입해야 한다.

첫째로 언어 차원에서 타겟 클래스에 표시하지 않도록 되어있다면 해당 코드 작성자 이외에는 해당 코드에 aspect가 적용되는 것인지 알 수 없다. 해당 코드 이외에 전체적인 시스템의 흐름이 파악되어야 정확히 이해할 수 있다. 특히 pointcut이 훼손될 경우 찾아내는 데 큰 어려움을 겪을 수 있다.

둘째로 aspect를 통한 모듈화가 오히려 모듈화를 방해할 수 있다. AOP는 핵심 로직에만 집중할 수 있도록 돕는 도구인데 AOP가 주가 되어버리는 경우이다. 

셋째로 동시에 여러 개의 aspect가 적용될 경우 문제가 발생할 수 있으며, aspect가 자기 자신에게 적용된다면 의도하지 않은 결과가 나올 수 있다.

---

#### References

-   [Aspect-oriented software development](https://en.wikipedia.org/wiki/Aspect-oriented_software_development#Concepts_and_terminology)
-   [Aspect-oriented programming](https://en.wikipedia.org/wiki/Aspect-oriented_programming)
-   [Aspect (computer programming)](https://en.wikipedia.org/wiki/Aspect_(computer_programming))
-   [Cross-cutting concern](https://en.wikipedia.org/wiki/Cross-cutting_concern)
-   [Intertype declarations in AspectJ (member injection)](https://programmer.help/blogs/intertype-declarations-in-aspectj-member-injection.html)
