# 단일 책임 원칙(Single Responsibility Principle; SRP)

단일 책임 원칙은 **클래스(혹은 모듈)는 오직 하나의 책임만을 가져야 한다는 것**이다. 또한 **클래스가 변경되어야 하는 이유는 단 하나여야 한다**는 것이다. 여기서 '책임'과 '이유' 가 무엇인지 모호할 수 있다. 단일 책임 원칙을 이해하기 위해서 먼저 알아 둬야 할 개념들이 있기 때문이다. 단일 책임 원칙은 **관심사 분리**, **응집도와 결합도**에 관한 내용이다. 따라서 이에 대한 이해가 선행되어야 한다.

- [관심사 분리](soc.md)

- [응집도와 결합도](cohension&coupling.md)

클래스는 오직 하나의 책임만을 가져야 한다. 여기서 책임은 각 클래스의 관심사라고 할 수 있다. 즉 단일 책임 원칙은 각 클래스의 관심사가 잘 분리되어 있어야 한다는 것이다. 쉽게 얘기하면 각 클래스는 하나의 기능만을 구현해야 한다. 이를 위해 인터페이스를 사용하여 캡슐화 시키고 노출되어야할 기능에 대한 코드만 응집시켜야 한다.

또한 클래스가 변경되어야 할 이유는 단 하나여야 한다. 즉 같은 이유로 변하는 것은 하나로 모으고, 다른 이유로 변하는 것은 분리해야 한다. 잘 응집된 클래스는 다른 기능을 위한 분기처리가 필요없다. 다른 기능을 실행시키기 위한 상태가 필요없으므로 낮은 결합도를 유지할 수 있게 된다.

## 적용 방법

기본 설계 원칙을 위반하고 설계 품질에 부정적인 영향을 미치는 구조로 코드가 작성된 것을 [code smell](https://en.wikipedia.org/wiki/Code_smell)이라고 한다. code smell은 리팩토링의 징후라고 할 수 있는데, 리팩토링의 근본정신도 객체들의 책임을 최상의 상태로 분배한다는 것이기 때문에 이를 이용하여 단일 책임 원칙을 적용해 볼 수 있다. 여러 원인에 의한 변경과 산탄총 수술은 code smell 중 단일 책임 원칙과 연관이 깊은 것들이다.

- 여러 원인에 의한 변경(Divergent Change)
  - 단일 클래스에 많은 변경이 있는 경우 클래스를 추출하여 책임을 분리해준다.
  - 책임만 분리하는 것이 아니라 분리된 두 클래스간의 관계의 복잡도를 줄인다.

  > 여러 원인에 의한 변경을 확산적 변경이라고 부르기도 하는데, 여러 원인에 의한 변경이라고 부르는 것이 더욱 직관적이다.

- 산탄총 수술(Shotgun Surgery)
  - 변경을 할 때마다 수정해야 할 클래스가 많다면 책임이 분산되어 있는 것이다.
  - 이 경우 수술이 잘 끝나면 상관없지만, 수정해야 할 클래스가 너무 많아 빼먹는 경우가 생긴다면 고통이 계속될 것이다.
  - 해결을 위해 분산된 책임을 모아 응집도를 높일 수 있다.

## 예시1 - 계산기

```java
class Calculator {
  	public void calculate(int left, int right, String operator) {
    	if (operator.equals("+")) {
   			System.out.println(left + right);
    } else if (operator.equals("-")) {
    	System.out.println(left + right);
    } else if (operator.equals("*")) {
		System.out.println(left + right);
    } else if (operator.equals("/")) {
    	System.out.println(left + right);
    }
  }
}
```

위의 클래스는 '계산' 이라는 하나의 책임(기능)만 갖고 있는 것 처럼 보이지만 그렇지 않다. 사칙연산의 기능을 모두 갖고 있고 이를 출력하는 책임까지 갖는다. 여러가지 책임을 갖는 것이다. 클라이언트가 사용하기 편리해 보일지 모르지만, 한 가지 로직만 잘못되어도 이 프로그램은 제대로 동작 하지 않을 것이다. 뿐만 아니라 변경의 이유도 하나가 아니다.

각 기능을 메소드로 분리하여 설계하면 다음과 같은 인터페이스가 작성될 것이다.

```java
interface Calculator {
  	void calculate();
  	int getResult();
}

interface Printer {
    void print();
}
```

이에 따라 클래스를 작성해보면 다음과 같을 것이다.

```java
class BasicCalculator implements Calculator{ // 연산
    private final static String PLUS = "+";
    private final static String MINUS = "-";
    private final static String MULTIPLY = "*";
    private final static String DIVISION = "/";
    
    private int left;
    private int right;
    private String operator;
    private int result;
    
    public BasicCalculator(int left, int right, String operator) {
        this.left = left;
        this.right = right;
        this.operator = operator;
    }
    
    public void calculate() {
        if (operator.equals(PLUS)) {
          result = left + right;
        } else if (operator.equals(MINUS)) {
          result = left + right;
        } else if (operator.equals(MULTIPLY)) {
          result = left + right;
        } else if (operator.equals(DIVISION)) {
          result = left + right;
        }
    }
    
    public int getResult() {
        return result;
    }
}

class IntPrinter implements Printer { // 출력
    private int i;
    
    public IntPrinter(int i){
        this.i = i;
    }
    
    public void print() {
        System.out.println(i);
    };
}
```

각각의 클래스는 하나의 책임만 갖게 되었다. 또한 각각의 기능의 의존성이 사라졌다. 이렇게 책임이 분리 되면 변화에 훨씬 유연하게 대처할 수 있다. 만약 좌항을 최초 한 번만 입력할 수 있다는 비즈니스 로직이 추가되거나, 출력을 하는 방법이 바뀌거나, 연산이 추가되는 등의 변화가 생기더라도 해당되는 클래스만 변경해주면 된다. 

## 예시2 - 회사

예시1에서 만들어본 계산기를 통해 단일 책임 원칙의 '책임'은 프로그램의 책임이라는 것을 이해 할 수 있다. 버그 수정이나 리팩토링 같은 작업은 프로그래머의 책임이지 프로그램의 책임이 아니다. 하지만 단일 책임 원칙에 대해 이야기한 로버트 마틴은 단일 책임 원칙은 사람에 대한 것이라고 말한다.  또 다시 미궁에 빠지는 느낌이다.

> "This principle is about people" - Robert C. Martin

변경사항의 이유는 하나여야 한다고 했다. 어떤 것이 변경사항이 발생할 이유를 정의할지 생각을 해봐야 한다. 변경사항이 발생하는 이유는 다르게 말하면 책임이라고 말 할 수 있다. 우리는 책임을 정의하는 것이 무엇인지 생각해봐야 한다. 즉 누가 프로그램의 설계에 책임을 져야 하는지 생각해봐야 한다.

회사의 최상위에 CEO가 있고 그 밑에 CFO, COO, CTO와 같은 C-level 경영진들이 있다고 생각해보자. CFO는 회사의 재무를 관리하는 책임이 있고, COO는 회사 운영 및 관리에 책임이 있다. 그리고 CTO는 회사의 기술 환경 및 개발에 대한 책임이 있다.

우리는 이 회사에 새로 입사하게 되어 다음과 같은 업무를 배정 받았다.

- 직원의 계약, 상태, 근무 시간 등을 기준으로 특정 직원의 지급액을 결정
- 직원 객체가 관리하는 데이터를 데이터베이스에 저장
- 감찰 시 직원이 적절한 시간동안 작업하고, 적절한 보상을 받고있는지 확인하기 위한 보고서 내용 전달

이를 인터페이스로 나타내면 다음과 같이 정의할 수 있다.

```java
public interface Employee {
	public Money calculatePay();
	public void save();
	public String reportHours();
}
```

`calculatePay` 부터 살펴보자. C-level 경영진 중 `calculatePay` 메소드의 동작에 대해 설계해야 하는 사람은 누구일까? 만약 `calculatePay`가 오작동 한다면 누가 그 책임을 져야될까? 바로 CFO다. 너무 명확하다.

직원의 급여를 결정하는 것은 재무의 책임이다. 만약 CFO의 조직의 누군가 급여를 계산하는 규칙을 잘못 정해서 2배의 급여를 받았다면, CEO는 CFO에게 책임을 물을 것이다. 즉 `calculatePay` 메소드의 알고리즘에 변경이 발생한다면 CFO가 이끄는 조직에 의해 변경사항이 요청되어야 한다.

다른 메소드도 마찬가지다. `save` 메소드는 기업의 데이터 베이스에 관한 기능이다. 만약 여기에 문제가 생긴다면 CTO가 책임을 질 것이고, `reportHours` 가 잘못된다면 COO가 책임을 질 것이다. CTO가 요청한 변경사항때문에 COO가 책임을 져서는 안된다. 만약 `save` 메소드를 변경했는데 `reportHours` 메소드가 제대로 동작하지 않는다면, COO는 CTO에게 해당 메소드를 수정하지말라고 압박을 줄 것이다.

## 결론

단일 책임 원칙은 다른 객체지향 원칙들에 비해 단순한 개념이다. 프로그램은 하나의 책임만을 갖도록 하면 된다는 내용이기 때문이다. 만약 여러 원인에 의한 변경 혹은 산탄총 수술이 필요한 경우 단일 책임 원칙에 위배되지 않았는지 점검해볼 필요가 있다.

하지만 이 원리를 적용하여 직접 클래스를 설계하는 것은 매우 힘들다. 예시2 에서 나온 상황들이 단일 책임 원칙을 복잡하게 만들기 때문이다. 만약 비즈니스 프로세스와 관련된 프로그램을 작성하게 된다면 단일 책임 원칙이 사람에 관한 것이라는 구문을 다시 생각해보자. 

변경사항의 원인은 변경을 요청하는 사람(혹은 조직)이다. 따라서 소프트웨어를 설계할때 어떤 한 사람 또는 밀접하게 연관된 집단이 단 하나의 비즈니스 기능을 세심하게 정의해서 요청해야 할 것이다. 또한 모듈들이 조직의 복잡성으로부터 독립되어 단 하나의 비즈니스 기능에 대해 대응하고 책임지도록 시스템을 설계해야 한다.



---

#### References

- [The Single Responsibility Principle](https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html)

- [Code smell](https://en.wikipedia.org/wiki/Code_smell)
- [객체지향 개발 5대 원리 : SOLID](http://www.nextree.co.kr/p6960/)