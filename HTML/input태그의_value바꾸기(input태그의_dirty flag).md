# input태그의 value바꾸기(input태그의 dirty flag)

`<input>`태그의 내용(value)이 변경되면 `setAttribute()`로 값을 변경하여도 브라우저 화면에 반영되지 않는다.

```js
function test() {
  inputText.setAttribute("value", "test");
  console.log("test value: "+inputText.value);
  console.log("test default: "+inputText.defaultValue);
}
```

```html
<input type="text" id="inputText" name="testName"> // 만약 텍스트박스에 무언가 입력한다면
<input type="button" value="test" onclick="test()">// 버튼을 눌러도 화면에 변화가 없다.
```
> [예시(codepen)](https://codepen.io/dae-hwa/pen/gJMwQq)

<br/>

## dirty value flag

`<input>` element에 **dirty value flag(이하 더티 플래그)** 라는 속성이 있다. boolean 타입이고, **false가 초기값**이다. **value가 변경되면 true**로 바뀐다.

value의 속성이 add, set, remove될 때, **더티 플래그의 값이 false인 경우 element의 값이 value값이 된다.** (더티 플래그가 true일 경우 element의 값이 value의 속성 값으로 설정되지 않는다.)

value속성을 add, set, remove하는 것은 value의 `default value`프로퍼티를 변경하는 것이다. 즉, 더티 플래그가 **false인 경우 element의 default value의 값이 value 프로퍼티의 값이 된다.**

```js
function test() {
  inputText.setAttribute("value", "test");
  console.log("test value: "+inputText.value);
  console.log("test default: "+inputText.defaultValue);
}
```

```html
<input type="text" id="inputText" name="testName"> // 만약 텍스트박스에 "무언가"를 입력한다면 
                                                   // inputText의 defaultValue와 value프로퍼티의 값은 "무언가", 
                                                   // dirty value flag는 true로 변하게 된다.

<input type="button" value="test" onclick="test()">// 버튼을 클릭하면
                                                   // inputText의 value 프로퍼티의 값은 여전히 "무언가"이지만,
                                                   // default value는 test로 바뀐다.
```
> [예시(codepen)](https://codepen.io/dae-hwa/pen/RmRzzV)

<br/>

## .value

더티 플래그가 true로 바뀌면, attribute를 바꾸는 방식으로 value프로퍼티의 값이 바뀌지 않는다. 이때, value 프로퍼티로 값을 직접 변경 할 수 있다.

```
document.getElementById("id").value="new value";
```

value 프로퍼티는 값을 가져올때(get) element의 현재 값을 반환하고, **새 값으로 설정(set; =연산자 사용)할 경우 더티 플래그가 true로 바뀐다.**

```js
function test() {
  inputText.setAttribute("value", "test");
  console.log("test value: "+inputText.value);
  console.log("test default: "+inputText.defaultValue);
}
```

```html
<input type="text" id="inputText" name="testName">
// test3 혹은 test4를 누르는 순간부터 dirty value falg는 true가 되고,
// test1, test2를 눌러도 화면에 보이는 inputText의 값이 바뀌지 않는다.
<input type="button" value="test1(setAttribute)" onclick="test1()">
<input type="button" value="test2(setAttribute)" onclick="test2()">
<input type="button" value="test3(.value)" onclick="test3()">
<input type="button" value="test4(.value)" onclick="test4()">
```
> [예시(codepen)](https://codepen.io/dae-hwa/pen/WBxxKK)

<br/>

MDN Docs는 `setAttribute()`가 일관성 없이 동작할 수 있기 때문에 프로퍼티를 사용할 것을 권장한다.(e.g.`Element.value`)

---

#### Reference

- [MDN docs - Element.setAttribute()](https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute#Notes)
- [W3C Recommendation,Forms](https://www.w3.org/TR/html5/sec-forms.html#input-dirty-value-flag)


