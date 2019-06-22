# Dependency Injection(DI)
Dependency Injection는 **Framework에 의해** 객체의 의존성이 주입되는 설계 패턴을 말한다.
개발자가 class를 만들고 어떤 의존성을 주입할 것인지 설정하면, Framework가 **객체를 생성**하고 **동적으로 의존성을 주입**하는 형태이다. 결과적으로 객체간의 **의존 관계는 약해지며,** 프로그램의 제어권을 framework가 가져가는 **Ioc(제어의 역전)** 이 발생한다.   

Spring Framework에서는 **Spring container**가 이 역할을 한다. 

<br/>  

## 약한 의존 관계 설정

먼저 컨테이너를 사용하지 않은 코드를 작성하면 다음과 같다. 
```java
public class OracleDAO {
    public void insert(){ }
}

public class MySQLDAO {
    public void insert(){ }
}

public class Service {
    OracleDAO dao = new OracleDAO();
    dao.insert();
}
```
`Service`클래스는 `OracleDAO`의 객체를 직접 생성하고 있다. 그런데 만약 `OracleDAO` 대신 `MySQLDAO`의 객체를 사용하고 싶다면, `Service`클래스의 `OracleDAO dao = new OracleDAO();`를 `MySQLDAO dao = new MySQLDAO();`로 직접 고쳐줘야한다. 만약, 이런 클래스가 더 있다면? 일일이 그 클래스를 찾아 수정해줘야한다. 이러한 경우를 강한 의존관계라고 한다.  

이보다 의존관계를 약화시키기 위해 다움과 같이 `interface`를 사용할 수 있다.

```java
public interface DAO {
    public void insert(){ }
}

public class OracleDAO implements DAO{
    @Override
    public void insert(){ }
}

public class MySQLDAO implements DAO{
    @Override
    public void insert(){ }
}

public class Service {
    DAO dao = new OracleDAO();
    dao.insert();
}
```
하지만, 이 방식도 `Service`에서 객체를 생성하기 때문에 큰 차이는 없다. 더 의존성을 약화시키기 위해 Spring에서는 **컨테이너**를 사용할 수 있다. 

<br/>  

### 생성자를 이용한 의존관계 

```java
public interface MemberService {
   public String print();
}

public class MemberServiceImpl implements MemberService{
   private String name;
   private int age;
   
   MemberServiceImpl() {
      this.name = "Kim";
      this.age = 20;
   } 

   @Override
   public String print() {
      return "name : " + name + "\nage : " + age;
   }
}
```
```java
public class Member {
   private MemberService memberService;
   
   Member(MemberService memberService){
      this.memberService = memberService;
   }
   
   public String result() {
      return memberService.print();
   }
}
```
```xml
<!--applicationContext.xml-->
<bean id="memberService" class="com.test.MemberServiceImpl"/>
<bean id="member" class="com.test.Member">
    <constructor-arg ref="memberService"></constructor-arg>
</bean>
```
컨테이너는 `<bean>`태그를 읽어 `memberService`와 `member`객체를 만든다.   
이 때 `memberService`는 `MemberServiceImpl`의 객체이고, `member`는 `Member`의 객체이다. 즉,  `MemberService memberService = new MemberServiceImple()`과 `Member member = new Member()`이다.   
다만 `Member`클래스에서는 생성자 인자를 받기 때문에 `<constructor-arg>`태그를 사용하게 된다. 생성자 인자가 기본형이면 속성으로 `value`를 넣어주고, 참조형이면 `ref`를 사용하게 된다. 

```java
public class App {
    public static void main(String[] args) {
        //스프링 컨테이너 생성
        AbstractApplicationContext context = new GenericXmlApplicationContext("classpath:com/test/applicationContext.xml");

        try {
            //스프링 컨테이너에서 객체를 가져옴
            Member m1 = (Member)context.getBean("member");
            System.out.println(m1.result());
        } finally {
         context.close();
        }
    }
}
```
컨테이너에서 만들어 놓은 객체에 접근하기 위해 스프링 컨테이너를 생성한다.  
`GenericXmlapplicationContext`은 xml로 생성된 객체의 생성정보를 담는다.     
따라서 `context`는 `memberService`와 `member` 객체를 갖는다.   
객체에 접근하기 위해서는 `.getBean()`를 사용한다. 여기서 얻어진 객체의 타입은 `Object`이므로 다운캐스팅을 해줘야한다. 다운캐스팅이 번거롭다면 `context.getBean(Member.class)`처럼 작성할 수도 있다.   
본론으로 돌아가서, 만약 `memberService`가 `Membe rServiceImpl2`의 객체가 되도록 하려면 applicationContext.xml에서 `class`속성값만 바꿔주면 된다. 


<br/>  

### 프로퍼티를 이용한 의존관계 

`setter()`를 이용해 프로퍼티 값을 줄 때에는 `<property>`로 값을 지정해준다.
```java
public interface MemberService {
   public String print();
}

public class MemberServiceImpl implements MemberService{
   private String name;
   private int age;
   
   public void setName(String name) {
      this.name = name;
   }
   public void setAge(int age) {
      this.age = age;
   }

   @Override
   public String print() {
      return "name : " + name + "\nage : " + age;
   }
}
```
```java
public class Member {
   private MemberService memberService;
   
   public void setMemberService(MemberService memberService) {
      this.memberService = memberService;
   }

   public String result() {
      return memberService.print();
   }
}
```
```xml
<bean id="memberService" class="com.test.MemberServiceImpl">
    <property name="name" value="Kim"></property>
    <property name="age" value="10"></property>
</bean>

<bean id="member" class="com.test.Member">
    <property name="memberService" ref="memberService"></property>
</bean>
```
xml의 `p 네임스페이스`를 사용하면 다음과 같이 쓸 수 있다. 
```xml
<bean id="memberService" class="com.test.MemberServiceImpl" p:name="kim" p:age="10"/>
<bean id="member" class="com.test.Member" p:memberService-ref="memberService"/>
```

<br/>  

### 의존관계 자동설정

`autowire`속성을 이용해 의존관계를 자동으로 설정할 수 있다. 
속성값에는 `constructor`, `byName`, `byType`이 있다.
```xml
<!--생성자를 이용한 의존관계-->
<bean id="member" class="com.test.Member" autowire="constructor"/>
<!--프로퍼티를 이용한 의존관계-->
<bean id="member" class="com.test.Member" autowire="byName"/>
```

<br/>  


### 객체 생성 예제

- **Collection**

```java
public class MemberServiceImpl implements MemberService{
   private Map<String, String> address;
   private List<String> hobby;
   
   public void setAddress(Map<String, String> address) {
      this.address = address;
   }
   public void setHobby(List<String> hobby) {
      this.hobby = hobby;
   }

   @Override
   public String print() {
      String str = null;

      str = "======= 친구 주소록 ======= \n";
      Iterator<String> it = address.keySet().iterator();
      while(it.hasNext()) {
         String key = it.next();
         String value = address.get(key);
         
         str += key + " - " + value + "\n";
      }
      str += "===========================\n";
      
      str += "========== 취미 ===========\n";
      for(String s : hobby) {
         str += s + "     ";
      }
      str += "\n===========================\n";
      
      return str;
   }
}
```
```xml
<bean id="memberService" class="com.test.MemberServiceImpl">
    <property name="address">
        <map>
            <entry key="Kim" value="Incheon"></entry>
            <entry key="Lee" value="Seoul"></entry>
            <!-- 객체를 담는 경우
            <entry key-ref="obj" value-ref="obj"></entry>-->
        </map>
    </property>
    <property name="hobby">
        <list>
            <value>sports</value>
            <value>online-game</value>
             <!-- 객체를 담는 경우
            <ref-bean="obj"/>-->
        </list>
    </property>
</bean>   
<bean id="member" class="com.test.Member" p:memberService-ref="memberService"/>
```

- **lookup-method**

추상 클래스의 자식 객체를 생성한다.

```java
public class Member {
   private static AtomicLong num = new AtomicLong();
   private String name;
   
   public Member() {
      num.incrementAndGet();
   }

   public void setName(String name) {
      this.name = name;
   }

   @Override
   public String toString() {
      return "name : " + name + num;
   }
}
```
```java
public abstract class MemberService {
   public abstract Member checkMember();
}
```
```xml
<bean id="memberService" class="com.test.MemberService">
    <lookup-method name="checkMember" bean="member1"/>
</bean>   

<bean id="member1" class="com.test.Member" p:name="Kim" scope="prototype"/>
```
```java
public class App {
   public static void main(String[] args) {
      AbstractApplicationContext context = new GenericXmlApplicationContext("classpath:com/test/applicationContext.xml");
      
      try {
         MemberService ms = context.getBean(MemberService.class);

         System.out.println(ms.checkMember());
         System.out.println(ms.checkMember());
         System.out.println(ms.checkMember());
         System.out.println(ms.checkMember());
      } finally {
         context.close();
      }
   }
}
/*
    name : Kim1
    name : Kim2
    name : Kim3
    name : Kim4
*/
```
추상클래스는 자식 객체를 생성하지 않고는 사용하지 못한다. xml에서 `<lookup-method>`를 이용해 메소드가 호출될 때 자식 객체를 생성할 수 있다. `scope`의 default는 singleton이기 때문에 항상 같은 객체를 리턴하지만 속성값을 `prototype`으로 줌으로써 항상 다른 객체를 생성하게 만들었다. 따라서 Member객체의 num이 계속 증가한 것을 확인할 수 있다.

- **.properties**
xml의 `context 네임스페이스`를 사용해 파일을 읽고 EL표현식을 이용해 값을 불러올 수 있다.
```xml
<context:property-placeholder location="classpath:com/user5/user.properties"></context:property-placeholder>
   
<bean id="userService" class="com.user5.UserServiceImpl">
    <property name="name" value="${name}"/>
    <property name="tel" value="${tel}"/>
    <property name="age" value="${age}"/>
</bean>

<bean id="userBean" class="com.user5.UserBean" p:userService-ref="userService"/>
```
