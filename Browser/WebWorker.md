# Web Worker

`WebWorker`는 `script` 실행을 메인 쓰레드가 아니라 백그라운드 쓰레드에서 실행할 수 있도록 해주는 기술이다.
<br/>

이 기술을 통해 무거운 작업을 분리된 쓰레드에서 처리할 수 있으며, 이를 통해 메인 쓰레드(일반적으로 UI 쓰레드)는 멈춤, 속도저하 없이 동작할 수 있다.
<br/>

## WebWorker의 개념과 활용

`Worker` 는 `Worker()` 생성자를 통해 생성되며 지정된 `Javascript` 파일에 포함된 코드를 `Worker` 쓰레드에서 실행하며, (`Worker`는 현재 `Window` 와 분리된 `DuplicatedWorkerGlobalScope` 라는 별도의 `Global context` 에서 동작) `Worker` 쓰레드에서 어떠한 코드도 실행할 수 있지만, 몇가지 예외가 있다.
<br/>

예를들어 `Worker` 내에서는 `DOM` 을 직접 다룰 수 없다. 또한 `Window` 의 기본 메서드와 속성을 사용할 수 없다.
<br/>

`Message System` 을 통해 `Worker` 와 메인 쓰레드 간에 데이터를 교환할 수 있다.
<br/>

`Worker.postMessage()` 메서드를 통해 데이터를 전송할 수 있으며, `Worker.onmessage` 이벤트 핸들러 `Attribute` 를 통해 응답할 수 있다. (전송되는 메세지는 `MessageEvent.data` 에 포함). 전송되는 데이터는 공유되지 않으며 복제를 통해 전달되게 된다.
<br/>

부모페이지와 동일한 `Origin` 내에서 `Worker` 는 새로운 `Worker` 를 생성할 수 있다.  `Worker` 들은 `XMLHttpRequest` 를 통해 네트워크 통신을 할 수 있지만 `XMLHttpRequest` 의 `responseXML` 과 `channel attribute` 는 항상 `null` 을 반환한다.
<br/>

지금까지 알아본 `Dedicated Worker` 와 다른 유형의 `Worker`들도 존재한다.
<br/>

- `Shared worker` 는 `Worker` 가 동일한 도메인 내에 존재하는 여러 `script` 에 의해 사용될 수 있다. `Shared Worker` 는 `Dedicated worker` 보다 좀더 복잡성을 가지고 있다. 예를들어 `Script` 들은 반드시 활성화된 `Port` 를 통해 통신해야 한다.
- `ServiceWorker` 는 웹 어플리케이션 사이의 `Proxy Server`와 브라우저로서 역할을 하며 (만약 가능하다면)통신을 구축한다. 이를 통해 효율적인 오프라인 경험을 구축하고, 네트워크 요청을 가로채어 통신이 가능한지 여부에 따라 적절한 동작을 수행하며, 서버에 존재하는 자원들을 갱신할 수 있다. 또한 푸시 알림이나 백그라운드 동기화 API에 접근을 허용한다.
- `Chrome Worker` 는 `Firefox` 에서만 사용 가능한 `worker` 유형으로 Add-on을 제작할 때나 확장기능에서 `Worker` 를 사용하고 싶을 때 사용할 수 있으며, `Worker` 에서 `js-ctypes` 에 접근할 수 있다.
- `Audio Workers` 는 스크립트를 통한 직접적인 오디오 처리를 `Web Worker` 에서 처리할 수 있도록 해준다.

<br/>

---

#### Reference

- [MDN-WebWorker](https://developer.mozilla.org/ko/docs/Web/API/Web_Workers_API)
- [MDN 예제](
https://github.com/mdn/simple-web-worker)


