# 표준모드 :vs: 쿽스모드

## 들어가기에 앞서...

1. **DTD(Document Type Definition)**
2. 표준모드와 쿽스모드의 차이점은

<br/>

```html
<!DOCTYPE ... > //예시
```

<br/>

## DTD란

> 문서 형식 정의(DTD:Document Type Definition)는 마크업 문서의 요소와 속성등을 해석하는 기준을 명시하는 것입니다.
<br/>

전체적인 Markup 문서를 **어떤 형식에 맞춰서** 해석해야하는지 명시를 해준다는 것이다.
<br/>

문서 형식에는 크게 **HTML5, XHTML, HTML** 의 3가지가 존재한다.
<br/>

이전 버전의 **HTML(HTML2 ~ HTML4)** 은 [SGML](https://ko.wikipedia.org/wiki/SGML)에 기반을 두어 만들어졌기 때문에 상세한 `DTD` 참조가 필요하며, 이 때문에 `DOCTYPE` 선언을 하려면 **공개 식별자**와 **시스템 식별자**가 포함된 긴 문자열을 작성해야 한다.

:point_right: `HTML 4.01 Strict` 모드로 문서 형식을 정의할 경우의 예

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">

PUBLIC "-//W3C//DTD HTML 4.01//EN" //공개 식별자
"http://www.w3.org/TR/html4/strict.dtd" //시스템 식별자
```

<br/>

## **XHTML :vs: HTML5**

### **SGML과 XML**

`SGML(Standard Generalized Markup Language)`은 문서용 마크업 언어를 정의하기 위한 메타 언어이다.
<br/>

`SGML`은 정부나 항공우주 기업의 대규모 계획 사업 과정에서 기계 판독형(machine-readable) 문서를 공유할 목적으로 설계되었다.
<br/>

`SGML`은 인쇄와 출판 산업에 광범위하게 사용되었지만, 너무 복잡한 이유로 소규모 범용 목적으로 사용하는데 걸림돌이 되었다.
<br/>

`XML`은 `SGML`에서 파생된 언어이다. `SGML`을 단순화하려는 시도로 시작되어, `XHTML`, `RSS` 등을 포함해 여러 방면에서 응용되고 있다.
<br/>

### **XHTML**

`XHTML(Extensible Hypertext Markup Language)`은 `HTML`과 동등한 표현 능력을 지닌 마크업 언어로, **`HTML`보다 엄격한 문법을 가진다.**
<br/>

`HTML`이 `SGML`의 응용인 데 반해,  `XHTML`은 `SGML`의 제한된 부분집합인 **`XML`의 응용이다.**
<br/>

`XHTML` 문서는 하나의 `XML` 문서로서 문법적으로 정확해야 하기 때문에, `HTML`과 달리 **표준 `XML` 라이브러리를 이용한 자동화된 처리가 가능하다.**
<br/>

`XHTML 1.0`은 2000년 1월 26일, `W3C(World Wide Web Consortium: 월드 와이드 웹 콘서시엄)`의 권고안이 되었다.
<br/>

### **XHTML vs HTML 5**

2004년 W3C 회의에서 모질라 재단과 오페라 소프트웨어가 새로운 **HTML 표준**을 제안했지만, W3C에 의해 "웹의 혁명을 위한 기존의 지향점에 위배된다"고 거절당했다.
<br/>

이에 인터넷 익스플로러를 제외한 애플, 모질라, 오페라가 `WHATWG`라는 새로운 웹 표준 기관을 설립하고 `HTML5` 표준을 제정했다.  
<br/>

비슷한 시기에 `XHTML 2.0`이 나왔지만 기존의 표준과 너무 동떨어져서 개발자들에게 널리 사용되지 않았고, 2009년 폐기되기에 이르렀다.
<br/>

2014년부터 `HTML5`가 새로운 권고안이 되었다.
<br/>

### **HTML5**

HTML5는 HTML의 완전한 5번째 버전
<br/>

HTML5는 HTML 4.01, XHTML 1.0, DOM 레벨 2 HTML에 대한 차기 표준 제안.
<br/>

비디오, 오디오 등 다양한 부가기능과 최신 멀티미디어 콘텐츠를 액티브X 없이 브라우저에서 쉽게 볼 수 있게 하는 것을 목적으로 한다.
<br/>

## DTD를 정의하지 않으면 쿽스 모드(Quirks mode)로 렌더링된다

`DOCTYPE` 선언이 존재하지 않거나 잘못 적혀있을 경우, 웹 브라우저는 웹문서를 쿽스 모드로 해석한다.
<br/>

쿽스 모드란 ***오래된 웹 브라우저를 위하여 디자인된 웹 페이지의 하위 호환성을 유지하기 위해 웹 브라우저가 웹문서를 해석하는 방식*** 입니다.
<br/>

반대로, 표준 모드(Standards Mode)는 W3C나 IETF(국제 인터넷 표준화 기구)의 표준을 엄격히 준수하여 문서를 해석한다.
<br/>

쿽스 모드에서는 같은 코드라도 웹 브라우저마다 서로 다르게 해석하므로 전혀 다른 결과물을 보여주게 된다.
<br/>

오래된 브라우저의 경우 HTML과 CSS 명세(W3C 표준)가 완성되기도 전에 개발되어서 표준에 부응하지 못하였고, 그를 위해 쿽스 모드가 오래된 브라우저의 행동을 모방하도록 만들어진 것이다.
<br/>

## 표준 모드와 쿽스 모드의 차이

비표준 모드 :  Quirks mode, <br/>
표준 모드 :  Standards mode, <br/>
거의 표준 모드 : almost standards mode, 엄격 모드 : strick mode <br/>
<br/>

> 거의 표준 모드는 표준 모드와 한가지만 빼고 동일함. table 셀에서 비표준모드로 실행하고, 그외 나머지는 표준을 따름 따라서, 테이블 안에 조각난 이미지를 넣을 때, 표준 모드보다 비표준 모드, 거의 표준 모드일 때 이미지 간격이 떨어질 가능성이 덜함
<br/>

### 표준모드와 쿽스모드가 다르게 나타나는 부분(넘어가도 됨)

IE 박스 모델 버그

- 비표준 모드:  width 계산 시, padding, border 를 포함 함.
- 표준 모드: width 계산 시, padding, border를 포함하지 않음.

인라인 요소의 수직 정렬

- 비표준 모드: 박스의 border bottom에 맞추어 이미지를 정렬
- 표준 모드: baseline에 맞추어 정렬

table 안의 font size 상속

- 비표준 모드: table 안에서 텍스트는 기본 font size를 상속하지 않음
- 표준 모드: table 안에서의 텍스트는 기본 font size값을 상속 함.

<br/>

## 모든 Doctype 선언 방법

### HTML 5

```html
<!DOCTYPE html>
```

### HTML 4.01 Strict

- HTML 4.01 는 세가지 DTD가 있는데,  DTD는 지원하는 요소에 따라 다름

1. HTML 모든 요소와 속성을 포함.
2. 표현적인 것과 퇴화 요소는 포함하지 않음.
3. Font 태그 지원 안 함. Frameset 지원 안 함.

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
```

### HTML 4.01 Transitional

1. HTML 모든 요소와 속성 포함
2. 표현적인 것과 퇴화 요소도 포함 (Font 태그 지원)
3. Frameset 지원 안 함.

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
```

### HTML 4.01 Frameset

1. Strict DTD에 있는 것
2. 퇴화 요소와 속성(대부분 시각적 표현에 관한 것).
3. Transitional DTD + Frameset을 허용함.

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">
```

### XHTML 1.0 Strict

1. HTML모든 요소와 속성을 포함
2. 표현적인 것과 퇴화 요소는 포함하지 않음
3. Font 태그 지원 안함. Frameset 지원 안 함.
4. **Markup은 잘 조직된 XML로 쓰여져야 함.**

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
```

### XHTML 1.0 Transitional

1. HTML모든 요소와 속성을 포함.
2. 표현적인 것과 퇴화 요소는 포함( font 태그 지원)
3. Frameset 지원 안 함.
4. **Markup은 잘 조직된 XML로 쓰여져야 함.**

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
```

### XHTML 1.0 Frameset

1. HTML모든 요소와 속성을 포함.
2. 표현적인 것과 퇴화 요소는 포함( Font 태그 지원)
3. Frameset 지원.
4. **Markup은 잘 조직된 XML로 쓰여져야 함.**

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
```

### XHTML 1.1

1. XHTML 1.0 Strict와 같음.
2. Modules을 추가하도록 허용

예를 들어 동아시아언어를 위한 ruby 지원 함.

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
```

<br/>

## 정리

- Doctype이 무엇을 하는 것인가요?

:point_right: 문서 형식을 정의하기 위한 구문.

- HTML5를 사용한다면

:point_right: Example

```html
<!DOCTYPE html>
```

이것만 쓰면 됨.

- 표준모드(standards mode)와 쿽스모드(quirks mode)의 다른 점은 무엇인가?

:point_right: 표준모드는 W3C나 IETF의 표준을 준수하여 웹페이지를 렌더링한다.

쿽스모드는 오래된 웹 브라우저에서도 호환되도록 비표준적인 방법의 `CSS`를 적용해 웹페이지를 렌더링하며, 렌더링 방식은 브라우저에 따라 다르다.
<br/>

`DOCTYPE` 선언이 존재하지 않거나 잘못 적혀있을 경우 브라우저는 웹페이지를 쿽스모드로 해석한다.

---

#### Reference

- [DTD.md](https://gist.github.com/crispynap/09a560619431c599ea3be3553b102791)
- [비표준 모드quirks mode, 표준 모드 standards mode 차이와 DOCTYPE](http://aboooks.tistory.com/m/169)
