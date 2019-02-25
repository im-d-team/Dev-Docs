# Includes와 IndexOf

## 소개

두 메서드 모두 배열에 어떤 값이 있는지 찾을 때 비슷하게 사용한다. 정확히는 사용 용도가 조금은 다르지만, 배열에 어느 값이 있는지 확인할 때 사용할 수 있다. includes는 ES6부터 새로 생긴것인데 어떤 차이점이 있는지 알고 왜 이 메서드를 사용해야하는지 알아보자.

## 공통점

includes는 boolean을, indexOf 는 Number를 반환한다. indexOf는 찾고자하는 값이 있는 배열의 숫자를 반환하고 없으면 -1을 반환한다.

아래와 같이 사용할 수 있다.

```javascript
const array = [0, 1, 2, 3, 4];

array.includes(2) ? console.log('yes') : console.log('no');
array.indexOf(2) > -1 ? console.log('yes') : console.log('no');
```

## 차이점

배열 안의 값이 조금 특별해지면 이야기가 달라진다.

```javascript
const array = [1, null, NaN, , -0]; // 빈값은 undefined

array.includes(1) ? console.log('yes') : console.log('no');
array.indexOf(1) > -1 ? console.log('yes') : console.log('no');

array.includes(null) ? console.log('yes') : console.log('no');
array.indexOf(null) > -1 ? console.log('yes') : console.log('no');

// 달라지는 구간
array.includes(NaN) ? console.log('yes') : console.log('no');
array.indexOf(NaN) > -1 ? console.log('yes') : console.log('no');

array.includes(undefined) ? console.log('yes') : console.log('no');
array.indexOf(undefined) > -1 ? console.log('yes') : console.log('no');

// 둘다 버그
array.includes(+0) ? console.log('yes') : console.log('no');
array.indexOf(+0) > -1 ? console.log('yes') : console.log('no');
```

1, null에는 큰 이상이 없지만 NaN, undefined는 includes만 잡아낸다. -0, +0은 모두 잡지 못한다.

## 결론

배열안의 값을 확인하는 경우 큰 차이는 없지만 NaN, undefined와 관련한 버그가 발생할 수 있다. 따라서 이왕이면 includes를 사용하는 것이 더 좋아보인다.
