# 개방-폐쇄 원칙(Open-Closed Principle)

개방-폐쇄 원칙은 **확장에 열려있고, 변경에는 닫혀있어야 한다**는 원리이다. 열려있다는 것(개방; open)은 소프트웨어는 확장(기능 추가 등의)할 수 있어야 한다는 것이고, 닫혀있다는 것(폐쇄; closed)은 기존 코드를 수정하지 않고 확장할 수 있어야 한다는 것이다. 즉 소프트웨어는 **수정 없이 확장할 수 있어야 한다**.

열려있다는 것은 비교적 명확하나 닫혀있다는 것의 의미가 애매할 수 있다. 닫혀있다는 것에 대해 좀 더 자세히 말하면, 새로운 기능을 추가할 때 기존 시스템의 수정 없이 변경할 수 있어야 한다는 것이다. 닫혀있는 프로그램은 기존 소스를 새롭게 컴파일하거나 배포할 필요 없이 새롭게 추가된 부분만 배포하면 된다. 이를 위해 폐쇄된 모듈은 잘 은닉되어있고, 사용 혹은 재사용에 반드시 필요한 부분만 인터페이스로 정의되어 있어야 한다.

## 적용 방법

- 변경(확장)이 일어날 수 있는 부분과 변하지 않을 부분을 명확히 정의한다.
- 변경이 일어날 수 있는 모듈과 변하지 않는 모듈의 사이에 인터페이스를 만들어 이를 통하여 메세지를 주고받도록 한다.
- 정의한 인터페이스에 의존하도록 한다(구현에 영향을 받지 않도록).

## 예시1 - 계산기

```java
interface Calculator {
  void calculate();
  int getResult();
}

class BasicCalculator implements Calculator {
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
      result = left - right;
    } else if (operator.equals(MULTIPLY)) {
      result = left * right;
    } else if (operator.equals(DIVISION)) {
      result = left / right;
    }
  }

  public int getResult() {
    return result;
  }
}
```

위의 사칙연산 계산기에서 새로운 기능을 추가하려면 기존 소스를 변경해야 한다. 다음과 같을 것이다.

```java
public void calculate() {
  if (operator.equals(PLUS)) {
    result = left + right;
  } else if (operator.equals(MINUS)) {
    result = left - right;
  } else if (operator.equals(MULTIPLY)) {
    result = left * right;
  } else if (operator.equals(DIVISION)) {
    result = left / right;
  } // 추가 할 기능 작성 e.g. 나머지 연산 제곱 연산 제곱근 연산 등등...
}
```

첫째로 상속을 생각해볼 수 있겠지만, 핵심 로직을 변경해야 하는 것은 마찬가지이고 이 경우는 특히나 [캡슐화](https://www.geeksforgeeks.org/encapsulation-in-java/)를 위반할 가능성이 높다. 자식 클래스에서 부모 클래스의 기능을 이용한 변경이 일어날 수 있기 때문이다. 따라서 각 책임을 새롭게 분리해 볼 수 있다.

```java
class PlusCalculator implements Calculator {
  private int left;
  private int right;
  private int result;

  public PlusCalculator(int left, int right) {
    this.left = left;
    this.right = right;
  }

  @Override
  public void calculate() {
    result = left + right;
  }

  @Override
  public int getResult() {
    return result;
  }
}

class MinusCalculator implements Calculator {
  // ...
    
  @Override
  public void calculate() {
    result = left - right;
  }
    
  // ...
}
```

각 연산 별로 새로운 클래스를 정의했다. 새로운 기능을 추가할때 새로운 클래스만 작성하면 되는것 처럼 보이지만 클라이언트에 문제가 생긴다.

```java
class CalculatorClient {
  private final static String PLUS = "+";
  private final static String MINUS = "-";
  private final static String MULTIPLY = "*";
  private final static String DIVISION = "/";

  // +,1,2와 같이 입력이 되었다고 가정
  public static void main(String[] args) {
    for (String arg : args) {
      Calculator calculator;

      String[] inputs = arg.split(",");
      String operator = inputs[0];
      int left = Integer.parseInt(inputs[1]);
      int right = Integer.parseInt(inputs[2]);

      if (operator.equals(PLUS)) {
        calculator = new PlusCalculator(left, right);
      } else if (operator.equals(MINUS)) {
        calculator = new MinusCalculator(left, right);
      } // ... 다른 연산

      calculator.calculate();
      System.out.println(calculator.getResult());
    }
  }
}
```

클라이언트에서 또 다른 분기가 이루어져서 추가적인 관리 포인트가 생겼다. 클라이언트와 핵심 로직 사이에 인터페이스를 추가하여 개선해볼 수 있다. 여러가지 방법을 사용해볼 수 있는데, 간단한 팩토리를 이용하여 개선해보겠다.

```java
class CalculatorFactory {
  private final static String PLUS = "+";
  private final static String MINUS = "-";
  private final static String MULTIPLY = "*";
  private final static String DIVISION = "/";
	   
  private Calculator calculator;

  private CalculatorFactory(Calculator calculator) {
    this.calculator = calculator;
  }

  public static Calculator createByOperator(int left, int right, String operator) {
    if (operator.equals(PLUS)) {
      return new PlusCalculator(left, right);
    } else if (operator.equals(MINUS)) {
      return new MinusCalculator(left, right);
    } // ... 다른 연산
  }
}
```

```java
class CalculatorClient {
  // +,1,2와 같이 입력이 되었다고 가정
  public static void main(String[] args) {
    for (String arg : args) {
      Calculator calculator;

      String[] inputs = arg.split(",");
      String operator = inputs[0];
      int left = Integer.parseInt(inputs[1]);
      int right = Integer.parseInt(inputs[2]);
	
      caluclator = CalculatorFactory.createByOperator(left, right, operator);
      calculator.calculate();
      System.out.println(calculator.getResult());
    }
  }
}
```

클라이언트 부분은 해결됐다. 여기까지만 해도 OCP원칙이 어느정도 적용되었다고 볼 수 있지만, 좀 더 완벽한 구현을 위해 enum 객체를 활용해보겠다.

```java
enum Calculator {
  PLUS("+") {
    public void calculate(int left, int right) {
      result = left + right;
    }    
  },
  MINUS("-") {
    public void calculate(int left, int right) {
      result = left - right;
    }
  },
  MULTYPLY("*") {
    public void calculate(int left, int right) {
      result = left * right;
    }
  },
  DIVISION("/") {
    public void calculate(int left, int right) {
      result = left / right;
    }
  };
    
  public final String OPERATOR;
    
  private int result;
    
  Calculator(String operator) {
      this.OPERATOR = opeartor;
  }
          
  public abstract void calculate(int left, int right);
    
  public int getResult() {
      return result;
  }
    
  public static Calculator getCalculatorByOperator(String operator) {
      // ... 해당하는 enum 객체 반환
  }
}
```

## 예시2 - IDE(플러그인 시스템)

IDE를 생각해보면 변경이나 재배포 없이 플러그인을 이용하여 손쉽게 확장이 가능하다. 이는 개방-폐쇄 원칙의 아주 좋은 예시이다.

시스템은 플러그인에 대해 모르고, 플러그인은 시스템에 대해서 알고 있다. 플러그인은 시스템에 종속성을 가지지만, 시스템은 플러그인에 종속되지 않는다. 플러그인이 하나 잘못되면 해당 기능이 제대로 동작하지 않을 뿐이지, 시스템 전체에 영향을 주지 않는다. 의존성을 잘 관리하고 아키텍쳐의 경계를 넘는 것들을 역전시켰기 때문이다.

## 결론

위에서 여러가지 방법을 이용하여 개방-폐쇄 원칙에 부합하는 프로그램을 만들었다. 하지만 이는 의미 없게 보일 수 있는데, 우리들이 쓰고있는 언어들과 설계들은 일반적으로 새로운 기능들이 시스템의 다른 부분들과 분리되어 배포, 컴파일, 작성되는 것을 허용하지 않기 때문이다.

또한 복잡한 시스템이라면 현재의 시스템이 변경에 닫혀있는지, 새로운 기능의 확장에 열려있는지 확인하기 어렵다. 따라서 실제로 새로운 기능을 추가할 때 기존 소스에서 많은 변경이 이루어진다([산탄총수술](https://refactoring.guru/smells/shotgun-surgery)이 바람직하지 않다는 것을 알면서도).

개방-폐쇄 원칙은 실제 개발에서 유용하게 쓰이기 힘들다는 의견이 많다. 하지만 플러그인 아키텍쳐가 그러한 의견이 틀렸다는 반증이다. Robert C. Martin (Uncle Bob)은 플러그인 아키텍쳐가 미래의 소프트웨어 시스템에서 중요한 부분을 차지할 것이라고 했다. 잘 생각해보면 현재 인기가 많은 언어들은 플러그인과 유사하게 의존성을 관리한다. 플러그인 시스템이 모든 것을 해결해주지는 않겠지만, 현재 시점에서 가장 좋은 OCP원칙의 best practice라고 말할 수 있을 것이다.

---

#### References

- [The Open Closed Principle](https://blog.cleancoder.com/uncle-bob/2014/05/12/TheOpenClosedPrinciple.html)

- [객체지향 개발 5대 원리: SOLID](http://www.nextree.co.kr/p6960/)
