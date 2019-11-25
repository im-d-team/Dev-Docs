# JSend

RESTful하게 개발하는 건 2019년 현재 개발 트렌드다.

backend - frontend를 완전히 구분하고 자원에 대한 API를 REST하게 설계한다. 이 둘은 JSON 형태로 데이터를 주고받는다.

REST와 관련된 자료는 아래 두 자료를 참고하자.

- [Dev-Docs rest](https://github.com/Im-D/Dev-Docs/blob/master/Network/REST.md)
- [그런 rest api로 괜찮은가](https://www.youtube.com/watch?v=RP_f5dMoHFc)

두번째 자료인 그런 rest api로 괜찮은가를 보면 생각보다 rest api를 구축하기는 상당히 어렵다.
이를 도와주는 약속 중 하나가 JSend다.

## JSend란?

[JSend](https://github.com/omniti-labs/jsend)는 JSON 응답에 대한 스펙이다. 

[JSON](https://ko.wikipedia.org/wiki/JSON) 형식은 더글라스 크락포드가 만든 key-value형식의 데이터 포맷이다. 형식이 매우 자유로운 편이다. 그래서 유연하다.

대신 문제가 있다. 형식이 자유로운 만큼 표준이 없다. 따라서 사이트마다 응답 데이터의 생김새가 모두 다르다.
모양이 다른 문제는 결국 front-end 개발자가 개발할 때마다 다른 모양에 맞춰야 한다는 점이다.

사이트마다, 팀마다, 사람마다 response의 포맷은 같지만, 형식이 다르다면 엄청 귀찮은 일이 될 것이다.

이를 해결하고자 나온 아주 간단한 JSON 스펙이 JSend다.

## specification

```js
{
    status : "success",
    data : [
      { "id" : 1, "category" : "A blog post", "body" : "Some useful content" },
      { "id" : 2, "category" : "A Film", "body" : "parasite" }
    ]
}
```
생김새는 위와 같다.

꽤 많은 사이트에서 위와 같은 포맷의 response를 확인할 수 있다.

매우 간단한 스펙이다. status와 data를 나눈다.

status의 타입도 간단하게 세 가지다.

| TYPE    | Description                                                                                         | Required Keys   | Optional Keys |
|---------|-----------------------------------------------------------------------------------------------------|-----------------|---------------|
| success | All went well, and (usually) some data was returned.                                                | status, data    |               |
| fail    | There was a problem with the data submitted, or some pre-condition of the API call wasn't satisfied | status, data    |               |
| error   | An error occurred in processing the request, i.e. an exception was thrown                           | status, message | code, data    |

- success: 성공
- fail: 데이터에 어떤 문제가 생겼을 때
- error: 프로세스에서 에러가 발생했을 때

### 참고할만한 사항

- data가 null인 경우에도 success일 수 있다. 조회한 데이터의 결과가 null일 수 있기 때문이다.
- post values에 문제가 생겼을 경우 data object의 key가 그 post value와 일치해야 한다.
    ex) title 값이 잘못된 경우 => { "status": "fail", "data" : { "title" : "A title is required" } }
- 에러의 message는 end-user-readable해야한다. error code 같은 것은 optional data로 추가되어야지 message에 들어가면 안 된다.

### 사용이유

HTTP의 status가 있다. 그래도 굳이 body에 status를 표기하는 JSend를 사용하는 이유가 있다.

HTTP는 상태 코드가 너무 많다. 41개 이상의 상태 코드가 있다. 200, 404와 같은 코드들 말이다.
표준이 확실히 있는 것은 좋지만 그만큼 관리하기 어렵다는 문제가 있다.

개발자가 41개의 모든 상태 코드를 다 알고 대응해야 한다. 301과 같은 코드들은 사람이 바로 알 수 없다. human-readable하지 않다.

JSend는 spec이 작고 제한적이다. application-level의 약속이라 protocol에 반하지도 않는다. 
따라서 응용도가 높고 독립적으로 응용이 가능하다.

사용하기 편리하고 가볍고 간단한 표준이다. 따라서 개발단계에서 응답 형식에 얽매이지 않고 바로 개발할 수 있기에 이와 같은 규칙을 사용하면 좋다.

---

#### 참고자료

- [Dev-Docs rest](https://github.com/Im-D/Dev-Docs/blob/master/Network/REST.md)
- [그런 rest api로 괜찮은가](https://www.youtube.com/watch?v=RP_f5dMoHFc)
- [JSend](https://github.com/omniti-labs/jsend)
- [JSend란](https://krksap.tistory.com/1216)