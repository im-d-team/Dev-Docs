살짝(?) 늦은 감이 있지만 MVC에 대해 정확히 알아보고자 문서를 새로 작성하기로 하였다.

저번 시간에  MVC1, MVC2 model의 차이점을 알아보았는데 사실 MVC1, MVC2 model은 실제로 존재하지 않는다고 한다.

대개 사람들은 MVC2가 우리가 말하는 MVC model이라고 불리는데, 이 둘은 완전히 다른 개념이다.

웹 프로그래밍과 MVC에 대해 차근차근 알아보자.

# 웹 애플리케이션의 디자인 모델
웹 애플리케이션이란, 웹 브라우저와 사용자와 대화하는 대화식으로서 인터넷을 이용하는 일종의 컴퓨터 프로그램을 말한다.

웹 애플리케이션의 디자인에는 일반적으로 두 가지의 디자인 모델이 있다.

바로 `Model 1 JSP programming`, `Model 2 JSP programming`이다. 
이것이 MVC1, MVC2라고 불리게 된 원인이다.

## Model 1 JSP programming

### Servlet
> JAVA 코드 내에  HTML 코드 삽입

![servlet](https://user-images.githubusercontent.com/43868540/99893233-df804300-2cc0-11eb-9514-78cc6c21b25d.PNG)

> [출처 mingyu0403.tistory](https://mingyu0403.tistory.com/49)

처음에 웹 개발은 `Sevlet`을 이용하여 개발하였다. 서블릿은 자바를 이용해서 작성하기 때문에 자바언어에 대한 지식을 가지고 있어야 했다. 하지만 웹 디자이너들은 쓰여진 JAVA 코드를 이해해야했고 코드를 유지하면서 프레젠테이션 로직을 변경하는 것이 어려웠다. 또한, `Sevlet`을 이용한 웹 페이지는 코드가 수정되면 다시 .class 파일을 컴파일을 해야 하는 단점이 있었다.

### JSP
> HTML 코드 내에 JAVA 코드 삽입

![jsp](https://user-images.githubusercontent.com/43868540/99893226-c7a8bf00-2cc0-11eb-8be9-46139aeb99b9.PNG)

> [출처 mingyu0403.tistory](https://mingyu0403.tistory.com/49)

이 문제를 해결하기 위해서 `Sevlet` 대 `JSP`개념이 등장하게 되었고 디자이너는 JAVA 지식을 가질 필요가 없어졌다. 또한, `JSP`를 활용해 웹 디자이너는 프레젠테이션 로직만 따로 기술해 코드를 유지하기가 쉬워졌다.

이것이 바로 `Model 1 JSP programming`이라고 불려왔고 `MVC1`이라고도 불렸다.

![JSP Model 1](https://user-images.githubusercontent.com/43868540/99762801-a919bb00-2b3c-11eb-9abc-0dbcaab37dea.png)

> [출처 wikipedia](https://en.wikipedia.org/wiki/JSP_model_1_architecture)

1. 브라우저가 JSP 페이지에 대한 요청을 보낸다.
2. JSP는 Java Bean에 액세스하고 비즈니스 로직을 호출한다.
3. Java Bean은 데이터베이스에 연결하고 데이터를 가져오거나 저장한다.
4. 응답은 JSP에 의해 생성된 브라우저로 전송된다.

하지만 `JSP`를 이용한 프로그래밍도 단점이 있다. 개발자들은 `JSP`를 이용해 데이터베이스에서 접근하였고 `Sevlet`역할도 하였다. 따라서 요청 처리, 데이터 유효성 검사, 비즈니스 로직 처리 및 응답 등 요청에 대한 모든 책임을 `JSP`에서 처리하였다. 즉, 프레젠테이션 로직과 비즈니스 로직을 분리하지 못하였다.

## MVC
프레젠테이션 로직과 비즈니스 로직을 분리하기 위해 Trygve Reenskaug가 `MVC` 패턴을 발명하였다.
`MVC`는 Model-View-Controller로 이루어져 프로그램 로직을 나누고 개발하는 소프트웨어 설계 패턴이다.

따라서
- `Sevlet`이 `Controller`역할을 하여 프레젠테이션 로직과 비즈니스 로직 사이의 상호 동작을 관리한다.
- 기존에 `JSP`에 쓰였던 프레젠테이션 로직을 `View`에 기술하여 인터페이스 요소를 나타내고
- 데이터베이스에 접근하기 위해 `Bean`을 작성해 `Model`역할을 한다.

이렇게 로직을 분리해 대규모 프로그램을 개발하고 유지 보수하기에 수월해졌다.

1. 브라우저가 요청을 보내고 Contoller(SERVLET)로 전달한다.
2. 요청받은 Controller는 비즈니스 요구사항을 충족하는 데 필요한 모델(Bean)을 가져온다.
3. 응답 프레임을 설정하고 응답을 뷰 구성요소(JSP)로 전달한다.

## Model 2 JSP programming
이렇게 로직을 분리하여 개발한 프로그래밍이 `Model 2 JSP programming`이라고 한다. 이것 또한 역시 `MVC2`라고 잘못 불린 개념이다. 
`Model 2`는 비즈니스 로직과 프레젠테이션 로직을 분리하므로 일반적으로 MVC ( 모델-뷰-컨트롤러 ) 패러다임을 활용한 모델이라고 할 수 있다.

![Model 2 JSP programming](https://user-images.githubusercontent.com/43868540/99875933-9b486080-2c36-11eb-86bd-38d38b4d2058.PNG)

>[출처 wikipedia](https://en.wikipedia.org/wiki/JSP_model_2_architecture#cite_note-5)

`Model 2`는 로직을 `JSP`에서 분리하여 `Sevlet`에 배치하고 `Sevlet`이 `Controller` 로 이용된다.
`Controller`는 사용자로부터 응답을 받아 로직을 수행하고 `Model`을 가져온다. 그 후에 응답을 전달받은 `View`는 사용자에게 응답을 보여준다.

이처럼 복잡한 설계 패턴 때문에 중형 및 대형 애플리케이션에 권장된다.

# 오해
일반적으로 사람들에게 널리 알려진 `MVC2`라는 개념은 `MVC` 패턴에서 발전된 차세대 패턴이라는 잘못된 믿음을 주기 쉽다.
하지만 이는 `MVC`패턴을 이용한 `Model 2 JSP programming`이었고 `MVC2`라는 용어는 남용되고 있었다는 것을 알 수 있었다.
아마 `model2` 용어가 너무 길기 때문에 줄여서 부르다 보니 만들어진 해프닝인 것 같다.

아직 많은 사람이 MVC 패턴이 MVC2 모델이라고 알고 있고 나 또한 그랬었다. 이번 시간을 통해 정확히 개념을 바로잡는 시간이 되었기를 바란다.

잘못된 개념을 바로 잡아준 @Dae-Hwa 님께 감사합니다 :)

----
#### Reference
- [JSP 모델 1 아키텍쳐](https://en.wikipedia.org/wiki/JSP_model_1_architecture)
- [JSP 모델 2 아키텍쳐](https://en.wikipedia.org/wiki/JSP_model_2_architecture#cite_note-5)
- [MVC 패턴](https://ko.wikipedia.org/wiki/%EB%AA%A8%EB%8D%B8-%EB%B7%B0-%EC%BB%A8%ED%8A%B8%EB%A1%A4%EB%9F%AC)
- [MVC1과 MVC2의 차이](https://technicalrecyclebin.wordpress.com/2012/11/14/difference-between-mvc1-and-mvc2/)
- [Model 1 vs Model 2](https://www.oreilly.com/library/view/programming-jakarta-struts/0596006519/ch01s04.html)
