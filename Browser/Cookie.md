브라우저에는 다양한 저장소가 있다.

<p align="center">
  <img src="https://user-images.githubusercontent.com/24274424/58260975-698cda00-7db2-11e9-90d9-1cfabfe6a94a.png" alt="Storage">
</p>

> [참고] Chrome 개발자 도구 - Application Tab

위 사진은 Chrome 개발자 도구에 들어가서 Application Tab을 누르게 되면 왼쪽 메뉴에 보이는 Storage로 총 **5개**가 있다. 그 중 가장 아래에 있는 Cookie에 대해서 알아보자

# Cookie

쿠키는 브라우저에 저장되는 작은 크기의 문자열로, **RFC 6265** 명세에서 정의한 HTTP 프로토콜의 일부이다.

서버가 HTTP 응답 헤더(header)의 `Set-Cookie`에 내용을 넣어 전달하면, 브라우저는 이 내용을 자체적으로 브라우저에 저장하는데 이것이 쿠키이다.

브라우저는 사용자가 쿠키를 생성하도록 동일 서버(사이트)에 접속할 때마다 쿠키 내용을 Cookie 요청 헤더에 넣어서 함께 전달한다.

이를 사용하여 쿠키는 클라이언트 식별 같은 인증에 가장 많이 쓰인다.

1. 사용자가 로그인하면 서버는 HTTP 응답 헤더의 `Set-Cookie`에 담긴 세션 식별자(session identifier) 정보를 사용해 쿠키를 설정한다.
2. 사용자가 동일 도메인에 접속하려고 하면 브라우저는 HTTP Cookie 헤더에 인증 정보가 담긴 고유값(세션 식별자)을 함께 서버에 요청으로 보낸다.
3. 서버는 브라우저가 보낸 요청 헤더의 세션 식별자를 읽어 사용자를 식별한다.
 
`document.cookie` 프로퍼티를 이용하면 브라우저에서도 쿠키에 접근할 수 있다.

```js
console.log(document.cookie);
```

`document.cookie`는 `name=value` 쌍으로 구성되어 있으며, 쌍은 `;`로 구분된다. 쌍 하나는 하나의 독립된 쿠키이다.

`document.cookie`에 직접 값을 쓸 수 있다. cookie는 데이터 프로퍼티가 아닌 접근자(accessor) 프로퍼티이다.

```js
// getter
document.cookie = "user=SeonHyungJo";
console.log(document.cookie);
```

`document.cookie`에 값을 할당하면, 브라우저는 이 값을 받아 해당 쿠키를 갱신한다. 다른 쿠키의 값은 변경되지 않는다.

```js
document.cookie = "user=SeonHyungJo";
console.log(document.cookie); // user=SeonHyungJo
document.cookie = "newuser=SeonHyungJo";
console.log(document.cookie); // user=SeonHyungJo; newuser=SeonHyungJo
```

쿠키의 이름과 값엔 특별한 제약이 없다. 하지만 형식의 유효성을 일관성 있게 유지하기 위해 반드시 내장 함수 `encodeURIComponent`를 사용하여 이름과 값을 이스케이프 처리를 해주는 것이 좋다.

```js
let name = 'origin';
let value = "github/SeonHyungJo";

document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);

console.log(document.cookie); // origin=github%2FSeonHyungJo
```

## 단점

- 용량 : **4kb**로 매우 작은 용량이다.
- 속도 : 요청 때마다 포함되어서 간다. 작은 용량이라고 하지만 필요 없는 데이터가 전달되는 낭비가 발생한다.
- 보안 : 위험성이 크다.

## 옵션

### path

- `path=/mypath`

URL path(경로)의 접두사로, 경로나 경로의 하위 경로에 있는 페이지만 쿠키에 접근할 수 있다. 절대 경로이어야 하고, 기본값은 현재 경로이다.

`path=/user` 옵션을 사용하여 설정한 쿠키는 `/user`과 `/admin/something`에선 볼 수 있지만, `/partner` 이나 `/adminpage`에선 볼 수 없다.

특별한 경우가 아니라면, path 옵션을 `path=/`같이 루트로 설정해 웹사이트의 모든 페이지에서 쿠키에 접근할 수 있도록 한다.

### domain

- `domain=imdev.com`

쿠키에 접근 가능한 domain(도메인)을 지정한다. 다만, 몇 가지 제약이 있어서 아무 도메인이나 지정할 수 없다.

domain 옵션에 아무 값도 넣지 않았다면, 쿠키를 설정한 도메인에서만 쿠키에 접근할 수 있다. `imdev.com`에서 설정한 쿠키는 `other.com`에서 얻을 수 없다. 서브 도메인(subdomain)인 `forum.imdev.com`에서도 쿠키 정보를 얻을 수 없다.

```js
// imdev.com에서 쿠키를 설정함
document.cookie = "user=SeonHyungJo"

// imdev.com의 서브도메인인 forum.imdev.com에서 user 쿠키에 접근하려 함
alert(document.cookie); // 찾을 수 없음
```

서브 도메인이나 다른 도메인에서 쿠키에 접속할 방법은 없다. `imdev.com`에서 생성한 쿠키를 `other.com`에선 절대 전송받을 수 없다.

이런 제약사항은 안정성을 높이기 위해 만들어졌는데, 민감한 데이터가 저장된 쿠키는 관련 페이지에서만 볼 수 있도록 하기 위해서다.

정말 `forum.imdev.com`과 같은 서브 도메인에서 `imdev.com`에서 생성한 쿠키 정보를 얻을 방법이 없는 걸까? `imdev.com`에서 쿠키를 설정할 때 domain 옵션에 루트 도메인인 `domain=imdev.com`을 명시적으로 설정해 주면 된다.

```js
// imdev.com에서
// 서브 도메인(*.imdev.com) 어디서든 쿠키에 접속하게 설정할 수 있다.
document.cookie = "user=SeonHyungJo; domain=imdev.com"

// 이렇게 설정하면
// forum.imdev.com와 같은 서브도메인에서도 쿠키 정보를 얻을 수 있다.
alert(document.cookie); // user=SeonHyungJo 쿠키를 확인할 수 있다.
```

하위 호환성 유지를 위해 (imdev.com 앞에 점을 붙인) `domain=.imdev.com`도 `domain=imdev.com`과 같이 작동한다. 오래된 표기법이긴 하지만 구식 브라우저를 지원하려면 이 표기법을 사용하는 것이 좋다.

이렇게 domain 옵션값을 적절히 사용하면 서브 도메인에서도 쿠키에 접근할 수 있다.

> 테스트 해보기(도메인 설정을 한 경우, 안 한 경우)

### expires와 max-age

expires(유효 일자)나 max-age(만료 기간) 옵션이 지정되어있지 않으면, 브라우저가 닫힐 때 쿠키도 함께 삭제된다. 이런 쿠키를 **세션 쿠키(session cookie)** 라 부른다.
expires 나 max-age 옵션을 설정하면 브라우저를 닫아도 쿠키가 삭제되지 않는다.

- `expires=Tue, 19 Jan 2038 03:14:07 GMT`

브라우저는 설정된 유효 일자까지 쿠키를 유지하다가, 해당 일자가 도달하면 쿠키를 자동으로 삭제한다.

쿠키의 유효 일자는 반드시 GMT(Greenwich Mean Time) 포맷으로 설정해야 한다. `date.toGMTString` (`toUTCString`) 을 사용하면 해당 포맷으로 쉽게 변경할 수 있다.

```js
// 지금으로부터 하루 뒤
let date = new Date(Date.now() + 86400e3);
date = date.toGMTString();
document.cookie = "user=SeonHyungJo; expires=" + date;
```

expires 옵션값을 과거로 설정하면 삭제된다.

- `max-age=3600`

max-age는 expires 옵션의 대안으로, 쿠키 만료 기간을 설정할 수 있다. 현재부터 설정하고자 하는 만료일시까지의 시간을 초로 환산한 값을 설정한다. 0이나 음수값을 설정하면 쿠키는 바로 삭제된다.

```js
// 1시간 뒤에 쿠키가 삭제된다.
document.cookie = "user=SeonHyungJo; max-age=3600";

// 만료 기간을 0으로 지정하여 쿠키를 바로 삭제한다
document.cookie = "user=SeonHyungJo; max-age=0";
```

### secure

- `secure`

이 옵션을 설정하면 HTTPS로 통신하는 경우에만 쿠키가 전송된다.

secure 옵션이 없으면 기본 설정이 적용되어 `http://imdev.com`에서 설정(생성)한 쿠키를 `https://imdev.com`에서 읽을 수 있고, `https://imdev.com`에서 설정(생성)한 쿠키도 `http://imdev.com`에서 읽을 수 있다.

쿠키는 기본적으로 도메인만 확인하지 프로토콜을 확인하지 않는다.

하지만 secure 옵션이 설정된 경우, `https://imdev.com`에서 설정한 쿠키는 `http://imdev.com`에서 접근할 수 없다. 쿠키에 민감한 내용이 저장되어 있어 암호화되지 않은 HTTP 연결을 통해 전달되는 걸 원치 않는다면 이 옵션을 사용하면 된다.

```js
// (https:// 로 통신하고 있다고 가정 중)
// 설정한 쿠키는 HTTPS 통신시에만 접근할 수 있음
document.cookie = "user=SeonHyungJo; secure";
```

## samesite

다른 보안 속성인 samesite 옵션은 크로스 사이트 요청 위조(cross-site request forgery, XSRF) 공격을 막기 위해 만들어진 옵션이다.

아래 XSRF 공격 시나리오를 통해 이 속성의 동작 방식과 언제 이 속성을 유용하게 사용할 수 있는지 알아보자.

### XSRF 공격

현재 bank.com에 로그인되어 있을 때. 해당 사이트에서 사용되는 인증 쿠키가 브라우저에 저장되고, 브라우저는 bank.com에 요청을 보낼 때마다 인증 쿠키를 함께 전송한다. 서버는 전송받은 쿠키를 이용해 사용자를 식별하고, 보안이 필요한 재정 거래를 처리한다.

이제 (로그아웃하지 않고) 다른 창을 띄워서 웹 서핑을 하던 도중에 뜻하지 않게 evil.com이라는 사이트에 접속했다 가정하면, 이 사이트엔 해커에게 송금을 요청하는 폼(form) `<form action="https://bank.com/pay">`이 있고, 이 폼은 자동으로 제출되도록 설정되어 있다.

폼이 evil.com에서 은행 사이트로 바로 전송될 때 인증 쿠키도 함께 전송된다. bank.com에 요청을 보낼 때마다 bank.com에서 설정한 쿠키가 전송되기 때문이다. 은행은 전송받은 쿠키를 읽어 (해커가 아닌) 계정 주인이 접속한 것으로 생각하고 해커에게 돈을 송금한다.

이런 공격을 크로스 사이트 요청 위조라고 부른다.

실제 은행은 당연히 이 공격을 막을 수 있도록 시스템을 설계한다. bank.com에서 사용하는 모든 폼에 **XSRF 보호 토큰(protection token)**이라는 특수 필드를 넣는다. 이 토큰은 악의적인 페이지에서 만들 수 없고, 원격 페이지에서도 훔쳐 올 수 없도록 구현되어 있다. 따라서 악의적인 페이지에서 폼을 전송하더라도 보호 토큰이 없거나 서버에 저장된 값과 일치하지 않기 때문에 요청이 무용지물이 된다.

하지만 이런 절차는 구현에 시간이 걸린다.

> 참고 : [CSRF 공격이란? 그리고 CSRF 방어 방법](https://itstory.tk/entry/CSRF-%EA%B3%B5%EA%B2%A9%EC%9D%B4%EB%9E%80-%EA%B7%B8%EB%A6%AC%EA%B3%A0-CSRF-%EB%B0%A9%EC%96%B4-%EB%B0%A9%EB%B2%95)

### samesite 옵션

쿠키의 samesite 옵션을 이용하면 XSRF 보호 토큰 없이도 크로스 사이트 요청 위조를 막을 수 있다.

이 옵션엔 두 가지 값을 설정할 수 있다.

- `samesite=strict`

사용자가 사이트 외부에서 요청을 보낼 때, `samesite=strict` 옵션이 있는 쿠키는 절대로 전송되지 않는다.

메일에 있는 링크를 따라 접속하거나 evil.com과 같은 사이트에서 폼을 전송하는 경우 등과 같이 제3의 도메인에서 요청이 이뤄질 땐 쿠키가 전송되지 않는다.

인증 쿠키에 samesite 옵션이 있는 경우, XSRF 공격은 절대로 성공하지 못한다. evil.com에서 전송하는 요청엔 쿠키가 없을 것이고, bank.com은 미인식 사용자에게 지급을 허용하지 않을 것이기 때문이다.

만약 사용자가 메모장 등에 bank.com에 요청을 보낼 수 있는 링크를 기록해 놓았다가 이 링크를 클릭해 접속하면 bank.com이 사용자를 인식하지 못하는 상황이 발생하기 때문이다. 실제로 이런 경우 `samesite=strict` 옵션이 설정된 쿠키는 전송되지 않는다.

이런 문제는 쿠키 두 개를 함께 사용해 해결할 수 있다. "Hello, SeonHyungJo"과 같은 환영 메시지를 출력해주는 "일반 인증(general recognition)"용 쿠키, 데이터 교환 시 사용하는 `samesite=strict` 옵션이 있는 쿠키를 따로 두는 것이다.

- `samesite=lax` (Chrome default 값)

> [관련 이슈](https://brocess.tistory.com/263)

`samesite=lax`는 사용자 경험을 해치지 않으면서 XSRF 공격을 막을 수 있는 느슨한 접근법이다.

strict와 마찬가지로 lax도 사이트 외부에서 요청을 보낼 때 브라우저가 쿠키를 보내는 걸 막아준다. 하지만 예외사항이 있다.

아래 두 조건을 동시에 만족할 때는 `samesite=lax` 옵션을 설정한 쿠키가 전송된다.

1. 안전한 HTTP 메서드인 경우(예: GET 방식. POST 방식은 해당하지 않음). 

> 또는 `a href`, `link href`

안전한 HTTP 메서드 목록은 RFC7231 명세에서 확인할 수 있다. 안전한 메서드는 읽기 작업만 수행하고 쓰기나 데이터 교환 작업은 수행하지 않는다. 참고로, 링크를 따라가는 행위는 항상 GET 방식이기 때문에 안전한 메서드만 쓰인다.

2. 작업이 최상위 레벨 탐색에서 이루어질 때(브라우저 주소창에서 URL을 변경하는 경우).

대다수의 작업은 이 조건을 충족한다. 하지만 `<iframe>`안에서 탐색이 일어나는 경우는 최상위 레벨 탐색이 아니기 때문에 충족하지 못한다. AJAX 요청 또한 탐색 행위가 아니므로 이 조건이 안된다.

브라우저를 이용해 자주 하는 작업인 "특정 URL로 이동하기"를 실행하는 경우, `samesite=lax` 옵션이 설정되어 있으면 쿠키가 서버로 전송된다. 하지만 외부 사이트에서 AJAX 요청을 보내거나 폼을 전송하는 등의 복잡한 작업을 시도할 때는 쿠키가 전송되지 않는다. 이런 제약사항이 있어도 괜찮다면, `samesite=lax` 옵션은 사용자 경험을 해치지 않으면서 보안을 강화해주는 방법으로 활용할 수 있을 것이다.

samesite는 좋은 옵션이긴 하지만, 한가지 문제점이 있다.

- 오래된 브라우저(2017년 이전 버전)에선 samesite 옵션을 지원하지 않는다.

samesite 옵션으로만 보안 처리를 하게 되면, 구식 브라우저에서 보안 문제가 발생할 수 있다. 구식 브라우저에 대응하지 못한다는 문제가 있긴 하지만, samesite 옵션을 XSRF 토큰 같은 다른 보안 기법과 함께 사용하면 보안을 강화할 수 있다.

구식 브라우저가 사용되지 않는 그날을 위해...

## 함수로 만들어서 사용하기

### getCookie

```js
const getCookie = (name) => {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
```

### setCookie

```js
const setCookie = (name, data, expire = '', path = '') => {
  const date = new Date();
  date.setDate(date.getDate() + expire);
  date.setHours(0, 0, 0, 0)

  document.cookie = `${name}=${data};` + `expires=${date.toGMTString()};` + `path=${path};`;
}
```

### removeCookie

```js
const removeCookie = (name) => {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
```

#### Reference

- https://ko.javascript.info/cookie#ref-271
- https://ifuwanna.tistory.com/223
