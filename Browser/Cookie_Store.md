# New Cookie Store API(after Chrome 87)

2020년 11월 01일 기준 Chrome의 버전은 `86.0.4240.111`이다.

![chrome_version](https://user-images.githubusercontent.com/24274424/97792446-d223eb80-1c21-11eb-8733-36687902850a.png)

추후 버전 87에 추가되는 기능 중에서 Cookie관련 API를 알아보자.

# Release

Cookie Store API는 HTTP 쿠키를 서비스 워커에서도 접근이 가능하며, `document.cookie`에서 비동기적으로 사용가능하도록 하는 기능이라고 명세가 되어있다.

> [Chrome Platform Status](https://www.chromestatus.com/feature/5658847691669504)

![chrome_status](https://user-images.githubusercontent.com/24274424/97792406-372b1180-1c21-11eb-9fcc-f8ef35f8385c.png)

위와 같이 87 버전에 포함된 항목은 추후 업데이트를 하게 되면 확인가능하며, 다른 브라우저들은 아직 적용이 안됨으로 사용하는데 주의가 필요하다.

## 관련 Issue

1. [Add cookie accessor/setter methods? · Issue #707 · w3c/ServiceWorker](https://github.com/w3c/ServiceWorker/issues/707)

2. [Possible API Sketch · Issue #14 · WICG/cookie-store](https://github.com/WICG/cookie-store/issues/14)

# Document

W3C Community Group에서 처음 나온 초안으로 관련 레포인 [WICG/cookie-store](https://github.com/WICG/cookie-store)을 들어가면 설명이 있다.

새로운 API 기존의 cookie의 스펙을 바꾸지 않고 사용하는 방식이며 위에서 언급되었던 바와 같이 Service Worker에서의 접근과 비동기적으로 처리할 수 있게 하는 것을 주 목표로 삼고 있다(Promise 사용).

간단하게 인터페이스를 살펴보자.

```cpp
[Exposed=(ServiceWorker,Window), SecureContext]

interface CookieStore : EventTarget {
  Promise<CookieListItem?> get(USVString name);
  Promise<CookieListItem?> get(optional CookieStoreGetOptions options = {});

  Promise<CookieList> getAll(USVString name);
  Promise<CookieList> getAll(optional CookieStoreGetOptions options = {});

  Promise<undefined> set(USVString name, USVString value);
  Promise<undefined> set(CookieInit options);

  Promise<undefined> delete(USVString name);
  Promise<undefined> delete(CookieStoreDeleteOptions options);

  [Exposed=Window]
  attribute EventHandler onchange;
};

dictionary CookieStoreGetOptions {
  USVString name;
  USVString url;
};

enum CookieSameSite {
  "strict",
  "lax",
  "none"
};

dictionary CookieInit {
  required USVString name;
  required USVString value;
  DOMTimeStamp? expires = null;
  USVString? domain = null;
  USVString path = "/";
  CookieSameSite sameSite = "strict";
};

dictionary CookieStoreDeleteOptions {
  required USVString name;
  USVString? domain = null;
  USVString path = "/";
};

dictionary CookieListItem {
  USVString name;
  USVString value;
  USVString? domain;
  USVString path;
  DOMTimeStamp? expires;
  boolean secure;
  CookieSameSite sameSite;
};

typedef sequence<CookieListItem> CookieList;
```

`interface CookieStore`를 살펴보기 전 상단의 코드를 보게 되면, window뿐만 아니라 ServiceWorker가 있는 것을 확인할 수 있다.

`interface CookieStore`에는 우리가 사용할 수 있는 메서드들과 이벤트 핸들러가 있는 것을 볼 수 있는데, 이벤트 핸들러는 window에서만 사용이 가능하다.

`getAll`, `get`, `delete` 메서드를 사용하는 방법은 기본적으로 cookie의 이름만으로 사용할 수 있고, option이라는 것을 통해서 가져오거나 삭제가 가능한다. 자세한 형태는 아래를 살펴보면 된다.

간단하게 `dictionary CookieInit` 부분을 보게 되면 cookie에서 사용하는 설정 중 CookieSameSite의 기본값이 strict라는 것을 알 수 있다. 

최근 Chrome 86에서 변경된 Cookie 정책을 알고 있다면, 86 버전 이전 기본값이 `none`이였다면, 86이후에는 기본값이 `lax`로 바뀐 것을 알 것이다. 그런데 해당 API에서는 기본값이 `strict`이다.

이 부분의 차이점을 알고있는 것이 중요하다.

> [Browser Cookie](https://github.com/im-d-team/Dev-Docs/blob/master/Browser/Cookie.md)

# Explainer

[Cookie Store API Explainer](https://wicg.github.io/cookie-store/explainer.html)

## Method

### 일반적인 사용법

```js
document.cookie =
  '__Secure-COOKIENAME=cookie-value' +
  '; Path=/' +
  '; expires=Fri, 12 Aug 2016 23:05:17 GMT' +
  '; Secure' +
  '; Domain=example.org';
// now we could assume the write succeeded, but since
// failure is silent it is difficult to tell, so we
// read to see whether the write succeeded
var successRegExp =
  /(^|; ?)__Secure-COOKIENAME=cookie-value(;|$)/;
if (String(document.cookie).match(successRegExp)) {
  console.log('It worked!');
} else {
  console.error('It did not work, and we do not know why');
}
```

### set

```js
const one_day_ms = 24 * 60 * 60 * 1000;
cookieStore.set(
  {
    name: 'imd',
    value: '1',
    expires: Date.now() + one_day_ms,
  }).then(function() {
    console.log('It worked!');
  }, function(reason) {
    console.error(
      'It did not work, and this is why:',
      reason);
  });
```

### get

```js
try {
  const cookie = await cookieStore.get('imd');
  if (cookie) {
    console.log(`Found ${cookie.name} cookie: ${cookie.value}`);
  } else {
    console.log('Cookie not found');
  }
} catch (e) {
  console.error(`Cookie store error: ${e}`);
}
```

### getAll

```js
try {
  const cookies = await cookieStore.getAll('imd');
  for (const cookie of cookies)
    console.log(`Result: ${cookie.name} = ${cookie.value}`);
} catch (e) {
  console.error(`Cookie store error: ${e}`);
}
```

### delete

```js
try {
  await cookieStore.delete('imd');
} catch (e) {
  console.error(`Failed to delete cookie: ${e}`);
}
```

### event

```js
cookieStore.addEventListener('change', event => {
  console.log(`${event.changed.length} changed cookies`);
  for (const cookie of event.changed)
    console.log(`Cookie ${cookie.name} changed to ${cookie.value}`);

  console.log(`${event.deleted.length} deleted cookies`);
  for (const cookie in event.deleted)
    console.log(`Cookie ${cookie.name} deleted`);
});
```

### Reference

- [Cookie Store API](https://wicg.github.io/cookie-store/)
- [web-platform-tests/wpt](https://github.com/web-platform-tests/wpt/tree/master/cookie-store)
- [Digital Information World](https://www.digitalinformationworld.com/2020/10/chrome-87-beta-is-aiming-to-become-much.html)
- [web-platform-tests/wpt](https://github.com/web-platform-tests/wpt/tree/master/cookie-store)
- [Asynchronous Access to HTTP Cookies | Web | Google Developers](https://developers.google.com/web/updates/2018/09/asynchronous-access-to-http-cookies)
- [Asynchronous Cookie Access on the Web](https://docs.google.com/document/d/1ak6JzOMMO5q3dXvu4mHFWR-LLvaDc09XDvdeJZLtZd4/edit#heading=h.7nki9mck5t64)
