# DOM

![DOM](https://user-images.githubusercontent.com/24274424/57984686-291f1a80-7a99-11e9-9fbc-b2bbcc663209.png)

들어가기에 앞서 먼저 BOM에 대해서 알아보자.

당연하게 웹은 브라우저에서 돌아가기 때문에 웹 개발을 하다 보면 브라우저와 밀접한 관계를 가지게 된다. 브라우저와 관련된 객체들의 집합을 브라우저 객체 모델(BOM : Browser Object Model)이라고 부른다. BOM을 사용하면 창을 이동하고 상태 표시줄의 텍스트를 변경하는 페이지 내용과 직접 관련이 없는 브라우저와 관련된 기능을 사용할 수 있다. **DOM은 이 BOM 중 하나이다.** 

> 예시)  `history`, `location`, `navigator`,  `screen`

BOM의 최상위 객체는 window라는 객체이고, DOM은 window 객체의 하위 객체이다.

![GIF_window document](https://user-images.githubusercontent.com/24274424/57984688-291f1a80-7a99-11e9-8926-09a8b8adb39c.gif)
<br/>

## DOM이란?

> 문서 객체 모델(The Document Object Model(DOM)) 은 HTML, XML 문서의 프로그래밍 interface 이다. - MDN

HTML에는 `<html>`, `<head>`, `<body>`와 같은 많은 태그가 있는데 이를 JavaScript로 사용할 수 있도록 객체로 만들면 그것을 **Document Object하고 한다.**

DOM은 문서의 구조화된 표현을 제공하며 **프로그래밍 언어(JavaScript 등)가 DOM 구조에 접근할 수 있는 방법을 제공하여 문서 구조, 스타일, 내용 등을 변경할 수 있도록 해준다.** 
<br/>

### DOM은 어떻게 생겼나?

DOM의 모양을 이해하는데 선행되는 자료구조는 **Tree 구조**이다. DOM이 바로 Tree 형식의 자료구조를 가지고 있기 때문이다.

이름 그대로 Tree 구조는 나무가 땅에서 솟아 위로 뻗어 나가면서 가지를 치면서 나가는 모양으로, DOM은 거꾸로 있는 모양이다.

<p align="center">
  <img src="https://user-images.githubusercontent.com/24274424/57984687-291f1a80-7a99-11e9-811b-bc9b3b1dfef5.png" alt="DOM_Tree"/>
</p>
> The HTML DOM Tree of Object(by w3school)
<br/>

## DOM과 HTML 코드의 차이점

우리가 웹페이지를 만들 때 HTML을 작성한다. 그렇다면 우리가 작성하는 이 소스가 DOM과 똑같을까?

우리가 작성한 소스는 브라우저가 읽어서 DOM Tree를 만든다. 

> 참고) Im-D/Dev-Docs [ 브라우저의 작동 원리](https://github.com/Im-D/Dev-Docs/blob/master/Browser/%EC%9B%B9%20%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80%EC%9D%98%20%EC%9E%91%EB%8F%99%20%EC%9B%90%EB%A6%AC.md)

HTML 코드는 DOM과 똑같은 것으로 예상되지만 브라우저에서 생성한 DOM과는 엄연히 다르다. 예시로 우리가 작성한 코드 중 중대한 오류가 아닌 이상 브라우저가 자동으로 소스 코드의 오류를 수정한다. (Ex. tbody)

<p align="center">
  <img src="https://user-images.githubusercontent.com/24274424/57984677-27eded80-7a99-11e9-8a67-62516944a1ab.png" alt="code1" width="400"/>

  <img src="https://user-images.githubusercontent.com/24274424/57984678-27eded80-7a99-11e9-8ebb-45d120464b0f.png" alt="code1_devtool" width="400"/>
</p>
위의 사진을 비교하게 되면 왼쪽은 실제 코드를 작성한 것이고 오른쪽은 실제 DOM으로 만들어진 모양이다. 실제로 tbody 태그를 작성하지 않았지만 만들어주는 것을 보여준다.

이외

- HTML 파일에 단어 하나라도 존재하더라도 브라우저는 이를 `html`과 `body` 으로 감싸고 `head`를 필수적으로 추가한다.

<p align="center">
  <img src="https://user-images.githubusercontent.com/24274424/57984679-27eded80-7a99-11e9-87bd-acc9fbafd3e3.png" alt="code2" width="400"/>

  <img src="https://user-images.githubusercontent.com/24274424/57984680-28868400-7a99-11e9-8dbb-0bb56a3ad599.png" alt="code2_devtool" width="400"/>
</p>

- DOM을 생성하는 과정에서 여는 태그는 작성을 하고 닫는 태그를 작성하지 않는 경우 자동 생성하여 맞춰서 오류가 발생하지 않는다.

<p align="center">
  <img src="https://user-images.githubusercontent.com/24274424/57984681-28868400-7a99-11e9-95e4-f0c8797dfceb.png" alt="code3" width="400"/>

  <img src="https://user-images.githubusercontent.com/24274424/57984682-28868400-7a99-11e9-93f5-68542db5cf5e.png" alt="code3_devtool" width="400"/>
</p>

그렇다면 우리가 작성한 코드가 실제 DOM으로 만들어진 것을 어디서 볼 수 있나?
<br/>

## DevTools

우리가 브라우저로 소스를 열어서 `F12`버튼 또는 `Ctrl + Shift + i`를 누르게 되면 브라우저 DevTools이 나오게 된다. 

![dev_tools](https://user-images.githubusercontent.com/24274424/57984683-28868400-7a99-11e9-8d75-64216c78a9c7.gif)
<br/>

### Element Tab

Element가 실제로 그려진 DOM Tree를 볼 수 있는 곳으로 **Element의 스타일 이벤트 등을 볼 수 있으며 실제로 조작을 하면서 변화를 확인해 볼 수 있다.**
<br/>

### Console Tab

JavaScript를 사용해서 DOM을 조작할 수 있다. 실제로 JavaScript 엔진을 사용해서 테스트를 해보고 싶을 때 많이 사용하는 공간으로 IntelliSense를 보는 공간으로도 사용이 가능하다.

브라우저에서 테스트할 때 원하는 Element를 JavaScript로 찾기 힘들 때 Element Tab에서 해당 Element를 클릭 후 Console 창에서 `$0`으로 호출해서 바로 사용이 가능하다.

기본적으로 브라우저에서 클릭 된 history를 보관하고 있어 이전에 선택한 Element를 다시 가져올 수 있다.

![devtools2](https://user-images.githubusercontent.com/24274424/57984684-291f1a80-7a99-11e9-95a2-24a9d55afe10.gif)

---

#### Reference

- [introduction to the dom](https://www.digitalocean.com/community/tutorials/introduction-to-the-dom)
- [What’s the Document Object Model, and why you should know how to use it.](https://medium.freecodecamp.org/whats-the-document-object-model-and-why-you-should-know-how-to-use-it-1a2d0bc5429d)
- [What is the DOM?](https://css-tricks.com/dom/)
- W3C: [What is the Document Object Model?](http://www.w3.org/TR/DOM-Level-2-Core/introduction.html)
- MDN: [Introduction - Document Object Model](https://developer.mozilla.org/en-US/docs/DOM/DOM_Reference/Introduction)
- Wikipedia: [Document Object Model](http://en.wikipedia.org/wiki/Document_Object_Model)