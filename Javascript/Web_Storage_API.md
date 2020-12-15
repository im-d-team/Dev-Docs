# Web Storage API

개발을 진행하다가 클라이언트에서 특정 값을 저장해야 하는 기능 구현 필요성이 생겼다면 어떻게 해야 할까? 쿠키를 사용할 경우 생성할 수 있는 개수 및 데이터 크기 등의 제약 사항이 생길 수 있다. Web Storage API를 사용하게 되면 앞서 의도한 목적에 맞게 기능을 구현할 수 있다.

쿠키의 경우 서버와 효율적으로 통신하기 위한 배경으로 탄생했다. 실제로 쿠키는 HTTP 헤더를 바탕으로 서버와 클라이언트가 서로를 식별하는 인증 과정을 위해 가장 많이 사용된다.

이와 다르게 Web Storage는 클라이언트 로컬 영역에만 값을 저장한다. 또한 서버가 HTTP 헤더로 값을 조작할 수 없다. 오로지 자바스크립트로만 Web Storage의 값을 제어할 수 있다.

Web Storage로 저장되는 값은 Key, Value로 이루어진 객체 형태이며 대부분의 브라우저에서 최소 2MB 이상의 객체를 저장할 수 있다. 4KB밖에 저장하지 못하고 개수 제한이 있는 쿠키와 비교했을 때 Web Storage는 값을 저장하는 용도로 좀 더 적합하다고 볼 수 있다.

Web Storage를 [지원 가능한 브라우저 목록](https://caniuse.com/namevalue-storage)은 아래와 같으며 W3C와 WHATWG에서 표준을 정의하고 있다.

<img width="1358" alt="Screen Shot 2020-11-22 at 1 14 39 PM" src="https://user-images.githubusercontent.com/16266103/99893582-b2ce2a80-2cc4-11eb-8715-207d9df35b32.png">

> 출처: https://caniuse.com/namevalue-storage

## 1. 공통 프로퍼티

Web Storage는 Local Storage와 Session Storage로 나뉜다. 두 Storage는 동일한 메서드와 프로퍼티를 제공하는데 이는 아래와 같다.

- `setItem(key, value)` – 키-값 쌍을 보관
- `getItem(key)` – 키에 해당하는 값을 받아옴
- `removeItem(key)` – 키와 해당 값을 삭제
- `clear()` – 모든 것을 삭제
- `key(index)` – 인덱스(`index`)에 해당하는 키를 받아옴
- `length` – 저장된 항목의 개수를 얻음

Web Storage에 저장되는 key와 value는 모두 String이어야 한다. 숫자나 객체를 넣을 경우 자동으로 문자열로 변경된다.

## 2. Local Storage

Web Storage는 기본적으로 쿠키와 동일하게 오리진(domain/port/protocol)에 따라 값에 대한 접근이 제한된다. Local Storage의 경우 특정 오리진에 저장된 데이터가 있더라도 다른 오리진에서 접근할 수 없다. 오로지 오리진이 같아야만 해당 데이터에 접근할 수 있다.

Local Storage는 아래와 같이 setItem 메소드를 통해 key와 value를 지정하여 데이터를 설정할 수 있다.

```javascript
localStorage.setItem('id', 'dididy');
```

Local Storage에 저장된 데이터를 가져오기위해서는 아래와 같이 getItem 메소드의 매개변수로 가져오고 싶은 key 값을 넣어주면 된다.

```javascript
localStorage.getItem('id'); // dididy
```

Local Storage에 저장된 데이터를 삭제하기 위해서는 removeItem 메서드의 매개변수로 지우고 싶은 key를 넣어주면 해당 값을 삭제할 수 있다.

```javascript
localStorage.removeItem('id');
```

데이터를 추가하거나 삭제할 때 오리진이 같다면 URL 경로가 다르더라도 다른 탭, 다른 브라우저 창에서 데이터가 변경되었음을 확인할 수 있을 것이다. 즉 오리진에 따라 모든 탭과 브라우저 창의 localStorage의 값은 공유되며 데이터의 변화가 Storege Event에 의해 반영된다.

위에서 메서드를 사용한 방법 이외에 권장하진 않지만, 일반 객체처럼 사용하기도 한다. 만약 이와같이 일반 객체처럼 사용할 경우 메서드 이름을 키로 사용할 때의 예외처리를 해줘야 하며 Storage Event가 발생하지 않는다.

```javascript
// setItem
localStorage.id = 'dididy';

// getItem
console.log(localStorage.id); // dididy

// removeItem
delete localStorage.id;
```

Chrome 브라우저의 경우 DevTools의 Application 탭에서 Local Storage를 수정하고 삭제할 수 있다.
<img width="1134" alt="localStorage" src="https://user-images.githubusercontent.com/16266103/99893104-82d05880-2cbf-11eb-8085-80e7cfd8ae14.png">

## 3. Session Storage

Session Storage와 Local Storage의 차이점은 데이터 지속 여부와 접근할 수 있는 데이터 범위에 있다.

저장되면 영구적으로 데이터가 저장되는 Local Storage와 다르게 Session Storage는 브라우저를 닫는 등 세션이 종료되면 데이터가 삭제된다. Session Storage의 이러한 특성으로 인해 보안이 필요한 경우 사용하면 좋다.

앞서 설명했듯이 Local Storage는 오리진이 같다면 전역으로 데이터를 공유할 수 있었다. 하지만 Session Storage의 경우 오리진이 같더라도 서로 다른 탭 혹은 서로 다른 브라우저라면 서로의 데이터를 침범할 수 없다. 즉 Local Storage와 달리 해당 탭에 대해 종속되어 있게 된다.

window.open을 이용해 새로운 창을 열게 되면 기존 창의 Session Storage의 값이 복사되기는 하지만 두 창의 데이터가 공유되지는 않는다.

Session Storage의 프로퍼티 사용 방법은 Local Storage와 일치한다.

## 4. Storage Event

Local Storage와 Session Storage에서 데이터가 갱신될 경우 Storage Event가 실행되는데 이에대한 프로퍼티는 아래와 같다.

- `key` – 변경된 데이터의 키(`.clear()`를 호출했다면 `null`)
- `oldValue` – 이전 값(키가 새롭게 추가되었다면 창null`)
- `newValue` – 새로운 값(키가 삭제되었다면 `null`)
- `url` – 갱신이 일어난 문서의 url
- `storageArea` – 갱신이 일어난 `localStorage`나 `sessionStorage` 객체

Local Storage에서 같은 오리진인 경우 Local Storage의 값이 변경되는 경우 window객체로 전송한다. event.url을 사용하면 갱신된 문서의 URL을 알 수 있다.

```javascript
window.addEventListener('storage', (event) => {
  if (event.key != 'now') return;
  alert(event.key + ':' + event.newValue + " at " + event.url);
});

localStorage.setItem('now', Date.now());
```
> 출처: https://ko.javascript.info/localstorage

## 마무리

Web Storage을 잘 응용한 사례는 다음과 같은 경우가 있을 수 있다.

- 웹서버의 데이터 캐시
- 같은 오리진일 경우 서버를 통하지 않고 모든 탭, 브라우저 창의 정보 갱신([Broadcast Channel API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API)의 폴리필 구현 시 사용할 수 있음)
- 글쓰기 등 창이 닫힐 경우를 대비해 값을 저장해야 하는 경우
- base64로 변환된 Canvas나 이미지 임시 저장
- 웹페이지의 개인화 설정 저장 및 제공(캐시로서의 역할)

<img width="375" alt="Screen Shot 2020-11-22 at 1 20 59 PM" src="https://user-images.githubusercontent.com/16266103/99893931-9252a000-2cc5-11eb-9c28-f01d2f272ccc.png">

> Netflix Local Storage에 저장되는 정보

---

#### Reference

- [MDN: Web Storage API](https://developer.mozilla.org/ko/docs/Web/API/Web_Storage_API)

- [W3C: Web Storage](https://www.w3.org/TR/webstorage/)

- [Modern Javascript Tutorial: localSotrage와 sessionStorage](https://ko.javascript.info/localstorage)
