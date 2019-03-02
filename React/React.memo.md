# React memo()

리액트를 사용하게 되면 데이터가 변하게 되면 화면이 다시 렌더링이 이루어진다.

그러나 데이터의 변화가 자주 일어나게 되고 그 데이터가 변하지 않았음에도 불구하고 렌더링이 이루어진다는 것을 알게 된다.

리액트 팀에서는 이러한 퍼포먼스를 줄이고자 다양한 기능을 넣어두었다.

오늘은 `memo()`에 대해서 알아보고 한다.

<br/>

## Intro

일단 들어가기에 앞서 우리는 기본적인 `Class` 기반의 `Component` 를 많이 봐왔을 것이다.

```js
import React from 'react';

class Test extends React.Component {
  constructor(props) {
      super(props);
        this.state = {
          count: 0
        }
  }

  render() {
      return (
        <div >
          {this.state.count}
          <button onClick={()=>this.setState({count: 1})}>Click Me</button>
        </div>
      );
  }
}

export default Test;
```

<br/>

## shouldComponentUpdate(LifeCycle)

우리가 가장 먼저 접하는 이 `Class` 기반의 `Component`에 있어 라이프사이클의 하나로 `shouldComponentUpdate`를 넣어 주었다.

> 자세한 라이프 사이클에 대해서는 [링크](https://github.com/SeonHyungJo/React-Lifecycle)를 참조

일단 모양새를 이러하다.

```js
shouldComponentUpdate(nextProps, nextState) {
  return true        
}
```

기본적인 형태는 `Class`기반 `Component`로 선언한 안에서 `shouldComponentUpdate`라는 메소드를 만들고 2개의 인자를 받는다. `nextProps`와 `nextState`이다.(이름은 무엇으로 하든 상관은 없다.) 

이 2개의 인자에는 각각의 바뀐 데이터가 들어오게 된다. 이 단계에서 내가 원하는 데이터가 바뀌었을 때만 렌더링을 한다는 의미에서 `return` 값으로 `true` 를 주면 된다. 

당연하게 `false` 를 돌려주게 되면 렌더링을 하지 않는다.

<br/>

## Pure Component

`Pure Component` 는 리액트 버전 **v15.5** 에 추가가 되었다.

```js
import React from 'react';

class Test extends React.PureComponent {
  constructor(props) {
      super(props);
      this.state = {
          count: 0
      }
  }
  render() {
      return ( 
          <div> 
          { this.state.count } 
          <button onClick = {
              () => this.setState({ count: 1 })
          }> Click Me </button> 
          </div >
      );
  }
}

export default Test;
```

사용방법은 간단하다. `Class`기반 `Component`에서 `React.PureComponent` 를 사용해서 `extends`를 하면 되는 것이다. 

이렇게 함으로써 우리가 위에서 보았던 `shouldComponentUpdate`과 같은 역할을 하는 것이다.

**얕은 비교**를 하고 나서 렌더링을 할 지 판단하게 된다.

## memo()

때는 리액트 팀에서 **v16.6**으로 버전업을 하면서이다. `memo()` 라는 새로운 기능 말고도 `Suspense and Lazy Load` 라는 것도 있다. 

우리는 여기서는 `memo()` 에 대해서만 자세히 살펴보자. 

리액트에 있어서 컴포넌트를 생성하는 방법은 3가지가 있다고 한다.(한 블로그에서 그러하였다.)

1. Component
2. PureComponent
3. Functional Component

1번은 우리가 흔히 많이 사용하는 클래스기반의 컴포넌트이며 2번은 우리가 위에서 보았던 `shouldComponentUpdate` 를 알아서 해주는 컴포넌트이다. 

마지막으로 남은 `functional Component`에 대해서 알아보자.

```js
const Funcomponent = ()=> {
  return (
      <div>
          Hiya!! I am a Funtional component
      </div>
  )
}
```

쉽게 말하면 우리가 클래스로 만들던 화면들을 함수로 만드는 것이다.

우리가 이렇게 사용하게 되면 문제가 생기게 된다.

클래스기반에 컴포넌트에서 발생하는 다수의 렌더링을 막기 위해서 사용하면 `shouldComponentUpdate` 나 `PureComponent` 를 사용할 수 없다는 것이다.

이에 리액트팀에서는 함수형으로 나아가기 위해서 하나의 기능을 추가해 주었다. 그것이 바로 `React.memo()` 라는 것이다. 

```js
const Test = (props) => {
    console.log('Rendering TestC :', props)
    return ( 
        <div>
        { props.count }
        </>
    )
}

export default React.memo(Test);
```

기능은 따로 새롭다고 할 수 없다. 우리가 기존에 사용하고 있던 `shouldComponentUpdate` 나 `PureComponent` 와 비슷하기 때문이다. 

`memo()`는 `PureComponent` 와 더욱이 비슷하다. **얕은 비교**를 하고 렌더링을 판단을 하게 된다.

`memo()`를 사용하는 것은 퍼포먼스 적으로 좋은 기능이라고 할 수 있지만 우리가 간과해서 안될 것은 **얕은 비교라는 것이다.**

Reference타입의 객체를 잘못 사용한다면 데이터가 바꼈음에도 불구하고 화면이 바뀌지 않는 현상이 발생하게 될 것이다.

#### Reference

- [Improving Performance in React Functional Components using React.memo()](https://blog.bitsrc.io/improve-performance-in-react-functional-components-using-react-memo-b2e80c11e15a)