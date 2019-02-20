# React의 Lifecycle Event(라이프사이클 이벤트)

<br/>

## 라이프사이클 이벤트

`React`의 컴포넌트 생명 주기를 가지며, **컴포넌트가 생성되고 소멸되기까지의 과정에서 특정 시점에 호출되는 메서드들을 이용해 이를 제어**할 수 있다.

<br/>

## React v16.3 이전

`React v16.3`이전의 라이프사이클과 이후의 라이프사이클은 약간의 차이를 보인다. 우선 이전의 라이프 사이클을 전체적으로 보면 다음과 같다.

![react_lifecylce](/assets/images/react_lifecycle.png)

<br/>

### componentWillMount()

---

엘리먼트를 DOM에 추가하기 직전에 호출되는 메소드다.
DOM을 조작할 수 없고, `render`가 호출되기 전이기 때문에 `setState`를 사용해도 `render`가 호출하지 않는다.

```js
componentWillMount() {
    console.log('componentWillMount!');
}
```

### componentDidMount()

---

컴포넌트가 렌더링 된 이후(`render`함수가 실행된 후)에 실행되는 메서드다. 비동기 통신으로 초기 데이터를 가져올 때 주로 사용된다.

```js
componentDidMount() {
    console.log('componentDidMount');
}
```

### componentWillReceiveProps(nextProps)

---

컴포넌트가 처음 마운트되는 시점에서는 호출되지 않고, 첫 렌더링을 마친 후 실행된다. `props`를 받아 `state`를 변경할 때 사용하며 내부에서 `setState`를 사용해도 추가적인 렌더링이 발생하지 않는다.

```js
componentWillReceiveProps(nextProps){
  console.log("componentWillReceiveProps: " + JSON.stringify(nextProps));
}
```

### shouldComponentUpdate(nextProps, nextState)

---

컴포넌트 업데이트 직전에 호출되는 메서드며, 리렌더링 방지를 위해 사용한다.
`props`나 `state`가 변경되었을 때, `true`값을 반환하면 리렌더링을 진행하고, 아니라면 리렌더링을 하지 않는다.

```js
shouldComponentUpdate(nextProps, nextState){
  console.log("shouldComponentUpdate: " + JSON.stringify(nextProps) + " " + JSON.stringify(nextState));
  return true;
}
```

### componentWillUpdate(nextProps, nextState)

---

`shouldComponentUpdate`가 실행된 직후 컴포넌트 업데이트 직전에 호출된다. 새로운 `props` 또는 `state`가 반영되기 직전 새로운 값들을 받는다. `setState`를 사용하면 무한 루프가 일어난다.

```js
componentWillUpdate(nextProps, nextState){
  console.log("componentWillUpdate: " + JSON.stringify(nextProps) + " " + JSON.stringify(nextState));
}
```

### componentDidUpdate(prevProps, prevState)

---

컴포넌트가 업데이트 되고 난 후, 호출되는 메서드다.

```js
componentDidUpdate(prevProps, prevState){
  console.log("componentDidUpdate: " + JSON.stringify(prevProps) + " " + JSON.stringify(prevState));
}
```

### componentWillUnmount()

---

컴포넌트가 DOM에서 소멸된 후, 실행되는 메서드다. 비동기 API나 값을 초기화 시켜줄 필요가 있을 때 사용한다.

```js
componentWillUnmount(){
  console.log("componentWillUnmount");
}
```

<br/>

## React v16.3 이후

<br/>

`React v16.3`이후 바뀐 부분들이 몇 가지 있다.

- `componentWillMount`, `componentWillReceiveProps`, `componentWillUpdate`는 v17 부터 사용불가
- `componentReceiveProps` => `getDerivedStateFromProps`
- `componentWillUpdate` => `getSnapshotBeforeUpdate`
- 에러 핸들링 API 추가(`componentDidCatch`)

<br/>

### getDerivedStateFromProps

---

`componentWillReceiveProps`에서는 `setState`를 사용했지만, `getDerivedStateFromProps`에서는 `state`를 갱신할 객체를 반환한다. 새로 넘어온 `props`가 `state`의 변경을 필요로 하지 않을 떄는 `null`을 반환한다.

```js
//componentReceiveProps
componentWillReceiveProps(nextProps) {
    if (this.props.name !== nextProps.name) {
        this.setState({ name: nextProps.name });
    }
}
```

```js
//getDerivedStateFromProps
static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.name !== nextProps.name) {
        return { name: nextProps.name };
    }

    return null;
}
```

### getSnapshotBeforeUpdate

---

많이 사용되는 메서드는 아니지만, 렌더링이 일어나는 동안 수동으로 특정 시점을 유지할 때 사용할 수 있다.

### componentDidCatch

---

자신의 에러는 잡아내지 못하고 자식 컴포넌트에서 에러가 발생했을 때 실행된다.

```js
class ErrorComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isError : false };
    }

    componentDidCatch(error, info) {
        this.setState({ isError : true });
    }

    render() {
        if(this.state.isError)
            return <h1>ERROR Occured!</h1>
        
        return this.props.contents;
    }
}
```

---

#### Reference

- [리액트 교과서 - 컴포넌트와 라이프사이클 이벤트](https://velog.io/@kyusung/%EB%A6%AC%EC%95%A1%ED%8A%B8-%EA%B5%90%EA%B3%BC%EC%84%9C-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8%EC%99%80-%EB%9D%BC%EC%9D%B4%ED%94%84%EC%82%AC%EC%9D%B4%ED%81%B4-%EC%9D%B4%EB%B2%A4%ED%8A%B8)
- [react Docs - State and Lifecycle](https://reactjs.org/docs/state-and-lifecycle.html)
