# Component, Props, State

React는 `Component`개념에 집중되어 있는 라이브러리다. `Component`는 JavaScript의 함수와 유사하다고 할 수 있는데, `Props`라는 데이터를 입력 받고 화면에 표시될 React `Element`를 반환한다. 한마디로 **재사용 가능한 UI 조각**이라고 생각하면 된다.

> `Element` 는 React App의 가장 작은 단위이다. 화면에 표시할 내용을 기술한다. `Element`는 브라우저 DOM Element와 달리 일반 객체(plain object)이다.

1) 브라우저 DOM 태그로 나타낸 React Element: `firstElement`

```jsx
const firstElement= <h1>Hello, world</h1>;

// ReactDOM.render 함수를 통해 Element를 DOM에 붙일 수 있다.
ReactDOM.render(firstElement, document.getElementById('root'));
```

2) 사용자 정의 `Component` (`Welcome`)로 나타낸 React Element: `secondElement`

cf. React Component 이름은 다음 `Welcome`과 같이 항상 **대문자**로 시작한다.

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// React는 {name: 'Sara'}를 props로 하여 Welcome를 호출한다.
const secondElement = <Welcome name="Sara"/>; // 어떤 것이든 넘어가긴 함

ReactDOM.render(
  secondElement,
  document.getElementById('root')
);
```

# 1. Component

## 1) Component 종류

React Component 에는 `Function Component`와 `Class Component`가 있다. 이 Component들의 가장 큰 차이점은 `LifeCycle`과 `State`이다. (추후에 다룰 예정)

### (1) JavaScript 함수로 작성: `Function Component`

```jsx
function Welcome(props) {

  // function 컴포넌트는 state를 useState를 통해 관리할 수 있다.
  // const [content, setConent] = React.useState("");
  
  return <h1>Hello, {props.name}</h1>;
}
```

props(객체 형태)를 받고 React Element를 return 해주고 있다.

### (2) ES6 Class로 작성: `Class Component`

```jsx
class Welcome extends React.Component {

  // class 컴포넌트는 props, state를 다음과 같은 형태로 관리할 수 있다.
  // constructor(props) {
  //   super(props);
  //   this.state = {content: ""};
  // }

  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

`Function Component`와 달리 render() 메소드 내에서 return 해야 한다.

## 2) Component 합성과 추출

### (1) Component 합성

`App` Component에 `Welcome` Component 여러 개가 합성되어 있다. 이처럼 자신의 컴포넌트에 다른 컴포넌트들을 참조할 수 있다.

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

![2-1](https://user-images.githubusercontent.com/43839938/99895454-a9948c00-2ccb-11eb-8935-54533513d421.png)


### (2) Component 추출

추출은 할 일이 많아보이지만 컴포넌트를 재사용할 일이 많은 App 에서는 유지 보수가 더 수월해진다. 1) UI 일부가 여러 번 사용되거나(Button, Panel, Avatar) 2) UI 일부가 자체적으로 복잡한 경우에는(App, FeedStory, Comment) 별도의 컴포넌트로 만드는 게 좋다. 

다음 `Comment` Component에는 유저사진 / 유저이름 / 내용 / 날짜가 브라우저 DOM 태그 형태 그대로 포함되어 있다. 

```jsx
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <img className="Avatar"
          src={props.author.avatarUrl}
          alt={props.author.name}
        />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

위를 다음처럼 UserInfo로 분리해서 간결하게 표현할 수 있다.

```jsx
function Comment(props) {
  return (
    <div className="Comment">
      <UserInfo user={props.author} />
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

전체 코드는 다음과 같다.

```jsx
// const {author, } = props
function formatDate(date) {
  return date.toLocaleDateString();
}

function Avatar(props) {
  return (
    <img
      className="Avatar"
      src={props.user.avatarUrl}
      alt={props.user.name}
    />
  );
}

function UserInfo(props) {
  return (
    <div className="UserInfo">
      <Avatar user={props.user} />
      <div className="UserInfo-name">{props.user.name}</div>
    </div>
  );
}

function Comment(props) {
	const {author, } = props

  return (
    <div className="Comment">
      <UserInfo user={props.author} />
      <div className="Comment-text">{props.text}</div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}

const comment = {
  date: new Date(),
  text: 'I hope you enjoy learning React!',
  author: {
    name: 'Hello Kitty',
    avatarUrl: 'https://placekitten.com/g/64/64',
  },
};
ReactDOM.render(
  <Comment
    date={comment.date}
    text={comment.text}
    author={comment.author}
  />,
  document.getElementById('root')
);
```

![2-2](https://user-images.githubusercontent.com/43839938/99895455-ab5e4f80-2ccb-11eb-8aa9-76acf3dee035.png)


# 2. Props 와 State (속성과 상태)

`Props`와 `State`는 React Component가 다루는 데이터이다. 간단하게 말하자면 `Props`는 부모 `Component`가 자식 `Component`에게 주는 변경할 수 없는 값이고 `State`는 `Component`내부에서 선언하며(비공개) `Component`에 의해 완전히 제어된다.

## 1) Props

### (1) Props는 변경 불가

모든 React 컴포넌트는 자신의 `Props`를 다룰 때 반드시 `순수함수` 처럼 동작해야 한다.

> `순수함수` 란 입력 값을 바꾸지 않는 함수이다. 동일한 입력값에 대해서 항상 동일한 결과를 반환한다.

```jsx
// 순수함수 O
function sum(a, b) {
  return a + b;
}

// 순수함수 X: 입력값 account를 변경하고 있다.
function withdraw(account, amount) {
  account.total -= amount;
	return {...account, total: account.total - amount}
}

// 매개변수, return 있고 매개변수를 직접 바꾸지 않는다.
// 이러면 새로운 객체가 리턴 된다. 
// ES6, 인사이드 자바스크립트
const obj = withdraw(account, amount);

```

### (2) defaultProps

props에 값이 없을 때를 대비하기 위해 defaultProps를 설정할 수 있다.

```jsx
import React, { Component } from 'react';

class MyName extends Component {
  render() {
    return (
      <div>
        안녕하세요! 제 이름은 <b>{this.props.name}</b> 입니다.
      </div>
    );
  }
}

function MyName(props) {
  const { name = '기본이름' } = props; // default parameter

  return (
  );
}

MyName.defaultProps = {
  name: '기본이름'
};

export default MyName;
```

`<MyName name = "은지">` 대신 `<MyName />` 과 같이 사용하면 위의 defaultProps인 '기본이름'을 name 으로 인식하게 된다.

## 2) State

React 컴포넌트는 state를 통해 위 규칙을 위반하지 않고 사용자 액션, 네트워크 응답 및 다른 요소에 대한 응답으로 시간에 따라 자신의 출력값을 변경할 수 있다.

매 초마다 시간이 업데이트 되는 화면을 만들어보자.

```jsx
class Clock extends React.Component {
	// (2) <Clock />의 constructor가 호출된다. state도 초기화한다.
  constructor(props) { 
    super(props);
    this.state = {date: new Date()};
  }

	// (4) (3)이 처음 실행된 직후 componentDidMount() 생명주기 메서드가 실행된다. 
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
	
	// 

	// (6) <Clock />이 DOM에서 삭제되었다면 componentWillUnmount() 생명주기 메서드가 실행된다.
  componentWillUnmount() {
    clearInterval(this.timerID);
  }

	// (5) setState() 메서드가 있으므로 새로운 state로 render() 메소드를 다시 호출한다. (this.state ~ 로 직접 수정하는게 아니다!)
  tick() {
    this.setState({
      date: new Date()
    });
  }

	// (3) <Clock />의 render() 메서드를 호출한다. 화면에 표시할 내용이다. (2)에서 초기화된 state를 기반으로 화면에 Mount한다.
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

// (1) <Clock /> Component가 있음을 인지한다.
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

### (1) State를 직접 수정하면 안된다.

직접 수정할 수 없는 것은 Props와 마찬가지이다. (다만 state는 다른 방식으로 값을 수정할 수 있다.)

```jsx
// Wrong: render() 함수를 부르지 않는다.
this.state.comment = 'Hello';

// Correct: 이후 render() 함수를 부른다.
this.setState({comment: 'Hello'});
```

this.state는 constructor 내에서만 사용할 수 있다.

### (2) State 업데이트는 비동기적일 수도 있다. // 스레드 safe하지 않다

React는 성능을 위해 여러 setState() 호출을 단일 업데이트로 한꺼번에 처리할 수 있다. 따라서 **직전 값을 기반으로 업데이트를 해야할 경우**에는 setState(객체) 가 아닌 setState(함수) 를 사용하자. setState(함수) 는 첫번째 인자로 이전 state 첫 번째 인자를, 두번째 인자로 업데이트가 적용된 시점의 props를 받는다.

```jsx
// Wrong (객체)
this.setState({
  counter: this.state.counter + this.props.increment,
});

// Correct (화살표함수)
this.setState((state, props) => ({
  counter: state.counter + props.increment
}), (prev, next) => {
  console.log(prev);
  this.setState((state, props) => {
    return { 
     counter: state.counter + props.increment;
}
})
});
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
// Correct (일반함수)
this.setState(function(state, props) {
  return {
    counter: state.counter + props.increment
  };
});
```

### Reference
- [Components and Props](https://ko.reactjs.org/docs/components-and-props.html)
- [State와 생명주기](https://ko.reactjs.org/docs/state-and-lifecycle.html)
- [누구든지 하는 리액트 1편: 리액트는 무엇인가](https://velopert.com/3612)
- [누구든지 하는 리액트 4편: props 와 state](https://velopert.com/3629)
