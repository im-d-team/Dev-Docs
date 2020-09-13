### React의 상태 불변성

`react`와 `redux`의 공식 문서를 읽다 보면 `Immutability`를 강조하는 대목을 종종 볼 수 있다. 
왜 불변성(Immutability)를 유지해줘야 할까?

불변성을 지키지 않으면 우리는 컴포넌트를 최적화 할 수 없다.

리액트가 컴포넌트를 렌더링하는 과정을 살펴보자.

> 1. setState를 호출 (혹은 부모로부터 props를 전달 받음)
> 2. shouldComponentUpdate를 실행했는데 false를 리턴하면 여기서 멈추고, true를 리턴하면 다음 단계로 이동
> 3. 가상 DOM과 실제 DOM을 비교해서 변경사항이 있으면 화면을 다시 그린다

핵심은 2번에 있다. 다음과 같은 2개의 상태를 비교한다고 가정해보자.

```js
const array = [1,2,3,4];
const sameArray = array;
sameArray.push(5);

console.log(array !== sameArray); // false
```

```js
const array = [1,2,3,4];
const differentArray = [...array, 5];
console.log(array !== differentArray); // true
```
첫 번째 코드의 `array`와 `sameArray`변수가 참조하고 있는 배열의 주소 값은 서로 같다. 하지만, 두 번째 코드의 각각의 배열은 다른 레퍼런스를 가지기 때문에 비교했을 때 다르다는 결과 값이 나오게 된다.
이와 같이 불변성을 유지하여 코드를 작성하면 각 객체의 값이 아닌 레퍼런스 값만 비교를 해주면 된다.

즉, `shouldComponentUpdate`내의 코드는 한 줄이면 컴포넌트를 최적화할 수 있게 된다.

하지만, 불변성을 유지하며 코드를 작성하다보면 상태 업데이트 로직이 복잡해질 수 있다.

```js
state = {
    where: {
        are: {
            you: {
                now: 'faded',
                away: true // 이 부분을 바꾸고 싶다
            },
            so: 'lost'
        },
        under: {
            the: true,
            sea: false
        }
    }
}
```

```js
const { where } = this.state;
this.setState({
    where: {
        ...where,
        are: {
            ...where.are,
            you: {
                ...where.are.you,
                away: false
            }
        }
    }
});
```

위의 예시만 봐도 충분히 복잡해지는 것을 볼 수 있다. 이런 상태 업데이트 로직을 편하게 해주는 대표적인 라이브러리가 우리가 `React`를 사용하면서 패턴 처럼 많이 사용해왔던 `Immutable.js`이다. 

정리하자면, React의 상태는 컴포넌트 최적화를 위해 불변성을 유지해야하며 이를 편하게 하기 위해 `Immutable.js`같은 불변 객체를 반환해주는 라이브러리를 사용한다.

#### 🙏 Reference

- [누구든지 하는 리액트: 9편 불변성을 지키는 이유와 업데이트 최적화](https://velopert.com/3640)
- [리액트의 불변성과 Immutable.js 사용하기 - 1](https://byseop.github.io/2018/06/19/react-immutablejs01.html)
- [React state가 불변이어야 하는 이유](https://medium.com/@ljs0705/react-state%EA%B0%80-%EB%B6%88%EB%B3%80%EC%9D%B4%EC%96%B4%EC%95%BC-%ED%95%98%EB%8A%94-%EC%9D%B4%EC%9C%A0-ec2bf09c1021)
