# Chrome 80 DevTool Update

## 콘솔창에서 `let` 과 `class` 재선언을 지원한다.

 `let` 과 `class` 의 재선언을 지원한다. 재선언을 할 수 없는 것은 콘솔창을 가지고 새로운 Javascript 코드를 실험하는 개발자에게는 엄청난 불편함이었다. 

script 안쪽에 있는 `let` 이나 `class`를 재선언하는 것은 이전과 동일하게 `SyntaxError`를 발생시킬 것이다.

예를 들어, 이전에는, `let`과 같은 로컬 변수를 재선언 했을 경우, 콘솔창에서 에러를 던진다.

![image](https://user-images.githubusercontent.com/24274424/74095008-d0fbdd00-4b2d-11ea-88cc-40deaba2465b.png)

이제는, 콘솔창에서 재선언이 허용된다.

![image](https://user-images.githubusercontent.com/24274424/74095014-ec66e800-4b2d-11ea-84e2-41654d770014.png)

Chromium issue [#1004193](https://crbug.com/1004193)

## WebAssembly 디버깅 향상

DevTools [DWARF Debugging Standard](http://dwarfstd.org/) 지원 시작한다. 이는 DevTool안에서 우리의 소스로 단계별로 진행하거나, 중단점을 잡거나, 스택추적을 해결하는 데 도움을 준다. [Improved WebAssembly debugging in Chrome DevTools](https://developers.google.com/web/updates/2019/12/webassembly) 풀스토리를 확인하세요

![image](https://user-images.githubusercontent.com/24274424/74095018-01dc1200-4b2e-11ea-808e-1cda18156298.png)

## Network panel 업데이트

### Request Initiator Chains in the Initiator tab

중첩된 목록으로 network 요청의 initiators와 dependencies 정보를 볼 수 있다. 이는 리소스가 호출된 이유를 보거나, 특정 스크립트와 같은 리소스들로 인해 발생한 네트워크 활동을 보는 데 유용할 것이다.

![image](https://user-images.githubusercontent.com/24274424/74095021-09032000-4b2e-11ea-8fd9-a08561dc5e89.png)

네트워크 패널에서 [네트워크 활동을 로깅](https://developers.google.com/web/tools/chrome-devtools/network)한 후 리소스를 클릭하고 **Initiator** 탭으로 이동하여  **Request Initiator Chain**을 볼 수 있다.

- *inspected resource*는 굵게 되어있다. 스크린샷 아래를 보게 되면, `https://web.dev/default-627898b5.js` 는 inspected resource이다.
- inspected 리소스위의 리소스는 *initiators*. 스크린 샷을 보면, `https://web.dev/bootstrap.js` 는 `[https://web.dev/default-627898b5.js](https://web.dev/default-627898b5.js)` 의 initiator이다. 다른 말로, `https://web.dev/bootstrap.js` 는`https://web.dev/default-627898b5.js` 를 네트워크 요청한다.
- The resources below the inspected 리소스 밑의 리소스는 *dependencies*이다. 스크린 샷을 보면, `[https://web.dev/chunk-f34f99f7.js](https://web.dev/chunk-f34f99f7.js)` 는  `[https://web.dev/default-627898b5.js](https://web.dev/default-627898b5.js)` 의 dependency 이다. 다른 말로,  `https://web.dev/default-627898b5.js` 는  `https://web.dev/chunk-f34f99f7.js` 를 네트워크 요청한다.

Initiator와 dependency 정보는 Shift 키를 누른 상태에서 network 리소스에 올리면 볼 수 있다. [View initiators and dependencies](https://developers.google.com/web/tools/chrome-devtools/network/reference).

Chromium issue [#842488](https://crbug.com/842488)

### Overview에서 선택된 network 요청 하이라이팅

네트워크 리소스를 확인하기 위해서 클릭을 하면, Network 패널에 **Overview**에 해당 리소스 주위에 파란색 선이 생긴다. 이를 통해서 네트워크 요청이 생각보다 빠르게 또는 느리게 왔는지 확인 가능하다.

![image](https://user-images.githubusercontent.com/24274424/74095028-20420d80-4b2e-11ea-874a-bfe6ec64c7ec.png)

Chromium issue [#988253](https://crbug.com/988253)

### Network panel에서의 URL과 path 행렬

**Network** 패널에서 상대경로와 전체 URL을 각각의 network 리소스 별로 새로운 **Path와** **URL** 행렬 사용이 가능하다. 

![image](https://user-images.githubusercontent.com/24274424/74095029-246e2b00-4b2e-11ea-9b77-89fec563c287.png)

**Waterfall** 테이블 헤더 우클릭으로 **Path** 또는 **URL** 새로운 행렬을 볼 수 있다.

Chromium issue [#993366](https://crbug.com/993366)

### Updated User-Agent strings

DevTools 은 **Network Conditions** 탭에서 커스텀  User-Agent string 셋팅을 지원한다. User-Agent string은 network 리소스와 관련된 `User-Agent` HTTP header, 그리고 `navigator.userAgent` 값에 영향을 미친다. 

사전정의된 User-Agent strings 최신 브라우저 버전을 반영하도록 업데이트되었다.

![image](https://user-images.githubusercontent.com/24274424/74095036-4a93cb00-4b2e-11ea-97cb-4b9e106dc5d6.png)

**Network Conditions 에** 접근하기 위해서, [the Command Menu](https://developers.google.com/web/tools/chrome-devtools/command-menu) 를 열고 `Network Conditions` 명령어를 실행시키면 된다.

Chromium issue [#1029031](https://crbug.com/1029031)

## Audits 패널 업데이트

### 새로운 설정 UI

설정 UI는 새롭고, 반응형 디자인이며 throttling 설정 옵션이 단순화되었다. 변경에 대한 더 많은 정보는 [Audits Panel Throttling](https://github.com/GoogleChrome/lighthouse/blob/master/docs/throttling.md#devtools-audits-panel-throttling) 에 들어가서 확인할 수 있다.

![image](https://user-images.githubusercontent.com/24274424/74095037-4f587f00-4b2e-11ea-8c14-b93caef94e65.png)

## Coverage 탭 업데이트

### Per-function 또는 per-block 커버리지 모드

[Coverage tab](https://developers.google.com/web/tools/chrome-devtools/coverage)는 **per function** 또는 **per block** 로 커버리지 데이터를 수집할지 지정할 수 있는 새로운 드롭다운 메뉴를 가지고 있다.. **Per block** 커버리지는 더욱 상세하게 수집할 수 있지만, 비용이 더 든다. DevTools의 기본값은 **per function** 커버리지를 사용한다.

**per function** 또는 **per block** 모드 사용여부에 따라 HTML파일에서 코드 커버리지 적용 범위가 달라진다. 

**per function** 모드를 사용하면, HTML 파일의 인라인 스크립트는 함수로 취급된다. 스크립트가 조금이라도 실행되면 DevTools는 전체 스크립트를 사용된 코드로 표시한다.스크립트가 전혀 실행되지 않는 경우에만 DevTools는 스크립트를 사용하지 않는 코드로 표시한다.

![image](https://user-images.githubusercontent.com/24274424/74095038-52536f80-4b2e-11ea-85e7-1027ddb72abc.png)

### Coverage 페이지 새로고침으로 시작해야한다.

페이지 새로고침 없이 코드 커버리지를 토글링하는것은 제거되었다. 커버리지 데이터를 신뢰할 수 없기 때문이다. 예를 들어, 함수가 오래전에 실행되어 V8 가비지 컬렉션 대상이 된 경우 해당 함수가 실행되지 않은 것으로 보고될 수 있다.

Chromium issue [#1004203](https://crbug.com/1004203)

#### Reference

- [https://developers.google.com/web/updates/2019/12/devtools](https://developers.google.com/web/updates/2019/12/devtools)
