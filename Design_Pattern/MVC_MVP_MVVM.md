# MVC, MVP, MVVM

간단하게 많이 사용하는 패턴을 정리를 해보자.
<br/>

웹개발시 쓰이는 패턴들은 다양하게 존재한다.<br/>
그 중에서 3개를 보게되면 공통점은 모두 화면에 보여주는 로직과 실제 데이터가 처리 되는 로직이 분리되어 있다는 것이다.
<br/>

솔직히 패턴을 사용하지 않고도 충분히 짤 수는 있겠지만 모든 것은 나중에 한 번에 터지듯이 쌓이다 보면 한꺼번에 리팩토링을 하기에는 무리가 있는 것이다.
<br/>

## **MVC (Model + View + Controller)**

MVC 패턴은 3가지의 요소로 구성이 되어있다.
<br/>

- Controller : 사용자의 입력을 받고 처리하는 부분
- Model : 프로그램에서 사용되는 실제 데이터 및 데이터 조작 로직을 처리하는 부분
- View : 사용자에게 제공되어 보여지는 UI 부분

<br/>

처음 알게된 패턴이 바로 이 패턴이었다. 당시 내용은 스프링으로 작업을 할 때 많이 봤었다. 
<br/>

![MVC](https://github.com/SeonHyungJo/FrontEnd-Dev/blob/master/assets/image/MVC.png?raw=true)

<br/>

1. 사용자가 처음 주소를 입력하고 Enter를 누르게 되면 `Controller`에 먼저 요청이 들어간다.
2. 이에 `Controller`는 해당 주소에 맞는 데이터를 `Model`에 요청을 하며 불러오게 되고,
3. `Model`은 해당 데이터들을 보여줄 `View`를 선택해서 화면에 보여주게 된다.

<br/>

**MVC의 단점은 View와 Model이 서로 의존적이라는 점이다.**
<br/>

## **MVP (Model + View + Presenter)**

여기서는 한눈에 보아도 눈에 띄는 것은 바로 `Presenter`입니다.
<br/>

- Presenter : `View`에서 요청한 정보를 `Model`로 부터 가공해서 `View`로 전달하는 부분
- Model : 프로그램에서 사용되는 실제 데이터 및 데이터 조작 로직을 처리하는 부분
- View : 사용자에게 제공되어 보여지는 UI 부분

<br/>

이제 사용자의 입력의 시작은 `View`에서 시작을 한다. 이에 `Presenter`는 `Model`과 `View`의 중간자 역할을 한다. 데이터를 처리하는 `Model`과 `View`는 서로 의존성이 떨어지게 된다.
<br/>

![MVP](https://github.com/SeonHyungJo/FrontEnd-Dev/blob/master/assets/image/MVP.png?raw=true)

<br/>

1. `View`로 사용자의 입력이 들어옵니다.
2. `View`는 `Presenter`에 작업 요청을 합니다.
3. `Presenter`에서 필요한 데이터를 `Model`에 요청 합니다.
4. `Model`은 `Presenter`에 필요한 데이터를 응답 합니다.
5. `Presenter`는 `View`에 데이터를 응답 합니다.
6. `View`는 `Presenter`로부터 받은 데이터로 화면에 보여주게 됩니다.

<br/>

이것의 단점은 이제 `Model`과 `View`의 의존성은 떨어지게 되었지만 **`View`와 `Presenter`가 1:1로 강한 의존성을 가지게 된다는 것입니다.**
<br/>

## **MVVM (Model + View + ViewModel)**

이제는 `Presenter`, `Controller`대신하여 `ViewModel`이라는 것이 생겼습니다.
<br/>

- ViewModel : `View`를 표현하기 위해 만들어진 `View`를 위한 `Model`
- Model : 프로그램에서 사용되는 실제 데이터 및 데이터 조작 로직을 처리하는 부분
- View : 사용자에게 제공되어 보여지는 UI 부분

<br/>

`MVVM`은 **2가지 디자인 패턴을 사용한다고 한다.** 바로 `Command패턴`과 `DataBinding`입니다.
<br/>

위의 2가지 패턴으로 인해 `View`와 `ViewModel`은 의존성이 완전히 사라지게 됩니다.
<br/>

`MVP`과 마찬가지로 `View`에서 입력이 들어오며, 입력이 들어오게 되면 `Command`패턴을 통해 `ViewModel`에 명령을 내리게 되고(Action) `DataBinding`으로 인해 `ViewModel`의 값이 변화하면 바로 `View`의 정보가 바뀌에 되는 것입니다.
<br/>

![MVVM](https://github.com/SeonHyungJo/FrontEnd-Dev/blob/master/assets/image/MVVM.png?raw=true)

<br/>

1. `View`에 입력이 들어오면 `Command`패턴으로 `ViewModel`에 명령을 합니다.
2. `ViewModel`은 필요한 데이터를 `Model`에 요청 합니다.
3. `Model`은 `ViewModel`에 필요한 데이터를 응답 합니다.
4. `ViewModel`은 응답 받은 데이터를 가공해서 저장 합니다.
5. `View`는 `ViewModel`과의 `Data Binding`으로 인해 자동으로 갱신 됩니다.

<br/>

위와 같은 **MVVM 패턴**은 SPA에서 리액트나 뷰의 진형에서 사용되고 있는 패턴이다. 모든 패턴들이 완벽하지는 않다 시간이 지나고 사용을 하면서 발전하는 것이 바로 패턴인 것이다. :running:

---

#### Reference

- [마기의 개발블로그](https://magi82.github.io/android-mvc-mvp-mvvm/)