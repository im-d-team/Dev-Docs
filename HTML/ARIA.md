# ARIA(Accessible Rich Internet Applications)

ARIA란 웹 콘텐츠와 웹 어플리케이션을 제작할 때 누구든 쉽게 접근할수 있도록 하는 접근성 향상 방법 중 하나이다. ARIA를 사용하여 내비게이션 랜드마크, 위젯, 서식 힌트, 에러메시지, 실시간 콘텐츠 업데이트 등을 표현하여 **접근성**을 부여할 수 있다.

ARIA는 접근성 관련 **속성(attribute)** 이며, HTML에 최적화 되어 있다. `role` 속성을 사용하여 객체(article, alert, slider 등등)의 일반 타입을 정의하고, 이 외 ARIA 속성을 추가로 사용하여 서식에 관한 설명이나 상태바의 현재 값을 제공하는 등 유용한 프로퍼티들을 제공한다.

> [role 종류에 대해서 자세히 알아보기](https://www.w3.org/TR/wai-aria-1.1/#role_definitions) <br/>
> [ARIA_Techniques - MDN 문서](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques)

대부분의 브라우저들과 스크린 리더 기기는 ARIA를 지원한다. 그러나 구현방식이 상이하여 지원을 하더라도, 오래된 기기 혹은 브라우저의 경우에는 제대로 적용되지 않는 경우가 있다. 애플리케이션의 기능을 [우아한 하향](https://github.com/Im-D/Dev-Docs/blob/master/Performance/%EC%A0%90%EC%A7%84%EC%A0%81%ED%96%A5%EC%83%81_%EC%9A%B0%EC%95%84%ED%95%9C%ED%95%98%ED%96%A5.md)를 하여 ARIA를 사용하거나, 사용자에게 기기를 최신 버전으로 업그레이드할 것을 요청해야 한다.

**role** 속성은, **tabIndex** 속성과 항상 같은 곳에서 적용되어야 한다. **그래야 설정된 role이 의도된 element에서 정확히 수행될 수 있다**. ARIA를 통해 바꿀 수 있는 것은 오직, **Accessibility Tree** 뿐이다. Element의 외형, 동작, focusability, keyboard event handling 등등 다른 것은 아무것도 바뀌지 않는다.
<br/>

## ARIA 레이블과 관계

### aria-label

**`aria-label`** 을 사용하여 접근 가능한 label 문자열을 지정할 수 있다. **`aria-label`** 은 label Element처럼 네이티브 labelling을 모두 무시한다. 예를 들어, **`button`** 에 텍스트 콘텐츠와 **`aria-label`** 이 모두 있는 경우 **`aria-label`** 값만 사용된다.

텍스트 대신 그래픽을 사용하는 버튼과 같이, Element의 목적을 시각적으로 표시할 때 **`aria-label`** 속성을 사용할 수 있다. 그러나 이미지만 사용하여 표시하는 버튼 같은 것은 시각적 인지할 수 없는 사용자를 위해 다른 방법으로 Element의 목적을 표시해야 한다.

![aria1](https://user-images.githubusercontent.com/24274424/57572191-f0a48e80-7451-11e9-9ff0-e426757e33c2.png)
<br/>

### aria-labelledby

**`aria-labelledby`** 를 사용하면 DOM에 있는 다른 Element의 ID를 해당 Element의 레이블로 지정할 수 있다.

![aria2](https://user-images.githubusercontent.com/24274424/57572192-f0a48e80-7451-11e9-88c5-8835061ee040.png)

이것은 몇 가지 차이점이 있는 label Element이라고 생각하면 된다.

1. **`aria-labelledby`** 는 레이블 지정 가능한 Element뿐 아니라 어떤 Element에서든 사용할 수 있다.
2. **`label`** Element는 자신이 레이블을 지정하는 대상을 참조하지만 **`aria-labelledby`** 의 경우에는 관계가 다르다. 
3. 한 레이블 Element만 레이블 지정 가능한 Element와 연결할 수 있지만, **`aria-labelledby`** 는 IDREF 목록을 선택하여 여러 Element에서 레이블을 작성할 수 있다. 레이블은 IDREF가 지정되는 순서대로 연결된다.
4. **`aria-labelledby`** 를 사용하여 숨겨져 있거나 접근성 트리에 없는 Element를 참조할 수 있다. 예를 들어, 레이블을 지정하려는 Element 옆에 숨겨진 **`span`** 을 추가하고 **`aria-labelledby`** 로 참조할 수 있다.
5. 하지만 ARIA는 접근성 트리에만 영향을 주므로 **`aria-labelledby`** 를 사용하면 label Element를 사용할 때처럼 레이블 클릭 동작을 구현할 수는 없다.

중요한 점은, **`aria-labelledby`** 한 Element에 대한 다른 **모든** 이름 소스를 재정의 한다. 예를 들어, 어떤 Element에 **`aria-labelledby`** 와 **`aria-label`** 이 모두 있거나 **`aria-labelledby`** 와 네이티브 label이 있는 경우에는 **`aria-labelledby`** **레이블이 항상 우선한다.**
<br/>

## 관계

**`aria-labelledby`** 는 *관계 속성*의 예이다. **관계 속성은 DOM 관계와는 무관하게 페이지에 있는 Element들 사이의 의미 체계 관계를 생성** 한다. **`aria-labelledby`** 의 경우 의미 체계 관계는 이 Element가 저 Element에 레이블을 지정한다.

**`aria-activedescendant`**, **`aria-controls`**, **`aria-describedby`**, **`aria-labelledby`**, **`aria-owns`** 는 하나 또는 그 이상의 Element를 참조하여 페이지에 있는 Element들 사이에 새로운 링크를 생성한다.
<br/>

### aria-owns

**`aria-owns`** 는 가장 널리 사용되는 ARIA 관계 중 하나이다. 이 속성을 사용하여 DOM에 있는 별개의 Element를 현재 Element의 하위 Element로 처리해야 한다고 알려주거나 기존 하위 Element를 다른 순서로 재정렬할 수 있다.

![aria3](https://user-images.githubusercontent.com/24274424/57572193-f13d2500-7451-11e9-852a-dcd2ca642647.png)
<br/>

### aria-activedescendant

Element의 활성화된 하위 항목을 설정하여 상위 항목에 실제로 포커스가 있을 때 그 Element를 사용자에게 포커스된 Element로 표시해야 함을 알려줄 수 있다. 

예를 들어, 목록 상자에서 목록 상자 컨테이너에 페이지 포커스를 남겨두고 싶지만 **`aria-activedescendant`** 속성은 현재 선택한 목록 항목에 맞춰 계속 업데이트 유지할 수도 있다. 이를 통해 현재 선택한 항목이 마치 포커스된 항목인 것처럼 나타나게 할 수 있다.

![aria4](https://user-images.githubusercontent.com/24274424/57572194-f13d2500-7451-11e9-81f6-e7c49d8d0cbe.png)
<br/>

### aria-describedby

**`aria-describedby`** 는 **`aria-labelledby`** 가 레이블을 제공하는 것과 똑같은 방식으로 액세스 가능한 설명을 제공한다. **`aria-labelledby`** 와 마찬가지로, **`aria-describedby`** 는 DOM에서 숨겨지거나 숨겨졌는지에 상관없이 다른 방법으로는 보이지 않는 Element를 참조한다. 이는 사용자에게만 적용되든 모든 사용자에게 적용되든 상관없이, 사용자에게 추가적인 설명문이 필요할 때 유용한 기법이다.

![aria5](https://user-images.githubusercontent.com/24274424/57572195-f13d2500-7451-11e9-9fb6-4774a8f7fe38.png)
<br/>

### aria-posinset 및 aria-setsize

나머지 관계 속성은 앞서 설명한 속성과는 약간 다르게 사용된다. **`aria-posinset`**과 **`aria-setsize`**는 목록과 같이 집합을 이루고 있는 형제 Element 간의 관계를 정의하는 속성이다.

DOM에 있는 Element로는 집합의 크기를 결정할 수 없을 때 **`aria-setsize`** 는 실제 집합 크기를 지정할 수 있고 **`aria-posinset`** 는 집합에서 Element의 위치를 지정할 수 있다. 예를 들어, Element 개수가 1,000개인 집합의 경우 DOM에서 특정 Element가 맨 처음에 나타나더라도 **`aria-posinset`** 가 857이라고 하고 동적 HTML 기술을 사용해 사용자가 필요할 때 전체 목록을 탐색하도록 할 수 있다.

![aria6](https://user-images.githubusercontent.com/24274424/57572196-f13d2500-7451-11e9-8649-9b65bbc90f54.png)
<br/>

### aria-hidden

사용자를 위한 사용 환경의 미세 조정에서 중요한 다른 기술은 페이지에서 관련 부분만 노출 시킨다. DOM의 한 부분이 접근성 API에 노출되지 않도록 하는 방법은 여러 가지가 있다.

먼저 DOM에서 명시적으로 숨겨진 콘텐츠는 접근성 트리에도 포함되지 않는다. 따라서 **`visibility: hidden`** 또는 **`display: none`** 의 CSS 스타일이 있거나 HTML5 **`hidden`** 속성을 사용하는 콘텐츠 역시 숨겨져 사용자가 인식할 수 없다.

하지만 시각적으로 렌더링되지 않지만 명시적으로 숨겨지지는 않는 Element는 여전히 접근성 트리에 포함된다. 한 가지 일반적인 기법은 절대 위치상 화면 밖에 있는 Element에 스크린 리더 전용 텍스트를 포함하는 것이다.

```css
.sr-only {  
  position: absolute;  
  left: -10000px;  
  width: 1px;  
  height: 1px;  
  overflow: hidden;
}
```

또한, 다른 상황이었다면 숨겨지는 Element를 참조하는 **`aria-label`**, **`aria-labelledby`** 또는 **`aria-describedby`** 속성을 통해 스크린 리더 전용 텍스트를 제공할 수 있다.

마지막으로, ARIA는 **`aria-hidden`** 속성을 사용하여 시각적으로 숨겨지지 않는 콘텐츠를 제외하기 위한 매커니즘을 수행하는데, Element에 이 속성을 적용하면 사실상 Element와 *모든 하위 항목*이 접근성 트리에서 제거된다. **`aria-labelledby`** 또는 **`aria-describedby`** 속성이 참조하는 Element가 유일한 예외이다.

```html
<div class="deck">  
  <div class="slide" aria-hidden="true">    
    Sales Targets  
  </div>  
  <div class="slide">    
    Quarterly Sales  
  </div>  
  <div class="slide" aria-hidden="true">    
    Action Items  
  </div>
</div>
```

예를 들어, 기본 페이지에 대한 액세스를 차단하는 모달 UI를 생성하려는 경우 **`aria-hidden`** 을 사용할 수 있다. 이 경우 시력이 정상인 사용자에게는 페이지 대부분을 현재 사용할 수 없음을 나타내는 반투명 오버레이가 표시될 수 있겠지만, 스크린 리더 사용자는 페이지의 다른 부분을 계속 탐색할 수 있다. 
<br/>

### aria-live

개발자는 **`aria-live`** 를 사용해 페이지 중 어떤 부분을 '라이브'로 표시할 수 있다. 즉, 사용자가 페이지를 탐색하다가 그저 우연히 그런 '라이브' 부분을 발견하는 것이 아니라, 페이지의 어느 위치에 있든 상관없이 새롭게 업데이트된 정보를 사용자에게 즉시 알릴 수 있다. **`aria-live`** 속성을 가진 Element가 있는 경우 페이지에서 이런 Element와 그 하위 항목을 포함한 부분을 *라이브 영역*이라고 한다.

![aria7](https://user-images.githubusercontent.com/24274424/57572197-f1d5bb80-7451-11e9-8206-763d58b362ba.png)

예를 들어, 라이브 영역은 사용자 작업의 결과로서 나타나는 상태 메시지일 수 있다. 시력이 정상인 사용자의 시선을 끌어야 할 중요한 메시지인 경우 **`aria-live`** 속성을 설정하여 사용자의 관심 역시 충분히 끄는 것이 중요하다. 아래의 일반적인 **`div`** 를

```html
  <div class="status">Your message has been sent.</div>
```

'라이브' `div`로 나타내면

```html
  <div class="status" aria-live="polite">Your message has been sent.</div>
```

**`aria-live`** 에는 **`polite`**, **`assertive`**, **`off`** 의 세 가지 값이 허용된다.

- **`aria-live="polite"`** 는 현재 어떤 작업을 하고 있든 그 작업을 마치면 사용자에게 변경 사항을 알리도록 하는 역할을 한다. 긴급하지 않은 변경사항일 경우에 적합하며 **`aria-live`** 는 대부분 이런 용도로 사용된다.
- **`aria-live="assertive"`** 는 수행 중인 작업이 무엇이든 중단하고 사용자에게 변경 사항을 **즉시 알리도록 하는 역할**을 한다. '서버 오류가 발생하여 변경 내용이 저장되지 않습니다. 페이지를 새로 고치세요' 같은 상태 메시지나  위젯에 있는 버튼처럼 사용자 작업의 직접적 결과로서 입력란이 업데이트되는 경우와 중요하고 긴급한 업데이트에 사용된다.
- **`aria-live="off"`** 는 **`aria-live`** 인터럽트를 일시적으로 중단하도록 하는 역할을 한다.

라이브 영역이 제대로 작동하도록 하기 위한 방법이 몇 가지 있다.

첫째, 처음에 페이지를 로드할 때 **`aria-live`** 영역을 설정해야 한다. 엄격히 지켜야 할 규칙은 아니지만 **`aria-live`** 영역에 어려운점이 있을 경우 문제가 된다.

둘째, 스크린 리더는 다양한 유형의 변화에 각기 다르게 반응한다. 예를 들어, 하위 Element의 **`hidden`** 스타일을 `true`에서 `false`로 전환해 스크린 리더에서 경고를 발생시킬 수 있다.

**`aria-live`** 와 함께 사용하는 다른 속성들은 라이브 영역이 바뀔 때 사용자에게 전달할 내용을 미세하게 조정하는 데 도움이 된다.

**`aria-atomic`** 은 업데이트를 전달할 때 영역 전체를 하나의 전체로서 간주해야 할 지 여부를 나타낸다. 예를 들어 일, 월, 년으로 구성된 날짜 위젯에 **`aria-live=true`** 와 **`aria-atomic=true`** 가 있고 사용자가 컨트롤을 사용해 월의 값만 변경할 경우 날짜 위젯의 전체 콘텐츠가 다시 읽는다. **`aria-atomic`** 의 값은 **`true`** 또는 **`false`**(기본값)일 수 있다.

**`aria-relevant`** 는 사용자에게 표시해야 할 변경 사항의 유형을 나타낸다. 별도로 사용하거나 목록으로 사용할 수 있는 옵션이 있다.

- *additions*: 라이브 영역에 추가하는 Element가 중요하다는 뜻이다. 예를 들어, 상태 메시지의 기존 로그에 범위를 추가할 경우 이는 사용자에게 그 범위를 알려줄 것이라는 의미이다(**`aria-atomic`** 이 **`false`** 라고 가정).
- *text*: 하위 노드에 추가하는 텍스트 콘텐츠가 관련성이 있다는 뜻이다. 예를 들어, 사용자설정 텍스트 필드의 **`textContent`** 속성을 수정하면 수정한 텍스트를 사용자에게 읽어주게 된다.
- *removals*: 텍스트나 하위 노드 제거를 사용자에게 전달해야 한다는 뜻이다.
- *all*: 모든 변경 사항이 관련성이 있다는 뜻이다. 하지만 **`aria-relevant`** 의 기본값은 **`additions text`** 인데, 이는 곧 **`aria-relevant`** 를 지정하지 않으면 Element에 추가되는 항목에 대해 사용자에게 표시되는 내용을 업데이트할 것이라는 의미이다.

마지막으로, **`aria-busy`** 를 사용하면 Element에 대한 변경 사항을 일시적으로 무시해야 한다고 알려줄 수 있다(예: 로딩중일 때). 모든 절차를 끝낸 후 리더의 작동을 정상화하려면 **`aria-busy`** 를 `false`로 설정해야 한다.
<br/>

#### Reference

- [ARIA - MDN](https://developer.mozilla.org/ko/docs/Web/Accessibility/ARIA)
- [왜 ARIA인가?](https://starkying.tistory.com/entry/%EC%99%9C-ARIA%EC%9D%B8%EA%B0%80)
- [ARIA 레이블과 관계](https://developers.google.com/web/fundamentals/accessibility/semantics-aria/aria-labels-and-relationships?hl=ko)
- [콘텐츠 숨기기 및 업데이트](https://developers.google.com/web/fundamentals/accessibility/semantics-aria/hiding-and-updating-content?hl=ko)
- [Why, How, and When to Use Semantic HTML and ARIA](https://css-tricks.com/why-how-and-when-to-use-semantic-html-and-aria/)
- [레진 WAI-ARIA 가이드라인 소개](https://tech.lezhin.com/2018/04/20/wai-aria)