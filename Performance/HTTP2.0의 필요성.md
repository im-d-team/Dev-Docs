# HTTP2.0의 필요성

## HTTP/1.1

HTTP/1.1의 동작 방식은 간단하다. Connection하나 당 하나의 요청만 처리한다. 따라서 **동시 전송이 불가능하고 요청과 응답이 순차적으로 처리된다.** 처리할 리소스(img, css, script)가 많아질수록 Latency(대기시간)은 길어지게 되고 이는 치명적이다.

<br/>

### Header와 3-way Handshake의 반복

---

HTTP/1.0의 또 다른 문제로는 매 **Connection마다 중복된 헤더 요청이 일어나고, 매 요청마다 3-way Handshake가 반복적으로 일어난다.** Header가 Body보다 무거운 경우가 발생할 수 있으며, `3-way Handshake`가 반복적으로 발생하면 `RTT(Round Trip Time)`이 증가하게 되고 성능이 저하된다.

<br/>

## 성능 향상

### Pipelining

---

위에서 설명한 HTTP/1.1의 단점인 하나의 Connection 당 하나의 처리만 가능한 것을 보완해 **하나의 Connection에 다수의 리소스를 요청할 수 있는 기법으로서 `Pipelining`이 있다.**

하지만 만약 첫 번째 리소스의 응답 시간이 길어지게 되면 응답 처리가 완료되기 전까지 나머지 리소스의 요청은 대기 상태에 빠진다. 이는 `Pipelining`의 문제이며 이를 **HOLB(Head of Line Blocking)**라고한다.

<br/>

### Image Spriting(CSS Spriting)

---

Image Spriting은 이미지 여러 개를 하나로 만들고 `background-position` 속성을 이용해 필요한 부분의 이미지만 보여준다. 즉, 해당 이미지의 좌표 값을 지정해 렌더링한다.

이미지의 갯수만큼 HTTP 요청을 했던 방식을 **한 번의 요청으로 줄일 수 있어** 렌더링 속도가 향상될 수 있다.

```css
#spriteImg span {
  background: url(images/buttons-bg.png) no-repeat;
}

#spriteImg #profile span {background-position: 0 0;}
#spriteImg #github span {background-position: 0 -15px;}
```

<br/>

### 도메인 샤딩(Domain Sharding)

---

**`도메인 샤딩`은 여러 개의 서브도메인을 생성하여 리소스를 병렬로 가져온다. 기본적으로 HTTP/1.1에서는 도메인 당 동시 요청의 갯수가 제한되기 때문에 이는 해결책이 될 수 있다.** 

하지만, 각 하위 도메인의 DNS 조회를 하고 이는 시간, CPU 전력을 생각보다 많이 소모하게 된다. 또한 현재 많은 모바일 브라우저가 `Piplining`을 구현하고 있기 때문에 근본적인 해결책은 될 수 없다. 


### Minification

리소스의 용량을 줄이기 위해 CSS, Script 코드를 축소하여 적용하는 방식이다.


## HTTP2.0

위의 여러 방법들이 있지만 분명 한계가 존재하기 때문에 HTTP2.0이 필요해졌고 이에 대한 설명은 [HTTP2.0과 Web Socket](https://github.com/Im-D/Dev-Docs/blob/master/Browser/HTTP2_Websocket.md)에서 대체한다.

---

#### Reference

- [나만 모르고 있던 - HTTP/2](https://www.popit.kr/%EB%82%98%EB%A7%8C-%EB%AA%A8%EB%A5%B4%EA%B3%A0-%EC%9E%88%EB%8D%98-http2/)
- [도메인 샤딩](https://wonism.github.io/domain-sharding/)