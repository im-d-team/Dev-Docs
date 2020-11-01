# Types of Databases: The Right Database for the Right Service 
그동안 DB를 사용할 때는 RDB(Relational Database, 관계형 데이터베이스)만 사용했다. 어느 순간 부터 RDB와 무언가 대조되는 듯한 느낌을 주는 NoSQL DB의 존재를 알게 됐다. 이 문서에서 NoSQL이 정확히 무엇인지 언제 사용하는지(왜 존재하는지) 등을 정리하고자 한다.

## NoSQL이란?

NoSQL이란 No SQL, Not Only SQL 등 여러 의미로 해석되지만 현재 대다수가 Not Only SQL로 풀어내고 있다. 이는 곧 단순히 기존 RDB가 갖고 있는 특성뿐만 아니라 다른 특성들을 부가적으로 지원한다는 것을 의미한다.

> 참고: SQL은 Structured Query Language의 약자로 RDB의 데이터를 관리하는 특수 목적의 프로그래밍 언어이다. 우리는 데이터베이스를 비교하는 것이다. 이 문서에서는 RDB (SQL을 사용) vs NoSQL DB를 비교한다고 생각하면 된다.

NoSQL을 구체적으로 이해하기 위해 먼저 RDB가 무엇인지 살펴보자. RDB는 1970년대 탄생 이후 지금까지 수십년간 가장 많이 사용된 DB 모델이다. RDB는 데이터를 정형화된 구조(Strict Schema)에 따라 테이블(Table)에 저장하는 형식이다. 각 테이블은 관계(Relations)를 갖고 있는데 이는 RDB가 데이터의 중복을 방지하고 [참조 무결성](https://ko.wikipedia.org/wiki/%EC%B0%B8%EC%A1%B0_%EB%AC%B4%EA%B2%B0%EC%84%B1)이 보장되도록 한다. 더불어 [ACID 속성](https://ko.wikipedia.org/wiki/ACID)을 갖고 있다. 예시로는 MySQL, PostgreSQL, MariaDB, Oracle SQL, MSSQL 등이 있다.

그렇다면 이런 RDB의 특성과 대비한 NoSQL의 특성은 무엇일까? NoSQL은 RDB가 갖고 있던 데이터 완결성을 조금 포기하고 **유연한 데이터 모델** / **대량의 데이터 처리** / **짧은 지연시간 (Low Latency)** 이 중요한 애플리케이션들에 적용되고 있다. AWS에서 설명하는 [RDS vs NoSQL DB 표](https://aws.amazon.com/ko/nosql/)를 살펴보자.

|   | 관계형 데이터베이스  |  NoSQL 데이터베이스 |
|---|---|---|
|최적의 워크로드| 관계형 데이터베이스는 일관성이 뛰어난 온라인 트랜잭션 프로세싱(OLTP) 애플리케이션을 위해 설계되어 온라인 분석 프로세싱(OLAP)에 적합합니다.  | NoSQL 데이터베이스는 낮은 지연 시간의 애플리케이션을 포함한 수많은 데이터 액세스 패턴에 맞도록 설계되었습니다. NoSQL 검색 데이터베이스는 반정형 데이터에서 분석을 위해 설계되었습니다   |
|데이터 모델|관계형 모델은 데이터를 행과 열로 구성된 테이블로 정규화합니다. 스키마는 테이블, 행, 열, 인덱스, 테이블 간 관계, 기타 데이터베이스 요소를 정확하게 규정합니다. 데이터베이스는 테이블 사이의 관계에서 참조 무결성을 실현합니다. |NoSQL 데이터베이스는 키-값, 문서, 그래프 등 성능과 규모 확장에 최적화된 다양한 데이터 모델을 제공합니다. |
|ACID 속성|	관계형 데이터베이스는 원자가, 일관성, 격리성 및 지속성(ACID, atomicity, consistency, isolation, and durability)의 속성을 제공합니다 1) 원자가는 완벽하게 실행하거나 혹은 전혀 실행하지 않는 트랜잭션을 필요로 합니다. 2) 일관성은 트랜잭션이 커밋되면 데이터가 데이터베이스 스키마를 준수하도록 요구합니다. 3) 격리성은 동시에 일어나는 트랜잭션들이 각기 별도로 실행되어야 함을 의미합니다. 4) 내구성은 예기치 못한 시스템 장애 또는 정전 시 마지막으로 알려진 상태로 복구하는 기능을 필요로 합니다.|NoSQL 데이터베이스는 흔히 수평으로 확장할 수 있는 보다 유연한 데이터 모델을 위해 관계형 데이터베이스의 일부 ACID 속성을 완화함으로써 조정합니다. 이로써 NoSQL 데이터베이스는 단일 인스턴스의 한계를 넘어 수평으로 확장해야 하는 사용 사례에서 높은 처리량, 낮은 지연 시간을 위한 탁월한 선택이 됩니다.|
|성능|	성능은 일반적으로 디스크 하위 시스템에 따라 다릅니다. 최고 성능을 달성하기 위해서는 쿼리, 인덱스 및 테이블 구조를 자주 최적화해야 합니다.|성능은 일반적으로 기본 하드웨어 클러스터 크기, 네트워크 지연 시간 및 호출 애플리케이션의 기능입니다.|
|확장|	관계형 데이터베이스는 일반적으로 하드웨어의 계산 성능을 높이거나 읽기 전용 워크로드의 복제물을 추가함으로써 확장됩니다.|NoSQL 데이터베이스는 일반적으로 거의 무제한적인 범위에서 일관된 성능을 제공하는 처리량 제고를 위해 분산형 아키텍처를 사용해 액세스 패턴이 확장 가능하기 때문에 분할성이 있습니다.|
|API|데이터를 저장 및 검색하기 위한 요청은 **SQL(구조화 질의 언어)** 을 준수하는 쿼리를 사용하여 전달됩니다. 쿼리는 관계형 데이터베이스에 의해 구문 분석되고 실행됩니다.|**객체 기반 API**를 통해 앱 개발자가 데이터 구조를 쉽게 저장 및 검색할 수 있습니다. 파티션 키를 사용하면 앱에서 키-값 페어, 열 세트 또는 일련의 앱 객체 및 속성을 포함하는 반정형 문서를 검색할 수 있습니다.|


## NoSQL의 종류
NoSQL에는 여러 가지 종류가 있다. 여기서는 대표적인 3가지만 소개하려고 한다.

![databases](https://user-images.githubusercontent.com/43839938/91643449-48637080-ea6e-11ea-8950-989d5367f716.png)


### 1. Key-Value: DynamoDB, Redis(In-memory), Cassandra(이는 Wide Column DB로 분류되기도 함)
#### 특징
- 키를 고유한 식별자로 사용하는 키-값 쌍의 집합으로 데이터를 저장한다.
- 일반적으로 키-값 데이터베이스는 관계형 데이터베이스에 비하여 페이지당 제공하는 [오버헤드](https://ko.wikipedia.org/wiki/%EC%98%A4%EB%B2%84%ED%97%A4%EB%93%9C)가 적다. (데이터 양이 많아져도 일관적인 성능을 갖는다.)

#### 구조
![key-value](https://user-images.githubusercontent.com/43839938/91649679-52f32980-eab1-11ea-8088-fcb0b23f7ff2.png)

#### 사례
- 대량의 multi-player 온라인 게임에서 각 플레이어들의 세션(레벨, 상태 등)을 관리할 때
- 온라인 쇼핑의 장바구니를 관리할 때 (이후의 주문 트랜젝션은 RDB를 사용하는게 좋다.)


### 2. Document Database: MongoDB, CouchDB 등
#### 특징
- schema 없이 임의의 property 를 추가할 수 있다. (유연한 구조)
- 개발자들이 자신의 애플리케이션 코드에서 사용하는 것과 동일한 문서 모델 형식을 사용하여 데이터베이스에서 보다 손쉽게 데이터를 저장하고 쿼리할 수 있다. (JSON이나 XML 같은 문서 데이터를 저장할 수 있다.)

#### 구조
다음은 책들을 저장해 놓은 Document DB의 예시이다. 
```json
[
    {
        "year" : 2013,
        "title" : "Turn It Down, Or Else!",
        "info" : {
            "directors" : [ "Alice Smith", "Bob Jones"],
            "release_date" : "2013-01-18T00:00:00Z",
            "rating" : 6.2,
            "genres" : ["Comedy", "Drama"],
            "image_url" : "http://ia.media-imdb.com/images/N/O9ERWAU7FS797AJ7LU8HN09AMUP908RLlo5JF90EWR7LJKQ7@@._V1_SX400_.jpg",
            "plot" : "A rock band plays their music at high volumes, annoying the neighbors.",
            "actors" : ["David Matthewman", "Jonathan G. Neff"]
        }
    },
    {
        "year": 2015,
        "title": "The Big New Movie",
        "info": {
            "plot": "Nothing happens at all.",
            "rating": 0
        }
    }
]
```
#### 사례
- 카탈로그 정보를 저장할 때: 가령 전자 상거래 애플리케이션에서 제품마다 일반적으로 속성 수가 다른데, RDB에서는 모든 속성을 고려해야 했다면(RDB에서 수천 개의 속성을 관리하는 것은 비효율적이며 읽기 성능에 영향을 미친다.) Document DB는 각 제품에 맞게 속성을 부여할 수 있다.

### 3. Graph Database: AllegroGraph, neo4j 등
#### 특징
- 그래프 데이터베이스는 node를 사용하여 데이터 엔터티를 저장하고 edge로는 엔터티 간의 관계를 저장한다.
- 노드 간의 관계가 쿼리 시간에 계산되지 않고 데이터베이스에 유지되기 때문에 조인 또는 관계를 순회하는 것이 매우 빠르다.
- 직관적인 쿼리를 짤 수 있다.

#### 구조
동일한 스포츠를 follow한 다른 사람이 구매한 제품을 다른 사용자에게 추천 할 수 있다. 또는 친구가 있지만 아직 서로를 알지 못하는 사람을 식별한 다음 친구 추천을 할 수 있다. 
![graph](https://user-images.githubusercontent.com/43839938/91651332-75437200-eac6-11ea-9afd-d7a203262907.png)

#### 사례
- 추천 엔진: 그래프 데이터베이스를 사용하면 고객 관심사, 친구 및 구매 내역과 같은 정보 범주 간의 관계를 그래프로 저장할 수 있다. 


## 실제 사례: 하나의 Application에 여러 가지 DATABASE를 사용하는 사례

### Airbnb
![airbnb](https://user-images.githubusercontent.com/43839938/91651726-116f7800-eacb-11ea-885a-fd8b7fee6ec1.png)


### duolingo
![duolingo](https://user-images.githubusercontent.com/43839938/91651712-f1d84f80-eaca-11ea-948e-309bf5420473.png)


> In-memory: 가령, 베스트셀러(leader board) 리스트를 뽑아야 한다고 가정하자. 관련 모든 Table을 스캔해야하고 group by, order by, ... 등 매번 저 베스트 셀러를 조회하는 API를 요청할 때마다 이 작업을 반복해야 한다. 게다가 Order가 늘어날 수록 Query Performance는 더 느려진다. 따라서 미리 베스트셀러 리스트를 저장해놓고, Order가 늘어날 때 그 리스트와 함께 처리하도록 한다. [Redis](https://aws.amazon.com/ko/redis/)가 대표적인 DB이다.

## 결론, 하나의 어플리케이션에서 각 서비스에 맞는 DB를 선택하자
RDB와 NoSQL은 경쟁의 관계가 아니라 상생의 관계다. 각 특성에 맞게 적절히 사용한다면 보완적인 관계를 극대화 할 수 있다.
NoSQL은 특정 목적에 맞게 종류가 다양하듯(a purpose-built strategy for databases) 구현할 서비스를 세분화하고 각각의 목적을 고려해 어떤 DB를 사용하는 것이 좋을지 선택해야 한다. 이 문서에서는 이런 선택의 기준을 제시하기 위해 여러 종류의 DB를 살펴봤다.

---
#### Reference
- [NoSQL이란?](https://aws.amazon.com/ko/nosql/)
- [NoSQL이란 무엇인가?](https://www.samsungsds.com/global/ko/support/insights/1195843_2284.html)
- [SQL vs NoSQL 5분컷 설명!](https://youtu.be/Q_9cFgzZr8Q)
- [Understanding Key-Value Databases](https://www.dataversity.net/understanding-key-value-databases/)
- [NoSQL 개념, 특징과 장점, CAP 이론, 데이터모델 분류](https://sjh836.tistory.com/97)
- [AWS re:Invent 2018: [REPEAT 1] Databases on AWS: The Right Tool for the Right Job](https://youtu.be/-pb-DkD6cWg)
