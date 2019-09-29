# Virtual DOM

react에서는 virtual DOM이라는 개념이 있다. 이 Virtual DOM에 대해 알아보자.

## 브라우저의 렌더링

virtual DOM을 알아보기 앞서 먼저 브라우저 렌더링 프로세스를 생각해야 한다.

[웹 브라우저의 작동 원리](https://github.com/Im-D/Dev-Docs/blob/master/Browser/%EC%9B%B9%20%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80%EC%9D%98%20%EC%9E%91%EB%8F%99%20%EC%9B%90%EB%A6%AC.md)에 따르면 브라우저에서 화면은 크게 JS - Style - Layout - Paint - Composite의 단계로 그려진다.

![rendering process](https://user-images.githubusercontent.com/24724691/62412567-bf49f200-b63f-11e9-9ed4-ec8215d04a7d.png)

display가 완료된 상태에서 이 상태에서 DOM 조작을 하게 되면 보통의 경우 tree를 수정하게 된다. 그럼 render tree - layout - painting의 단계를 다시 거치게 된다.
이와 관련된 내용은 [Reflow Repaint](https://github.com/Im-D/Dev-Docs/blob/master/Performance/Reflow%20Repaint.md)에서 확인할 수 있다.

다수의 DOM 조작이 발생하고 잦은 reflow/repaint를 발생시킨다면 성능에 영향을 줄 것이다. 한 화면에서 DOM을 변경하여 기능을 구현하는 SPA의 경우 이 DOM조작이 많을 수 밖에 없다.

이 때 사용되는 것이 virtual DOM이다.

## 메모리에 있는 가상의 DOM

virtual dom은 메모리에 존재하는 가상 DOM이다. react는 메모리에 virtual dom을 가지고 있다가 view의 변화를 감지하면 virtual dom을 1차적으로 변화시킨다.

그런 뒤 이를 한꺼번에 모아 실제 DOM에 전달한다. (batch)

![react-virtual-dom](https://user-images.githubusercontent.com/24724691/64325552-5ae5ce00-d003-11e9-9c50-ae0e888919e1.png)
출처 https://auth0.com/blog/face-off-virtual-dom-vs-incremental-dom-vs-glimmer/

실제 dom에 바로 적용한다면 rendering process의 일부분을 매번 다시 발생시킨다. 하지만 memory의 virtual dom에 모았다가 발생시킨다면 rendering process는 한번만 일어나게 된다.

## Why react

이 개념은 사실 react에만 특별히 있는 것은 아니다. document fragment로 dom조작을 하면 이 개념과 크게 다르지 않다.

그런데 react가 이렇게 주목받는 이유는 dom fragment를 관리하는 것을 자동화 해주기 때문이다. virtual dom을 추상화하여 내부에서 처리하기 때문에 개발자가 따로 관리해야 할 것이 많지 않다.

vanilla script로 복잡한 상태와 다양한 view를 관리해봤다면 이 불편함을 잘 알 것이다. 이를 반자동의 느낌으로 다룰 수 있어 인기가 많다.

반자동이기에 성능은 vanilla를 이길 수 없다. 하지만 생산속도와 유지보수에 엄청난 강점을 가진다. 성능을 약간 포기하고 개발의 편리성을 끌어올리는 것이 react의 사용 이유다.

## Reconciliation

그럼 내부적으로 어떤 작업이 일어나길래 좋은 성능을 가질 수 있을까?

Virtual DOM을 갱신할 때 [Reconciliation](https://reactjs.org/docs/reconciliation.html) 작업을 한다. Reconciliation 작업은 Virtual DOM과 DOM을 비교해 DOM을 갱신하는 작업이다.

## virtual dom 갱신 방법

virtual dom을 변경하는 제일 흔한 방법 중 하나는 `setState()`다.
`setState()`로 state를 변경하면 `ReactUpdates.enqueueUpdate()`를 실행해 변경 대상 컴포넌트로 등록한다.
그런 뒤 나중에 배치작업 시 이를 실제로 갱신한다.

화면의 변화가 일어나는 것은 이 갱신 타임에 일어난다.

this.state 값을 직접 변경하는 경우 변경 대상 컴포넌트로 등록하는 작업이 일어나지 않아 따로 등록처리가 일어나기 이전에는 갱신이 발생하지 않는다.

이 외에도 `render()`를 실행하면 하위 컴포넌트들을 돌며 갱신한다. 이 `render()` 방식은 redux에서 store 변경 시 일어난다.

### diffing algorithm

대상 컴포넌트에 등록된 (enqueue) 컴포넌트들은 비교 알고리즘을 통해 virtual dom과 실제 dom을 비교하게 된다.

이 비교 알고리즘을 거친 뒤 변경되었다고 판단되면 추후 배치 업데이트가 된다.

그런데 문제는 최신의 비교 알고리즘도 O(n^3)의 복잡도를 가진다.

컴포넌트가 100개만 되어도 1000000번의 비교연산이 수행된다. 따라서 쉽게 말해 대충 변했다고 가정하는 휴리스틱 알고리즘을 구현했다.

이 휴리스틱의 판단 기준은 두가지다.

1. 다른 타입의 엘리먼트는 더이상 비교하지 않고 다르다고 판단한다.
2. key prop이 변경되었다면 다르다고 판단한다.

#### 다른 타입의 엘리먼트 

```jsx
<div>
  <Counter />
</div>

<span>
  <Counter />
</span>
```

이와 같이 `div` => `span`으로 변경되었다면 엘리먼트의 타입이 변경된 경우다. 이 경우 하위는 비교하지 않는다.

그냥 변한것이며 트리를 아예 다시 그린다. 따라서 unmount 후 state를 버리고 다시 마운트 한다.

타입은 그대로지만 state => props가 변경되는 경우 componentWillRecieveProps => componentWillUpdate => render가 불려 다시 렌더링이 일어난다. 

#### key prop

```jsx
<ul>
  <li>1</li>
  <li>2</li>
  <li>3</li>
</ul>
```
이런 데이터가 있을때 4가 추가된다고 하자.

```jsx
<ul>
  <li>1</li>
  <li>2</li>
  <li>3</li>
  <li>4</li>
</ul>

<ul>
  <li>4</li>
  <li>1</li>
  <li>2</li>
  <li>3</li>
</ul>
```

위와 아래는 사람 눈에는 큰 차이가 없어보인다. 하지만 react는 이를 완전히 다르게 처리해버린다. 전자는 하위 노드 추가, 후자는 전체 하위 노드 초기화.

따라서 고유한 key prop을 통해 최적화 한다.

```jsx
<ul>
  <li key={'2019'}>4</li>
  <li key={'2016'}>1</li>
  <li key={'2017'}>2</li>
  <li key={'2018'}>3</li>
</ul>
```

이렇게 하면 새로 추가된 li가 2019라는 것을 명확하게 알 수 있기 때문에 비교 알고리즘에 2019만 걸리고 이를 업데이트 한다.

---

### 참고자료

- https://auth0.com/blog/face-off-virtual-dom-vs-incremental-dom-vs-glimmer/
- https://velopert.com/3236
- https://hashnode.com/post/the-one-thing-that-no-one-properly-explains-about-react-why-virtual-dom-cisczhfj41bmssp53mvfwmgrq
- https://d2.naver.com/helloworld/9297403
- https://reactjs.org
