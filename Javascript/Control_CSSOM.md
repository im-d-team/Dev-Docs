# Control CSSOM

`CSSOM(CSS Object Model)` . 즉, 자바스크립트로 `CSS`를 조작할 수 있도록 하는 `API`이다.
<br/>

위에 관련된 자세한 내용은 웹의 렌더링과정에 대한 내용을 보면 이해하는데 도움이 될 것으로 생각이 된다.
<br/>

> [MDN에서도 잘 설명이 되어있다.](https://developer.mozilla.org/ko/docs/Web/API/CSS_Object_Model)

그렇다면 우리는 어떻게 사용하고 있을까?
<br/>

## Element.style

우리가 많이 사용하는 방법이다.
일반적으로 개발자들이 자바스크립트로 `CSS`를 변경하려고 할 때 많이 사용하는 방법 중 하나이다.(Jquery를 사용안한다는 전제)
<br/>

```js
document.body.style.backgroundColor = 'black';
document.body.style.padding = '100px';
```

위와같이 하게 되면서 스타일이 변하면서 `inline` 스타일로 들어가게 된다.
또한 `width`나 `height`의 경우는 초기에 입력한 값과 실제로 렌더링된 값이 다를 수 있는 경우가 생기게 된다.
<br/>

그렇다면 실제로 렌더링 결과의 값을 가져올 방법이 없는 것일까?
<br/>

이럴때 사용하는 것이 `CSSOM` 이다. 화면이 렌더링되면서 `DOM TREE` 를 그리고 `CSSOM` 를 그리고 `렌더링트리` 가 만들어지는데 이 과정에서의 결과값이 `CSSOM`에 들어가게 된다. 
<br/>

결론적으로 `CSSOM` 안에 있는 `style` 을 가져오게 되면 실제 우리가 보는 화면의 스타일을 알 수 있다는 것이다.
<br/>

## 계산된(computed) 스타일 가져오기

`API` 적으로 지원을 해주고 있어서 쉽게 가져와서 읽을 수 있다. 

```js
window.getComputedStyle(document.body) // 너무 많은 정보를 보여준다.
```

위와 같이 콘솔에 찍어보면 엄청난 정보가 쏟아진다. 내가 입력했던 정보뿐만 아니라 `Default`값들도 보여주기 때문이다.

```js
window.getComputedStyle(document.body).font; 
window.getComputedStyle(document.body).color; 
```

이제 위와 같이 입력을 하게 되면 내가 필요한 정보만을 얻을 수 있게 된다.
<br/>

또한 위에서 언급했듯이 실제 계산된 값을 보여주기 때문에 `width`와 `height`의 값이 숫자로 보여주게 되는 것이다.
<br/>

### 속성을 가져오는 여러가지 방법

```js
// 점(.) 이용, camel case를 사용한다. 
window.getComputedStyle(el).backgroundColor; 

// [대괄호] 이용, - 사용 : lint 에서 권고하지 않음. 
window.getComputedStyle(el)['background-color']; 

// getPropertyValue() 메소드를 이용, - 사용 
window.getComputedStyle(el).getPropertyValue('background-color');
```

<br/>

## 가상 요소(pseudo-element)에 접근

`window.getComputedStyle`의 두번째 인자를 전달하면 가상요소의 속성에 접근이 가능하다.

```css
.box::before { 
    display: block; 
    width: 50px; 
    content: 'Example'; 
}
```

```js
let box = document.querySelector('.box'); 
window.getComputedStyle(box, '::before').width; // '50px'
```

<br/>

## 사용할 수 있는 API

- setProperty() : 설정, 2개의 인자 (속성,값)
- getProperty() : 가져오기, 1개의 인자
- item() : 가져오려는 속성의 인덱스를 인자로 사용
- removeProperty() : 삭제

```js
// 설정(set) 
document.body.style.setProperty('color', 'lime'); document.body.style.setProperty('font-size', '16px'); // - 를 사용한것에 주목! 
// 읽기(get) 
document.body.style.getPropertyValue('color'); // 'lime' 

// item() 이용, 인자값은 인덱스 숫자 
document.body.style.item(0) // 'color' 
document.body.style.item(1) // 'font-size' 

// 제거(remove), 제거 후에는 빈 문자열을 반환한다. 
document.body.style.removeProperty('color') // 'lime' 
document.body.style.item(1) // '' 
```

<br/>

---

#### Reference

- [Javascript로 CSS 제어하기](http://ibrahimovic.tistory.com/56)