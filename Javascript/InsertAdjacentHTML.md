# insertAdjacentHTML

## DOM 추가

Document Object Model이라고 한다. 웹브라우저가 작동하는 원리에 따라 브라우저가 렌더링 될 때 HTML을 파싱한 뒤 DOM Tree를 만든다. 이 DOM Tree의 DOM과 같다.

이렇게 만들어진 DOM Tree를 HTML과 같은 텍스트(string)로 수정해야 할 경우가 있다. 최근의 SPA방식에서는 자주 사용되지는 않지만 Vanilla Script나 JQuery 방식에서는 자주 사용되는 패턴이다.

두가지 방법이 존재한다.

- innerHTML
- insertAdjacentHTML

## innerHTML

```js
document.addEventListener('DOMContentLoaded', function() {
  let bodyContent = document.querySelector('.content');
  const elem = '<div>hello<div/>';

  for (let i = 0; i < 500; i++) {
    bodyContent.innerHTML += elem;
  }
});
```

content라는 div아래에 div를 5000개 추가하는 코드다.

[Mozilla의 MDN web docs](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)에 따르면 bodyContent가 가지는 값은 아래와 같다..

> A DOMString containing the HTML serialization of the element's descendants.

DOMString이라는 string 값을 받게 되는데 이는 하위 노드들을 모두 직렬화(serialization)한다. 그리고 난뒤 값을 재설정하게 되면 아래와 같은 설명이 나온다.

> Setting the value of innerHTML removes all of the element's descendants and replaces them with nodes constructed by parsing the HTML given in the string htmlString.

innerHTML의 값을 바꾸면(setting) 기존의 하위 노드는 모두 삭제되고 새로 받은 String을 가지고 새로운 노드로 대체된다. 즉 값을 추가할 때마다 받은 string을 파싱한 뒤 DOM을 다시 생성하게 된다.

## 향상된 innerHTML

따라서 아래와 같이 수정하면 성능이 향상될 수 있다.

```js
document.addEventListener('DOMContentLoaded', function() {
  let bodyContent = document.querySelector('.content');
  let elem = '<div>hello<div/>';

  for (let i = 0; i < 5000; i++) {
    elem += '<div>hello<div/>';
  }
  bodyContent.innerHTML = elem;
});
```

이 경우 innerHTML의 값의 수정은 단 한번만 일어나게 된다. string을 파싱하는 과정이 한번만 일어나기 때문에 성능이 향상된다.

### 성능 테스트

---

![insertAdjacentHTML_1](../assets/images/insertAdjacentHTML_1.png)

![insertAdjacentHTML_2](../assets/images/insertAdjacentHTML_2.png)

두 사진은 테스트 시 위와 아래의 각각 소요시간을 보여준다. 65초에서 1.3초정도로 엄청나게 줄어든 것을 확인 할 수 있다. 또한 위의 경우 parseHTML이 5000번이 실행되었다. anonymous 아래의 파랑색의 많은 칸이 parseHTML부분이다.

그러나 아래의 경우 parseHTML은 한 번만 실행되어 엄청난 성능 향상을 보여준다.

## insertAdjacentHTML

> element.insertAdjacentHTML(position, text);

insertHTML의 경우 위와 같이 사용하는 메서드인데 인자가 두개다. 쉽게 생각해 position에 text를 추가한다.

position은 아래 네가지 단어를 사용한다.

- 'beforebegin' // element 앞에
- 'afterbegin' // element 안에 가장 첫번째 child
- 'beforeend' // element 안에 가장 마지막 child
- 'afterend' // element 뒤에

이제 코드로 보자.

```js
document.addEventListener('DOMContentLoaded', function() {
  let bodyContent = document.querySelector('.content');
  const elem = '<div>hello<div/>';

  for (let i = 0; i < 5000; i++) {
    bodyContent.insertAdjacentHTML('beforeend', elem);
  }
});
```

위의 두가지 코드와 같은 기능이다. 그런데 이 메서드의 크리티컬한 부분은 바로 파싱에 순서에 있다.

역시 [MDN 문서](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML)에 따르면 아래와 같이 써 있다.

> The insertAdjacentHTML() method parses the specified text as HTML or XML and inserts the resulting nodes into the DOM tree at a specified position. It does not reparse the element it is being used on, and thus it does not corrupt the existing elements inside that element. This avoids the extra step of serialization, making it much faster than direct innerHTML manipulation.

요약 하자면 text로 받은 string을 먼저 파싱한 뒤 기존의 DOM Tree에 추가하는 방식이다. 따라서 전체를 reparse하지 않아 기존의 element에 영향을 적게 준다. 전체를 수정하지 않으니 직렬화 과정이 줄어들며 성능이 향상되는 것이다.

### 성능 테스트

---

![insertAdjacentHTML_3](../assets/images/insertAdjacentHTML_3.png)

훨씬 빨라진 것을 볼 수 있다. parseHTML은 5000번이 똑같이 호출되지만 전체를 수정하는 것이 아니라 확실히 성능이 향상되었다. 단순하게 아무것도 없는 html에 추가만 하는 테스트 코드인데도 이 정도의 성능 향상을 보였다. 복잡한 문서라면 더욱 드라마틱한 성능 향상을 보일 것으로 예상된다.

## 사용 시 주의점

이렇게 String 기반으로 DOM요소를 수정하는 모든 경우 크로스 스크립팅에 취약하다. 예를들어 사용자의 입력 값을 받아 그 String으로 DOM을 수정하는 경우다. 이 경우 입력 값을 script로 넣어버릴 수 있기 때문이다.

따라서 입력값을 받아 DOM을 수정하는 경우 항상 조심해서 사용해야 합니다.
