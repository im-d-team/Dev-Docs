# Jest로 테스트 코드 작성하기

개발자로서 살아가다 보면 테스트 코드의 중요성에 대해 들어본 적 있을 것이다. 과연 테스트 코드는 중요할까?

개발 방법론 중 하나인 TDD는 테스트 주도의 개발을 의미한다. 로직을 작성하기 전에 테스트 케이스를 정의하여 테스트를 통과하지 못하는 상태를 만들고(Red) 로직을 완성시켜가면서(Blue) 최종적으로 테스트를 통과하도록(Green) 하는 방식으로 진행된다. 번거롭다고 느낄 수 있는 방식을 사용하여 개발을 하는 이유가 무엇일까? 바로 테스트 코드를 작성하면서 얻을 수 있는 장점이 있기 때문이다.

장점은 아래와 같다.

1. 방금 작성한 코드가 잘 작동하는 코드인지를 판별할 수 있다.
2. 코드를 어떻게 작성해야 할지 무엇을 해야 할지 결정하는 데 도움을 준다.
3. 리팩토링을 하거나 새로운 기능을 구현 시 기존 테스트 코드를 기반으로 사이드 이펙트를 방지할 수 있다.
4. 버그 발생 시 실패한 테스트로부터 원인을 찾는 데 도움을 줄 수 있다. 즉, 디버깅 시간을 줄여준다.
5. 테스트 문서 및 스펙 문서의 역할을 할 수 있다.

종합해보면 테스트 코드를 작성하면 변화에 대응하거나 유지 보수하기 쉽고 새롭게 투입된 인원이 테스트 코드를 기반으로 프로젝트를 파악하는데 수월해질 수 있다.

물론 장점만 있는 건 아니다. 개발자가 테스트 코드 작성에 익숙해지는 데까지의 비용이 들 수 있다. 즉, 생산성 측면에서 초기에는 어려움이 있을 수밖에 없는 구조이다

그럼에도 React나 Vue, ESLint 등 JavaScript 기반 오픈소스 프로젝트를 보면 테스트 코드가 포함되어 있는 경우가 많다. 테스트 코드 작성은 규모가 큰 오픈소스 프로젝트의 경우 보편적이며 거의 필수적으로 진행되고 있다.

이번 글에서는 Jest를 이용해 테스트 코드를 작성하는 방법에 대해서 설명해보고자 한다.

## Jest를 이용한 테스트 코드 작성

Jest는 Test Runner, Test Matcher, Test Mock까지 제공해 주는 All in one 테스팅 프레임워크이다. 이러한 테스팅 도구를 사용하게 되면 작성된 코드가 제대로 동작되는지를 확인할 수 있다. 테스트 코드의 유무는 일종의 보증서 역할을 하기 때문에 프로젝트의 볼륨이 커지는 경우 side-effect를 발견하기 쉬워진다. 또한 잘 작성된 테스트 코드는 기능을 정의한 문서로서의 역할을 할 수 있다.

Jest를 사용해 간단한 Unit Test를 작성할 수 있다. 이번 시간에 Jest는 어떻게 구성되어 있는지, 어떻게 사용해야 하는지를 알아볼 것이다.

### 설치 및 기본 사용법

Jest는 node 환경이 구성되어 있는 경우 아래와 같이 npm 명령을 통해 설치할 수 있다. 이후 package.json 파일의 test 스크립트를 `jest`로 수정해 준 뒤 `npm run test` 명령어로 jest를 실행할 수 있다. jest 옵션으로 `--watchAll --coverage`를 사용하게 되면 파일 변경 시 테스트를 다시 실행해 주며 모든 파일에 대한 커버리지 확인이 가능하다.

```shell
mkdir jest-test
cd jest-test
npm init -y

npm i -D jest
// package.json
...
  "scripts": {
    "test": "jest --watchAll --coverage"
  },
...
```

example.test.js 파일을 만들고 아래와 같이 테스트 코드를 작성 후 jest를 실행시키면 테스트가 통과함을 알 수 있다.

```javascript
test('1 is 1', () => {
  expect(1).toBe(1);
});
```

Jest로 작성되는 테스트 코드의 구조는 다음과 같다.

```javascript
test('테스트 설명', () => {
  expect('검증 대상').toXxx('기대 결과');
});
```

테스트 코드를 작성하는 경우 테스트 코드가 제대로 동작하는지 검증하기 위해 처음에는 실패하는 테스트를 작성한 뒤 테스트를 통과하게 수정하는 과정을 거치게 된다.

### Matcher

expect 뒤에 붙는 `.toXxx` 부분이 Test Matcher이다. Test Matcher는 검증 대상에 대해 다양한 측면에서 테스트를 할 수 있도록 도와준다. Test Matcher의 종류는 아래와 같다.

- `.toBe()` : 검증 대상과 기대 결과가 동일한지를 검증한다. 객체를 검증해야 하는 경우에는 사용하지 못한다.

  ```javascript
  test('two plus two is four', () => {
    expect(2 + 2).toBe(4);
  });
  ```

- `.toEqual()` : 위와 마찬가지로 검증 대상과 기대 결과가 동일한지를 검증한다. 객체, 배열도 재귀적으로 확인하므로 검증 가능하다.

  ```javascript
  test('object assignment', () => {
    const data = { one: 1 };
    data['two'] = 2;
    expect(data).toEqual({ one: 1, two: 2 });
  });
  ```

- `.toBeTruthy()`, `.toBeFalsy()` : 검증 대상이 true 인지, false 인지 검증한다.

  ```javascript
  test('null', () => {
    const n = null;
    expect(n).toBeNull();
    expect(n).toBeDefined();
    expect(n).not.toBeUndefined();
    expect(n).not.toBeTruthy();
    expect(n).toBeFalsy();
  });

  test('undefined', () => {
    const u = undefined;
    expect(u).not.toBeNull();
    expect(u).not.toBeDefined();
    expect(u).toBeUndefined();
    expect(u).not.toBeTruthy();
    expect(u).toBeFalsy();
  });

  test('zero', () => {
    const z = 0;
    expect(z).not.toBeNull();
    expect(z).toBeDefined();
    expect(z).not.toBeUndefined();
    expect(z).not.toBeTruthy();
    expect(z).toBeFalsy();
  });
  ```

- `.toHaveLength()` : 검증 대상의 배열의 길이를 검증한다.

  ```javascript
  const shoppingList = [
    'diapers',
    'kleenex',
    'trash bags',
    'paper towels',
    'beer',
  ];

  test('the number of shopping list', () => {
    expect(shoppingList).toHaveLength(5);
  });
  ```

- `.toContain()` : 검증 대상의 배열에 특정 원소가 있는지를 검증한다.

  ```javascript
  const shoppingList = [
    'diapers',
    'kleenex',
    'trash bags',
    'paper towels',
    'beer',
  ];

  test('the shopping list has beer on it', () => {
    expect(shoppingList).toContain('beer');
    expect(new Set(shoppingList)).toContain('beer');
  });
  ```

- `.toMatch()` : 검증 대상에 대해 정규식 기반으로 검증이 필요할 경우 사용한다.

  ```javascript
  test('there is no I in team', () => {
    expect('team').not.toMatch(/I/);
  });

  test('but there is a "stop" in Christoph', () => {
    expect('Christoph').toMatch(/stop/);
  });
  ```

- `.toThrow()` : exception 발생 여부를 검증한다. 문자열 혹은 정규식을 인자로 넘기면 에러 메시지와 동일한지 검증한다.

  ```javascript
  function compileAndroidCode() {
    throw new Error('you are using the wrong JDK');
  }

  test('compiling android goes as expected', () => {
    expect(compileAndroidCode).toThrow();
    expect(compileAndroidCode).toThrow(Error);

    expect(compileAndroidCode).toThrow('you are using the wrong JDK');
    expect(compileAndroidCode).toThrow(/JDK/);
  });
  ```

## 마무리하며

JavaScript 테스트 코드를 Jest의 Matcher로 어떻게 작성할 수 있는지 기본적인 부분을 다뤄보았다. 추후에 함수와 모듈을 mocking 하거나 비동기 테스트 진행 혹은 테스트 전/후처리에 대해서 작성해볼 계획이다.

리액트에 Jest(+ React Testing Library)를 이용해 유닛 테스트를 하는 방법은 [프런트엔드에서 TDD가 가능하다는 것을 보여드립니다.](https://www.youtube.coM/watch? v=L1dtkLeIz-M) 영상에서 자세히 설명되어 있다.

#### Reference

- https://jestjs.io/en/
