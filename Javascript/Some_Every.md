# Some과 Every

흔히 javascript의 배열과 관련된 메서드로 map, filter, reduce를 생각한다.
사실 이 세가지 아니 정확히는 reduce 하나만으로도 모든것을 구현할 수 있다.
하지만 언제나 그렇듯 코드의 가독성과 생산성을 위해 다양한 메서드를 알고 있다면 유익하다.

이번에 some을 이용해서 코드를 짜볼 기회가 있었어서 알아봤는데 every와 비슷한것 같았다. 자주 사용되지는 않지만 간단하고 꽤나 쓸모가 있는 Some과 Every를 알아봤다.

## some

some은 배열의 요소가 특정 조건에 한번이라도 만족하는지 검사하는 메서드다.

some의 정의는 아래와 같다.

> arr.some(callback[, thisArg])

- callback
  - currentValue // 현재값
  - index (Optional) // 인덱스
  - array (Optional) // array
- thisArg (Optional) // this

코드로 보자면 아래와 같다.

```js
var array = [1, 2, 3, 4, 5];

var isThree = function(element) {
  return element === 3;
};

console.log(array.some(isThree)); // true
```

한번이라도 조건을 만족하면 true다. 조건에 만족하면 그 즉시 true를 리턴한다. 위의 코드의 경우 2번 요소인 3까지만 callback이 실행되고 4부터는 실행되지 않는다.

또한 map, filter와 비슷하게 호출한 배열을 변형하지 않는다.(side effect 최소화)

## every

every는 some과 비슷하지만 좀 다르다. 배열의 요소가 특정 조건에 모두 만족하는지 검사하는 메서드다.

> every.some(callback[, thisArg])

- callback
  - currentValue // 현재값
  - index (Optional) // 인덱스
  - array (Optional) // array
- thisArg (Optional) // this

callback에 들어가는 요소도 동일하다.

```js
var array = [10, 20, 30, 40, 50];

var overThirty = function(element) {
  return element < 30;
};

console.log(array.every(overThirty)); // false
```

모든 요소가 조건을 만족하면 true다. 즉 모든 경우가 N번 실행되게 된다. some과는 반대로 조건에 만족하지 않으면 그 즉시 true를 리턴한다. 위의 코드의 경우 3번 요소인 40까지만 callback이 실행되고 50은 실행되지 않는다.

이또한 map, filter와 비슷하게 호출한 배열을 변형하지 않는다.(side effect 최소화)

### 결론

실제로 내가 이렇게 사용하기도 했지만, 어떤 작업을 시작하기 전 혹은 작업을 마치고 난 후 null 체크나 값 확인용으로 사용하기 좋은 간단한 메서드다.

---

#### 참조

- [MDN-Some](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
- [MDN-Every](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/every)
