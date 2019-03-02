# Vue - LifeCycle

## Contents

React와 비교해서 라이프사이클이 외우기? 쉽고 간단하다. 또한 React와는 다르게 공식 사이트 한글문서가 너무 잘되어있어 읽어보면 쉽게 이해가 될 것이다.

> [React라이프 사이클 살펴보기](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

- beforeCreate
- create
- beforeMount
- mount
- beforeUpdate
- update
- beforeDestroy
- destroy
- nextTick
- errorCaptured

<br/>

### Diagram

![vue-lifecycle](/assets/images/Vue-lifecycle.png)

<br/>

## beforeCreate

```js
beforeCreate () {
  //can't use Data(this.title ...), events(vm.$on, vm.$once, vm.$off, vm.$emit)
}
```

뷰에서 가장 먼저 실행되는 훅이다. `data`와 이벤트`($on, $once, $off, $emit)`, 감시자(`$watch`)등이 설정 되기 전에 호출이 된다.

여러 곳을 찾아봤지만 어떻게 사용을 하고 운용을 할 수 있는지에 대해서는 자세히 찾지 못했다. 아무것도 만들어지고 아무것도 사용할 수 없는데 무엇을 할 수 있을까?

<br/>

## created

```js
created : {
  titleComputed() {
    //can use Data(this.title, this.titleComputed ...), events(vm.$on, vm.$once, vm.$off, vm.$emit)
    //don't use $el
  }
}
```

이 훅에서는 이제 `data`와 `events`가 활성화가 되어 이제는 접근이 가능한 것이 생겼다. 

여전히 아직 DOM에 컴포넌트가 마운트 되지않은 상태이기 때문에 
하지만 `$el`은 사용할 수 없다.

<br/>

## beforeMount

```js
beforeMount() {
    console.log(`this.$el doesn't exist yet, but it will soon!`)
}
```

이 훅은 템플릿과 render 함수들이 컴파일된 후에 **첫 렌더링이 일어나기 직전**에 실행된다.

위에서 말했듯이 컴포넌트 초기에 `data`가 세팅되어야 한다면 `created` 훅을, **렌더링 되고 DOM을 변경해야 한다면** `mounted` 훅을 사용하면 된다.

그래서 거의 사용하지 않는 라이프 사이클 훅이라고 한다.

<br/>

## mounted

```js
mounted() {
  console.log(this.$el.textContent) // can use $el
  this.$nextTick(function () {
    // 모든 화면이 마운트되었다는 것이 보장이 된다.
  })
}
```
이 훅에서는 컴포넌트, 템플릿, 렌더링된 돔에 접근할 수 있다.

컴포넌트가 DOM에 추가 된 후 호출되는 훅이다. `$el`을 사용하여 DOM에 접근 할 수 있습니다. 

`mounted` 훅이 호출되었다고 모든 컴포넌트가 마운트 되었다고 보장할 수 없다. (자식 컴포넌트까지 마운트가 되었다고 보장이 되지 않는다.) <- 이 부분은 React와의 차이점

![Parent_Child_workflow](/assets/images/Parent_Child_workflow.png)

전체가 렌더링 보장된 상태에서 작업을 하기 위해서는 `$nextTick`을 사용해야 한다. (마지막 부록 부분 참고)

<br/>

## beforeUpdate

```js
beforeUpdate() {
  console.log('beforeUpdate');
}
```

데이터가 변경되면, 가상 DOM `re-render`와 패치가 이뤄지기 전에 호출된다.

`re-rendering` 전의 새 상태의 데이터를 얻을 수 있고 더 많은 변경이 가능하다. 그러나 추가로 `re-render`가 이루어지지 않는다고 한다. 

<br/>

## updated

```js
updated() {
  console.log('updated');
  this.$nextTick(function () {
    // 모든 화면이 마운트되었다는 것이 보장이 된다.
  })
}
```
이 훅은 데이터가 변경되어 가상 DOM이 재 렌더링되고 패치되면 호출된다.

DOM이 업데이트 완료된 상태이므로 DOM 종속적인 연산을 할 수 있다. 

그러나 여기서 상태를 변경하면 무한루프에 빠질 수 있다. 
`mounted`와 유사하게 모든 자식 컴포넌트의 재 렌더링 상태를 보장하지는 않는다.

<br/>

## beforeDestroy

```js
beforeDestroy() {
    console.log('beforeDestory');
}
```

이 훅은 해체(뷰 인스턴스 제거)되기 직전에 호출된다. 컴포넌트는 원래 모습과 모든 기능들을 그대로 가지고 있다. 

이벤트 리스너를 제거하거나 `reactive subscription`을 제거하고자 한다면 이 훅에서 진행하면 된다.

<br/>

## destroyed

```js
destroyed() {
    console.log('destroyed');
}
```

이 훅은 해체(뷰 인스턴스 제거)된 후에 호출된다. 

Vue 인스턴스의 모든 디렉티브가 바인딩 해제 되고 모든 이벤트 리스너가 제거되며 **모든 하위 Vue 인스턴스도 삭제된다.**

<br/>

## 부록

### Vue.nextTick( [callback, context] )

```js
// 데이터를 변경합니다
vm.msg = 'Hello'
// 아직 DOM 업데이트가 되지 않았습니다
Vue.nextTick(function () {
  // DOM이 업데이트 되었습니다
})

// usage as a promise (2.1.0+, see note below)
Vue.nextTick()
  .then(function () {
    // DOM updated
  })
```

다음 DOM 업데이트 사이클 이후 실행하는 콜백을 연기한다. 

DOM 업데이트를 기다리기 위해 일부 데이터를 변경한 직후 사용해야한다.

<br/>

### vm.$nextTick( [callback] )

```js
methods: {
  // ...
  example: function () {
    // 데이터 수정
    this.message = 'changed'
    // 아직 DOM 이 갱신되지 않음
    this.$nextTick(function () {
      // DOM이 이제 갱신됨
      // `this` 가 현재 인스턴스에 바인딩 됨
      this.doSomethingElse()
    })
  }
}
```

다음 DOM 업데이트 사이클 이후 실행될 콜백을 연기한다. DOM 업데이트를 기다리기 위해 일부 데이터를 변경한 직후 사용한다. 

콜백의 this컨텍스트가 이 메소드를 호출하는 인스턴스에 자동으로 바인딩되는 점을 제외하고 전역 `Vue.nextTick` 과 같다.

<br/>

### errorCaptured

```js
errorCaptured (err, vm, info) {
    this.error = true
}
```

자손 컴퍼넌트로부터의 에러가 캡처되었을 때에 불린다.(React에서 추가된 `getDerivedStateFromError(err)`와 비교)

오류를 트리거 한 컴포넌트 인스턴스 및 오류가 캡처된 위치에 대한 정보가 들어있는 문자열의 세 가지 전달인자를 받는다. 

이 훅은 false를 반환하여 오류가 더 전파되지 않도록 할 수도 있다.

#### 에러 전파 규칙

기본적으로 모든 오류는 정의 된 경우 전역 `config.errorHandler` 로 보내지므로 분석 서비스에 한 곳에 계속 보고할 수 있다.

여러 개의 `errorCaptured` 훅이 컴포넌트의 상속 체인이나 부모 체인에 존재하면, 모두 동일한 에러로 호출됩니다.

`errorCaptured` 훅에서 에러를 `throw` 하면, 이 에러와 원래 캡쳐 된 에러 모두가 글로벌 `config.errorHandler` 로 보내진다

`errorCaptured` 훅은 오류가 더 전파되지 않도록 false를 반환 할 수 있다. 이것은 본질적으로 **이 오류가 처리되었으므로 무시해야한다.** 를 의미합니다. 추가로 `errorCaptured` 훅이나 글로벌 `config.errorHandler` 가 이 에러를 위해 호출되지 않도록 한다.

<br/>

#### Reference

- [Vue 공식사이트(라이프사이클-훅)](https://kr.vuejs.org/v2/api/#%EC%98%B5%EC%85%98-%EB%9D%BC%EC%9D%B4%ED%94%84%EC%82%AC%EC%9D%B4%ED%81%B4-%ED%9B%85)
- [Vue.js 2.0 라이프사이클 이해하기](https://medium.com/witinweb/vue-js-%EB%9D%BC%EC%9D%B4%ED%94%84%EC%82%AC%EC%9D%B4%ED%81%B4-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-7780cdd97dd4)
- [vue 인스턴스 생명주기](https://hyeooona825.tistory.com/40)