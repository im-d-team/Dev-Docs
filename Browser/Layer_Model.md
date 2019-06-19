# Layer Model

브라우저의 layer model에 대해 알아보자.

## layer란

브라우저는 크게 layer를 두가지로 분류한다.

- RenderLayer
- GraphicsLayer

### RenderLayer

렌더 레이어는 DOM의 subTree에 대응되는 [rendering critical path](https://github.com/Im-D/Dev-Docs/blob/master/Browser/%EC%9B%B9%20%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80%EC%9D%98%20%EC%9E%91%EB%8F%99%20%EC%9B%90%EB%A6%AC.md#rendering-engine)의 render tree(frame tree)의 결과를 말한다.

### GraphicsLayer

그래픽스 레이어는 그 외의 레이어를 말한다. 이 글에서 render layer는 크게 중요하지 않으니 그래픽스 레이어만 다루도록 하자.

그래픽스 레이어는 GPU에 텍스쳐로 업로드된다.(GraphicsLayers are what get uploaded to the GPU as textures)

이 GPU의 텍스쳐에 대해 조금 알아보자.

#### GL - GPU

texture는 RAM(주기억장치)에서 GPU의 VRAM(비디오메모리)으로 이동하는 image라고 생각하면 된다.
image가 GPU에 올라가게 되면 mesh geometry라는 것과 매핑된다.

이 mesh는 아래 그림처럼 3차원 모델을 만들 때 다각형의 집합으로 이루어진 모델같은 것이다.

![mesh](https://user-images.githubusercontent.com/24724691/59143838-5876d680-8a0a-11e9-84d0-298b28d622be.png)

[출처: unity documentation](https://docs.unity3d.com/kr/current/Manual/class-Mesh.html)

#### layer-texture

크롬은 각 그래픽스 레이어를 texture로 취급하여 GPU에 올린다.

즉 한 장의 image 파일처럼 취급하여 GPU에게 위임한다.
GPU에서 texture는 사각형의 메쉬로 만들어진다.
그래서 layer의 position을 수정한다거나 변형(transformation)하는 경우 매우 저렴한 비용으로 매핑될 수 있다.

3D CSS는 이러한 방식으로 작동한다.

## layer 생성 기준

이러한 layer가 생성되는 기준은 다음과 같다.

- 3D나 perspective를 표현하는 CSS transform 속성을 가진 경우
- 하드웨어 가속 디코딩을 사용하는 <video> 엘리먼트
- 3D 컨텍스트(WebGL) 혹은 하드웨어 가속 2D 컨텍스트를 가지는 <canvas> 엘리먼트
- (플래시와 같은) 플러그인 영역
- 투명도(opacity) 속성 혹은 webkit transform의 애니메이션의 사용
- 가속 가능한 CSS 필터를 가진 경우[css filter](https://developer.mozilla.org/en-US/docs/Web/CSS/filter)
- 합성 레이어(Compositing Layer)를 하위 노드로 가진 경우
- 낮은(lower) z-index를 가진 형제 노드(Sibling)가 합성 레이어(Compositing Layer)를 가진 경우

## layer 눈으로 확인하기

layer를 확인하는 가장 좋은 방법은 개발자 도구를 이용하는 것이다.
개발자 도구를 열어서 rendering - layer borders 옵션을 켜면 오렌지색 테두리로 레이어를 보여준다.

### 단일 layer

```html
<!DOCTYPE html>
<html>
  <body>
    <div>this is single layer</div>
  </body>
</html>
```

![singleLayer](https://user-images.githubusercontent.com/24724691/59145371-e9a37880-8a1d-11e9-9359-9c6c73fc7437.PNG)

### transform 사용하여 layer 나누기

css transform 속성을 사용하면 layer가 나뉘게 된다.

```html
<!DOCTYPE html>
<html>
  <body>
    <div style="transform: rotateY(30deg) rotateX(-30deg); width: 200px;">
      this is detached layer
    </div>
  </body>
</html>
```

![transformLayer](https://user-images.githubusercontent.com/24724691/59145396-41da7a80-8a1e-11e9-8f5f-6abac2af8ce1.PNG)

transform을 사용하면 div와 body가 구분되어 layer를 가지는 것을 확인 할 수 있다.

### animation

layer를 분리하면 가장 좋은 점은 reflow(relayouting)와 repaint를 하지 않는다는 점이다.

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      div {
        animation-duration: 5s;
        animation-name: slide;
        animation-iteration-count: infinite;
        animation-direction: alternate;
        width: 200px;
        height: 200px;
        margin: 100px;
        background-color: gray;
      }
      @keyframes slide {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(120deg);
        }
      }
    </style>
  </head>
  <body>
    <div>this is animation</div>
  </body>
</html>
```

![animation](https://user-images.githubusercontent.com/24724691/59145581-da71fa00-8a20-11e9-855f-b83835a20aee.gif)

위 사진에서는 초록색 부분이 페인트다.
레이어가 분리되어 다르게 동작하기때문에 paint는 처음에만 일어나며 다시 일어나지 않는다.

### reflow repaint

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      div {
        animation-duration: 5s;
        animation-name: slide;
        animation-iteration-count: infinite;
        animation-direction: alternate;
        width: 200px;
        height: 200px;
        margin: 100px;
        background-color: gray;
      }
      @keyframes slide {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(120deg);
        }
      }
    </style>
  </head>
  <body>
    <div id="foo">I am a strange root.</div>
    <input id="paint" type="button" value="repaint" />
    <script>
      var w = 200;
      document.getElementById('paint').onclick = function() {
        document.getElementById('foo').style.width = w++ + 'px';
      };
    </script>
  </body>
</html>
```

다음의 코드는 버튼을 클릭하면 1px씩 증가한다.

따라서 화면을 재 계산해야 하기 때문에 reflow(relayouting) 후 repaint를 하게 된다.

위 코드는 직접 개발자도구를 실행시켜 확인해보자.

## 종합

레이아웃을 중심으로 브라우저가 DOM을 렌더링 하는 과정은 다음과 같다.

1. DOM을 얻고 그것들을 레이어들로 분리합니다.
2. 이 레이어들 각각을 독립적인 소프트웨어 비트맵으로 출력합니다.
3. 그것들을 GPU에 텍스쳐로써 업로드합니다.
4. 다양한 레이어를 최종 스크린 이미지로 함께 합성(composite)합니다.

강제로 레이어를 분리하여 코딩하면 repaint를 일으키지 않고 동작하기 때문에 성능에 매우 유리하다.

좋은 예로는 [네이버 모바일페이지](https://m.naver.com/)에서 화면을 좌/우로 변경하면서 layer를 확인해보자.

처음에만 paint를 하고 그 뒤로는 layer만 변경되는 것을 찾아볼 수 있다.

### 단점

만능은 아니다.

당연히 레이어별로 메모리를 다르게 할당한다.

또한 GPU의 video memory는 RAM과 물리적으로 다른 공간에 위치한다.
따라서 texture를 옮기는 데이터 송수신의 손실도 발생한다.

또한 RAM => VRAM으로 이동하려면 결국 CPU -> RAM에서 texture 로드 -> GPU VRAM으로 전송의 과정이 필요하다.

CPU가 연산하지 않으면 안된다. CPU가 직접 처리하지 않을 뿐 CPU가 작동하지 않는 것은 아니다.

texture 데이터를 다루는 시간도 고려해야 한다.

---

### 참고자료

- [프론트엔드 개발자를 위한 크롬 렌더링 성능 인자 이해하기](https://medium.com/@cwdoh/%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-%EA%B0%9C%EB%B0%9C%EC%9E%90%EB%A5%BC-%EC%9C%84%ED%95%9C-%ED%81%AC%EB%A1%AC-%EB%A0%8C%EB%8D%94%EB%A7%81-%EC%84%B1%EB%8A%A5-%EC%9D%B8%EC%9E%90-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-4c9e4d715638)
- [Accelerated Rendering in Chrome](https://www.html5rocks.com/en/tutorials/speed/layers/)
- [Unity documentation](https://docs.unity3d.com/Manual/index.html)
