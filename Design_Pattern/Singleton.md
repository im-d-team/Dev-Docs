# Singleton 패턴   

## Singleton 패턴이란?   

`Singleton`패턴은 클래스에 객체가 단 하나만 필요한 경우에 사용되는 디자인 패턴이다. 
예를 들어 시스템 안에서 1개밖에 존재하지 않는 것(ex. 컴퓨터 자체, 윈도우 시스템)을 프로그램으로 표현하고 싶을 때 사용한다.   

>프로그래머가 주의를 기울여 객체를 1개만 생성한다면 `Singleton` 패턴을 사용하지 않을 수도 있겠지만 확실히 **보장 할 수 없다**.

즉,
- 지정한 클래스의 객체가 **절대로** 1개밖에 존재하지 않는 것을 **보증**하고 싶을 때
- 객체가 1개밖에 존재하지 않는 것을 프로그램 상에서 표현하고 싶을 때

`Singleton`패턴을 사용한다.

## 자바의 Singleton 패턴 구현 방식

### singleton 패턴 구현 

- **static** 속성을 이용하여 객체를 인스턴스화 하지 않고 사용
- 객체의 접근 제한자가 **private**이므로 직접적인 접근 불가능
- 생성자가 **private** 으로 선언 되어있으므로 외부에서 new()를 통한 접근 불가능
- **getInstance()** 메소드를 통해서만 객체에 접근 가능

`Singleton` 패턴은 몇가지 방식으로 구현 할 수 있다.
<br>
### eager Initialization

```java
public class Singleton {
    // Singleton 객체 하나를 생성해서 가리키는 정적 필드
    // 클래스가 메모리에 로드될 때 한번 실행
    private static Singleton makeInstance = new Singleton();

    // private construct , new를 통한 객체 생성 불가
    private Singleton() {}

    // Singleton 객체 반환
    public static Singleton getInstance() {
        return makeInstance;
    }
}
```
`eager Initialization` 방식은 Singleton 인스턴스를 미리 생성해 놓는 방식으로, 
**Multi-thread** 환경이 아니면서 Singleton 인스턴스가 많은 일을 하지 않을 때 사용 할 수 있다. 
<br>
### Static block

```java
public class Singleton {
    //Instance
    private static Singleton makeInstance;

    //private construct
    private Singleton() {}

    static {
        try { makeInstance = new Singleton();}
        catch(Exception e) { 
	throw new RuntimeException("Create instace fail. error msg = " + e.getMessage() ); }
    }

    public static Singleton getInstance() {
        return makeInstance;
    }
}
```
`Static block` 방식은 `eager Initialization`방식에서 예외처리가 가능해진 형태이다.

>**Static block** : 클래스가 로딩되고 클래스 변수가 준비된 후 자동으로 실행되는 블록

<br>
위의 두방식은 클래스가 로딩될 때 실행되며,
객체가 사용되기 이전 메모리를 점유하는 문제가 발생한다.
<br>

### lazy Initialization

```java
public class Singleton {
	
	private static Singleton makeInstance;

	private Singleton() {}

	public static Singleton getInstance() {
		if (instance == null) { makeInstance = new Singleton();}
		return makeInstance;
	}
}
```

`lazy Initialization`은 **getInstance()** 메소드가 호출 될 때, 클래스의 인스턴스가 사용되는 시점에 Singleton 객체를 생성한다. 


<br>앞선 세가지 방식 모두 `Multi-thread`환경에서는 동작이 보장되지 못한다. 
<br>

![쓰레드](https://user-images.githubusercontent.com/43839951/79640641-8ce02500-81cd-11ea-8bc4-1f920b96c33c.JPG)

만약, 위 그림의 상황에서 `스레드A`와 `스레드B`가 동시에 **getInstance()** 를 호출한 경우, 먼저 cpu를 할당받은 `스레드A`가 Singleton 객체를 생성하고, 
**makeInstance** 변수에 할당하기 직전에, `스레드B` CPU를 할당받고 **getInstance( )** 를 호출한다면,
`스레드B` 또한 Singleton 객체를 생성 할 것이다.

<br>

### Lazy Initialization with synchronized

```java
public class Singleton {
    private static Singleton makeInstance;

    private Singleton() {
    }

    public static synchronized Singleton getInstance() {
        if (makeInstance == null) {
            makeInstance = new Singleton();
        }
        return makeInstance;
    }
}
```

 `Multi-thread`환경에서 Singleton 패턴을 보장하기 위해서  **getInstance( )** 메소드를 `synchronized`로 선언하여 thread에서의 동시 접근에 대한 문제를 해결 할 수 있다. 
하지만 위의 방식은 객체 생성의 유무와 관계없이 **synchronized block** 을 거치게 되어 성능이 크게 저하된다.
<br>

### Lazy Initialization. Double-Checked Locking(DCL)

```java
public class Singleton {
    private static Singleton makeInstance;

    private Sigleton() {}

    // Lazy Initialization. DCL
    public Singleton getInstance() {
      // instance가 null인 경우에만 synchronized block에 접근
      if(makeInstance == null) {
         synchronized(Singleton.class) {
            if(makeInstance == null) {
               makeInstance = new Singleton(); 
            }
         }
      }
      return makeInstance;
    }
}
```

`DCL 방식`은 **makeInstance** 가  **null**인 경우에만 `synchronized block`에 접근하므로 성능저하를 보완할 수 있다.
<br><br>

## Singleton 패턴의 장점

- 한번의 생성으로 객체를 사용하기 때문에 **고정된 메모리 영역**을 얻을 수 있으므로 `메모리 낭비`를 방지 할 수 있다.

- Singleton으로 만들어진 객체는 `전역 객체`이기 때문에 다른 클래스의 객체들이 데이터를 **공유**하기 쉽다.
<br>

## Singleton 패턴의 한계

- Singleton으로 만든 객체의 역할이 복잡한 경우라면 해당 객체를 사용하는 
`객체간의 상호 의존도`가 높아져서 **객체 지향 설계 원칙**에 어긋나게 된다.

- `multi-thread`환경에서 동기화 처리 문제가 발생 할 수 있다. 

----
#### Reference
- [Java에서 싱글톤(Singleton) 패턴을 사용하는 이유와 주의할 점](https://elfinlas.github.io/2019/09/23/java-singleton/)   
- [싱글톤 패턴(Singleton pattern)을 쓰는 이유와 문제점](https://jeong-pro.tistory.com/86)   
- [싱글턴 패턴(Singleton Pattern)](https://medium.com/webeveloper/%EC%8B%B1%EA%B8%80%ED%84%B4-%ED%8C%A8%ED%84%B4-singleton-pattern-db75ed29c36)
