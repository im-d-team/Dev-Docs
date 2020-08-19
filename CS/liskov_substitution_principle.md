# 리스코프 치환 원칙(Liskov Substitution Principle)

> 바바라 리스코프(Barbara Liskov)가 1988년 제시한 파생(상속) 에 관한 원칙.

리스코프 치환 원칙은 하위 타입을 상위 타입으로 치환(substitution)하더라도 같은 동작을 해야 한다는 원칙이다. 상속 시 부모와 자식의 관계가 반드시 IS-A 관계를 맺도록 하면 자식 타입과 부모 타입은 치환 가능하다.

바바라 리스코프는 타입이 `S`인 객체 `o1`과 타입이 `T`인 객체 `o2`가 있을 때, `T`가 정의된 프로그램 `P` 에서 `o2`를 `o1`으로 치환하여도 `P`에서 동작의 변화가 없을 경우 `S`는 `T`의 서브타입이라 할 수 있는 치환 원칙이 필요하다고 했다.

쉽게 얘기하면  호출하는 프로그램 입장에서 부모 타입인지 자식 타입인지 신경써야하는 상황을 없애야 하고, 이를 위해서는 자식 클래스에서 부모 클래스에서 가능한 동작이 보장되어야 한다는 것이다. 그리고 이를 만족하면 자식과 부모클래스가 치환되어도 프로그램의 동작에 문제가 생기지 않는다.

```java
public class Line {
  private Point p1;
  private Point p2;
    
  public Line(Point p1, Point p2) {
    //...
  } 

  public boolean isOn(Point p) {
    //...
  }
} 

public class LineSegment extends Line {
  public LineSegment(Point p1, Point p2) {
    super(p1, p2);   
  }        

  public double getLength() {
    //...
  }

  //Line.isOn()의 참이 아래에서는 거짓이 될 수 있음.
  @Override
  public boolean isOn(Point p) {
    //...
  }
}
```

위 코드에서 `LineSegment`는 `Line`의 `isOn()` 메소드를 재정의 하였다. 

```java
public class LineClient {
  void doSomething(Line line) {
    if(line.isOn(point)) {
      //...
    }
  }
}
```

위 코드는 매개변수 `line`의 `isOn()` 메소드가 `true` 를 반환할 것을 기대하고 작성 되었다. 하지만 이 경우 `line`의 인스턴스가 `Line` 이아닌  `LineSegment` 일 경우 제대로 동작하지 않을 수 있다. 버그가 잠재적인 코드인 것이다.

만약 리스코프 치환 원칙을 준수하지 않는다면 부모 클래스에 따라 작성된 클라이언트의 코드가 변경되어야 하는 상황을 피하기 힘들다. 

> 이외에 직사각형과 정사각형에 대한 예시가 자주 나오는데, 이 또한 하위 타입의 변경에 의해 상위 타입을 바탕으로 정의한 동작이 제대로 작동하지 않는 경우에 관한 얘기이다. 참고 - [The Liskov Substitution Principle](https://drive.google.com/file/d/0BwhCYaYDn8EgNzAzZjA5ZmItNjU3NS00MzQ5LTkwYjMtMDJhNDU5ZTM0MTlh/view)

## LSP 준수 방법

- [계약에 의한 설계(design by contract; DBC)](https://en.wikipedia.org/wiki/Design_by_contract)  : overriding 시 부모 클래스와 같거나 약한 수준에서 동작하는 선행조건을 지정하고, 부모 클래스와 같거나 더 강한 수준에서 동작하는 후행 조건을 정의해야 한다.

  > 선행조건(pre-condition) : 모듈을 호출하기 위해 참이어야 하는 조건.
  >
  > 후행조건(post-condition) : 모듈이 동작한 뒤 반드시 참이어야 하는 조건.

  ```java
  @Override
  public boolean isOn(Point p) {
    if(isSomthingStartWithBaseClassTrue()) { // 선행조건
      // ...
    }
    
    if(isEndWithSomthingWrong()) { // 후행조건
      throw new SomeException();
    }
  }
  ```

- 상속(추출) 대신 공통 인자를 추출한다.

  ```java
  public abstract class LinearObject {
    private Point p1;
    private Point p2;
  
    public LinearObject(Point p1, Point p2) {
      //...    
    }
  
    public abstract boolean isOn(Point p);
  }
  
  public class Line extends LinearObject{    
    public Line(Point p1, Point p2) {
      super(p1, p2);
    } 
  
    @Override
    public boolean isOn(Point p) {
      //...
    }
  } 
  
  public class LineSegment extends LinearObject {
    public LineSegment(Point p1, Point p2) {
      super(p1, p2);   
    }        
  
    public double getLength() {
      //...
    }
  
    @Override
    public boolean isOn(Point p) {
      //...
    }
  }
  
  ```

  만약 아까와 같이 `Line` 의 `isOn()` 을 이용한 동작이 보장되야 되는경우가 문제 없어진다. 그리고 만약 인스턴스와 무관하거나 인스턴스에 따라 동작이 달라져야 하는 경우라면 추상 클래스(혹은 인터페이스)를 타입으로 사용하면 된다.

  ```java
  public class LineClient {
    void doSomething(LinearObject linearObject) {
      //...
        
      // 인스턴스에 따라 동작이 달라져야 하는 경우
      if(linearObject.isOn(point)) {
        //...
      }
    }
  }
  ```

## 결론

상속을 정의할 때 IS-A 관계만 생각할 경우 가능 범위가 너무 넓어질 수 있다. 이럴 경우 다음 그림을 떠올려보자.
![liskov_duck](https://user-images.githubusercontent.com/24666330/88468977-55002080-cf26-11ea-9269-6c42815ee481.jpg)
> 유사해 보여도 동작이 달라져야 한다면 이는 잘못된 추상화일 가능성이 높다.

이외에 더 자세한 내용을 원한다면 [리스코프 치환 원칙](https://ko.wikipedia.org/wiki/리스코프_치환_원칙)을 참고해도 좋다. 더 구체적인 조건이 명시되어 있다. 또는 로버트 마틴의 글 [The Liskov Substitution Principle](https://drive.google.com/file/d/0BwhCYaYDn8EgNzAzZjA5ZmItNjU3NS00MzQ5LTkwYjMtMDJhNDU5ZTM0MTlh/view)를 참고해도 좋다. 구체적 예시가 포함되어 있다.

---

#### References

- [LSP : The Liskov Substitution Principle](https://sites.google.com/site/anyflow/software-design/aejail-gaebal-wonchig-agile-development-principle/lsp-the-liskov-substitution-principle)

- [The Liskov Substitution Principle](https://drive.google.com/file/d/0BwhCYaYDn8EgNzAzZjA5ZmItNjU3NS00MzQ5LTkwYjMtMDJhNDU5ZTM0MTlh/view)
