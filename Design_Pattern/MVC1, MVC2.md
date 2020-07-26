# MVC1 vs MVC2
주제를 무엇으로 하면 좋을까 생각하다가 MVC model에는  `MVC1`, `MVC2` 이렇게 두 가지 모델이 있다는 것을 발견하였다. 

생소한 단어였기 때문에 정리를 해보았다.

## MVC
우선 MVC란 `Model`, `View`, `Controller`의 줄임말로써 사용자와 상호작용하는 S/W를 디자인함에 있어 세 가지 요소로 쪼개어 하는 것을 가리킨다. 

### MVC를 사용하는 이유
비즈니스 로직을 분리하여 애플리케이션의 시각적 요소나 그 이면에서 실행되는 비즈니스 로직을 서로 영향 없이 쉽게 고칠 수 있는 애플리케이션을 만들 수 있기 때문에 사용한다.

예를 들어 디자인이 수시로 바꾸는 경우 로직을 분리하지 않으면 서로 영향 없이 코드를 고치기에는 쉽지 않을 것이다. 

MVC 모델을 사용한다면 유지 보수 및 확장성을 높일 수 있다. 

**1. Model**
> 프로그램의 내부 상태, 내부 비즈니스 로직을 처리하기 위한 역할이다.

**2. Controller**
> 사용자의 입력 처리와 흐름 제어를 담당하고 뷰와 모델을 분리하는 역할을 한다.

**3. View**
> 사용자 인터페이스 요소를 뜻하는데, 유저에게 보여주는 화면을 말한다. 

## MVC1
쉽게 말해 `M+(V+C)`라고 보면 된다.

- 웹 브라우저의 요청을 jsp 페이지가 받아서 처리하는 구조이고, **JSP가 Controller와 View의 기능을 모두 담당**한다.
- jsp 페이지에 비즈니스 로직을 처리하기 위한 코드와 웹 브라우저에 결과를 보여주기 위한 출력 관리 코드가 뒤섞여 있는 구조이다.
- jsp 내부에서 java로 Controller의 기능을 수행한다. view는 HTML과 CSS로 처리하고 event 처리 및 제어는 javascript로 실행한다.
- 재사용이 힘들고, 코드가 뒤섞여 있어 가독성이 떨어진다.
> 많은 프로세싱이 요구되는 대형 프로젝트의 경우 적합하지 않다.

MVC1의 이해를 돕기 위해 [예제](https://itsaessak.tistory.com/64)을 참고하길 바란다. 

![MVC1 model](https://user-images.githubusercontent.com/43868540/88455376-c18c0880-ceaf-11ea-90b2-fcf2be11b7f6.png)
- [출처 creator0609.tistory](https://creator0609.tistory.com/entry/MVC1-MVC2-차이)

### 장점
- 단순해서 **개발 시간 단축**에 유리하다.
- **중소형 프로젝트**에 적합하다.

#### 단점
- 웹 애플리케이션이 복잡해질수록 유지 보수가 힘들어진다.
- 디자이너와 개발자가 원활한 소통이 필요하다.

## MVC2
일반적으로 MVC라고 하면 MVC2모델을 이야기한다고 보면 된다.

- MVC1 구조와 달리 웹 브라우저의 요청을 하나의 `서블릿`이 받게 된다. 여기서 서블릿은 `controller`이다. 
- `서블릿`은 웹 브라우저의 요청을 알맞게 처리한 후 그 결과를 jsp 페이지로 넘기게 된다.
> 서블릿은 웹 프로그래밍에서 클라이언트의 요청을 처리하고 그 결과를 다시 클라이언트에게 전송하는 자바 프로그래밍 
- 요청 처리, 데이터 접근, 비즈니스 로직을 포함하는 **Controller와 View가 엄격히 구분**되어 있다. 
> 대형 프로젝트의 경우에는 적합하나 구조 설계를 위한 충분한 시간이 필요하다. 

MVC2의 예제도 [이곳](https://itstudyroom.tistory.com/entry/MVC2-게시판-2-로그인)을 참고하면 MVC1모델과는 다른 것을 확인할 수 있다.

![MVC2 model](https://user-images.githubusercontent.com/43868540/88455358-a5886700-ceaf-11ea-9be5-38e234dbfd7c.png)
- [출처 creator0609.tistory](https://creator0609.tistory.com/entry/MVC1-MVC2-차이)

### 전체적인 컴포넌트 설계
![전체적인 컴포넌트 설계](https://user-images.githubusercontent.com/43868540/88455435-39f2c980-ceb0-11ea-8123-4e31d9db21e1.png)
- [출처 creator0609.tistory](https://creator0609.tistory.com/entry/MVC1-MVC2-차이)

### 장점
- 비즈니스 로직과 뷰가 분리되어 **유지 보수 및 확장성**이 뛰어나기 때문에 큰 프로젝트에서 사용된다.
- 개발자, 디자이너의 역할이 분리되어 **책임이 분명**해진다.

### 단점
- 개발 초기 비용 증가 및 개발 기간이 늘어난다. 
----
#### Reference
- [MVC1과 MVC2의 개념](https://nickjoit.tistory.com/9)
- [MVC1,2의 장단점](http://blog.naver.com/PostView.nhn?blogId=koliaok&logNo=220566166684&categoryNo=0&parentCategoryNo=0&viewDate=&currentPage=1&postListTopCurrentPage=1&from=postView)
