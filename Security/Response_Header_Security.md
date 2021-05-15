# 웹 보안, 웹 취약점 막기

웹 개발자들이 많이 알고 사용하고 있는 웹 페이지 사이트로 테스트를 진행해보고 보안 관련한 이슈를 해결해보자.

아래의 사이트를 들어가서 본인의 사이트를 입력한 후 테스트를 진행하면, 진단 후 종합테스트 결과를 보여준다.

> [성능 체크하기](https://www.webpagetest.org/)

![performance 1](https://user-images.githubusercontent.com/24274424/112757684-cf3cf380-9025-11eb-91f6-8450c4c4e29c.png)

### 설정 전

![prev-setting](https://user-images.githubusercontent.com/24274424/112757694-d7952e80-9025-11eb-9d68-402b483fbe26.png)

설정 전에는 보안 영역에서 F가 나온 것을 볼 수 있다.

### 설정 후

![post-setting](https://user-images.githubusercontent.com/24274424/112757704-debc3c80-9025-11eb-9387-2db68f9601fa.png)

추후 설정을 하고 나서 A등급으로 변경된 것을 확인할 수 있다.

### 설정이 필요한 요소

사이트를 테스트해보니 위에서 설정 전처럼 **F 등급**이 나왔다. 자세히 보기 위해서 버튼을 누르게 되면 부족한 설정과 어떤 설정을 해주어야 하는지 친절하게 설명해준다.

![security-list](https://user-images.githubusercontent.com/24274424/112757711-eaa7fe80-9025-11eb-9c39-d7a52eee4f21.png)

각각의 설정에 대해서 알아보고 Cloudfront + S3 구조로 되어있는 곳에서 어떻게 설정해야 하는지 살펴보자.

## Strict Transport Security

흔히 **HSTS**라 불리는 항목으로 http를 사용하는 대신 https를 사용하여 액세스 해야 한다고 알려주는 Header다. 

```text
strict-transport-security: max-age={number}; includeSubdomains
```

**Cache-Control**과 동일한 **max-age**를 설정하여 언제까지 https로만 액세스해야 하는지 설정하며, **includeSubdomains**은 서브도메인까지 포함해서 설정하려고 할 때 사용하는 값이다.

![strict-transport-security](https://user-images.githubusercontent.com/24274424/112757716-eda2ef00-9025-11eb-892a-34a606fe174a.png)

> 참고 : [naver.com](https://naver.com)

네이버에서는 위의 사진과 같이 설정해서 사용하고 있다. preload라는 설정값도 있지만, 해당 값은 적용되지 않는 브라우저도 있으며, 네이버에서도 여러 이유로 사용하고 있지 않은 것으로 보인다.

> [MDN : Strict Transport Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security)

## X-Content-Type-Option

Resource를 다운로드할 때 해당 Resource의 **MIME type**이 일치하지 않는 경우 차단한다.

```text
X-Content-Type-Options: nosniff
```

위와 같이 설정하게 되면 Style Sheet는 MIME type이 `text/css`와 일치할 때까지 Style Sheet를 로드하지 않는다. 또한 공격자가 다른 확장자(jpg)로 서버에 파일을 올린 후 script 태그들의 src 경로를 변경하여 script를 로드하는 등의 공격을 막아준다.

![x-content-type-option](https://user-images.githubusercontent.com/24274424/112757737-03181900-9026-11eb-8c86-e5eafba72b95.png)

> [MDN : X-Content-Type-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options)

## X-Frame-Options

이 Header는 사용자의 눈에 보이지 않는 영역을 추가하고, 사용자는 의도한대로 버튼을 누르지만 실제로는 다른 곳을 클릭하게 만드는 [**ClickJacking**](https://en.wikipedia.org/wiki/Clickjacking)을 방지할 수 있는 옵션이다.

- X-Frame-Options : DENY => 모든 표시를 거부.
- X-Frame-Options : SAMEORIGIN => 동일한 출처에 대한 것만 표시.
- X-Frame-Options : ALLOW FROM https://snyung.com => https://snyung.com에 대해서만 허용.

![x-frame-options](https://user-images.githubusercontent.com/24274424/112757740-057a7300-9026-11eb-8033-d54fec75205c.png)

> [MDN : X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)

## Content Security Policy(CSP)

브라우저에서 XSS와 관련된 공격을 막아주는 Header다. 브라우저는 페이지에서 요청하는 모든 코드를 내려받아 실행한다. 

하지만 CSP를 설정함으로써 브라우저에게 특정 조건의 Resource를 실행하거나 Rendering 지시를 내릴 수 있다. 지시문의 종류는 `default-src`, `script-src`, `child-src`등이 있다.

CSP를 적용하기는 쉽지 않다. 모든 페이지를 정확히 알고 있지 않은 한 어디에 무슨 코드가 숨어있을지 알 수 없기 때문이다. 실제 해당 내용을 바로 적용하는 것이 아니라 위반 사항이 발견될 경우 Report만 받는 것으로 설정을 할 수 있다.

**이 설정은 네이버에서도 사용하고 있지 않는 것으로 보인다.**

> [MDN : CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

## X-XSS-Protection

이 Header는 한 번 https로 접속하는 경우 이후의 모든 요청을 http로 요청하더라도 브라우저가 자동으로 https로 요청한다.

```text
X-XSS-Protection: 1;mode=block
```

위처럼 설정하면 브라우저가 XSS 공격을 감지하면 자동으로 내용을 치환한다. **mode=block** 유무에 따라 내용만 치환하고 사용자 화면에 보여주거나 페이지 로드 자체를 block 할 수 있다.

위 Header는 브라우저의 내장 **XSS Filter**에 의해 처리되므로 브라우저마다 처리 방식이 다를 수 있다. 모든 공격을 막을 수는 없기 때문에 추가적으로 Filter를 설정하여 방어해야 한다.

![x-xss-protection](https://user-images.githubusercontent.com/24274424/112757744-09a69080-9026-11eb-8b57-b780a60ec124.png)

> [MDN : X-XSS-Protection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection)

## 최종 결과물 (Chrome_DevTool)

![response-headers](https://user-images.githubusercontent.com/24274424/112757781-2ba01300-9026-11eb-8325-d343db05ae3d.png)

## CloudFront + Lambda@Edge로 설정하기

CloudFront + S3 구조를 사용하게 되면 Header를 넣어주는 방법을 찾을 수 없다. Cache-Control과 같은 설정은 S3의 설정으로 추가하면 되지만 Response의 Header는 해줄 수 없는 것이다.

그러나 AWS에서는 다른 방법으로 제공해주고 있다. 바로 **Lambda@Edge**이다.

Lambda를 사용해서 CloudFront로 들어와 S3에서 Resource를 가져온 후 Response 전 Lambda Function을 호출하여 Header 값을 추가해줄 수 있는 것이다.

![lambda-1](https://user-images.githubusercontent.com/24274424/112757782-2e026d00-9026-11eb-9620-623044a3949b.png)

아직은 블루프린트에서 cloudfront-modify-response-header 항목이 없어서 버지니아 북부로 설정해주고 생성해야한다.

![lambda-2](https://user-images.githubusercontent.com/24274424/112757785-3064c700-9026-11eb-9276-e77c86968f4a.png)

함수 명을 작성하고 생성하게 되면 CloudFront를 선택하라는 화면이 나오면서 원하는 CloudFront와 연결할 수 있다.

![lambda-3](https://user-images.githubusercontent.com/24274424/112757790-32c72100-9026-11eb-93d3-7d40c7b3b518.png)


아래를 확인해보면 Request에 연결할 것인지, Response에 연결할 것인지 선택할 수 있다. 우리는 Response에 연결해주면 된다.

### Lambda 코드

```js
exports.handler = async (event, context) => {
  const response = event.Records[0].cf.response;
  const headers = response.headers;

  headers['strict-transport-security'] = [{key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubdomains;'}]; 
  headers['content-security-policy'] = [{key: 'Content-Security-Policy', value: default-src 'none'; img-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'}]; 
  headers['x-content-type-options'] = [{key: 'X-Content-Type-Options', value: 'nosniff'}]; 
  headers['x-frame-options'] = [{key: 'X-Frame-Options', value: 'DENY'}]; 
  headers['x-xss-protection'] = [{key: 'X-XSS-Protection', value: '1; mode=block'}]; 
  headers['referrer-policy'] = [{key: 'Referrer-Policy', value: 'same-origin'}]; 

  return response;
};
```

#### Reference

- [https://www.webpagetest.org/](https://www.webpagetest.org/)

