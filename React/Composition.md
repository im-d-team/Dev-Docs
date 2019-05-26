# Composition(합성)

<br/>

React에서는 일반적으로 상속이 아닌 합성을 이용하여 컴포넌트를 재사용한다.

## children prop

`React`에서 어떠한 컴포넌트가 있을 때 그 컴포넌트의 자식 엘리먼트를 어떤 것이 들어올지 알 수 없는 경우가 있다.
예를 들어, Dialog나 일반적인 웹 페이지에서 Header와 Footer를 제외한 Contents부분이 있을 수 있다.

```js
function Border(props) {
    return (
        <div>
            {props.children}
        </div>
    );
}
```

```js
function WelcomeDialog() {
    return (
        <div>
            <Border>
                {/* Border 컴퍼넌트가 구현 할 요소를 선언. props.children으로 호출한다.*/}
                <h1 className="Dialog-title">
                    Welcome
                </h1>
                <p className="Dialog-message">
                    Thank you for visiting our spacecraft!
                </p>
            </Border>
            <Border>
                {/* Border 컴퍼넌트가 구현 할 요소를 선언. props.children으로 호출한다.*/}
                <h1 className="Dialog-title">
                    Second Title
                </h1>
                <p className="Dialog-message">
                    Wassup
                </p>
            </Border>
        </div>
    );
}
 
ReactDOM.render(
    <WelcomeDialog/>, document.getElementById('root')
);
```

<br/>

## 여러 개의 자식 엘리먼트

```js
function Contacts(){
    return (
        <div>Contacts!</div>
    );
}
 
function Chat(){
    return (
        <div>Chat!</div>
    );
}
```

```js
function SplitPane(props) {
    return (
        <div className="SplitPane">
            <div className="SplitPane-left">
                {props.left}
            </div>
            <div className="SplitPane-right">
                {props.right}
            </div>
        </div>
    );
}
 
function App() {
    return (
        <SplitPane left={<Contacts />} right={<Chat />}/>
    );
}
 
ReactDOM.render(
    <App/>, document.getElementById('root')
);

```

위와 같이 컴포넌트가 여러 개 필요할 경우, 위와 같이 각각의 자식 엘리먼트를 props로 전달하면 된다. `React`에서는 props로 전달할 수 있는 것에 제한이 없기 때문이다.

<br/>

## Specialization

`React`에서는 **상속이 아닌 합성(Composition)을 권장**하고 있으며 아래와 같이 `Dialog`라는 일반적인 컴포넌트를 이용하여 `WelcomDialog`라는 특수화된 컴포넌트를 구현한 뒤 이를 `SignUpDialog` 클래스 컴포넌트에서 이용하고 있다.

```js
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
      {props.children}
    </FancyBorder>
  );
}
```

```js
function WelcomeDialog() {
  return (
    <Dialog
      title="Welcome"
      message="Thank you for visiting our spacecraft!">
        {props.childern}
    </Dialog>

  );
}
```

```js
class SignUpDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.state = {login: ''};
  }

  render() {
    return (
      <WelcomeDialog>
        <input value={this.state.login}
               onChange={this.handleChange} />

        <button onClick={this.handleSignUp}>
          Sign Me Up!
        </button>
      </WelcomeDialog>
    );
  }

  handleChange(e) {
    this.setState({login: e.target.value});
  }

  handleSignUp() {
    alert(`Welcome aboard, ${this.state.login}!`);
  }
}
```

---

#### Reference

- [Composition vs Inheritance](https://ko.reactjs.org/docs/composition-vs-inheritance.html)
- [[React] 11. Component 간의 합성(Composition)](https://blog.sonim1.com/186)
