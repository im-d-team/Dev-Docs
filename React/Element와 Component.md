# Element와 Component

<br/>

## Element

`React`에서 `element`는 일반 객체(Plain Object)이다. 따라서 생성하는데 큰 어려움이 없이 생성이 가능하다.<br/>
단, 한 번 생성된 `element`는 변경불가능하다. 즉, `element`를 생성한 이후에는 해당 엘리먼트의 자식이나 속성을 변경할 수 없다.

```js
const element = React.createElement(
  'div',
  {id: 'login-btn'},
  'Login'
)
```

`React.createElement()`함수는 아래와 같이 일반 객체를 반환한다.

```js
{
  type: 'div',
  props: {
    children: 'Login',
    id: 'login-btn'
  }
}
```

### React Element 렌더링과 업데이트

---

`React Element`를 렌더링하기 위해서는 `element`를 생성하고 이를 `ReactDOM.render()`로 `root DOM Node`와 생성한 `element`를 넘기면 된다.

```js
const element = React.createElement(
  'div',
  {id: 'login-btn'},
  'Login'
);
ReactDOM.render(element, document.getElementById('root'));
```

[React 공식 문서 - Rendering Element](https://codepen.io/pen?&editable=true&editors=0010)


`React Element`는 불변 객체기 때문에 변경할 수 없다. 따라서 업데이트하기 위해서는 새로운 `element`를 생성하여 `ReactDOM.render()`로 넘겨주면 된다.

[React 공식 문서 - Update Element](https://codepen.io/pen?&editable=true&editors=0010)

<br/>

## Component

`React`에서 `Component`는 함수와 비슷하다고 보면 된다.

```js
const Button = ({ onLogin }) =>
  <div onClick={onLogin} />
```

위와 같이 `Component`를 생성하면 `JSX`에서는 이를 아래와 같이 `transpile`한다.

```js
const Button = ({ onLogin }) => React.createElement(
  'div',
  { onClick: onLogin },
  'Login'
)
```

[React 공식 문서 - Component Rendering](https://ko.reactjs.org/redirect-to-codepen/components-and-props/rendering-a-component)

<br/>

### Class Component vs Function Component

---

`Component`를 생성하는 방법에는 2가지가 있는데 첫 번째로 가장 간단한 방법은 `JS`함수를 작성하면 된다.

```js
//JS function 생성
function HelloWorld(props) {
    return <h1>Hello World {props.name}</h1>;
}
```

또 다른 방법은 `ES6`의 `class`문법을 사용하여 생성하는 것이다.

```js
//ES6 class 사용
class HelloWorld extends React.Component {
  render() {
    return <h1>Hello World {props.name}</h1>;
  }
}
```

> 만약, `Component`가 `state`나 `LifeCycle Method`가 필요하다면 `class Component`를 사용하면 되고, 그게 아니라면 `function Component`를 사용하면 된다.

---

#### Reference

- [sudheerj/reactjs-interview-questions](https://github.com/sudheerj/reactjs-interview-questions#what-is-the-difference-between-element-and-component)
- [react Docs - 엘리먼트 렌더링](https://ko.reactjs.org/docs/rendering-elements.html)
- [react Docs - Component와 Props](https://ko.reactjs.org/docs/components-and-props.html)
