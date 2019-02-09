# Tagged Template Literals

## Template literals

literals 즉 입력하는 값에 백틱(`)과 치환자(\${})로 템플릿을 설정할 수 있는 기능이다. ES6에서 추가 된 기능이다. 이미 너무 많은곳에서 사용하고 있기에 간단하게만 알아보자.

```js
var area = '서울';
var temper = 10;

console.log('이번달 ' + area + '의 평균온도는 ' + temper + '도입니다.'); // 1
console.log('이번달', area, '의 평균온도는', temper, '도입니다.'); // 2

//이번달 서울의 평균온도는 10도입니다.
//이번달 서울 의 평균온도는 10 도입니다.
```

Template Literals를 사용하지 않았을 때의 방법이다. 1번이 전통적인 방법이며 2번의 경우 사용은 편하지만 공백이 자동으로 달라붙어 조금 귀찮다.

```js
console.log(`이번달 ${area}의 평균온도는 ${temper}도입니다.`);
```

Template Literals를 사용해 1번의 결과와 완벽히 똑같이 만들수 있다.

참고로 Template String이라고도 이야기하는데 이는 오래된 표현이며 Literal이 옳은 표기법이다

## Expression

단순히 사용만 편한것은 아니다. 저 \${} 사이에는 expression(표현식)이 들어갈 수 있다.

```js
var a = 5;
var b = 8;
console.log(`${a}와 ${b}의 합은 ${a + b}이며,
${a}와 ${b}의 곱은 ${a * b}입니다.
`);
// 5와 8의 합은 13이며,
// 5와 8의 곱은 40입니다.
```

표현식을 사용한 예제다. 참고로 멀티라인을 지원하는데 이 경우 LF(\n)으로 줄바꿈된다.

```js
var nike = true;
var shoes = ['Adidas', 'Vans', 'Puma'];
var out = `Shoes : ${nike ? shoes.join(',') : ''}`;

console.log(out);
// Shoes : Adidas,Vans,Puma (nike가 true)
// Shoes :  (nike가 false)
```

표현식을 이용하여 다양하게 활용이 가능하다.

## Tagged Template Literals

이제 태그가 붙여진 Template Literals다.

```js
var shoes = ['Adidas', 'Vans', 'Puma'];
var result = js`제 신발은 ${shoes[0]}입니다. ${shoes[1]}와${shoes[2]}도 있습니다`;

function js(strings, expr1, expr2, expr3) {
  debugger;
  return 'complete';
}
```

tag는 js라고 임의의 이름으로 만들었다. Template Literal 앞에 붙은 태그는 함수다.

브라우저에서 디버거로 strings를 확인하면 `["제 신발은 ", "입니다. ", "와", "도 있습니다"]` 다. 즉 순수 string부분이다. expr1, 2, 3은 차례대로 들어온 표현식의 결과 값이다. 즉 기존의 문자열과 표현식을 구분하여 사용할 수 있게 된다.

그런데 태그가 함수라면 그냥 함수를 사용하지 이렇게 사용해야 하는 이유가 뭘까? 라고 생각할 수 있다.

```js
var shoes = ['Adidas', 'Vans', 'Puma'];
var result = js(`제 신발은 ${shoes[0]}입니다. ${shoes[1]}와${shoes[2]}도 있습니다`);

function js(strings, expr1, expr2, expr3) {
  return 'complete';
}
```

이렇게 말이다. 그런데 이렇게 사용하면 strings는 하나의 완성된 string이며 expr 1, 2, 3은 undefined다. 완성된 결과만 가질 수 있다.

```js
var shoes = ['Adidas', 'Vans', 'Puma'];
//debugger
var result = js(['제 신발은 ', '입니다. ', '와', '도 있습니다'], shoes[0], shoes[1], shoes[2]);

function js(strings, expr1, expr2, expr3) {
  return 'complete';
}
```

따라서 이렇게 표기해야만 같은 기능을 한다.

## 활용

그렇다면 이를 어디에 사용할까?? 사실 사용방법은 굉장히 다양하겠지만 react에서 아주 쉽게 찾아볼 수 있는 styled-components를 생각해보자.

```js
const Button = styled.button`
  font-size: ${props => (props.primary ? '2em' : '1em')};
`;
```

만일 tagged template literals가 없었다면 styled-components의 이 표기법은 존재할 수 없다.

또 [es2015-i18n-tag](https://github.com/skolmer/es2015-i18n-tag) 라고하는 i18n / l10N 라이브러리도 있다.

```js
console.log(i18n`Hello ${name}, you have ${amount}:c in your bank account.`);
// Hallo Steffen, Sie haben € 1,250.33 auf Ihrem Bankkonto.
```

영어를 받아서 미리 지정해둔 언어로 교체할 수 있다. strings를 받아 언어를 변경한다.

Tagged Template Literals를 통해 HTML이나 CSS 파서등을 만들 수도 있을 것이다. 더 나아가 [XRegExp](http://xregexp.com/) 라고 정규표현식을 파싱한 라이브러리도 존재한다.

## 참고자료

[The magic behind 💅 styled-components](https://mxstbr.blog/2016/11/styled-components-magic-explained/)

[Tagged Template literals — Its more than you think](https://codeburst.io/javascript-es6-tagged-template-literals-a45c26e54761)

[ES2015 Tagged Template Literal](https://www.zerocho.com/category/ECMAScript/post/5aa7ecc772adcb001b2ed6f3)-zerocho

[ES6 번역프로젝트 - 8.Template리터럴](https://github.com/ES678/Exploring-ES6/blob/master/08%20Template%20%EB%A6%AC%ED%84%B0%EB%9F%B4/README.md)

[ES6 Tagged Template Literals](https://www.youtube.com/watch?v=c9j0avG5L4c&t=335s) - youtube video
