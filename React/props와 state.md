# props와 state

<br/>

## props

`React`에서 `props`는 컴포넌트에 전달되는 입력 값이다. 함수의 매개변수를 생각하면 쉽다. 사용 방법은 `HTML`의 태그에서 속성과 같은 문법으로 컴포넌트에 전달하고 자식 컴포넌트에서는 `this.props`를 통해 사용한다. <br/>`props`는 함수형 컴포넌트나 클래스 컴포넌트 모두에서 사용할 수 있다. 함수형 컴포넌트에서는 다이얼로그와 같이 `props`만 받아와서 해당 컴포넌트를 렌더링만 하면 될 때 사용하면 유용하다.

```js
//class 컴포넌트
import React, {Component} from 'react';

class Dialog extends Component {
    static defaultProps ={
        title : '환영합니다!'
    }

    render() {
        return() {
            <div>
                {this.props.title}
            </div>
        }
    }
}

export default Dialog;
```

```js
//functional 컴포넌트
import React from 'react';

const Dialog = ({title}) => {
    return() {
        <div>
            {title}
        </div>
    }
}

export default Dialog
```

```js
import React, {Component} from 'react';
import Dialog from './Dialog';

class App extends Component {
    render() {
        return() {
            <Dialog title='Welcome to Im-D' />
        }
    }
}

export default App
```

쉽게 생각하면 `props`는 특정 컴포넌트에 커스텀된 입력 값을 전달하기 위해 존재하는 개념이라고 보면 된다.

<br/>

## state

`React`에서 `state`는 컴포넌트의 변경 될 수 있는 정보를 보유하는 객체다. `state`는 private하기 때문에 컴포넌트 외부에서는 직접적으로 접근할 수 없다.

`state`를 정의하는 방법은 다음과 같다.

```js
import React, { Component } from 'react';

class Developer extends Component {
  state = {
    name: 'BKJang',
    skill: 'Javascript'
  }

  render() {
    return (
      <div>
        <h1>Developer</h1>
        <div>Info: {this.state.name} / {this.state.skill}</div>
      </div>
    );
  }
}

export default Developer;
```

위와 같이 `state`를 정의하는 방법이 `class fields` 문법을 사용하는 방법이다.
이는 편의를 위한 방법이며 이외에 `constructor`를 사용하는 방법이 있다.

```js
import React, { Component } from 'react';

class Developer extends Component {
  constructor(props) {
      super(props);
      this.state = {
        name: 'BKJang',
        skill: 'Javascript'
      }
  }

  render() {
    return (
      <div>
        <h1>Developer</h1>
        <div>Info: {this.state.name} / {this.state.skill}</div>
      </div>
    );
  }
}

export default Developer;
```

`constructor` 에서 `super(props)` 를 호출 한 이유는 React의 Component 를 상속하기 때문에 React Component가 갖고 있던 생성자를 `super` 를 통하여 미리 실행한 이후, 우리가 필요한 `state`를 설정해주는 것이다.

그렇다면 `state`값을 바꾸고 싶을 땐 어떻게 하면 될까? `React`에서는 `state`를 변경하기 위해서는 무조건 `setState`함수를 통해서 상태를 변경해주어야 한다. `React`에서는 `setState`함수가 호출되면 컴포넌트가 리렌더링되도록 되어 있기 때문이다.

### setState함수를 통한 state 변경

---

- **객체 전달을 통한 state 변경**

```js
state = {
    name: 'BKJang',
    skill: 'Javascript'
}
  
this.setState({
    skill : 'Java' 
})
```

- **two depth이상의 state 변경**

```js
state = {
    name: 'BKJang',
    skill: {
        frontEnd : 'Javascript',
        backEnd: 'Java'
    }
}
  
this.setState({
    skill : {
        ...this.state.skill,
        backEnd: 'Node.js'
    } 
})
```

위의 예시 처럼 `skill`에서 `backEnd`에 해당하는 상태 값만 변경하고 싶다면 [Spread Operator(전개 연산자)](https://bkdevlog.netlify.com/posts/spread-rest)를 사용하여 변경하면 된다.

- **함수 전달을 통한 state 변경**

```js
state = {
    dialogVisible : false
}
  
this.setState(
    (state) => ({
        dialogVisible : !state.dialogVisible
    })
)
```

위와 같이 현재 `state`를 매개변수로 전달하고 이를 이용해 `state`값을 변경하는 방법을 사용할 수 있다.

```js
this.setState(
    ({dialogVisible}) => ({
        dialogVisible : !dialogVisible
    })
)
```

혹은 위와 같이 `ES6`의 [Destructuring(비구조화 할당)](https://bkdevlog.netlify.com/posts/destructuring)을 사용하여 `state`를 변경할 수도 있다.

위 2가지 방법은 어떤 것이 더 좋다라고 할 수 없다. 상황에 따라 더 적절한 방법을 선택하는 것이 맞다.

### setState함수 실행 이후의 콜백

---

`setState`함수를 무조건 실행한 이후 특정 함수를 콜백으로 실행해야할 경우가 있다. <br/>`setState`는 비동기적으로 실행되기 때문에 JS의 이벤트 루프상 `setTimeout`과 같은 비동기 함수를 사용하여 동기적으로 콜백 함수를 동작하도록 할수도 있다. 하지만 `setState`함수의 2번째 인자로 특정 함수를 전달해주면 `setState`함수의 콜백 함수로 동작하기 때문에 다음과 같이 사용할 수 있다.

```js
state = {
    currentMonth : 5;
}

handleMonthWithNext = () => {
    this.setState(({currentMonth}) => ({
       currentMonth : currentMonth + 1; 
    }), () => {
     this.getCalendarData(this.state.currentMonth)
    })
}

getCalendarData = () => {
    console.log(this.state.currentMonth); //6
}
```

<br/>

## props vs state

`props`와 `state`는 모두 JS의 순수 객체다. 둘 다 렌더링 결과에 영향을 주는 정보를 가지고 있다. <br/>단, `props`는 함수의 매개변수와 비슷하게 해당 컴포넌트로 전달되는 반면, `state`는 함수 내에서 선언된 변수와 유사하게 해당 컴포넌트 내에서 관리된다.

---

#### Reference

- [sudheerj/reactjs-interview-questions](https://github.com/sudheerj/reactjs-interview-questions#what-is-state-in-react)
- [Velopert - 누구든지 하는 리액트 4편: props 와 state](https://velopert.com/3629)
