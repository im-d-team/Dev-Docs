# isNaN

## NaN

NaN은 Not a Number이다. 그런데 이건 조금 특이하다. 단순히 숫자가 아닌것이 아니다. 조금 정확히 하자면 Not a Number 보다는 Invaild Number라는 표현이 조금 더 정확할 것 같다. 무슨말이나면 숫자긴 숫자인데 에러가 발생하는 숫자라는 의미다.

```javascript
var a = 2 / 'hello';

typeof a; // 'number'
```

NaN은 연산의 결과에서 에러가 발생(undefined or unpresentable) 할 때 생성된다. 위의 경우처럼 숫자를 문자열로 나누는 것처럼 말이다.

## NaN의 비교 (isNaN())

너무 유명한 주제인데 NaN은 서로 동등비교 할 수 없다. NaN은 자신과도 같지 않기 때문이다.

```javascript
var a = NaN;

a === a; // false
a === NaN; // false
```

그래서 내장 전역 함수인 isNaN()을 사용했었다.
그런데 치명적인 문제는 이 역시 의미가 모호하다. 이유는 메커니즘에 있다. 주어진 인자 x 가 Number가 아니라면 Number(x)의 형태로 강제 형변환을 한 뒤 이게 NaN인지 비교하는 방식이다.

```javascript
isNaN(NaN); // true
isNaN('hello'); // true
isNaN('37'); // false
```

즉 isNaN은 NaN인지는 확인이 가능하다. 그러나 `"hello"` 와 같이 NaN이 아닌 값도 NaN으로 판단한다. 즉 숫자로 강제 변환되지 않는 값은 NaN으로 취급하는 에러가 발생한다.

따라서 `isNaN("NaN") // true` 이런 일도 발생해 버린다.

## NaN의 비교 (Number.isNaN())

ES6부터 이를 해결하기 위해 Number.isNaN()라는 메서드가 등장했다. 원래의 전역 isNaN보다 조금 더 엄격한 버전이다.

```javascript
Number.isNaN(NaN); // true
Number.isNaN('hello'); // false
Number.isNaN('37'); // false
Number.isNaN('NaN'); // false
```

아주 직관적으로 잘 작동한다. 그런데 ES6부터기 때문에 폴리필이 필요할 수 있다. 폴리필을 보면 코드가 실제로 어떻게 작동하는지 알수 있기 때문에 유용한데 안은 정말정말 간단하게 되어있다.

```javascript
Number.isNaN =
  Number.isNaN ||
  function(value) {
    return value !== value;
  };
```

한줄이 끝이다. `value !== value` 인 것만 확인하면 된다. 생각보다 매우 잘 작동한다. 혹시 isNaN을 사용할 일이 있다면 에러가 발생할 수 있기 때문에 모두 Number.isNaN으로 바꿔주도록 하자.
