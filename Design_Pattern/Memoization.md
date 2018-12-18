# Memoization

`React` 10월 말을 기준으로 **새로운 릴리즈**가 올라왔다.
<br/>
`React.memo`라는 새로운 기능이 나오게 되었다.
<br/>

최근 회사에서 사용하는 `vue`의 컴포넌트를 1300개 가량을 그리게 되면 13초의 시간이 걸리는 이슈가 생겨서 생각을 하고 있었는데 `React`에서는 16.6버전에 `Memoization`기능이 추가가 되었다. 더 많은 기능의 설명은 해당 주소로 이동하면 된다.
<br/>

`Memoization`을 간단하게 말을 하자면 컴포넌트를 캐시를 해놓고 같은 컴포넌트를 만들때 캐시된 내용을 먼저 보고 있다면 새로 만드는 것이 아닌 캐시된 컴포넌트 내용을 보고 만드므로써 성능, 속도를 향상 시키는 것이다.
<br/>

그렇다면 js에서는 어떻게 사용할 수 있을까?
<br/>

자바스크립트에서는 반복적으로 계산되는 함수는 **메모이제이션 패턴**으로 구현을 한다.
<br/>

계산 결과를 저장해 놓아 이후에 **다시 계산할 필요없이 사용가능하도록 저장해놓은 캐싱과 같은 기능 메모이제이션**이라고 한다.
<br/>

가장 좋은 예시는 피보나치 수열로 하는 것이다.
기존의 3!에서 4!을 다시 구하는데 있어서 새로 처음부터 계산을 해나가는 것이 아니다.
<br/>

아래에서 피보나치수열로 예를 들어보도록 하자.
<br/>

피보나치수열은 `0, 1, 1, 2, 3, 5, 8, 13, 21, ... `으로 나타나는 수열이다.
<br/>

## 일반코드 \#1

```js
function fibonacci(n) {
    if (n < 2) {
         return n;
    }
    else {
         return fibonacci(n-1) + fibonacci(n-2);
    }
}
fibonacci(5);
```

<br/>

## 일반코드 \#2

삼항연산자를 사용하여 코드 정리

```js
function fibonacci(n) {
    return n < 2 ? n : fibonacci(n-1) + fibonacci(n-2);
}
fibonacci(5);
```

<br/>

## Memoization을 사용한 코드 \#3

`memo` 배열에 계산한 값을 저장해 놓은 후, 다시 계산하지 않고 사용하도록 개선

```js
let memo = [0,1];

function fibMemoization(n) {
   if(typeof memo[n] !== 'number') {
     memo[n] = fibMemoization(n-1) + fibMemoization(n-2);
   }
   return memo[n];
}
fibMemoization(5);
```

연산할 값이 크면 클수록 `Memoization`을 사용했을 때와 하지 않았을때의 성능은 크게 차이가 난다.
<br/>

재귀적으로 `fibonacci`함수를 몇번 호출하는지 비교를 통해서 알아볼 수 있다.
<br/>

```js
var count = 0;

function fib(n) {
   count++;
   console.log('called fib: ', count);
   return n<2 ? n : fib(n-1) + fib(n-2);
}

var beforeDate = new Date();

fib(15);

var afterDate = new Date();

console.log(afterDate - beforeDate);
```

<br/>

```js
var memo = [0,1];
var count = 0;

function fibMemoization(n) {
   count++;
   console.log('called fibMemoization: ', count);
   if(typeof memo[n] !== 'number') {
     memo[n] = fibMemoization(n-1) + fibMemoization(n-2);
   }
   return memo[n];
}

var beforeDate = new Date();

fibMemoization(15);

var afterDate = new Date();

console.log(afterDate - beforeDate);
```