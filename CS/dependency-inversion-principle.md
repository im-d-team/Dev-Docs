# 의존 역전 원칙(Dependency Inversion Principle)

이름 그대로 의존 관계를 역전시키라는 원칙이다. 고차원의 모듈은 저차원의 모듈에 의존하면 안된다. 의존 역전 원칙은 다음과 같이 정의된다.

1.  고수준 모듈(high level module)은 저수준 모듈(low level module)에 의존하면 안된다. 또한, 두 모듈은 추상화된 것(abstarctions)에 의존해야 한다.
2.  추상화된 것은 상세한 것(details)을 의존하면 안된다. 상세한 것은 추상화된 것을 의존해야 한다.

의존 역전 원칙의 정의 또한 다른 원칙의 정의처럼 많이 추상화되어 있는데, 각 단어들이 낯설게 느껴질 수 있다. 사용되는 용어들 부터 살펴보자면 아래와 같다.

**의존(dependency)**

여기서 의존이란 다른 객체를 포함 또는 사용하고 있다는 것이다.

```java
class A {
    private B b
}

class B {
    
}
```

위의 경우 클래스 `A` 는 클래스 `B` 에 의존한다. uml로 표현하면 다음과 같다.

![dip01-dependency.png](https://github.com/Dae-Hwa/diagrams/blob/master/dip/dip01-dependency.png?raw=true)

**모듈의 수준**

-   고수준 모듈이란 실제로 사용하는 것과 근접해있는 것이다. 모듈의 본질적인 기능과 책임이 어떤 것인지 나타내는 것이다.

-   저수준 모듈이란 모듈 내부를 구성하는 각각의 동작들을 의미한다. 고수준 모듈에서 기능을 수행하기 위해 도와주는 역할을 한다.

|   고 수준 모듈   |                         저 수준 모듈                         |
| :--------------: | :----------------------------------------------------------: |
| 파일을 불러온다. |  불러오기 원하는 파일을 찾는다.<br />찾은 파일을 반환한다.   |
| 파일을 저장한다. | 입력값을 이용하여 파일을 생성한다.<br />생성한 파일을 저장한다. |
| 파일을 수정한다. |      기존 파일을 삭제한다.<br />변경된 파일을 저장한다.      |
| 파일을 삭제한다. |     삭제 대상 파일을 찾는다.<br />찾은 파일을 삭제한다.      |

## 저수준 모듈에 의존하는 고수준 모듈

![dip01-typical-file.png](https://github.com/Dae-Hwa/diagrams/blob/master/dip/dip01-typical-file.png?raw=true)

위 다이어그램에서 고수준 모듈인 `FilePolicy` 클래스는 저수준 모듈에 의존한다.

만약 압축기능이 추가로 필요하다면? 다음과 같이 변경을 해야할 것이다.

![dip01-typical.png](https://github.com/Dae-Hwa/diagrams/blob/master/dip/dip01-typical.png?raw=true)

이는 [개방 폐쇄 원칙](https://github.com/im-d-team/Dev-Docs/blob/master/CS/open-closed-principle.md)에서 살펴봤던 예시와 비슷한 상황이다. 압축을 하는 것은 모든 파일에서 가능하지만, 압축을 푸는 것은 압축된 파일에서만 동작해야한다. 만약 압축을 풀기위한 클래스를 만든다면 개방 폐쇄 원칙에 위배될 것이기 때문에 인터페이스를 도출하게 될 것이다. 인터페이스를 도출하면 자연스럽게 의존의 역전이 일어난다.

## 의존 역전

![dip01-inversion2.png](https://github.com/Dae-Hwa/diagrams/blob/master/dip/dip01-inversion2.png?raw=true)

위와 같이 `FileHandler`를 인터페이스로 도출한다면 위와 같이 될 것이다. 이것이 의존 역전이 일어난 것인데, 상위 모듈에서 하위 모듈을 사용하기 때문에 의존방향이 상위 모듈에서 하위 모듈을 향해야 한다. 하지만 가운데 추상화 된 인터페이스를 추가시켜 하위 모듈의 방향이 반대로 되었다. 즉 상위 모듈과 하위 모듈의 의존성이 제어의 흐름(flow of control)과 반대 방향이 되었다. 

![dip01-inversion3.png](https://github.com/Dae-Hwa/diagrams/blob/master/dip/dip01-inversion3.png?raw=true)

엄밀히 말하면 런타임에 결정되는 의존성은 그대로지만, 컴파일타임에 결정되는 의존성이 변경된다. 이로인해 위에서 얘기했던 저수준 모듈을 의존하는 경우의 단점이 해결 될 수 있다. 

>   위의 예시는 인터페이스 분리 원칙에 위배되는데 이에 대한 해결과정은 [CS/interface-segregation-principle](https://github.com/im-d-team/Dev-Docs/blob/master/CS/interface-segregation-principle.md)을 참고하자.

의존 역전을 위해 적용된 인터페이스는 상위 레이어와 같은 레벨이 된다.

![dip01-layer.png](https://github.com/Dae-Hwa/diagrams/blob/master/dip/dip01-layer.png?raw=true)

즉 경계가 분리 될 때 의존성이 역전되어야 상위 모듈에서 하위 모듈을 사용하는 것이 유연해진다. 

## 의존 주입(DI)과 의존 역전 원칙(DIP)

의존성에 대해 다루는 비슷한 용어가 있다. 의존 주입(dependency injection)인데, 이를 잘못 이해하면 의존 역전 원칙과 같은 사항으로 오해할 수 있다.

의존 주입은 말 그대로 의존성을 외부에서 주입하는 것이다. 클래스 `A`가 클래스 `B`를 의존하고 있을 때 다음과 같은 코드를 작성할 수 있을 것이다.

```java
class A {
    public void someMethod() {
        B b = new B();
    }
}
```

위의 예시는 클래스 `B`를 직접 생성하여 사용하는 것이다. 만약 의존성을 주입하려면 클래스 `B`의 생성을 외부에서 하도록 유도하면 된다.

```java
class A {
    public void someMethod(B b) {
        b.doSomething();
    }
}
```

만약 멤버변수를 이용하여 의존성을 주입한다면 우리가 흔히 접하던 코드가 된다.

```java
class A implements Injector<B>{
    private B b;
    
    // constructor injection
    public A(B b) {
        this.b = b;
    }
    
    // setter injection
    public void setB(B b) {
        this.b = b;
    }
    
    // interface injection
    @Override
    public void inject(B b) {
        this.b = b;
    }
}
```

## 마치며

의존 역전 원칙은 어떻게 보면 앞에서 다뤄봤던 다른 원칙들을 포괄하는 개념일 수 있다. 레이어를 넘나드는 아키텍쳐를 구성하는 근간 원리이기 때문이다. 이를 따르면 변경에 강한 코드 구조가 되는데 추상화된 인터페이스를 바탕으로 상위 모듈과 하위 모듈의 관계를 느슨하게 만들어주기 때문이다.

주의해야 할 점은 위에서 살펴봤듯, 컴파일 타임 의존성을 변경시켜 구조를 유연하게 만드는 것이지 레이어의 순서를 뒤바꾸는것이 아니다. 상위 모듈은 하위 모듈에 의존하되, 의존 관계 사이에 추상화된 인터페이스를 둬서 유연성을 최대한 보장하도록 하는 것이 핵심이다.

----

#### References

-   [The Dependency Inversion Principle](https://www.labri.fr/perso/clement/enseignements/ao/DIP.pdf)

-   [클린 코더스 강의 15.1. DIP(Dependency Inversion Principle)](https://www.youtube.com/watch?v=mI1PsrgogCw&ab_channel=%EB%B0%B1%EB%AA%85%EC%84%9D)
