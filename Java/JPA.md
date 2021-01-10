# JPA(JAVA Persistence API)

인프런 백엔드 로드맵에 적혀있는 문장이다.

> **JPA**를 활용한다면 객체 중심의 개발을 통해 생산성을 높일 수 있어서 단순한 SQL 작성으로 인생을 낭비할 필요가 없어요. **JPA**를 써본 개발자들은 사용 전으로 돌아가는 건 상상도 할 수 없다고 해요.

JPA란 무엇인가? 나오게 된 배경은 무엇이며 어떤 이점이 있는가? 한 번 살펴보자. 이 문서는 [이 강의](https://www.inflearn.com/course/ORM-JPA-Basic/dashboard) 를 참고하여 작성되었다.

## 1. 객체 지향과 관계형 데이터베이스 패러다임의 불일치

### 0. 생산성 문제

객체지향적 언어인 JAVA와 관계형 데이터 베이스를 같이 사용하려면 자바 객체를 SQL로, SQL을 자바 객체로 전환하는 과정이 빈번하게 일어난다. 다음 사례를 살펴보자.

```java
public class Member {
	private String memberId;
	private String name;
}
```

```sql
INSERT INTO MEMBER(MEMBER_ID, NAME) VALUES ...
SELECT MEMBER_ID, NAME FROM MEMBER M
UPDATE MEMBER SET ...
```

Member 객체에 tel 필드를 하나 추가한다고 해보자. 이에 대응하는 SQL 코드도 모두 수정되어야 한다.

```java
public class Member {
	private String memberId;
	private String name;
	private String tel; // 추가
}
```

```sql
// 관련 있는 모든 SQL 문에 TEL 추가
INSERT INTO MEMBER(MEMBER_ID, NAME, **TEL**) VALUES ...
SELECT MEMBER_ID, NAME, **TEL** FROM MEMBER M
UPDATE MEMBER SET ... **TEL**
```

다음 항목 부터는 객체 - 관계형 데이터베이스의 패러다임 불일치로 인한 문제가 더욱 명확해진다.

### 1. 상속

![상속](https://user-images.githubusercontent.com/43839938/104115503-79747b80-5353-11eb-9650-d4f34f67b9be.jpeg)

Album 객체를 ALBUM 테이블에 저장해야 할 때는 INSERT INTO ITEM, INSERT INTO ALBUM 두 가지를 모두 해야 한다. ALBUM 테이블을 조회해야 할 때는 Album, Item 객체를 생성하고 각각에 맞게 select 해서 넣어줘야 한다.

### 2. 연관관계

객체는 참조를 사용하고 member.getTeam();

테이블은 외래 키를 사용한다. JOIN ON M.TEAM_ID = T.TEAM_ID

![연관관계](https://user-images.githubusercontent.com/43839938/104115506-7c6f6c00-5353-11eb-8cff-52e37025b1cb.jpeg)

객체를 데이터베이스 테이블 구조로 만들지 않는 이상, 연관관계 패러다임 불일치로 인한 변환 작업을 거쳐야 한다. 다음 두 사례를 통해 살펴보자.

1) 저장

```java
class Member {
	String id;
	Team team; // 연관관계
	String username;
}
```

```sql
// TEAM_ID 에는 member.getTeam().getId(); 가 들어가야 한다.
INSERT INTO MEMBER(MEMBER_ID, TEAM_ID, USERNAME) VALUES ...
```

2) 조회

```sql
SELECT M.*, T.*
FROM MEMBER M
JOIN TEAM T ON M.TEAM_ID = T.TEAM_ID
```

```java
public Member find(String memberId) {
	// SQL 실행 
	Member member = new Member();
	// DB에서 조회한 회원 정보 모두 입력
	Team team = new Team();
	// DB에서 조회한 팀 정보 모두 입력

	// 회원과 팀 관계 설정을 해주고 return 해야 한다.
	member.setTeam(team);
	return member;
}
```

### 3. 객체 그래프 탐색
다음과 같은 객체 구조가 있다고 가정해보자

![객체 그래프 관계](https://user-images.githubusercontent.com/43839938/104115508-7d080280-5353-11eb-83ec-13ab581cb15b.jpeg)

Layerd Architecture
![layered architecture](https://user-images.githubusercontent.com/43839938/104115545-cf492380-5353-11eb-88de-a84b69391d3c.png)



[Layerd Architecture](https://walbatrossw.github.io/etc/2018/02/26/etc-layered-architecture.html) 즉, 물리적으로는 계층을 잘 나눴다고 해도 실제 SQL이 어떻게 실행되었느냐에 따라서 Entity의 신뢰 문제가 생긴다.

```sql
SELECT M.*, T.*
FROM MEMBER M
JOIN TEAM T ON M.TEAM_ID = T.TEAM_ID
```

```java
member.getTeam(); // OK
member.getOrder(); // null
```

```java
class MemberService {

	public void process() {
		Member member = memberDAO.find(memberId);
		member.getTeam(); // ???
		member.getOrder().getDelivery(); // ???
	}
}
```

### 4. 비교하기

```java
class MemberDAO {
	public Member getMember(String memberId) {

		String sql = "SELECT * FROM MEMBER WHERE MEMBER_ID = ?";

		...
		return new Member(...);
	}

}
```

```java
String memberId = "100";
Member member1 = memberDAO.getMember(memberId);
Member member2 = memberDAO.getMember(memberId);

member1 == member2 // false
```

---

이처럼 객체 지향 언어에서 관계형 데이터베이스를 **객체답게 모델링**을 한다면 Mapping 작업이 늘어나고, 패러다임 불일치로 인해 부가적으로 생각해야 할 것들이 많다.

(**객체답게 모델링** 한다는 것은 객체 지향 프로그래밍의 장치들 즉, 추상화, 캡슐화, 정보 은닉, 상속, 다형성등을 활용하는 것을 의미한다.)

결국, 이런 부가적인 작업을 최소화 하려면 객체지향 언어에서 **SQL에 의존적인 개발**을 할 수밖에 없다. 그렇다면 SQL 의존적인 개발이 아닌, **객체 중심적인 개발** 즉, 객체지향의 여러 장치들을 활용하면서 관계형 DB에도 수월하게 접근할 수 있는 방법은 없는 것일까?

이를 위해 객체를 **자바 Collection**에 저장하듯 데이터베이스에 저장하는 방법을 생각해냈고, 이는 **JPA**를 탄생시켰다.

## 2. JPA란

**JPA**는 JAVA Persistence API의 약자로, 자바 진영의 ORM(Object-Relation Mapping) 기술 표준이다. 여기서 ORM은 객체 - 관계를 매핑해주는 것이다. 객체는 객체대로 설계하고, 관계형 데이터베이스는 관계형 데이터베이스 대로 설계를 한뒤 ORM 프레임 워크가 중간에서 매핑해주는 역할을 한다. 대중적인 언어에는 대부분 ORM 기술이 존재한다. (JS의 Sequelize, Python의 SQLAlchemy 등)

![JPA](https://user-images.githubusercontent.com/43839938/104115509-7da09900-5353-11eb-8990-459b031c4807.jpeg)

JPA는 인터페이스의 모음일 뿐이다. 이를 실제 구현한 구현체는 Hibernate, EclipseLink, DataNucleus 등 다양한데, Hibernate가 가장 대중적이다.

![구조1](https://media.vlpt.us/images/adam2/post/099e1c78-ad02-4c38-981e-cee526f50cf5/Untitled.png)

![구조2](https://media.vlpt.us/images/adam2/post/7e6928cd-2537-45b4-a9f9-afd7c8a5e908/Untitled%202.png)

다음 3가지를 헷갈려하는 경우가 많다. 간단하게 정리해보자. 자세한 내용은 아래 Reference 부분을 참고하시라.

`Spring Data JPA` Spring에서 제공하는 JPA를 추상화한 모듈

`JPA` JAVA에서 제공하는 ORM 기술 표준 명세.

`Hibernate` JPA를 구현한 구현체 중 하나.

---

JPA를 사용함으로써 객체 지향 언어와 관계형 데이터베이스 패러다임의 불일치를 어떻게 해결했는지 살펴보자.

### 0. 생산성 증가

간단한 메소드로 CRUD를 처리할 수 있다.

C: **jpa.persist**(member)

R: Member member = **jpa.find**(memberId)

U: **member.setName**("변경할 이름")

D: **jpa.remove**(member)

필드를 추가해야 할 경우, SQL은 JPA가 처리하므로 필드만 추가하면 된다.

```java
public class Member {
	private String memberId;
	private String name;
	private String tel; // 추가
}
```

### 1. 상속

개발자는 다음만 처리하면 된다.

```java
// 1) 저장
jpa.persist(album);

// 2) 조회
Album album = jpa.find(Album.class, albumId);
```

나머지 SQL은 JPA가 알아서 처리한다.

```sql
// 1) 저장
INSERT INTO ITEM ...
INSERT INTO ALBUM ...

// 2) 조회
SELECT I.*, A.*
FROM ITEM I
JOIN ALBUM A ON I.ITEM_ID = A.ITEM_ID
```

### 2. 연관관계

```java
member.setTeam(team);
jpa.persist(member);
```

### 3. 객체 그래프 탐색

```java
Member member = jpa.find(Member.class, memberId);
Team team = member.getTeam();
```

```java
class MemberService {

	public void process() {
		Member member = memberDAO.find(memberId);
		member.getTeam(); // OK
		member.getOrder().getDelivery(); // OK
	}
}
```

### 4. 비교하기

동일한 트랜젝션에서 조회한 엔티티는 같음을 보장한다.

```java
String memberId = "100";

// Member member = memberDAO.getMember(memberId);
Member member1 = jpa.find(Member.class, memberId);
Member member2 = jpa.find(Member.class, memberId);

member1 == member2 // true
```

### Reference

- [자바 ORM 표준 JPA 프로그래밍 - 기본편](https://www.inflearn.com/course/ORM-JPA-Basic/dashboard)
- [JPA는 도대체 뭘까?](https://velog.io/@adam2/JPA%EB%8A%94-%EB%8F%84%EB%8D%B0%EC%B2%B4-%EB%AD%98%EA%B9%8C-orm-%EC%98%81%EC%86%8D%EC%84%B1-hibernate-spring-data-jpa)
- [계층화 아키텍쳐(Layered Architecture)의 구성요소](https://walbatrossw.github.io/etc/2018/02/26/etc-layered-architecture.html)
- [JPA, Hibernate, 그리고 Spring Data JPA의 차이점](https://suhwan.dev/2019/02/24/jpa-vs-hibernate-vs-spring-data-jpa/)