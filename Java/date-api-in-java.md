# Java의 날짜 API

JDK8 이전의 Java에서는 `java.util.Date` 클래스와 `java.util.Calendar` 클래스를 이용하여 날짜를 다룬다. 하지만 이는 사용하기 불편하기 때문에 대체하는 여러 라이브러리가 나왔는데, JDK8 이후에는 이를 반영한 개선된 API를 제공한다.

날짜와 시간 계산은 사회 제도나 과학과 복잡하게 얽혀있다. Java의 API들도 마찬가지로 이에 따른 영향을 받는다. Java의 API들을 본격적으로 살펴보기 전에 그 배경을 잠깐 살펴보고, JDK8이전의 날짜 API와 이후의 API를 살펴보자.

## 율리우스력과 그레고리력

### 최초의 달력과 율리우스력

날짜는 고대 농경사회에서 비슷한 기후나 온도를 기억하기 위해 만들어졌다. 최초의 달력은 이집트에서 만들어졌는데 이집트 사람들의 경우 4년마다 1일의 윤일이 있어야 한다는 사실을 알고 있었지만 이를 적용하지는 않았다고 한다. 이는 로마 시대까지 이어져 1년 355일짜리 달력을 사용하였는데, 날짜가 계속해서 틀어지는 것을 발견했다. 1년이 365.25일인 것을 확인한 뒤 4년마다 하루를 끼워 넣는 방식으로 사용하기 시작했고, 홀수달은 31일, 짝수달은 30일로 맞추었다. 이렇게 계산하면 1년이 366일이 되는데, 당시에는 3월이 1년의 시작이었기 때문에 1년의 마지막 달인 2월에서 하루를 빼 29일로 만들었다. 이것이 율리우스력이다.

>   율리우스력에서 8월(august)은 짝수월인데도 31일까지 있다. 이는 로마제국 황제였던 옥타비아누스가 아우구스투스라는 칭호를 사용하며 2월에서 하루를 빼 8월에 더해줬기 때문이다.

>   이름이 율리우스력인 이유는 날짜 개혁을 진행했던 초대 로마제국 황제의 이름이 '가이우스 율리우스 카이사르 옥타비아누스'였기 때문이다.

>   당시 3월이 한 해의 시작(1월) 이었는데, 옥타비아누스 이전 로마 공화국의 율리우스 카이사르가 집정관에 빨리 취임하기 위해 11월(january)을 1월로 바꾸었고, 10월(december)은 12월이 되었다.

### 율리우스력의 오차와 그레고리력

율리우스력은 기존의 달력체계보다 정교했지만, 한 가지 놓친 부분이 있었는데, 정확한 1년은 365.24219일이라는 것이다. 기존의 달력을 사용하면 400년이 지나면 3일이 넘는 오차가 생기는데, 이것이 누적되며 1582년에는 12일의 오차가 생겼고, 이를 없애고자 한 것이 그레고리력이다. 참고로, 12일의 오차가 생겼지만, 사람들의 혼동을 최소한으로 하기 위해 10일을 건너뛰는 것으로 결정했다.

그레고리력은 1582년 교황 그레고리 13세가 제정한 달력이다. 기본적 틀은 율리우스력과 같지만 위에서 계산한 약 3일의 차이를 없애기 위해 100의 배수가 되는 해의 윤년을 없앤다. 그렇게 되면 400년간의 오차가 정확히 4일이 되기 때문에 400의 배수가 되는 연도에는 윤년을 넣는다. 이것이 그레고리력이고 현대의 달력은 이를 기반으로 한다.

>   100년, 200년, 300년은 윤년 없이 넘어가고 400년에만 윤년을 적용하면 400년 동안 윤년이 97일이 된다. 이를 적용하지 않으면 400년간의 윤년은 100일이 되는데 이를 이용하여 3일의 오차를 없앤 것이다.

>   그레고리력도 365.24219일을 반올림하여 365.24일로 계산한 것이기 때문에 수만 년이 지나면 달력을 수정해야 한다. 이는 오늘날까지도 그레고리력의 문제점으로 꼽히고 있다.

## Java의 달력 API

### Calendar 클래스

글을 시작하며 `java.util.Date` 클래스와 `java.util.Calendar` 클래스를 이용하여 날짜를 다룬다. 하지만 이는 사용하기 불편하다고 했다. 왜 그런지 알아보자.

#### 불규칙

`Calendar` 클래스의 경우 위에서 살펴본 율리우스력과 그레고리력뿐만 아니라 여러 가지 사회 제도나 과학과 얽혀있다. 따라서 불규칙이 곳곳에 숨어있는데, 대표적인 몇 가지 사례가 있다.

우선 UTC(Universal Time Coordinated, 세계협정시) 시간대를 기준으로 1582년 10월 4일에 하루를 더하면 1582년 10월 15일이 된다.

```java
public void calendarTest_UTC() {
    TimeZone utcTimeZone = TimeZone.getTimeZone("UTC");
    Calendar calendar = Calendar.getInstance(utcTimeZone);
    // 처음 날짜 - 1582년 10월 4일
    calendar.set(1582, Calendar.OCTOBER, 4);
    
    String pattern = "yyyy.MM.dd";    
    SimpleDateFormat format = new SimpleDateFormat(pattern);
    format.setTimeZone(utcTimeZone);
    String theDay = format.format(calendar.getTime());
    System.out.println(theDay); // "1582.10.04"
    
    // 하루를 더해준다.
    calendar.add(Calendar.DATE, 1);
    String nextDay = format.format(calendar.getTime());
    System.out.println(nextDay); // "1582.10.15"
}
```

 이는 위에서 살펴봤던 그레고리력에서 건너뛴 10일 때문이다. 위에서 사용한 `Calendar.getInstance()` 메소드는 `java.util.GregorianCalendar` 클래스의 인스턴스를 반환한다. `GregorianCalendar ` 클래스는 그레고리력과 율리우스력을 같이 구현하고 있는데, AD 4년의 3월 1일 이전에는 윤년을 불규칙하게 두어 `GregorianCalendar ` 클래스로 구한 날짜는 정확하지 않다고 한다.

>   위에서 살펴본 내용은 `GregorianCalendar ` 클래스의 [API 문서](https://docs.oracle.com/javase/8/docs/api/java/util/GregorianCalendar.html)에 나와있다.

`Calendar.getInstance()` 메소드는 이외에도 Locale 설정에 따라 `JapaneseImperialCalendar`, `BuddhistCalendar ` 등도 반환한다.

우리나라 날짜(Asia/Seoul 시간대)의 경우 1961년 8월 9일 23시 59분의 1분 후를 계산할 경우 불규칙이 발생한다.

```java
public void calendarTest_AsiaSeoul() {
    TimeZone seoulTimeZone = TimeZone.getTimeZone("Asia/Seoul");
    Calendar calendar = Calendar.getInstance(seoulTimeZone);
    // 처음 날짜 - 1961년 8월 9일 23시 59분
    calendar.set(1961, Calendar.AUGUST, 9, 23, 59);
    
    // 하루를 더해준다.
    calendar.add(Calendar.MINUTE, 1);
    
    String pattern = "yyyy.MM.dd HH:mm";    
    SimpleDateFormat format = new SimpleDateFormat(pattern);
    format.setTimeZone(seoulTimeZone);
    
    String nextDay = format.format(calendar.getTime());
    System.out.println(nextDay); // "1961.08.10 00:30"
}
```

이외에 Asia/Seoul TimeZone에서 1988년 5월 8일 1시의 1시간 후를 계산하면 5월 8일 3시가 된다. 이는 일광 절약 시간제(서머타임) 적용 때문이다. 

>   현재 우리나라에서는 일광 시간 절약 제를 사용하지 않지만, 이전에 시행했던 기간은 [여기에](https://ko.wikipedia.org/wiki/%EC%9D%BC%EA%B4%91_%EC%A0%88%EC%95%BD_%EC%8B%9C%EA%B0%84%EC%A0%9C#%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD) 정리되어 있다.

마지막으로 UTC 2012년 6월 30일에는 윤초가 적용되어야 하는데, `Calendar` 클래스에서는 구현되지 않았다. 이 때문에 당시 Java 기반의 서버나 Cassandra, Hadoop, Elasticsearch 등을 사용하는 많은 시스템에서 장애를 일으켰다고 한다.

>   참고 - ["윤초 때문에…" 포스퀘어-링크드인 장애](https://zdnet.co.kr/view/?no=20120702094444)

>   윤초의 경우 이후에 나온 라이브러리나 API에서도 적용되지 않았는데, 윤초를 동기화할 경우 많은 오류를 동반할 가능성이 크기 때문으로 보인다.

#### 불변(immutable) 객체가 아니다

VO(value object)는 값에 의해 동등성이 판단되어야 한다. 따라서 불변 객체로 생성되어야 별칭(alias) 문제, 스레드 불안정성 등에서 자유로워지고, 여러 객체에서 공유되어도 안전해진다. C#, Python 등의 언어에서는 날짜 클래스가 한 번 생성된 이후에 내부 속성을 변경할 수 없는 불변 객체로 생성된다. 반면, Java의 기본 날짜, 시간 클래스는 불변 객체가 아니다. `Calendar`클래스와 `Date` 클래스에는 값을 변경할 수 있는 setter 메소드가 존재한다. 따라서 안전하게 구현하기 위해서 방어복사 기법을 사용하는 것이 바람직하다.

```java
public class DateSample {
    private final Date wrongDateSample;
    private final Date rightDateSample;
    
    public DateSample(Date wrongDateSample, Date rightDateSample) {
        this.wrongDateSample = wrongDateSample;
        this.rightDateSample = new Date(rightDateSample.getTime());
    }
    
    public Date getWrongDateSample() {
        return wrongDateSample;
    }
    
    public Date getRightDateSample() {
        return new Date(rightDateSample.getTime());
    }
}
```

>   `wrongDateSample` 필드처럼 사용되는 경우 정적 분석 도구에서 취약점으로 판단한다고 한다.

#### int 상수 필드의 남용

`Calendar`를 사용하여 날짜를 할 경우, 위에서 살펴봤던 예제들처럼 첫 번째 매개변수로 `Calendar.SECOND` 와 같은 상수 필드를 사용해야 한다. 하지만 이는 int 타입의 숫자로 구현되어 있어 엉뚱한 숫자나 상수를 넣어도 컴파일 시점에서 확인하기 힘들다.

```java
calendar.add(Calendar.HOUR, 1); // Calendar.HOUR의 값은 10(int)이다.
calendar.add(10, 1); // ?
calendar.add(Calendar.NOVEMBER, 1); // ???
```

위의 예시에서 세 가지 코드 모두 같은 동작을 한다. 즉, 의도하지 않은 동작이 이루어질 수 있다.

#### 헷갈리는 월 지정

위의 예시에서 `Calendar.NOVEMBER`는 11월을 의미하지만 실제로 값은 10이다. 이는 `Date` 클래스와 `Calendar` 클래스는 1월을 0으로 표현했기 때문인데, 이를 인지하지 못하거나 깜빡한다면 다음과 같은 실수를 할 수 있다.

```java
calendar.set(1582, 10 , 4);  // 1582년 10월 4일을 원했으나, 실제로는 11월 4일이 저장될 것이다.
```

#### 일관성 없는 요일 상수

`Calendar` 클래스에서는 일요일을 1로 표현했지만, `Date` 클래스의 경우 일요일을 0으로 표현한다.

#### 불편한 역할 분담

JDK1.1 이후 `Calendar` 클래스가 생기면서 날짜 간의 연산 혹은 국제화 지원 등의 역할은 `Calendar` 클래스에서 담당하게 되었고 `Date` 클래스에서 기존에 사용하던 많은 기능이 deprecated 되었다.

이로 인해 특정 시간대를 생성하기 위해 `Calendar` 클래스를 이용하여 값을 지정하거나 연산하고 다시 `Date` 객체를 반환하여 저장해야 한다. 특히 `Calendar` 클래스는 생성 비용이 비싼 편이기 때문에 불필요한 `Calendar` 클래스의 생성은 비효율적이다. 또한, `Date` 연산에 쓰이는 다른 라이브러리 또한 `Calendar` 클래스를 생성한다.

#### 예외가 발생하지 않는 시간대 ID 지정 오류

```java
TimeZone zone = TimeZone.getTimeZone("Seoul/Asia"); // Asia/Seoul 이 올바른 시간대 ID이다.
```

위와 같이 시간대 ID를 잘못 입력한 경우 시간대 ID가 `GMT`로 지정된다. 에러가 발생하지 않기 때문에 관련된 오류를 찾아내기 힘들어진다.

#### 잘못된 하위 클래스

`java.sql.Date` 클래스는 `java.util.Date`클래스를 상속한 클래스이다. 자식 클래스와 부모 클래스의 이름이 같은데, 기본 클래스로 사용된다. `java.sql.TimeStamp` 클래스 또한 `java.util.Date` 클래스를 상속받은 클래스인데, 나노초(nanosecond) 필드가 추가돼있다. 이 클래스는 `equals()` 메소드의 대칭성을 어기며 작성되었다. 따라서 `Date` 타입과 `TimeStamp` 타입을 섞어 쓰면 `a.equals(b)` 와 `b.equals(a)` 의 값이 서로 다른 경우가 생길 수 있다.

>   참고 - [Compare Date object with a TimeStamp in Java](https://stackoverflow.com/questions/8929242/compare-date-object-with-a-timestamp-in-java)

>   `java.sql.Date` 클래스의 경우 `Comparable` 인터페이스 재정의가 되지 않고 상위 클래스에서만 이루어져 관련 제네릭 설정이 복잡하다고 하는데, 간단한 테스트 시에는 큰 문제를 발견하지 못했다.

### JSR-310

JDK8 부터 JSR-310이라는 새로운 표준 명세 및 날짜와 시간에 대한 API가 추가되었다. [Joda-Time](https://www.joda.org/joda-time/)에 가장 큰 영향을 받았고, [Time and Money](http://timeandmoney.sourceforge.net/)나 [ICU](http://site.icu-project.org/home) 등의 오픈소스 라이브러리를 참고하여 만들었다고 한다. 위에서 살펴봤던 예제들을 다시 구현하며 새로운 날짜 API를 살펴보자.

```java
public void jsr310Test_UTC() {
    LocalDate theDay = IsoChronology.INSTANCE.date(1582, 10, 4);
    String pattern = "yyyy.MM.dd";
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
    System.out.println(theDay.format(formatter)); // 1582. 10. 04

    LocalDate nextDay = theDay.plusDays(1); // 새로운 객체 반환
    System.out.println(nextDay.format(formatter)); // 1582. 10. 05
    
    ZonedDateTime utcDay = theDay.atStartOfDay(ZoneId.of("UTC")); // 타임존이 명시 된 날짜로 변환
    System.out.println(utcDay.plusDays(1).format(formatter)); // 1582. 10. 05
}
```

기본적으로 날짜를 초기화하는 소스가 훨씬 직관적이게 되었다. 사용되는 format 생성 클래스도 생성자가 아닌, 팩토리 메소드를 사용한다. 특히 날짜를 더하는 부분은 날짜를 더하게 되면 새로운 객체를 반환하게 하여 불변 객체를 유지할 수 있도록 설계됐음을 알 수 있다. 만약 시간대(timezone) 설정이 필요하다면 `ZonedDateTime`을 사용하면 된다.

```java
public void jsr310Test_AsiaSeoul_movedTimeZone() {
    ZoneId seoulTimeZone = ZoneId.of("Asia/Seoul");
    ZonedDateTime theTime = ZonedDateTime.of(1961, 8, 9, 23, 59, 59, 0, seoulTimeZone);
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm");
    System.out.println(theTime.format(formatter)); // "1961.08.09 23:59"

    ZonedDateTime after1Minute = theTime.plusMinutes(1);
    // 시간대가 변경되며 발생한 불규칙에 대한 개선은 이루어지지 않았다.
    System.out.println(after1Minute.format(formatter)); // "1961.08.10 00:30"
}
```

```java
public void jsr310Test_AsiaSeoul_summerTime() {
    ZoneId seoulTimeZone = ZoneId.of("Asia/Seoul");
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm");
    ZonedDateTime beforeSummerTime = ZonedDateTime.of(1988, 5, 8, 1, 0, 0, 0, seoul);
    System.out.println(beforeSummerTime.format(formatter));
    // ZoneRules 클래스를 이용하여 서머타임인지 확인할 수 있도록 개선되었다.
    ZoneRules seoulTimeZoneRules = seoul.getRules();
    System.out.println(seoulTimeZoneRules.isDaylightSavings(Instant.from(beforeSummerTime)));

    ZonedDateTime afterSummerTime = beforeSummerTime.plusHours(1);
    System.out.println(afterSummerTime.format(formatter));
    System.out.println(seoulTimeZoneRules.isDaylightSavings(Instant.from(afterSummerTime)));
}
```

월이나 날짜 등을 잘못 입력하면 예외가 발생한다.

```java
public void jsr310Test_wrongDate() {
    LocalDate.of(2020, 11, 31); // java.time.DateTimeException: Invalid date 'NOVEMBER 31'
    ZoneId.of("Seoul/Asia"); // java.time.zone.ZoneRulesException: Unknown time-zone ID: Seoul/Asia
}
```

이외에도 요일의 경우 아예 `DayOfWeek`라는 enum 클래스로 만들어버렸으며, 나노초 단위의 정밀성을 가지도록 하였다. 또한, 시계의 개념도 도입되어 시간과 관련된 기능을 테스트할 때도 유용하게 쓰인다고 한다.

Spring 프레임워크는 4.0부터 JSR-310을 기본 지원한다. `ZoneDateTime`을 Controller에서 받아오면 문자열을 날짜 객체로 자동변환해준다. 굳이 `String`으로 받아온 값을 변환해주는 번거로운 작업을 해주지 않아도 된다.

## 마치며

JDK8이 나온 지 꽤 되었기 때문에 새로 나온 API라고 하기에도 민망하지만, 아직도 기본 제공되는 날짜 관련 클래스를 사용하는 경우가 있다. JSR-310에 확실한 개선점들이 있다. 뿐만 아니라 JDK8 이전의 버전에서 사용할 수 있는 백포팅 모듈도 있기 때문에 이를 사용하는 것이 보다 바람직할 것이며, 최신 버전의 Spring 프레임워크 및 Spring boot에서는 이에 대한 지원도 잘 되어있어 편하게 사용할 수 있다. 

>   참고 - [ThreeTen Backport](https://www.threeten.org/threetenbp/)

본문에서는 날짜 API에 대한 이해, 기존 API의 문제점과 새로운 API의 개선점 등을 알아보았다. 이외에 보다 자세한 사용법을 알고 싶다면 [여기](https://wickso.me/java/java-8-date-time/)에 잘 정리가 되어있어 참고하면 좋을 것 같다. 혹은 다른 기능들을 살펴보고 싶다면 

[Package java.time](https://docs.oracle.com/javase/8/docs/api/java/time/package-summary.html)을 참고하자.



---

#### References

-   [달력이야기 <율리우스력 그레고리력>](https://m.post.naver.com/viewer/postView.nhn?volumeNo=12082924&memberNo=6178993)
-   [[호기심으로 배우는 역사] 달력의 유래와 역사 (2) - voakorea](https://www.voakorea.com/archive/35-2010-01-06-voa27-91423439)
-   [Java의 날짜와 시간 API - Naver D2](https://d2.naver.com/helloworld/645609)
