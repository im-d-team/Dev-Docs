# Mybatis(마이바티스) Framework
## 마이바티스란?
 마이바티스를 설명하기 위해서 JDBC 개념을 알아야한다.
 
-  JDBC(Java Database Connectivity)란 Java에서 데이터베이스에 접속할 수 있도록 하는 자바 API이다.
자바는 JDBC를 통해 mysql, oracle에 접근한다.
기존에 JDBC를 이용하여 프로그래밍을 하는 방식은 프로그램 소스 안에 SQL 문을 작성하는 방식이었다.
그렇기 때문에 한 파일에 java 언어와 sql 언어가 있어 재사용성이 안 좋고 가독성이 떨어진다는 단점이 있다.


- Mybatis는 JDBC의 단점을 보완해 작업을 간편하게 해주는 프레임워크이다. 
SQL 쿼리문을 xml 형식의 파일로 분리시켜 저장관리할 수 있다.
또한, 개발자가 작성한 SQL 명령어와 자바 객체를 매핑해주는 기능을 제공하며, 기존에 사용하던 SQL 명령어를 재사용한다는 장점이 있다. 

따라서 SQL의 변경 등이 발생할 경우, 프로그램(java 파일)을 수정하기 때문에 그 유연성이 좋지 못했는데, MyBatis에서는 SQL을 xml 파일에 작성하기 때문에, SQL의 변환이 자유롭고, 가독성이 좋다는 장점이 있다.

## Mybatis를 쓰는 이유
###### Mybatis가 없었을 때의 소스 방식
~~~java
public Entity selectFAQList(UserConnection conn, Entity param) throws SQLException {
       UserStatement stmt = null;
       ResultSet rslt = null;
       StringBuffer sql = new StringBuffer();
       sql.append("\n SELECT *");
       sql.append("\n FROM");
       sql.append("\n TABLE1");
       stmt = conn.prepareStatement(sql.toString());
       rslt = stmt.executeQuery();
       Entity _DATA = new Entity();
       _DATA.put("_DATA", EntityUtil.ResultSetToClobList(rslt));
       return _DATA;
}
~~~
.java 파일 안에 StringBuffer라는 클래스를 호출해 sql이라는 객체를 만들어 문자를 계속 이어주면서 sql query를 작성하고 있다. 

이 경우 쿼리가 수정될 때마다 .java에 들어가 .append()메소드를 추가하고 저장해 유지 보수가 힘들고 가독성이 떨어져 sql query구문의 분리가 어려워진다. 

또한, 쿼리 양이 많아질수록 .java에는 자바 코드뿐만 아니라 쿼리 코드로 인해 양이 방대해진다.
그래서 sql 구문과 java 코드의 분리 필요성을 느끼게 된다. 

######  Mybatis적용 후 소스 방식
~~~java
<?xml version="1.0" encoding="UTF-8"?>
  <ENTITY id="table.getTable1List" type="SQL" return="List">
    <![CDATA[
        SELECT *
            FROM
            TABLE1
    ]]>
    <PARAMS>    
    </PARAMS>
  </ENTITY>
~~~

xml로 빼내서 쿼리문을 작성하면 내부적 처리는 Mybatis에서 모두 처리해 주므로 Entity id 값을 DAO에서 호출하기만 하면 된다. 

우리가 사용할 sql 문을 Mapper에 등록해놓고선 편리하게 나중에 sqlSession을 통해서 id 값을 이용해 불러오고 사용하면 훨씬 편리하다.


# 스프링 웹 프로젝트의 구조
![image](https://user-images.githubusercontent.com/43868540/79679996-af158980-8245-11ea-9cbb-66248dc0678e.png)

핵심적으로 DAO는 SessionTemplate를 통해 Mybatis를 호출해 데이터베이스에 접근한다. 

## Mybatis 연동하기
spring과 Mybatis는 연결한 전체 구조는 아래의 그림과 같다. 
![image 복사본](https://user-images.githubusercontent.com/43868540/79680054-6f9b6d00-8246-11ea-9658-d5fb79be24d3.png)
**1. Mybatis 라이브러리 추가**

스프링에서 MyBatis를 사용하려면 라이브러리가 필요하다. 
Maven을 이용하면 라이브러리의 추가가 굉장히 쉽다. <br>
Maven은 내가 사용할 라이브러리뿐만 아니라 해당 라이브러리가 작동하는데 필요한 다른 라이브러리들까지 관리하여 네트워크를 통해서 자동으로 다운받아 준다.<br>
라이브러리를 쉽게 관리할 수 있다.

pom.xml의 <dependencied>태그 안에 <dependencied>추가하기!

~~~java
<!-- mybatis -->
      <dependency>
         <groupId>org.mybatis</groupId>
         <artifactId>mybatis</artifactId>
         <version>3.4.6</version>
      </dependency>
      
      <dependency>
         <groupId>org.mybatis</groupId>
         <artifactId>mybatis-spring</artifactId>
         <version>1.3.2</version>
      </dependency>

      <dependency>
         <groupId>org.springframework</groupId>
         <artifactId>spring-jdbc</artifactId>
         <version>${org.springframework-version}</version>
       </dependency>
		 
	 <dependency>
    	<groupId>org.springframework</groupId>
    	<artifactId>spring-test</artifactId>
    	<version>4.3.18.RELEASE</version>
	</dependency>
      
	<!--jdbc의 Datasource 사용을 위한 dbcp도 추가해준다.-->
      <dependency>
         <groupId>org.apache.commons</groupId>
         <artifactId>commons-dbcp2</artifactId>
         <version>2.6.0</version>
      </dependency>
	  <!--여기까지 공통으로 들어가는 라이브러리-->
	  
      <!-- mariaDB DB에 따라서 추가할 라이브러리가 다르다. --> 
      <dependency>
         <groupId>org.mariadb.jdbc</groupId>
         <artifactId>mariadb-java-client</artifactId>
         <version>2.2.1</version>
      </dependency>
~~~

**2. Mybatis와 Spring 연결**
스프링 프레임워크에서 Mybatis를 사용하기 위한 xml 설정을 하는 단계

/WEB_INF/spring/appServlet경로에 root-context.xml 파일 생성!

~~~java
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
   
<!--DB 연결 정보-->
<bean id="dataSource" class="org.apache.ibatis.datasource.pooled.PooledDataSource">
         <property name="driver" value="org.mariadb.jdbc.Driver" />
        <property name="url" value="jdbc:mariadb://127.0.0.1:3306/test" />
         <property name="username" value="root" />
         <property name="password" value="passwd" />
   </bean>
  
  <!--    Mybatis의 xml파일들을 읽기 위한 설정-->
   <bean id="sqlSessionFactory"
        class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="dataSource"></property>
        <property name="configLocation"
            value="classpath:sql/mybatis-config.xml">
        </property>
    </bean>  
   
   <bean id="sqlSession" class="org.mybatis.spring.SqlSessionTemplate">
        <constructor-arg  ref="sqlSessionFactory"></constructor-arg>
    </bean>   
	
	<bean id="sqlSessionTemplate" class="org.mybatis.spring.SqlSessionTemplate"> <constructor-arg index="0" ref="sqlSession"/> 
   </bean> 
   </beans>
  ~~~
  
 
 15행은 sqlSession을 생성하기 위해 sqlSessionFactory를 정의하고 있다. 
 17행의 property의 name과 ref가 dataSource로 정의 되어있다. 
이 두 가지는 같은 것을 의미하지 않는다. name은 위에서 등록한 sqlSession 빈(bean)에서 사용할 이름이 dataSource이고, ref의 dataSource는 우리가 7행에서 정의한 빈(bean)을 참조하는 것을 의미한다. 

19행을 보면 src/main/resources 경로의 mybatis-config.xml 파일의 위치를 지정해 주는 것이다. 
mybatis-config.xml는 우리가 작성할 sql 문이 모여있는 xml 파일이다.

마지막으로 27행의 sqlSessionTemplate은 마이바티스 스프링 연동 모듈의 핵심이다. SQLSessionTemplate은 SqlSession을 구현하고, 코드에서 SqlSession을 대체하는 역할을 한다.

* sqlSessionFactory <br>
Mybatis에서는 SqlSession를 생성하기 위해 SqlSessionFactory를 사용한다. 
sqlSessionFactory를 생성 하기위해 SqlSessionFactoryBean 이 사용된다.
세션을 한번 생성하면 세션을 이용해서 매핑된 구문을 실행하거나 커밋 또는 롤백을 하기 위해 세션을 사용할 수 있다. 
그리고 마지막으로 더 이상 필요하지 않은 상태가 되면 세션을 닫는다. 

* sqlSessionTemplate <br>
SqlSessionTemplate은 마이바티스 스프링 연동 모듈의 핵심이다. 
SqlSessionTemplate은 SqlSession을 구현하고 코드에서 SqlSession를 대체하는 역할을 한다. 

**3. mybatis-config.xml 작성**
~~~java
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration
PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
"http://mybatis.org/dtd/mybatis-3-config.dtd">

<configuration>
    <mappers>
        <mapper resource="sql/user-mapper.xml"/>
        <mapper resource="sql/searchSubject-mapper.xml"/>
        <mapper resource="sql/member-mapper.xml"/>
        <mapper resource="sql/claim-mapper.xml"/>
        <mapper resource="sql/patent-mapper.xml"/>
        <mapper resource="sql/memo-mapper.xml"/>
        <mapper resource="sql/paper-mapper.xml"/>
    </mappers>
</configuration>
~~~

 mybatis-config.xml은 mapper들이 모인 xml 파일이다. 
 
 즉, 앞서 21행은 위에 모든 xml 파일을 읽어들인다. 
 
**4 web.xml 작성**

web.xml은 서버가 최초로 실행될 때 해당 위치에 있는 context 파일을 모조리 읽어들이는 것을 뜻한다. 
context 파일을 읽어들이면서 xml을 인식한다. 
~~~java
<context-param>
      <param-name>contextConfigLocation</param-name>
      <param-value>
          /WEB-INF/spring/root-context.xml
       </param-value>
   </context-param>
   ~~~
   
   
**5 DAO 작성**

마지막으로 실제 소스에서 위에서 선언한 SqlSessionTemplate을 사용할 DAO를 만들어준다. 
스프링의 Data Access Object (DAO) 지원은 JDBC, Hibernate, JPA, JDO같은 데이터 접근 기술과 관련된 작업을 일관된 방법으로 쉽게 할 수 있게 도와준다.
DAO는 sql 문의 id를 통해 데이터베이스와 sql 문을 연결해준다.

1) src/main/java 폴더의 first > common 패키지 밑에 dao 패키지를 생성한다.

2) dao 패키지 안에 AbstractDAO.java를 생성한다.

3) AbstractDAO.java에 코드 작성한다.
~~~java
public class AbstractDAO { 
	protected Log log = LogFactory.getLog(AbstractDAO.class); 
	@Autowired private SqlSessionTemplate sqlSession; 
	public Object insert(String queryId, Object params){ 
		return sqlSession.insert(queryId, params); 
	} 
		return sqlSession.update(queryId, params); 
	} 
	public Object delete(String queryId, Object params){ 
		return sqlSession.delete(queryId, params); 
	} 
	public Object selectOne(String queryId){ 
		return sqlSession.selectOne(queryId); 
	} 
	public Object selectOne(String queryId, Object params){ 
		return sqlSession.selectOne(queryId, params); 
	} 
	@SuppressWarnings("rawtypes") 
	public List selectList(String queryId){
		return sqlSession.selectList(queryId); 
	} 
	@SuppressWarnings("rawtypes") 
	public List selectList(String queryId, Object params){ 
		return sqlSession.selectList(queryId,params); 
	} 
}
~~~

앞에서 SqlSessionTemplate을 설정하였고, 이는 SqlSession을 대체한다.
3번째 줄에 SqlSessionTemplate을 선언을 한다.

쿼리는 sqlSession.메서드를 호출하면 되는데 쿼리 문의 id에 접근해 사용한다. 

**6  SQL.xml 파일 작성**

이제 SQL.xml 파일을 작성하면 완료~

앞서 21행에서 설정한 <value>classpath:sql/mybatis-config.xml</value>
이 부분대로 src/main/resources/sql/_.xml 파일을 생성해서 사용하면 된다.

paper-mapper.xml
~~~java
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper
PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
"http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="paperMapper">

<select id ="SELECT_paperOverChk" parameterType="java.util.HashMap" resultType= "String">
       SELECT    paper_id
       FROM    paper_tb
       WHERE   cn = #{cn}
  </select>
~~~

##  Mybatis의 특징
- 간단한 퍼시스턴스 프레임워크이다.
- 코드재사용으로 인한 개발자의 부담을 줄여주고 생산성을 높인다. 
- SQL문이 어플리케이션 소스코드로부터 완전히 분리되어 가독성이 높다.

## Mybatis의 단점
- SQL을 직접 작성하여 반복되는 작업이 존재
- SQL과 데이터베이스 벤더에 대한 종속성(오라클에서 mySQL로 바꾸면 함수들을 바꿔줘야한다.)

#### Reference <br>
- [Mybatis개념](https://sjh836.tistory.com/127)
- [마이바티스와 sql연동하기](https://baessi.tistory.com/8)
- [마이바티스연동과 개념](https://addio3305.tistory.com/62)
- [개발환경 설정](https://velog.io/@wimes/2.-개발환경설정-Spring-MyBatis-MySQL의-설정-2zk4cf5gof)
- [Mybatis와 JPA 비교](https://jar100.tistory.com/25)
