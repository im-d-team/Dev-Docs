# Proxy

사람들이 흔히 생각하는 프록시 패턴이 아닌 프록시 객체에 대해서 알아보는 시간을 가지자

## `Proxy` 객체?

ES6는 [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 라는 새로운 생성자를 정의 해놓았다.

이 생성자는 2개의 인자를 넣으면 되는 것으로

- *target* 객체 : 대상객체
- *handler* 객체 : 우리가 정의 해놓은 메소드들 

:point_right: 예를 보자

```js
  const target = {}
  const handler = {}

  const proxy = new Proxy(target, handler) // 간단하게 생성을 해보았다.
```

proxy 객체와 target 객체가 어떻게 연결되는지 살펴보자

proxy 객체의 동작 방식을 한 문장으로 설명할 수 있다. proxy 객체는 모든 내부 메소드 호출을 target 객체로 전달한다. 즉, 누군가 `proxy.[MethodName]()` 메소드를 호출하면, `target.[[MethodName]]()` 메소드가 그 결과를 리턴한다는 것이다.

우리가 상식적으로 알고 있던 프록시의 모양이다.

자 `proxy.[[Set]]()` 메소드가 호출이 될 수 있도록 테스트를 진행해보자

```js
  proxy.color = "pink"
```

이렇게 테스트를 진행하게 되면, `proxy.[[Set]]()` 메소드가 호출되면 자동적으로 `target.[[Set]]()` 메소드가 호출이 되고, target 객체에 새로운 속성을 만들고 그안에는 `pink`라는 string이 들어가게 된다.

```js
  target.color // result "pink"
```

나머지 **내부 메소드들도 마찬가지로 동작**한다. 


이 프록시 객체는 대부분은 타겟 객체인 것처럼 동작한다.

< `proxy !== target` >

프록시는 타겟과 다르다. 그래서 proxy 는 target 이 성공하는 타입 체크에 실패를 하곤 하는데, 예를 들어 proxy 의 target 이 **DOM Element** 인 경우, proxy 자신은 *진짜로는* Element 가 아니여서 `document.body.appendChild(proxy)` 같은 코드는 `TypeError` 를 내면서 실패하게 된다.

## **프록시 핸들러 (Proxy handler)**

handler 객체가 프록시를 유용하게 만들어 준다.

handler 객체의 메소드들을 통해 프록시 객체의 모든 내부 메소드들을 **오버라이드**해서 사용할 수 있다.

객체의 속성에 값을 할당하는 모든 시도를 가로채고 싶다면, 그냥 [[MDN]handler.set()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/set) 메소드를 정의하면 된다.

```js
  const target = {}
  const handler = {
    set: function (target, key, value, receiver) {
        throw new Error("Please don't set properties on this object.");
    }
  };

  const proxy = new Proxy(target, handler);
    
  proxy.name = "angelina"
    //Error: Please don't set properties on this object.
```

handler 객체로 오버라이딩 가능한 메소드들의 목록은 `Proxy` 에 대한 [MDN 문서](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#Methods_of_the_handler_object)를 보면 됩니다. 

목록에는 총 14개의 메소드들이 있으며, 메소드들 각각이 **ES6** 가 정의하는 14개의 내부 메소드들에 해당한다.

모든 handler 메소드들은 옵셔널이다. 만약 내부 메소드가 handler 객체에 의해 가로채어지지 않는다면, 우리가 이전에 본 것처럼 해당 메소드 호출은 그냥 target 객체로 전달한다.

## 예제: 1. 불가능 자동 생성 객체

이제 프록시를 이용해서 신기한 일을 해낼 수 있을만큼 프록시에 대해 충분히 알게 되었다.

여기 첫번째 연습 과제가 있습니다. `Tree()` 함수를 만들어 봅시다.

```js
    var tree = Tree()
    tree // { }
    tree.branch1.branch2.twig = "apple"

    tree // { branch1: { branch2: { twig: "green" } } }

    tree.branch1.branch3.twig = "Persimmon" // { branch1: { branch2: { twig: "green" }, branch3: { twig: "yellow" }}}
```

branch1, branch2, branch3 같은 모든 중간 객체들이 마법처럼 필요할 때마다 자동으로 생성이 되고 있다.

지금까지는 이런 일을 하는 방법이 없었다. 하지만 프록시를 이용하면 아주 짧은 코드로 이런 일을 해낼 수 있게 된다. 

handler에 `tree.[[Get]]()` 메소드에 끼어들기만 하면 된다.

:saxophone: 해답

```js
    function Tree() {
      return new Proxy({}, handler)
    }
    
    var handler = {
      get: function (target, key, receiver) {
        if (!(key in target)) {
          target[key] = Tree()  // auto-create a sub-Tree
        }
        return Reflect.get(target, key, receiver)
      }
    };
```

마지막의 `Reflect.get()` 구문에 주의해야 한다. 프록시 핸들러 메소드를 구현할 때 **이제 그냥 원래 하던 동작을 할 수 있도록 target 객체로 메소드 호출을 전달해주세요** 라고 말하는 기능이다. 

ES6 는 14개의 메소드들과 함께 새로운 [Reflect 객체](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect)


## 예제: 2. 읽기전용 뷰 (read-only view)

이제 우리는 `readOnlyView(object)` 함수를 구현하려고 한다. 이 함수는 임의의 객체를 인자로 전달받아서 그 객체와 똑같이 동작하는 프록시 객체를 리턴한다. *하지만* 리턴된 객체는 변경할 수 없습니다. 

예를 들자면 다음처럼 동작해야 한다.

```js
  const newMath = readOnlyView(Math)
  newMath.min(54, 40) // 40
  newMath.max = Math.min // Error: can't modify read-only view
  delete newMath.sin // Error: can't modify read-only view
```

첫번째 단계는 타겟 객체를 변경할 수 있는 모든 내부 메소드들을 가로채는 것입니다. 5개의 메소드들이 여기에 해당합니다.

```js
    function NOPE() {
      throw new Error("can't modify read-only view");
    }
    
    var handler = {
      // Override all five mutating methods.
      set: NOPE,
      defineProperty: NOPE,
      deleteProperty: NOPE,
      preventExtensions: NOPE,
      setPrototypeOf: NOPE
    };
    
    function readOnlyView(target) {
      return new Proxy(target, handler);
    }
```

이 코드는 동작합니다. 이 코드는 읽기전용 뷰(read-only view)가 할당 작업, 신규 속성 정의 작업 등을 하지 못하도록 막는 것이다.

가장 큰 문제점은 `[[Get]]` 메소드(그리고 다른 몇개의 메소드)가 여전히 수정 가능한 객체를 리턴한다는 것입니다. 그래서 만약 어떤 객체 `x` 가 읽기전용 뷰(read-only view)라고 하더라도 `x.prop` 객체는 수정 가능합니다! 이건 큰 구멍입니다.

이 구멍을 메꾸려면 `handler.get()` 메소드를 수정해야 합니다.

```js
    var handler = {
      ...
    
      // Wrap other results in read-only views.
      get: function (target, key, receiver) {
          // Start by just doing the default behavior.var result = Reflect.get(target, key, receiver);
    
          // Make sure not to return a mutable object!if (Object(result) === result) {
          // result is an object.return readOnlyView(result);
        }
        // result is a primitive, so already immutable.return result;
      },
    
      ...
    };
```

이것도 아직도 부족하다. `getPrototypeOf` 와 `getOwnPropertyDescriptor` 같은 다른 메소드들에도 비슷한 코드를 적용해야 한다.

아직도 문제가 더 존재하는데, 이런 종류의 프록시에 있는 getter 나 다른 메소드가 호출될 때, 메소드에 전달되는 `this` 는 통상 프록시 객체 자신이다. 하지만 우리가 조금 전에 본 것처럼, 많은 접근자들과 메소드들이 프록시 객체가 통과할 수 없는 타입 체킹을 수행한다. 이쯤 되면 타겟 객체를 프록시 객체로 바꾸는 것이 더 좋을 것 같다. 

## 정리

- 프록시는 무엇에 알맞은가

프록시는 어떤 객체에 대한 접근을 관찰하거나 로그를 남길 때 확실히 유용하다. 프록시는 디버깅할 때가 이상적이다. 테스트 프레임워크들이 [가짜 객체 (mock object)](https://en.wikipedia.org/wiki/Mock_object)를 만들 때 프록시를 이용할 수 있습니다.

프록시는 보통의 객체보다 아주 약간 느린 동작이 필요한 경우에 유용합니다. 예를 들면 게으르게 반환되는 속성 (lazily populating properties) 같은 경우입니다.

프록시를 사용하는 코드 내부에서 어떤 일이 일어나고 있는지 확인하는 가장 좋은 해결책 중 하나는 바로 프록시의 핸들러 객체를 다시 *다른 프록시*로 감싸는 것이다. 그래서 핸들러의 메소드가 호출될 때마다 콘솔에 로그가 출력되도록 만드는 것이다.

프록시는 우리가 `readOnlyView` 로 했던 것처럼 어떤 객체에 대한 접근을 제한하기 위해 사용할 수 있다.Firefox 는 내부적으로 프록시를 사용해서 서로 다른 도메인들 사이에 존재하는 [보안 장벽 (security boundary)](https://developer.mozilla.org/en-US/docs/Mozilla/Gecko/Script_security)을 구현하고 있다. 이것이 Firefox 보안 모델의 핵심이다.

- WeakMap 

`readOnlyView` 예제에서, 우리는 객체에 접근할 때마다 매번 새로운 프록시를 생성했다. 우리가 생성하는 프록시를 `WeakMap` 에 캐시하면 아주 많은 메모리를 절약할 수 있습니다. 그러면 어떤 객체가 여러번 `readOnlyView` 에 전달되더라도, 프록시는 한번만 생성되도록 만들 수 있습니다.

- 폐기 가능한 프록시(revocable proxy) 
  
ES6 는 또 `Proxy.revocable(target, handler)` 이라는 함수도 제공한다 이 함수는 `new Proxy(target, handler)`함수처럼 프록시 객체를 리턴하는데 이 함수를 통해 생성되는 프록시는 나중에 폐기시킬 수 있습니다. (`Proxy.revocable` 함수는 어떤 객체를 리턴한다. 이 객체에는 `.proxy` 속성과 `.revoke` 메소드가 존재한다.) 일단 프록시를 폐기시키면, 해당 프록시는 더이상 동작하지 않습니다. 폐기된 이후 호출되는 내부 메소드들은 예외를 발생시킵니다.

- **객체의 불변조건(object invariants).** 

어떤 경우에는, ES6 에서 프록시 핸들러 메소드가 target 객체의 상태와 일치하는 결과를 보고하도록 강제해야 할 때가 있다. 이렇게 하는 이유는 모든 객체들(심지어 프록시 객체들까지 포함해서)에서 변경불가(immutability) 원칙을 관철시키기 위해서 입니다. 예를 들어, 타겟 객체가 확장 불가능(inextensible) 하지 않은데, 프록시 객체가 확장 불가능하다고 주장할 수는 없다.

정확한 규칙을 설명하기에는 지면이 부족하다. 하지만 만약 `proxy can't report a non-existent property as non-configurable` 같은 에러 메시지를 보게 된다면, 바로 이런 이유 때문이다. 이때 좋은 처방은 프록시가 자신에 대해 보고하는 바를 수정하는 것이다. 또다른 처방은 프록시가 보고하는 내용에 따라 그때그때 타겟을 수정하는 것이다.

## 프록시를 지금 당장 쓸 수 있을까

웹에서는 지금 당장 쓸 수 없다. 더구나 폴리필도 존재하지 않는다.

---

#### Reference

- [ES6 In Depth: 프락시 (Proxy)](http://hacks.mozilla.or.kr/2016/03/es6-in-depth-proxies-and-reflect/)
- [babel](https://babeljs.io/docs/en/learn#proxies)
