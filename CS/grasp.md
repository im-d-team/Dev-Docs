# GRASP - General Responsibility Assignment Software Patterns

직역하자면 일반적으로 책임을 할당할 때 사용할 수 있는 소프트웨어 패턴이다. 말 그대로 책임 할당에 관한 패턴을 이야기한다. 특이한 점은 보통 생각하는 패턴들과는 달리 실체가 없고 추상적인 개념들이다. 따라서 SOLID 원칙과 유사하게 어떤 식으로 책임을 부여해야 할지에 대한 원칙과 철학을 담고 있다.

## 책임이란?

객체지향에서 책임은 매우 중요한 개념이다. RDD(Responsibility Driven Design)에서는 책임을 **특정 작업을 수행하거나, 정보를 알아야 할 의무(an obligation to perform a *task* or know *information*)** 라고 정의한다. 즉 행동(behavior; doing)과 아는것(data; knowing)을 명확히 구분한다. 따라서 객체의 책임은 다음과 같이 정의할 수 있다.

### 행동(Behavior; Doing)

- 스스로 하는 것(doing something itself)
- 다른 객체와 협력 하는 것(initiating and coordinating actions with other objects)

```java
public class Customer {
	// doing something itself
    private Customer() {
    }
 
    // doing something itself
    public Customer(String email, String name, UniquenessChecker customerUniquenessChecker) {
        this.email = email;
        this.name = name;

        // initiating and coordinating actions with other objects
        if (!customerUniquenessChecker.isUnique(id)) {
            throw new BusinessRuleValidationException("Customer with this email already exists.");
        }

        this.addDomainEvent(new CustomerRegisteredEvent(this));
    }
    
    // doing something itself
    public void addOrder(Order order) {
    }

}
```

### 아는 것(Data; Knowing)

- 객체의 데이터를 감추거나 공개하는 것(private and public object data)
- 연관된 객체의 참조를 연결하는 것(related objects references)
- 해당 객체가 도출해낼 수 있는 것(things it can derive)

```JAVA
public class Customer extends Entity/*knowing*/{    
    @Getter @Setter private Guid id;   // knowing
    @Getter @Setter private String email; // knowing
    @Getter @Setter private String name; // knowing
    @Getter private List<Order> orders; // knowing
```

## GRASP

GRASP은 다음의 9가지 패턴으로 이루어져있다. 각 패턴은 특정 객체가 가져야할 책임이 무엇인지에 대한 것이다. 

1. Information Expert
2. Creator
3. Controller
4. Low Coupling
5. High Cohesion
6. Indirection
7. Polymorphism
8. Pure Fabrication
9. Protected Variations

### Information Expert

객체에 책임을 할당하는 기본 원칙에 관한 것이다. 동작에 필요한 정보가 있는 객체에 책임을 지정해야 한다. 다르게 말하면 동작에 필요한 정보가 있는 객체는 해당 동작을 할 수있는 책임을 지녀야 한다. 반대로 동작에 필요한 정보가 없는 객체는 관련된 동작을 해서는 안된다.

```java
public class Customer {
    private List<Order> orders;
	
	public int getOrdersTotal(Guid orderId) {
		return orders.stream()
            .map(Order::getValue)
            .sum();
	}
}
```

위의 예시에서 `Customer` 클래스는모든 고객의 주문(`List<Orrder>)`을 알고 있다. 따라서 `Customer` 클래스가 주문의 총액을 계산하는 것은 당연한 일이다.

### Creator

객체를 생성하는 책임에 관한 것이다. 객체 A와 B가 있다고 가정 했을 때, 객체 B가 다음의 조건 중 하나라도 만족한다면 객체 A를 생성하는 책임을 가져야 한다. 만족하는 개수는 많을수록 좋다.

- B가 A를 포함하거나 복합적으로 집계
- B가 A를 기록
- B가 A를 밀접하게 사용
- B가 A의 초기화 데이터 보유

```java
public class Customer {
    private List<Order> orders; 

    public void addOrder(List<OrderProduct> orderProducts) {	
		Order order = new Order(orderProducts); // Creator

        if (2 <= orders.stream().filter(Order::isOrderedToday).count()) {
            throw new BusinessRuleValidationException("You cannot order more than 2 orders on the same day");
        }

        orders.add(order);

        addDomainEvent(new OrderAddedEvent(order));
    }
}
```

`Customer` 클래스는 주문을 집계하고 기록하고 사용한다. 무엇보다도 `Customer` 클래스가 주문(`Order`)을 포함한다. 

### Controller

UI 레이어를 넘나들며 시스템 작동의 제어권을 수신하고 조정하는 객체에 관한 것이다. 시스템, 루트객체, 시스템 실행에 필요한 장치, 핵심 서브시스템을 나타내거나 시스템 동작이 발생하는 시나리오(유스케이스)를 표현하는 객체일 경우 컨트롤러의 책임을 가져야 한다.

```java
public class CustomerOrdersController {
	private OrderService customerOrderService;

	public CustomerOrdersController(OrderService customerOrderService) {
		this.customerOrderService = customerOrderService;
	}

	@PostMapping("/{customerId}/orders")
	public String addCustomerOrder(Guid customerId, HttpServletRequest request)	{
	   ...
	}
}
```

위는 전형적인 Spring MVC의 컨트롤러인데, 좀 더 엄밀히 말하면 [DispatcherServlet](https://docs.spring.io/spring/docs/3.0.0.M4/spring-framework-reference/html/ch15s02.html)이 Front Controller 역할을 해주는 일종의 GRASP 컨트롤러라고 말할 수 있다. 

### Low Coupling

결합도(coupling)가 낮게 유지되도록 책임을 할당 해야 한다. 낮은 결합도는 변화의 영향을 줄이고 낮은 의존성과 재사용성을 증가시키는 방법이다. 위의 Controller 예시는 의존성 주입을 이용해 결합도가 낮다. `OrderService` 인터페이스의 명세가 바뀌지 않으면 이를 구현하는 서비스 객체가 바뀌어도 큰 영향을 받지 않을 것이다.

### High Cohension

좋은 객체는 높은 응집력(cohension)을 가져야 한다. 응집력은 객체 내부의 책임이 얼마나 연관성이 있는지에 관한 것이다. 만약 `Customer` 클래스가 주문 뿐만 아니라 상품의 가격을 관리하는 책임을 가지게 된다면 해당 클래스의 응집력은 크게 떨어진다.

### Indirection

컴포넌트나 서비스가 직접 연결되지 않도록 중재 역할을 해주는 책임을 갖는 객체를 이용하는 것이다. MVC패턴에서 모델과 뷰 사이에 컨트롤러를 구성하는 것을 예시로 들 수 있다. 혹은 [Mediator Pattern](https://springframework.guru/gang-of-four-design-patterns/mediator-pattern/)을 이용할 수 있다. 객체가 직접 연결되어 있지 않다는 것은 시스템을 유연하게 만드는 것을 도와줄 수 있지만, 가독성과 추론을 어렵게 만들 수 있는 trade off가 있기 때문에 직접 구현하게 된다면 이를 잘 고려해야 한다.

### Polymorphism

유형에 따라 서로 다른 케이스를 처리하고 싶을 경우 다형성을 이용할 수 있다. 

```java
private Guid id;

public Customer(string email, string name, UniquenessChecker customerUniquenessChecker) {
	this.Email = email;
	this.Name = name;
 
	if (!customerUniquenessChecker.isUnique(id)) {
		throw new BusinessRuleValidationException("Customer with this email already exists.");
	}
 
	this.AddDomainEvent(new CustomerRegisteredEvent(this));
}
```

`UniquenessChecker`가 `Customer`에 사용될 경우 `CustomerUniquenessChecker` 다른 곳에 사용될 경우 `OtherUniquenessChecker`를 사용하는 식으로 책임은 같지만 구현에 따라 동작이 달라질 경우 유용하게 쓰일 수 있다.

### Pure Fabrication

다른 원칙들을 적용하여 높은 응집력과 낮은 결합력을 유지하기 힘들 경우(정확한 책임을 할당하기 힘든 경우) 도메인에 독립적인 클래스와 인터페이스를 만드는 것이 좋을 수 있다.

```java
public interface ForeignExchange {
    List<ConversionRate> getConversionRates();
}

public class ForeignExchangeImpl implements ForeignExchange {
    private CacheStore cacheStore;

    public ForeignExchange(CacheStore cacheStore) {
        this.cacheStore = cacheStore;
    }

    @Override
    public List<ConversionRate> getConversionRates() {
        ...
    }

    private static List<ConversionRate> getConversionRatesFromExternalApi() {
        // Communication with external API
    }
}
```

### Protected Variations

변화가 많거나 변경의 가능성이 높은 불안정한 객체나 서브시스템은 안정적인 인터페이스로 감쌀 수 있다.

```java
public class CustomerOrdersRepository {

    private JdbcTemplate jdbcTemplate;

    public void setDataSource(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    // JDBC-backed implementations of the methods...
}

@Configuration
public class SpringJdbcConfig {
    @Bean
    public DataSource mysqlDataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("com.mysql.jdbc.Driver");
        dataSource.setUrl("jdbc:mysql://localhost:3306/springjdbc");
        dataSource.setUsername("guest_user");
        dataSource.setPassword("guest_password");
 
        return dataSource;
    }
}
```

위의 예시는 `DataSource`라는 안정적인 인터페이스 안에서 데이터 베이스 setup에 대한 책임을 담당한다. 데이터 베이스가 교체되더라도 `DataSource` 객체의 명세를 그대로 사용하기 때문에 이를 구현한 클래스 를 교체하거나 내부 구현의 내용만 바꿔주면 다른 시스템에 피해 없이 작업을 수행할 수 있다.

## 마치며

객체를 정의할때 가장 중요하지만 그만큼 어려운 것이 책임을 정의하고 그에 따라 설계하는 것이다. SOLID원칙과 마찬가지로 이를 완벽하게 지키기는 힘들다. 하지만 마찬가지로 지키지 않을 수록 절차지향적 코드에 가까워진다. 절차지향적인 프로그램이 나쁜 것은 아니지만, 본인이 객체 지향 프로그래밍을 의도하며 만들었다면 마땅히 따라야할 원칙과도 같은 것이기 때문에 최대한 지키기 위해 노력하는 것이 바람직하다.

---

#### References

- [GRASP – General Responsibility Assignment Software Patterns Explained](http://www.kamilgrzybek.com/design/grasp-explained/)
