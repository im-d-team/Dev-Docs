# Node.js의 특징
* 자바스크립트 런타임
    * 언어나 프레임워크, 라이브러리가 아니다.
    * 자바스크립트가 브라우저 환경에서 돌아가는 대신 내 컴퓨터에서 서비스 혹은 런타임으로 실행된다.

* V8자바스크립트 엔진을 사용한다.(크롬브라우저와 동일)
> 참고 - [Javascript_Engine](https://github.com/Im-D/Dev-Docs/blob/master/Javascript/Javascript_Engine.md)

* 언어 차원에서 네트워크를 지원한다.
    * 서버사이드 언어로 사용할 수 있다.

<br/>

## 왜 사용하는가?
#### 빠르고, 효율적이고, 확장성이 아주 크다
* Event driven이기 때문에 싱글 루프에서 실행되고, 논 블럭킹이다. 따라서 non-blocking i/o model을 가진다.

#### 인기가 많다!
> [mean stack](https://en.wikipedia.org/wiki/MEAN_(software_bundle)) 혹은 mern stack의 n이 노드다!
* 리엑트, 뷰, 앵귤러 등과 자주 사용되는데, 같은 언어로 프런트와 백을 할 수 있기 때문

<br/>

## 동작방식
Node.js는 **싱글 스레드(Single Thread)**로 동작하고, 비동기적인 **[event driven](https://terms.naver.com/entry.nhn?docId=822661&cid=50376&categoryId=50376)**방식을 사용한다.

이는 자바스크립트와 같다. 자바스크립트 엔진을 사용하기 때문이다.

차이점은 `setTimer()`과 같은 함수 혹은 `XHR` 등을 사용하는  대신, `EventEmitter` 클래스를 사용하여 이벤트와 리스너를 바인딩(binding) 한다.

또한, node.js는 수많은 연결이 하나의 스레드를 통해서 이루어진다. **Non-blocking I/O**를 사용하기 때문이다.

이때, 이벤트 루프를 이용하여 데이터 통신을 한다. 따라서, 이전의 데이터 전송의 완료여부와 상관없이 다음 작업이 진행된다.
> Event loop에 대한 내용은 [B_EventLoop](https://github.com/Im-D/Dev-Docs/blob/master/Javascript/B_EventLoop.md), [EventLoop](https://github.com/Im-D/Dev-Docs/blob/master/Javascript/EventLoop.md), [EventLoop_Advanced](https://github.com/Im-D/Dev-Docs/blob/master/Javascript/EventLoop_Advanced.md) 를 참고

<br/>

## Node.js에 적합한 프로젝트 타입
간단하게 요약하면 CPU intensive하지 않은 것이 적합하다.

앞서 말했듯, node.js의 I/O실행은 비동기적이다. Blocking 없이 통신을 할 수 있는 것이 장점이다.

하지만, 많은 CPU사용이 요구되어 CPU의 작업 처리가 한계에 다다른다면 결국 서버가 느려질 것이다. 그렇게되면 당연히 어플리케이션이 느려진다.

따라서 다음과 같은 프로젝트들이 어울린다.

* micro services 및 REST API

* 리얼타임 서비스(채팅, 라이브업데이트)

* CRUD Apps
  
    > 블로그나, 쇼핑카트, 소셜 네트워크 등

> CPU intensive하지 않은 선에서 툴이나 유틸리티도 괜찮다.

<br/>

## NPM(Node Package Manager)
Node.js를 설치하면 NPM이 생기는데, [써드 파티](https://ko.wikipedia.org/wiki/%EC%84%9C%EB%93%9C_%ED%8C%8C%ED%8B%B0_%EA%B0%9C%EB%B0%9C%EC%9E%90) 패키지나 모듈을 설치하는데 사용된다.

패키지들은 `node_modules`폴더에 저장된다.

설치된 패키지나 denpendency는 `package.json`에 담긴다.
> node.js의 모듈들은 package의 dependency를 통하여 연결된다.

```ps
npm init // Generates a package.json file
npm install express // installs a package locally
npm install -g nodemon // installs a package globally (-g플래그를 더해주면 된다.)
```

<br/>

## Modules of Node.js
모듈은 노드의 아주 큰 부분이다.

* 기본적으로 node.js에 포함된 코어 모듈이 있고,

* NPM을 통해 받을 수 있고

* 내가 만들 수도 있다.

변수들과 함수들과 클래스들 혹은 기타등등을 모듈에 포함시킬 수 있다.

모듈은 모듈 이름을 사용하여 불러올 수 있다. 

또한 경로를 적어주어서 불러올 수도 있다.

```js
const path = require('path');
const myFile = require('./myFile');
```

<br/>

---

#### Reference

* [Node.js Crash Course](https://www.youtube.com/watch?v=fBNz5xF-Kx4&feature=youtu.be)
