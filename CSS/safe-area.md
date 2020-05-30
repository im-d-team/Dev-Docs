# Safe-Area(IOS 11 이상 대응하기)

## 안전영역(Safe-Area)이란?

안전영역(Safe-Area)이라는 말은 TV에서 처음 도입된 개념이라고 한다.

TV 해상도 비율이 다양해지면서 영상에서 타이틀, 자막 등의 필수 콘텐츠 노출을 보장할 수 있는 영역이다.

더욱 자세한 정보는 아래의 링크를 추가하였습니다.

> [Caption/Title Safe Area](http://www.indefilms.net/html/title_safe_area.html)

위에서 언급한 것 같이 원래는 TV에서 쓰이는 개념이었지만 프론트엔드 개발자의 입장에서 찾아보며 이해하는 시간을 가지려고 한다.

처음부터 이 개념을 알고 찾아본 것이 아녔다.

회사에서 웹을 개발하다 보면 다양한 Vendor들의 화면을 그리거나 작동하는 방식의 차이로 인해서 이런저런 일을 많이 겪지만, 이번 일은 처음이라 기록으로 남기려고 한다. 

우리나라에서도 아이폰 유저가 많은 비율을 차지하고 있으며 그중에는 많은 버전의 아이폰이 있지만, IOS 11과 함께 출시된 아이폰 X를 기준으로 노치 디자인이 생기고 홈 버튼이 존재하지 않는다.

모든 사건과 사고는 혁신에서 찾아오는 법이다. 애플에서 사건을 만들어 주었다.

<center>
  <img src="https://user-images.githubusercontent.com/24274424/82733281-be5c8b00-9d4d-11ea-8855-f1ba7217b72d.png" alt="Iphone 11" width="200">
</center>

> 드디어 시뮬레이터를 써먹은 나의 MAC

정말 이쁘고 탈모탈모한 디자인인데, 문제가 하나 존재한다. 오직 프론트엔드에게만 골칫거리다.

<center>
  <img src="https://user-images.githubusercontent.com/24274424/82733424-94f02f00-9d4e-11ea-8fee-7e906740584d.png" alt="not bad" width="400">
</center>

가만히 살펴보고 있으면 잘 나오고 있는 게 아니냐고 생각할 수 있다. 잘 생각해보면 저런 게 되어있으면 `아이텍`이라는 글자와 홈 버튼이 겹치게 되어 글자가 눌리지 않게 될 것이다.

이렇게 겹치는 현상이 발생하게 된다.

단순하게 그럼 아래를 공통으로 높이면 되지 않나? 라고 생각할 수 있다. 그러나 그렇게 되면 아이폰 X 이상의 유저만이 아닌 다른 유저들에게는 좋은 경험을 선사하지 못하게 될 수 있다. 특히 하단 Nav가 있는 디자인이라면 더욱더 그러하다.

예시로 네이버에서는 하단에 29px이 직접 박혀있는 것을 확인하였는데 이처럼 한 것이 아이폰을 노리고 한 것인지는 모르나 저렇게 하면서 모든 Vendor를 위한 공통으로 제작하면 된다.(이 또한 좋은 방법일지도...)

우리는 다른 방법으로 해결해보자.

## Home Indicator

앱 개발을 하시는 분들이 어떻게 부르는지 잘 모르나, 약간 찾아본 결과 하단에 있는 홈 버튼 영역을 저렇게 지칭한다고 한다.

Home Indicator를 신경쓰는 웹 사이트는 많이 않다고 생각한다. 그러나 웹뷰를 가지고 서비스를 하는 기업 또는 하단 Nav를 사용하는 기업이 대상이라고 생각한다.

![Area-Data](https://user-images.githubusercontent.com/24274424/82733628-067cad00-9d50-11ea-9c83-f59ed839491b.png)

> 출처 : https://carrotdesign.tistory.com/entry/iPhone-X-iPhone-11의-안전영역Safe-area을-알아보자

어떤 잘 하시는 분이 이쁘게 정리를 하셔서 가져왔다. 위에 사진을 보게 되면 세로 모드 가로 모드에 따라 각각의 영역이 얼마나 되는지 그림과 수치로 보여주고 있다.

![Data-Table](https://user-images.githubusercontent.com/24274424/82733661-49d71b80-9d50-11ea-8409-f32e99e8c88c.png)

여기서 내가 겪었던 부분은 세로 모드일 때 34pt 가로 모드일 때 21pt인 부분이다. 그러나 위에서 언급했듯이 우리는 직접 하드코딩으로 넣지 말고 다르게 넣어보자.

## 해결방안

우리가 해결하려는 화면이 아래와 같다고 하자. 원래는 Home Indicator만 해결해보려고 했으나 추가로 발생할 수 있는 이슈도 같이 해결해보자.

<center>
  <img src="https://user-images.githubusercontent.com/24274424/82733747-04ffb480-9d51-11ea-94d1-62ce8ae5b808.png" alt="Test1_Port" width="200">
  <img src="https://user-images.githubusercontent.com/24274424/82733751-0b8e2c00-9d51-11ea-9845-5dd1a31bc8e3.png" alt="Test1_Land" width="400">
</center>

위의 사진에서 걸리는 부분이 있다. 가로 모드일 때 이상하게 좌우 흰색영역이 거슬린다. 먼저 없애주자.

```html
<meta name='viewport' content='initial-scale=1, viewport-fit=cover'>
```

간단하게 `viewport-fit=cover`를 주게 되면 해결된다. 

<center>
  <img src="https://user-images.githubusercontent.com/24274424/82733917-3b89ff00-9d52-11ea-8503-9018251f0de9.png" alt="Test2_Port" width="200">
  <img src="https://user-images.githubusercontent.com/24274424/82733922-3e84ef80-9d52-11ea-8a39-df4785d4cad9.png" alt="Test2_Land" width="400">
</center>

위와 같이 메타 태그의 기본값은 `auto`이다. 그러나 cover를 주게 되면 꽉 차는 화면을 가지게 된다. 그러나 여기서 보이는 문제는 header라는 글자와 footer라는 글자가 보이지 않게 된다.

### `constant()`, `env()`

애플이 위와 같은 문제를 해결하기 위해 제공하는 CSS 속성이 있다. 

IOS 11 당시 `constant()`라는 속성을 제공하였으나 IOS 11.2로 업데이트가 되면서 `env()` 속성으로 변경이 되었다. 업데이트하지 않은 만약의 경우를 생각해서 둘 다 넣어주면 된다.

```css
header {
  position: fixed;
  left: 0px;
  top: 0px;

  width: 100%;
  height: 30px;

  padding-left: constant(safe-area-inset-left);
  padding-right: constant(safe-area-inset-right);

  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);

  background-color: green;
}
```

```css
footer {
  position: fixed;
  left: 0px;
  bottom: 0px;

  width: 100%;
  height: 30px;

  padding-bottom: constant(safe-area-inset-bottom);
  padding-left: constant(safe-area-inset-left);
  padding-right: constant(safe-area-inset-right);

  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);


  background-color: blue;
}
```

각각 속성 명은 아래와 같이 4개가 된다.

- `safe-area-inset-top`
- `safe-area-inset-bottom`
- `safe-area-inset-left`
- `safe-area-inset-right`

아이폰 X 이상의 폰이 아니라면 해당 CSS 적용되지 않는다.

<center>
  <img src="https://user-images.githubusercontent.com/24274424/82734049-29f52700-9d53-11ea-8f6b-a739dedf6ccd.png" alt="Test3_Port" width="200">
  <img src="https://user-images.githubusercontent.com/24274424/82734053-2cf01780-9d53-11ea-845c-f102470df08e.png" alt="Test3_Land" width="400">
</center>

## 결과물

비록 제가 적용한 부분이 아니지만, 아래와 같이 결과물이 나옵니다.

<center>
  <img src="https://user-images.githubusercontent.com/24274424/82734120-940dcc00-9d53-11ea-9061-d18194a988f0.png" alt="Test3_Port" width="200">
  <img src="https://user-images.githubusercontent.com/24274424/82734039-19dd4780-9d53-11ea-87d9-8e20cbefb51e.png" alt="Test3_Land" width="200">
</center>

#### Reference

- [아이폰X 안전영역(Safe Area) 대응 사례 | WIT블로그](https://wit.nts-corp.com/2019/10/24/5731)
- [아이폰X를 생각하며 디자인하자. | 라이트브레인 블로그](http://blog.rightbrain.co.kr/?p=8499)
- [iPhone X, iPhone 11의 안전영역(Safe area)을 알아보자.](https://carrotdesign.tistory.com/entry/iPhone-X-iPhone-11%EC%9D%98-%EC%95%88%EC%A0%84%EC%98%81%EC%97%ADSafe-area%EC%9D%84-%EC%95%8C%EC%95%84%EB%B3%B4%EC%9E%90)
- [아이폰X 노치영역 대응 최적화하기 – dohoons(도훈) _(≥∇≤)ノミ☆](https://dohoons.com/blog/1468/)
