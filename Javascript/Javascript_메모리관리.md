# Javascript_메모리관리

고급 언어 인터프리터는 `가비지 콜렉터` 라는 소프트웨어를 가지고 있다. 
<br/>

## 가비지 콜렉터란 

**메모리 할당을 추적하고 할당된 메모리가 더 이상 필요 없어졌을 때 해제하는 작업을 한다.**
<br/>

일반적인 경우에 어떤 메모리가 필요없는지 알아내는 것은 알고리즘으로 풀 수 없는 비결정적인 문제이다.
<br/>

가비지 컬렉션자바스크립트의 메모리 관리는 우리에게는 보이지 않게 **자동으로** 실행된다.
<br/>

우리가 원시타입의 변수나 혹은 객체, 함수를 선언할때도 모두 메모리를 사용한다. 만약에 이러한 것들이 더이상 필요없게 된다면
**자바스크립트 엔진은 어떻게 이것들을 찾아내어 삭제하는걸까?**
<br/>

## 접근 가능성(Reachability)

자바스크립트 메모리 관리의 주요 개념은 **접근 가능성** 이다. 
<br/>

간단하게 말하면 **접근 가능한** 값은 어떻게든 엑세스가 가능하거나 사용할 수 있는 값임을 뜻한다. 이들은 메모리에 유지되는것을 보장받는다.
<br/>

1. 명백한 이유로 삭제될 수 없는 본질적으로 값에 접근 가능한 기본 세트가 있다. 이런 것들을 뿌리(Root)라고 부르겠다.

   - 현재 함수의 지역 변수와 매개변수
   - 다른 함수의 중첩 호출로 실행된 함수의 경우 현재의 스코프 체인으로 접근 가능한 변수와 매개변수
   - 전역 변수

2. 기타 다른 값은 참조(Reference) 또는 레퍼런스의 참조(A chain of references)에 의해 루트에서 도달 가능한 것으로 간주한다. 

예를 들어 로컬 변수가 특정 객체를 참조하고 있고 그 객체가 또다른 객체를 참조하는 프로퍼티를 가지고 있다면 그 객체에 도달 가능하다 라고 간주한다. 그리고 그것들이 참조하는 다른 것들도 도달할 수 있다.
<br/>

자바스크립트 엔진의 백그라운드 프로세스로 동작하는 **가비지 콜렉터** 라는 것이 있다. 이것은 모든 객체들을 모니터링 하며 그것들이 접근 불가능하게 되었을 때 삭제하는 작업을 수행한다.
<br/>

```js
// user는 객체에 대한 참조를 가지고 있습니다.
let user = { name: "SeonHyung"};
```

![Javascript_메모리관리_1](https://github.com/SeonHyungJo/FrontEnd-Dev/blob/master/assets/image/Memory_management_1.png?raw=true)

여기에 표시된 화살표는 객체 참조를 보여준다.
<br/>

전역 변수 `user` 는 `{name: "SeonHyung"}` 객체를 참조한다.
<br/>

존의 `name` 프로퍼티는 원시 타입을 저장하여 객체의 내부에 위치합니다. 여기에서 우리가 `user` 의 값을 덮어쓰게 되면 참조를 잃게 된다. 
<br/>

`user = null;` 이제 SeonHyung 은 접근이 불가능하게 되었다. 여기에 접근할 방법은 없으며 아무도 SeonHyung 을 참조하지 않게 되었다. 
<br/>

가비지 콜렉터는 데이터를 회수하고 메모리를 비운다. 
<br/>

## 두개의 참조

이번에는 `user` 를 `admin` 으로 참조를 복제하였다고 상상 해 보겠습니다.

```js
let user = { name: "SeonHyung"};
let admin = user;
```

이제 우리는 똑같은 작업을 한번 더 해보면.

```js
user = null; 
```

하지만 여전히 `admin` 변수가 SeonHyung 을 참조하고 있으므로 메모리에 유지된다. 우리가 `admin` 도 null로 선언을 한다면 그때 삭제 될 것이다. 
<br/>

![Javascript_메모리관리_2](https://github.com/SeonHyungJo/FrontEnd-Dev/blob/master/assets/image/Memory_management_2.png?raw=true)

## 상호 연결된 객체

이번엔 좀 더 복잡한 예제를 살펴보자. 

```js
function marry(man, woman) {   
    woman.husband = man;   
    man.wife = woman;   

    return {      
        father: man,      
        mother: woman   
    }
}

let family = marry({       
        name: "Any"   
    }, {       
        name: "Jerry"   
    }
);
```

`marry` 는 두 개의 객체를 서로 참조하게 하고 이 둘을 참조하고 있는 새로운 객체를 반환하는 결혼(?)을 시키는 함수이다.
<br/>

메모리 구조의 결과는 다음과 같이 나온다.
<br/>

![Javascript_메모리관리_3](https://github.com/SeonHyungJo/FrontEnd-Dev/blob/master/assets/image/Memory_management_3.png?raw=true)

모든 객체는 서로 접근 가능하게 되었다. 이제 두 개의 참조를 삭제하게 되면.

```js
delete family.father;
delete family.mother.husband;
// 전에도 글을 썻지만 delete를 사용하는 것보다는 null을 넣어주는 것이 더 좋다.
```

이 두개의 참조중에 하나만 삭제할 경우에는 여전히 모든 객체가 접근 가능하므로 객체가 삭제되기에 충분하지 않게 되는데 2개를 모두 삭제를 하는 아래와 같은 경우는 더이상 존재하지 않게 된다.
<br/>

![Javascript_메모리관리_4](https://github.com/SeonHyungJo/FrontEnd-Dev/blob/master/assets/image/Memory_management_4.png?raw=true)

그러므로 애니는 이제 접근 불가능하게 되었고 메모리에서 제거되게 된다.
<br/>

가비지 콜렉션이 동작한 이후에는 다음과 같이 나오게 된다.
<br/>

![Javascript_메모리관리_5](https://github.com/SeonHyungJo/FrontEnd-Dev/blob/master/assets/image/Memory_management_5.png?raw=true)

## 접근 불가능한 섬

외부에서 접근 불가능한, 자기들끼리만 상호 참조하여 만들어진 완벽한 형태의 섬도 메모리에서도 삭제가 가능하다.
<br/>

소스코드는 위와 동일하다고 가정하자
<br/>

이 예제는 접근 가능성에 대한 매우 중요한 개념을 보여주는 예제라고 생각하면 좋다.
<br/>

애니과 제리는 연결되어있다.
<br/>

그 둘은 안/밖으로 연결되는 링크들 모두를 가지고 있다.
<br/>

![Javascript_메모리관리_6](https://github.com/SeonHyungJo/FrontEnd-Dev/blob/master/assets/image/Memory_management_6.png?raw=true)

하지만 이전의 `family` 객체는 루트(Root)와의 연결이 끊어지게 되었다. 그러므로 이 완벽한 섬은 접근 불가능하게 되었으며 삭제될 것이다.
<br/>

## 내부 알고리즘

기본적인 가비지 콜렉션의 알고리즘은 `마크 앤 스윕(Mark-and-sweep)`이라고 불린다. 일반적으로 가비지 콜렉션은 다음의 과정을 거치게 된다.

> [마크 앤 스윕(Mark-and-sweep)](https://ko.wikipedia.org/wiki/%EC%93%B0%EB%A0%88%EA%B8%B0_%EC%88%98%EC%A7%91_(%EC%BB%B4%ED%93%A8%ED%84%B0_%EA%B3%BC%ED%95%99))

- 가비지 콜렉터는 루트를 획득하여 그들을 마크(기억)한다.
- 그리고 그들이 참조하고 있는 모든 것들에 방문하여 마크한다.
- 그리고 마크한 모든 객체에 방문하여 그들의 참조 역시 마크한다. 모든 객체들을 기억하고 나면 미래에는 같은 객체를 두 번 방문하지 않는다.
- 루트로부터 접근 가능한 방문하지 않은 참조가 있다면 계속해서 반복한다.
- 마크되지 않은 모든 객체는 삭제된다.

예를 들어 다음과 같은 객체의 구조가 있다고 해보자. 우리는 오른편에 **접근 불가능한 섬** 을 발견할 수 있다. 
<br/>

이제 가비지 콜렉터가 진행하는 마크 앤 스윕 과정이 이것을 어떻게 다루는지 보자. 
<br/>

![Javascript_메모리관리_7](https://github.com/SeonHyungJo/FrontEnd-Dev/blob/master/assets/image/Memory_management_7.png?raw=true)

다음은 루트로부터 첫번째 과정 결과 :
<br/>

![Javascript_메모리관리_8](https://github.com/SeonHyungJo/FrontEnd-Dev/blob/master/assets/image/Memory_management_8.png?raw=true)

이후에 그들의 참조들도 마크 결과 :
<br/>

![Javascript_메모리관리_9](https://github.com/SeonHyungJo/FrontEnd-Dev/blob/master/assets/image/Memory_management_9.png?raw=true)

그리고 그들의 참조도 가능할 때까지 반복 :
<br/>

![Javascript_메모리관리_10](https://github.com/SeonHyungJo/FrontEnd-Dev/blob/master/assets/image/Memory_management_10.png?raw=true)

이제 방문할 수 없는 객체들은 접근 불가능한것으로 간주되어 삭제될 것이다. 이것이 **가비지 콜렉터** 가 동작하는 개념이다.
<br/>

![Javascript_메모리관리_11](https://github.com/SeonHyungJo/FrontEnd-Dev/blob/master/assets/image/Memory_management_11.png?raw=true)

자바스크립트 엔진은 어플리케이션의 실행에 영향을 주지 않고 빠르게 수행되도록 하기 위해 많은 최적화 옵션을 적용하고 있다.

- 세대별 수집 : 객체는 **새로운 객체와 이전 객체** 두 개의 세트로 나뉘어진다. 많은 객체들은 나타나고 그들의 일을 수행하고 빨리 죽는다. 이것들은 공격적으로 청소될 수 있다. 하지만 충분히 오래 살아남은 객체들은 **오래된** 객체가 되어 덜 자주 검사를 받게 된다(JS엔진을 보면 더 명확해 질 듯).
- 증분 수집 : 많은 객체가 있고 이러한 많은 객체를 한번에 전부 다 방문하며 마크하는 과정을 거치게 되면 실행에 눈에 띄는 지연이 발생할 수 있다(당연히). 그래서 엔진은 이러한 수거 작업을 여러 조각으로 나누어 수행한다. 이렇게 나눈 조각의 변화를 추적할 수 있도록 부가적인 처리가 필요하지만 큰 한번의 딜레이 대신에 짧은 단위의 딜레이를 가질 수 있다.
- 유휴 시간 수집 : 가비지 콜렉터는 CPU가 유휴상태일 때만 실행되어 어플리케이션의 실행에 끼치는 영향을 줄인다.

이것 말고도 가비지 콜렉터의 다른 최적화 기능들이 있다. 각 엔진들이 구현하고 있는 추가적인 테크닉들이 있으며 엔진의 발전에 따라 지속적으로 변화하고 있다. 정리하면 아래와 같다.
<br/>

- 가비지 콜렉션은 자동으로 실행
- 객체는 그들이 접근 가능한 동안 메모리에 유지
- 참조가 된다는 것이 루트(Root)에서 참조 가능한 것과 같은 말은 아니다 : 상호 참조하고 있는 객체들이 전체에서 보면 참조 불가능할 수 있습니다.(접근 불가능한 섬 같은 경우)

---

#### Reference

- [MDN-Memory_Management](https://developer.mozilla.org/ko/docs/Web/JavaScript/Memory_Management)
- [가비지 컬렉션](http://theeye.pe.kr/archives/2872)
