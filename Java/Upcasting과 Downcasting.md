# Upcasting / Downcasting
먼저, casting이란 형변환을 말하며 upcasting과 downcasting은 참조형을 형변환하는 개념이다.   
참조형이 형변환되는 경우는 다음과 같다.
1. 클래스 상속시
2. 인터페이스 확장시  

때문에 Upcasting과 Downcasting은 다형성과 관련이 높다.

<br/>

# 클래스 상속에서의 Upcasting
`Parent parent = new Child();`
1. 자식 클래스로 생성한 객체가 부모 클래스 타입으로 형변환되는 형태이다.
2. 자식 클래스는 부모 클래스의 변수 및 메소드를 갖고 있기 때문에 암묵적 형변환이 가능하다.  
3. 형변환된 객체는 본래 클래스의 변수 및 메소드에 접근할 수 없다. 다시 접근하기 위해서는 Downcasting이 필요하다. 
4. upcasting을 이용해 코드 길이를 줄일 수 있다. 

```java
public class Vehicle {
    private int seat;

    public Vehicle() { }

    public Vehicle(int seat) {
        this.seat = seat;
    }

    public String ride() {
        return "운전중";
    }

    public int getSeat() {
        return seat;
    }

    public void setSeat(int seat) {
        this.seat = seat;
    }
}
```
```java
public class Bus extends Vehicle{
    private String company;

    Bus(int seat, String company){
        super(seat);
        this.company = company;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }
}
```
```java
public class Car extends Vehicle{
    private String operator;

    public Car() { };

    public Car(int seat, String operator) {
        super(seat);
        this.operator = operator;
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }
}
```
위의 예제에서 `Car`와 `Bus`는 `Vehicle`을 상속 받고 있다. `Car`와 `Bus`로 객체를 생성하고, `ride()`를 실행하기 위해 다음과 같이 코드를 작성할 수 있다. 

```java
public class Main {
	
    public static void main(String[] args) {
        Car c1 = new Car(4, "operator1");
        Car c2 = new Car(6, "operator2");
        Bus b1 = new Bus(10, "company1");
        Bus b2 = new Bus(40, "company2");

        for(Car car : list) {
            System.out.println(car.ride());
        }
        for(Bus bus : list) {
            System.out.println(bus.ride());
        }
    }
}
```
위 코드는 객체 타입이 `Car`와 `Bus`로 나뉘기 때문에 서로 다른 반복문을 이용해야 한다. 따라서, `Vehicle`을 상속받는 클래스가 늘어날수록 반복문도 늘어나게 된다. 이때 쓰일 수 있는 연산이 **upcasting**이다. 

```java
public class Main {
	
    public static void main(String[] args) {
        List<Vehicle> list = new ArrayList<Vehicle>();
        list.add(new Car(4, "operator1"));
        list.add(new Car(6, "operator2"));
        list.add(new Bus(10, "company1"));
        list.add(new Bus(40, "company2"));

        for(Vehicle v : list) {
            System.out.println(v.ride());
        }
    }
}
```  
`Vehicle`타입의 `List`에 `Car`와 `Bus`로 생성한 객체들을 `add()`해주었다. 각각의 객체들은 자동으로 형변환되어 동일한 반복문 안애서 실행된다.

<br/>

# 인터페이스에서의 Upcasting
다음 코드를 먼저 보자.
```java
public interface CarImpl {
    public String ride();
}
```
```java
public class Bus implements CarImpl{

    @Override
    public String ride() {
        
        return "버스 운행중";
    }
}
```
```java
public class Main {
	
    public static void main(String[] args) {
        Bus bus = new Bus();

        System.out.println((bus instanceof CarImpl)?"CarImpl":"Bus");
    }
}
```
`Bus`은 `CarImpl`을 확장한 클래스다. `main()`에서 `instanceof` 연산을 통해 `bus`의 실제 타입을 알아보았다. 만약 `bus`의 실제 타입이 `CarImpl`이라면 `true`가 반환되어 `CarImpl`이 출력될 것이고, 아니라면 `false`가 반환되어 `Bus`이 출력될 것이다. 출력 결과는 `CarImpl`이다.  
`bus`은 `CarImpl`로 **upcasting**된 것이다.  

<br/>

# Downcasting
```java
Parent parent = new Child(); //upcasting
Child child = (child) parent;
```
1. 부모 클래스로 생성한 객체가 자식 클래스 타입으로 형변환되는 형태이다.
2. 부모 클래스는 자식 클래스의 모든 변수 및 메소드를 갖지 않기 때문에 명시적으로 형변환을 해줘야한다.  

## Downcasting / ClassCastException 에러  
만약 위의 코드를 다음과 같이 수정하면 컴파일 에러, `ClassCastException`가 발생한다.
```java 
Child child = (Child) new Parent();
``` 
JVM은 `Parent`의 객체를 `Child`타입으로 형변환하려고 한다. 하지만, `Parent`는 `Child`에서 확장된 변수 및 메소드를 갖지 않고, JVM은 `Child`의 데이터를 알 수 없기 떄문에 형변환을 해줄 수 없다. 
```java
Parent parent = new Child();
Child child = (child) parent;
``` 
이 코드가 정상적으로 실행되는 이유는 `Child` 객체로 생성된 `parent`로 JVM이 `Child`의 데이터를 알 수 있었기 때문이다.      
<br/>  

---
#### Reference
[Casting (형변환 : 캐스팅)](https://inor.tistory.com/40)  
[JAVA - DownCasting(다운캐스팅)](https://mommoo.tistory.com/51)