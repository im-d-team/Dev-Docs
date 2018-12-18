# Functional setState()

제목을 보고 React를 아는 사람들은 `setState()`를 보고 아~ 했을 것이다.
흔히 `setState()` 함수(저런 형태는 기본적으로 함수니까)는

```js

onChangeEvent({target}){
    this.setState({
        value : target.value
    })
}

```

위와 같은? 방법으로 사용할 것 같다. (맞나?)
<br/>

그러나 이번에는 새로운 소식으로 제목에 따르면 setState()가 `Functional Programming`이라는 것이다.
<br/>

## setState()는 functional programming이다. 

함수형 프로그램의 특성은 작성한 글이 있다.
<br/>

> [함수형 프로그래밍](https://github.com/SeonHyungJo/FrontEnd-Dev/blob/master/Functional_Programming/README.md)
<br/>

함수형 프로그래밍에 있어서 가장 중요한 것은 2가지로 요약할 수 있다.
<br/>

1. 순수함수(Pure Function)
    1. 순수 함수는 같은 입력 값을 넣었을 때 항상 같은 출력 값을 반환한다.
    2. 유용한 순수 함수는 최소 한 개의 매개변수를 가진다.
    3. 유용한 순수 함수는 반드시 무엇인가를 반환한다.
2. 불변성(Immutable)

<br/>

## React는 Component 기반의 UI 라이브러리이다.

먼저 React는 Component 기반의 UI 라이브러리이다.
<br/>

React의 Component는 보통 자체 상태(State)가 포함 된 독립적이고 재사용 가능한 코드 조각(pieces of code)이다.
<br/>

이것은 어플리케이션의 UI를 구성하는 리액트 엘리먼트(element)를 반환한다.
<br/>

로컬 상태를 포함하는 컴포넌트에는 state라는 속성(property)이 있다.
<br/>

this.props 및 this.state는 비동기적(asynchronously)으로 업데이트 될 수 있으므로 다음 상태(state)를 계산하는 데는 이 값을 의존해서는 안된다.
<br/>

## setState()에 대해서...

### 이미 알고있는 것
  
- 업데이트 할 상태의 부분을 포함하는 **객체**를 setState의 인자로 전달한다.
- 전달한 객체에는 상태의 키에 해당하는 키를 포함

```js

this.setState({ key: value})

```

위에서부터 보게 되면 `setState()`의 인자로는 `Object`를 보내게 된다.
<br/>

인자로 `String`, `int`를 보내게 되면 에러가 발생한다.
<br/>

`setState()` 인자로 `key`와 `value`가 넘어가고 `key`로 비교를 해서 있다면 덮어씌우고 없다면 새로 생성하는 역할을 하기 때문이다.
<br/>

이러한 형태는 `Map`형태와 유사하다.

- `setState()`는 그 객체를 상태에 `Merge`하여 상태를 업데이트하거나 새로 설정
- `setState()`는 **비동기적** 으로 업데이트가 이루어질 수 있다.
  
<br/>

### 당신이 몰랐을 수 있는 것

**객체 대신 함수를 넘길 수 있다.** 
<br/>

```js

this.setState(
    function (state, props) {
        return { score: state.score - 1 };
    }
);

```

<br/>

- 함수를 넘길 수 있다는 것은 함수형 프로그래밍의 특성 중 하나이다.

<br/>

**그렇다면 왜 함수를 전달할까**

<br/>

- state 업데이트가 비동기로 실행이 된다.
- 현재 상태의 값을 안정적으로 가져올 수 있다.

<br/>

```js
submit(){
    this.setState(
        function(prevState, props){
            return {
                showForm: !prevState.showForm
            }
        }
    );
}
```

<br/>

### setState()가 호출이 되면...

- 전달한 객체를 현재 상태로 합치고 Merge 
- (간단히 보자면) 새로운 리액트 엘리먼트 트리를 만들고(Render), 이전 트리와 비교하고 변경된 부분을 DOM에 적용

<br/>
<br/>

## 리액트는 단순하게 상태를 세팅하지 않는다

리액트는 여러 setState() 호출을 성능 향상을 위해 단일 배치 방식으로 작업을 할 수도 있다.
<br/>

여러 setState() 호출은 setState()를 한 번 이상 단일 함수 내에서 호출하는 것을 의미 할 수 있다. => 무슨 말인가

<br/>

```js
//constructor
state = {score : 0}; // multiple setState() calls

increaseScoreBy3 () {
    this.setState({score : this.state.score + 1});
    this.setState({score : this.state.score + 1});
    this.setState({score : this.state.score + 1});
}
```

<br/>

setState()에 전달하는 것은 **일반 객체**이다.
<br/>

여러 setState() 호출을 만나면 전달 된 모든 객체를 추출하여 :point_right: **배치 작업**을 수행하고 이를 `Merge`하여 단일 객체를 만들고 그 단일 객체를 사용하여 `setState()`를 진행
<br/>

그렇담 `Merge`를 어떻게 진행 할까
<br/>

예상)
해당되는 객체들을 전부 가져와서 복사를 한다.
같은 프로퍼티 즉 같은 key를 가지고 있다면 맨마지막 key의 값을 넣는다.
<br/>

```react

const singleObject =
    Object.assign(
        {},
        objectFromSetState1,
        objectFromSetState2,
        objectFromSetState3 // 3개가 같다면 3번이 우선
    );

```

<br/>

위와 같은 패턴을 `Object Composition`이라고 한다.
<br/>

`Javascript`에서 만약 3개의 객체가 동일한 키를 가지고 있다면 `Object.assign()`에 마지막으로 전달 된 객체의 `key`값이 우선이 된다.
<br/>

```js

const me = {name : "Justice"},
      you = {name : "Your name"},
      we = Object.assign({}, me, you);

we.name === "Your name"; // true
console.log(we); // {name : "Your name"}

```

<br/>

## **중요**

즉, 위의 increaseScoreBy3 함수를 사용하면 리액트가 setState() 호출 순서로 상태를 즉시 업데이트하지 않기 때문에 함수의 최종 결과는 3 대신 1이 된다.
<br/>

리액트는 이처럼 먼저 모든 객체를 하나로 결합한 후에 계산한다.
<br/>

`{score : this.state.score + 1}`
<br/>

새로 만든 객체로 "setState"를 한 번만 수행했다.
<br/>

`User.setState ({score : this.state.score +1}`
<br/>

중요한 것은 +3이 아니라 +1이 된다는 점 이유는 위에 나와있지만 간단한게 여러 `setState`가 이루어지면 모든 **객체를 단일 객체로 만들고 그 단일 객체를 setState()한다.**
<br/>

`React`가 객체를 `Merge`하는 대신 <여러 Functional setState() 호출> 를 만나면 **호출된 순서대로 함수를 큐에 넣는다.**
<br/>

`React`는 "큐(queue)"의 각 함수를 호출하여 상태를 업데이트하고 이전 상태, 즉 첫 번째 함수형 setState() 호출 이전 상태를 전달한다 (첫 번째 함수형 setState() 인 경우). 만약 첫 번째 함수형 setState() 호출이 아니라면, 큐 내의 이전의 함수형 setState() 호출로부터 최신 갱신된 상태를 전달한다.
<br/>

이걸 해결한 함수를 넘기기 함수를 넘기게 되면 큐에 순서대로 첫번째 함수가 실행이 되고 얻어진 상태(최신의 상태)가 넘어간다.
<br/>

## 리액트 일급 비밀

지금까지 리액트에서 여러 함수형 `setState`를 수행하는 것이 왜 안전한지 깊게 살펴 봤다.
<br/>

실제로 함수형 `setState`를 완벽하게 정의하지는 못했다.
<br/>

"상태 변경을 컴포넌트 클래스와 분리해서 작성하라."
<br/>

수년간, `setState`에 전달하는 함수 또는 객체는 항상 컴포넌트 클래스 안에 존재했다.
<br/>

```js
// outside your component class
function increaseScore (prestate, props) {
  return {score : state.score + 1}
}
class User{
  ...
// inside your component class
  handleIncreaseScore () {
    this.setState( increaseScore)
  }
  ...
}
```

컴포넌트 클래스 외부에서 상태 업데이트 로직을 선언한다.
<br/>

그런 다음 컴포넌트 클래스 내에서 호출한다.
<br/>

**이것은 선언적(declarative)이다!**
<br/>

컴포넌트 클래스는 더이상 상태 업데이트 방법을 고려하지 않는다. 단순히 원하는 업데이트 유형을 선언한다.
<br/>

많은 상태(state)가 있는 복잡한 컴포넌트에 대해 생각해보자. 각 상태를 다른 액션으로 업데이트 할 것이다. 때로는, 각각의 업데이트 함수에는 많은 코드가 포함되어 있을 수 있다. 이 모든 로직이 컴포넌트 내에 있는 것이다.
<br/>

그러나 더 이상은 그럴 필요가 없다!

```js
import {increaseScore} from "../stateChanges";

class User{
  ...
  // inside your component class
  handleIncreaseScore () {
    this.setState( increaseScore)
  }
  ...
}
```

<br/>

다음 상태를 계산하기 위해 추가 인자를 전달할 수도 있다.

```js
// outside your component class
function increaseScore (plus) {
  return function(prestate, props){
        return {score : state.score + plus};
      }
    }
}
class User{
  ...
// inside your component class
  handleIncreaseScore () {
    this.setState(increaseScore(1))
  }
  ...
}
```

<br/>

---

#### Reference 

- https://www.vobour.com/%ED%95%A8%EC%88%98%ED%98%95-setstate%EA%B0%80-%EB%A6%AC%EC%95%A1%ED%8A%B8-react-%EC%9D%98-%EB%AF%B8%EB%9E%98%EC%9D%B4%EB%8B%A4-functiona
- https://www.vobour.com/-setstate-%EB%A9%94%EC%8F%98%EB%93%9C-%ED%8C%8C%EB%9D%BC%EB%AF%B8%ED%84%B0%EB%A1%9C-%EA%B0%9D%EC%B2%B4-%EB%8C%80%EC%8B%A0-%ED%95%A8%EC%88%98-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0-using
- https://meetup.toast.com/posts/110


