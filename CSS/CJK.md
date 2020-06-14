# CJK

실무에서 은근히 신경 쓰이면서 잘 모르고 있던 것을 발견하여 알아보려고 한다. 

대부분의 사이트에서 텍스트가 많은 경우는 드물다. 그렇기 때문에 내가 지정한 영역 안에서 나오는 텍스트의 넘치는 부분을 무심히 구글링하여 CSS로 처리를 하거나 신경 쓰지 않고 있던 부분이다.

그러나 이 부분은 **CJK**라 불리는 것의 차이를 말하는 것과 동일하다.

먼저 생소한 단어인 CJK에 대해서 먼저 알아보자.

W3C 문서에서는 중국어, 일본어, 한글을 통칭하여 CJK(Chinese, Japanes, Korean의 약자)라 지칭하고 있다.

> 왜 중국, 일본, 한국 순인지는 모르지만, K가 앞에 있으면 좋았을 텐데 우리나라의 영향력을 보여주는 부분 같아 아쉽다.

그리고 CJK를 제외한 나머지를 통칭하여 non-CJK(숫자, 영어, 베트남어 등)라 지칭하자.

그렇다면 본론으로 돌아가서 왜 CJK와 non-CJK를 분리하게 된 이유는 두 가지의 따라서 **단어 분리 방법**이 달라지기 때문이다.

## `word-break`와 `overflow-wrap`

두 CSS 속성은 주로 줄 바꿈을 위해서 사용한다. 각각의 속성이 무엇인지 간단하게 살펴보면,

- word-break : 단어의 분리를 어떻게 할 것인지 결정한다.
  - (공백/띄어쓰기) 스터디가·좋아요
  - (음절) 스·터·디·가·좋·아·요
- overflow-wrap : 박스의 가로 영역을 넘친 단어 내에서 임의의 분리 여부를 결정한다.

<p align="center">
  <img width="600" alt="overflow-wrap" src="https://user-images.githubusercontent.com/24274424/80282842-9ed24280-874e-11ea-93a8-713f3243eff1.png">
</p>

위의 두 속성은 역할이 다르지만 줄 바꿈을 위해 필요한 상황에 따라 선언하며, 또한 조합하여 선언한다.

## `word-break` 속성

줄 바꿈은 허용된 중단점에서 수행되는 것이며, 모든 속성이 기본값이라는 전제하에 줄 바꿈은 대부분의 non-CJK의 경우 공백(띄어쓰기), CJK의 경우 음절로 구분된다.

### 속성값

- normal
- break-all
- keep-all(IE에서는 계속 지원하였으나 webkit에서는 15년 6월부터 지원)

> [W3C의 word-break](https://www.w3.org/TR/css-text-3/#word-break)

#### 예제

원본

```txt
스터디가 좋아요 这是一些汉字 and some Latin و کمی نوشتنن عربی และตัวอย่างการเขียนภาษาไทย
```

`word-break: normal`

```txt
스·터·디·가·좋·아·요·这·是·一·些·汉·字,·and·some·Latin·و·کمی·خط·عربی·และ·ตัวอย่าง·การเขียน·ภาษาไทย
```

`word-break: break-all`

```txt1212
스·터·디·가·좋·아·요·这·是·一·些·汉·字·a·n·d·s·o·m·e·L·a·t·i·n·و·ﮐ·ﻤ·ﻰ·ﺧ·ﻁ·ﻋ·ﺮ·ﺑ·ﻰ·แ·ล·ะ·ตั·ว·อ·ย่·า·ง·ก·า·ร·เ·ขี·ย·น·ภ·า·ษ·า·ไ·ท·ย
```

`word-break: keep-all`

```txt
스터디가·좋아요·这是一些汉字·and·some·Latin·و·کمی·خط·عربی·และ·ตัวอย่าง·การเขียน·ภาษาไทย
```

### 단어의 분리는 CJK, non-CJK에 따라 다르다.

| |normal(기본값)|break-all|keep-all|
|-|------------|---------|--------|
|non-CJK|공백(띄어쓰기, 하이픈'-')|음절|공백(띄어쓰기, 하이픈'-')|
|CJK|음절|음절|공백(띄어쓰기, 하이픈'-', 그 외 기호|

**하이픈도 공백과 같이 인식을 한다는 것과 `keep-all`에서 CJK에서 기호들이 된다는 것에 주의를 해야 한다.**

## `overflow-wrap` 속성

넘친 단어를 대상으로 줄 바꿈을 하고 싶다면, `overflow-wrap` 속성의 값을 바꾸면 된다. 넘친 단어의 분리는 음절에서 발생하며 `white-space` 속성이 기본값(`normal`)일 때만 적용된다.

> 이전에는 `word-wrap` 속성이라고 불렸으나 CSS3부터는 `overflow-wrap`으로 변경되었다.

### 속성값

- normal
- break-word

#### 예제

normal

<p align="center">
  <img width="600" alt="over-flow_normal" src="https://user-images.githubusercontent.com/24274424/80283841-b9f48080-8755-11ea-9dc6-686388bbb693.png">
</p>

break-word

<p align="center">
  <img width="600" alt="over-flow_break-word" src="https://user-images.githubusercontent.com/24274424/80283884-f7590e00-8755-11ea-95d5-3fe3b57dba5e.png">
</p>

### 줄바꿈은 CJK, non-CJK에 따라 다르다.

|       |normal(기본값)|break-word|
|-------|:----------:|:--------:|
|non-CJK|단어넘침 O|단어넘침 X|
|CJK    |단어넘침 X|단어넘침 X|



## 그래서 우리는 어떻게 해야하나?

<p align="center">
  <img width="400" alt="CJK-wrap" src="https://user-images.githubusercontent.com/24274424/80282603-48183900-874d-11ea-8c01-a484718dfb67.jpeg">
</p>

참고로 오타가 있는데 `break-all`이 아니라 `break-word`이다.

> [참고 - MDN_overflow-wrap](https://developer.mozilla.org/ko/docs/Web/CSS/overflow-wrap)

#### Reference

- [word-break 속성과 word-wrap 속성 알아보기](https://wit.nts-corp.com/2017/07/25/4675)
- [overflow-wrap | CSS-Tricks](https://css-tricks.com/almanac/properties/o/overflow-wrap/)
- [CSS Text Module Level 3](https://www.w3.org/TR/css-text-3/#word-break)