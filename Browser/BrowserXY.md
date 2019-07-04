# 브라우저의 XY

브라우저에 event가 발생했을 때에 x, y 좌표 값을 얻는 방법에는 크게 4가지가 있다.

- clientX / clientY
- pageX / pageY
- screenX / screenY
- offsetX / offsetY

이렇게 4가지가 존재하는데 어떤 차이가 있는지 알아보았다.

## clientX / clientY

client는 viewport와 매칭된다고 생각하면 쉽다.

브라우저의 화면인 viewport를 기준으로 좌표를 계산한다. 브라우저의 현재 보이는 화면을 기준으로 어느 곳을 선택했는지 반환한다.

스크롤을 하게 되어도 화면의 같은 곳을 클릭하면 같은 값이 반환된다.
브라우저의 크기가 달라져도 화면의 같은 곳에서는 같은 값이 변경된다.

어느 정도 절대값이라고 할 수 있다.

## pageX / pageY

page는 html문서와 매칭된다.

client는 현재 브라우저에 보여지는 부분이다. page는 그것과 상관없이 렌더된 html문서가 기준이다.

스크롤을 하게 되면 값이 달라진다.
브라우저의 크기를 줄여도 값과는 상관없다.

## screenX / screenY

screen은 user device의 모니터를 기준으로 한다.
모니터의 어느 부분을 클릭했는지 물리적인 값을 반환한다.

따라서 브라우저 상단의 tab, bookmark와 같은 정보들의 높이도 포함한다.

스크롤을 해도 달라지지 않는다.
브라우저의 크기가 달라지는 것은 관계가 없다. 다만 브라우저를 작게하여 모니터상의 브라우저 위치를 이동하면 값이 달라질 수 있다.

## offsetX / offsetY

offset은 이벤트가 걸린 DOM기준이다. 예를들어 div를 클릭했다면 div의 왼쪽 상단 모서리가 0, 0이 된다.

스크롤을 해도 달라지지 않는다.
브라우저가 달라져도 값은 달라지지 않는다.

다만 event.target의 크기가 변경된다면 달라질 수 있다.

## 사진으로 보기

글로만 보면 상당히 헷갈린 개념이다. 여러 링크에서 사진들을 모아봤으니 눈으로 확인하자.

![](https://user-images.githubusercontent.com/24724691/59552616-4970c500-8fc4-11e9-93ae-a15ebd27b2cb.png)

![](https://user-images.githubusercontent.com/24724691/59552615-4970c500-8fc4-11e9-9995-fb8bbbcc6cf3.jpg)

![](https://user-images.githubusercontent.com/24724691/59552617-4a095b80-8fc4-11e9-9a39-c56ce0d2baf1.png)

마지막 사진은

- yellow : screen
- blue : client
- red : page

로 매칭된다.

사진의 출처는 아래에 링크로 대체한다.

## 예제로 확인하기

헷갈린 개념은 직접 디버깅하는 것이 좋다.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Document</title>
    <style>
      * {
        margin: 0;
        padding: 0;
      }

      .container {
        overflow-x: scroll;
        overflow-y: scroll;
        background-color: #fcc2d7;
      }

      .click {
        width: 150%;
        height: 120vh;
        margin: 0 auto;
        padding: 20px;
        border: 10px solid #000;
        background-color: #74c0fc;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="click">target</div>
    </div>
  </body>
  <script>
    const click = document.querySelector('.click');
    window.addEventListener('load', () => {
      click.addEventListener('click', event => {
        console.log(`client: (${event.clientX}, ${event.clientY})`);
        console.log(`page: (${event.pageX}, ${event.pageY})`);
        console.log(`screen: (${event.screenX}, ${event.screenY})`);
        console.log(`offset: (${event.offsetX}, ${event.offsetY})`);
      });
    });
  </script>
</html>
```

---

### 참고자료

- [screen, client, page, offset compare](https://m.blog.naver.com/PostView.nhn?blogId=sung487&logNo=220418825028&proxyReferer=https%3A%2F%2Fwww.google.com%2F)
- [clientX, offsetX, pageX, screenX의 차이](http://megaton111.cafe24.com/2016/11/29/clientx-offsetx-pagex-screenx%EC%9D%98-%EC%B0%A8%EC%9D%B4%EC%A0%90/)
- [What is the difference between screenX/Y, clientX/Y and pageX/Y?](https://stackoverflow.com/questions/6073505/what-is-the-difference-between-screenx-y-clientx-y-and-pagex-y)
- [What is the difference between pageX/Y clientX/Y screenX/Y in Javascript?](https://stackoverflow.com/questions/9262741/what-is-the-difference-between-pagex-y-clientx-y-screenx-y-in-javascript/17705548)
