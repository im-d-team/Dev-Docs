# Reduce

Array.prototype이 가지고 있는 리듀스라는 함수다. 이 리듀스는 흔히 SUM의 기능을 가진다고 생각을 많이 한다. 그러나 생각보다 더 많은 기능을 구현할 수 있다.

## 함수 설명

Reduce는 구조가 좀 특이하다. 일단 파라미터로 두가지를 받을 수 있는데 콜백함수와 초기값이다. 그런데 이 콜백에 4가지 파라미터가 있으나 2개가 필수 2개가 optinal이다. 보기쉽게 구조를 그려보자.

```markdown
- reduce\*
  - callback\*
    - total\* // 누적 값
    - currentValue\* // 현재 값
    - currentIndex
    - arr // reduce가 호출된 배열
  - initialValue // 초기값
```

reduce라는 함수에 파라미터로 콜백이 있고 이 콜백에 파라미터로 또 인자가 있는 구조다.

### sum

reduce로 할 수 있는 대표적인 기능이다. 매우 간단하니 코드로 살펴보자.

```javascript
var arr = [1, 2, 3, 4, 5];

var sum = arr.reduce((acc, cur) => {
  return acc + cur;
});

console.log(sum); // 15
```

```javascript
var arr = [1, 2, 3, 4, 5];
var reducer = (acc, cur) => {
  return acc + cur;
};

var sum = arr.reduce(reducer);

console.log(sum); // 15
```

위와 아래는 완전히 동일하다. 함수의 동작 방식은 생각보다 간단한데 map과 유사하다. map처럼 배열의 요소를 하나씩 가져온 것을 cur에 담는다. return 값이 acc가 되어 다음 반복 때 사용할 수 있다.

이러한 메커니즘 때문에 덧셈이 가능하다.

```javascript
var arr = [1, 2, 3, 4, 5];
var reducer = (acc, cur, index) => {
  console.log('acc, cur, index : ' + acc, cur, index);
  return acc + cur;
};

var sum = arr.reduce(reducer, 10);

console.log(sum);
// 위의 결과
// acc, cur, index : 10 1 0
// acc, cur, index : 11 2 1
// acc, cur, index : 13 3 2
// acc, cur, index : 16 4 3
// acc, cur, index : 20 5 4
// 25

// 초기값이 없다면
// acc, cur, index : 1 2 1
// acc, cur, index : 3 3 2
// acc, cur, index : 6 4 3
// acc, cur, index : 10 5 4
// 15
```

위와 같이 초기값을 정해주면 그 초기값이 첫번째 틱의 acc가 된다. 초기값을 정하지 않으면 index는 1부터, 초기값을 정하면 0부터 시작하게 된다.

### 응용

자바스크립트의 강점은 타입 선언이 동적이다. 파라미터의 타입역시 동적일 수 있다. 이게 응용을 가능하게 한다. 예를 들어 초기 값이 배열이라면? object라면? 여기서 출발한다.

```javascript
var arr = ['Kim', 'Kim', 'Kang', 'Jang', 'Jo', 'Kang', 'Jo'];

var reducer = (acc, cur, index) => {
  if (!acc[cur]) {
    acc[cur] = 1;
  } else {
    acc[cur] = acc[cur] + 1;
  }

  return acc; // 여기
};

var sorting = arr.reduce(reducer, {});

console.log(sorting); // { Kim: 2, Kang: 2, Jang: 1, Jo: 2 }
```

배열의 같은것을 찾아 개수를 세어봤다. 여기서 중요한 것은 누적 값인 object를 return한다는 점이다.

다음으로는 배열로 만들어 봅시다. 보통 map과 filter를 동시에 이용하는 로직의 경우 reduce로 한방에 처리가 가능합니다. 예를들어
짝수만 찾아서 요소들을 2를 곱해야 한다고 하면 아래와 같이 처리가 가능합니다.

```javascript
var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 15, 16, 20];

var reducer = (acc, cur, index) => {
  if (cur % 2 === 0) acc.push(cur * 2);
  return acc;
};

var double = arr.reduce(reducer, []);

console.log(double);
```

아래와 같이 object에서 특정값만 뽑아내는것도 가능합니다.

```javascript
const input = [
  {
    title: '슈퍼맨',
    year: '2005',
    cast: ['장동건', '권상우', '이동욱', '차승원']
  },
  {
    title: '스타워즈',
    year: '2013',
    cast: ['차승원', '신해균', '장동건', '김수현']
  },
  {
    title: '고질라',
    year: '1997',
    cast: []
  }
];
const key = 'cast';

const flatMapReducer = (acc, cur) => {
  cur[key].reduce((acc2, cur2) => {
    if (acc2.indexOf(cur2) === -1) acc2.push(cur2);
    return acc2;
  }, acc);

  return acc;
};
const flattenCastArray = input.reduce(flatMapReducer, []);
// ['장동건', '권상우', '이동욱', '차승원', '신해균', '김수현']

console.log(flattenCastArray);
```

참고자료

https://medium.com/@hongkevin/js-3-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EB%B0%B0%EC%97%B4-%EB%A9%94%EC%84%9C%EB%93%9C-reduce-100-%ED%99%9C%EC%9A%A9%EB%B2%95-feat-egghead-io-97c679857ece
