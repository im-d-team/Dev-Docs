# input태그의 value바꾸기(input태그의 dirty flag)

`<input>`태그의 내용(value)이 변경되면 `setAttribute()`로 값을 변경하여도 브라우저 화면에 반영되지 않는다.

> [예시](https://codepen.io/dae-hwa/pen/NVrRvm?editors=1010)

<br/>

## dirty value flag

`<input>` element에 **dirty value flag(이하 더티 플래그)** 라는 속성이 있다. boolean 타입이고, **false가 초기값**이다. **value가 변경되면 true**로 바뀐다.

value의 속성이 add, set, remove될 때, **더티 플래그의 값이 false인 경우 element의 값이 value값이 된다.** (더티 플래그가 true일 경우 element의 값이 value의 속성 값으로 설정되지 않는다.)

value속성을 add, set, remove하는 것은 value의 `default value`프로퍼티를 변경하는 것이다. 즉, 더티 플래그가 **false인 경우 element의 default value의 값이 value 프로퍼티의 값이 되는 것**이다.

> [예시](https://codepen.io/dae-hwa/pen/gJMwQq)

<br/>

## .value

더티 플래그가 true로 바뀌면, attribute를 바꾸는 방식으로 value프로퍼티의 값이 바뀌지 않는다. 이때, value 프로퍼티로 값을 직접 변경 할 수 있다.

```
document.getElementById("id").value="new value";
```

value 프로퍼티는 값을 가져올때(get) element의 현재 값을 반환하고, **새 값으로 설정(set; =연산자 사용)할 경우 더티 플래그가 true로 바뀐다.**

> [예시](https://codepen.io/dae-hwa/pen/WBxxKK?editors=1011)

<br/>

MDN Docs는 `setAttribute()`가 일관성 없이 동작할 수 있기 때문에 프로퍼티를 사용할 것을 권장한다.(e.g.`Element.value`)

---

#### Reference

- [MDN docs - Element.setAttribute()](https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute#Notes)
- [W3C Recommendation,Forms](https://www.w3.org/TR/html5/sec-forms.html#input-dirty-value-flag)

