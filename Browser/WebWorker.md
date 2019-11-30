# Web Worker

`WebWorker`는 `script` 실행을 메인 쓰레드가 아니라 백그라운드 쓰레드에서 실행할 수 있도록 해주는 기술이다.

이 기술을 통해 무거운 작업을 분리된 쓰레드에서 처리할 수 있다. 브라우저에서 메인쓰레드라 함은 Rendering을 처리하는 UI쓰레드를 말하는데, 이를 통해 메인 쓰레드는 멈춤, 속도저하 없이 동작할 수 있다.

다음과 같은 작업들을 백그라운드에서 실행하여 더욱 증가한 UX를 제공할 수 있다.

- 매우 복잡한 계산 작업
- 원격리소스에 대한 액세스 작업
- UI 쓰레드에 방해 없이 지속적으로 수행해야 하는 작업(timer, pusher, parser)

## WebWorker의 개념

Worker는 `Worker()` 생성자를 통해 생성되며 지정된 Javascript 파일의 코드를 Worker 쓰레드에서 실행한다. Worker는 현재 `Window` 와 분리된 `DuplicatedWorkerGlobalScope` 라는 별도의 `Global context` 에서 동작한다.

Worker 쓰레드에서 어떠한 코드도 실행할 수 있지만, 몇가지 예외가 있다.

예를들어 Worker 내에서는 `DOM` 을 직접 다룰 수 없다. 또한 `Window` 의 기본 메서드와 속성을 사용할 수 없다. 메인쓰레드와 자원을 공유하기 때문이다.

### 사용예시

Message System을 통해 Worker 와 메인 쓰레드 간에 데이터를 교환할 수 있다.

```html
<div id="result"></div>
<button id="btn">run</button>
<script>
  const sleep = (delay) => {
    const start = new Date().getTime();
    while (new Date().getTime() < start + delay);
  };

  document.querySelector('#btn').addEventListener('click', function () {
    sleep(3000);
    const div = document.createElement('div');
    div.textContent = Math.random();
    document.querySelector('#result').appendChild(div);
  });
</script>
```

`sleep()`의 while이 메인 쓰레드의 콜스택을 점유하기 때문에 3000ms 가 되기 전까지는 다른 작업을 진행 할 수 없다.

```html
<div id="result"></div>
<button id="btn">run</button>
<script>
  document.querySelector('#btn').addEventListener('click', () => {
    const worker = new Worker('./worker.js');
    worker.addEventListener('message', (e) => {
      const div = document.createElement('div');
      div.textContent = e.data;
      document.querySelector('#result').appendChild(div);
      worker.terminate();
    });
    worker.postMessage('워커작동 시작');
  });
</script>

// worker.js
const sleep = (delay) => {
  const start = new Date().getTime();
  while (new Date().getTime() < start + delay);
};

self.onmessage = (e) => {
  console.log(e.data);
  sleep(3000);
  const random = Math.random();
  console.log(random);
  self.postMessage(random);
};
```

이렇게 변경하면 3초를 점유하는 작업은 다른 쓰레드에서 진행하기 때문에 메인쓰레드에는 영향을 주지 않게 된다.

`Worker.postMessage()`를 통해 데이터를 전송할 수 있으며, `Worker.onmessage()` 를 통해 응답할 수 있다. 전송되는 데이터는 공유되지 않으며 복제를 통해 전달되게 된다.

부모와 동일한 origin이라면 Worker내에서 새로운 Worker를 생성하는 것도 가능하다. 또한 이렇게 생겨난 Worker들끼리 서로 통신하는 것 역시 가능하다.

### 유형

- Dedicated Worker
  - 헌신하는 전용 Worker다. 아래의 Shared Worker와 대비된다.
- Shared worker
  - 윈도우 창이나 iframe, Worker등의 다른 브라우징 컨텍스트에서도 공유되는 Worker다.
  - 이름 혹은 URL로 식별된다. Socket 통신처럼 Worker들은 port를 할당받고 이를 통해 통신한다.
  - `new SharedWorker()`로 생성하며 공유하는 전역 스코프를 가진다.
  - [MDN SharedWorker](https://developer.mozilla.org/ko/docs/Web/API/SharedWorker) 
- ServiceWorker
  - Proxy Server의 역할을 한다. 
  - 효율적인 오프라인 경험을 구축하고, 네트워크 요청을 가로채어 통신이 가능한지 여부에 따라 적절한 동작을 수행하며, 서버에 존재하는 자원들을 갱신할 수 있다.
  - 푸시 알림이나 백그라운드 동기화 API에 접근을 허용한다.  
- Audio Workers
  - 스크립트를 통해 직접적인 오디오 처리만을 담당하는 Worker다.
  - 단순한 오디오 출력만이 아니라 Audio API를 이용하여 오디오에 이펙트를 추가하거나 시각화와 같은 작업으로 오디오 객체를 조작할 수 있다.
  - [MDN Web Audio API](https://developer.mozilla.org/ko/docs/Web/API/Web_Audio_API) 

현재 브라우저 지원범위는 [여기](http://caniuse.com/#search=webworker)에서 확인 할 수 있는데, 거의 모든 현대 브라우저에서 작동한다.

---

#### Reference

- [MDN-WebWorker](https://developer.mozilla.org/ko/docs/Web/API/Web_Workers_API)
- [MDN 예제](https://github.com/mdn/simple-web-worker)
- [Shared Worker 블로그](https://m.blog.naver.com/sef16/70163116505)
- [google developers - serviceworker](https://developers.google.com/web/fundamentals/primers/service-workers?hl=ko)
- [웹 워커-zerocho](https://www.zerocho.com/category/HTML&DOM/post/5a85672158a199001b42ed9c)
