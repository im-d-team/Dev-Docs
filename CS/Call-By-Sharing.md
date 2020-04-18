# Call By Sharing(a.k.a Call By Object, Call By Object-Sharing)

## Call By Value와 Call By Reference

들어가기에 앞서, 메소드의 호출 방식에는 크게 두 가지가 있다. **call by value(값에 의한 호출)** 과 **call by reference(주소에 의한 호출)** 이다. 이 두 가지 방법은 매개 변수로 전달된 값의 유형으로 구분한다. 이처럼 함수 호출 시 전달 값의 종류를 결정하는 방법을 [평가 전략(Evaluation strategy)](https://en.wikipedia.org/wiki/Evaluation_strategy) 이라고 한다.

함수에 전달한 매개변수는 **actual parameter(actual argument)** 라고 하고, 함수에서 수신받은 매개변수는 **formal parameter(formal argument)** 라고 한다.

```js
void method(formal parameter){}

method(actual paramter)
```

> 보통, 이를 parameter와 argument로 나누어 부르는데, parameter는 formal parameter를 말하고 argument는 actual parameter를 뜻한다.

### Call By Value

call by value 방식은 actual parameter의 값을 formal parameter에 복사한다. 각각은 서로 다른 메모리 공간에 할당된다. 따라서 call by value 방식에서는 formal parameter가 지역변수 처럼 사용되고, formal parameter의 변경은 actual parameter에 영향을 주지 않는다.

```js
int i = 0;

function changeValue(i){
    i = 1;
}

changeValue(i); // i == 0
```

### Call By Reference

call by reference 방식은 formal parameter가 actual parameter를 그대로 사용한다. 따라서 formal parameter가 변경되면 actual parameter도 변경된다.

```js
int i = 0;

function changeValue(i){
    i = 1;
}

changeValue(i); // i == 1
```

이러한 방식은 대부분의 고급언어에서는 구현이 불가능하다. 비교적 저급언어에 가까운 c의 pointer를 이용하면 이를 확인할 수 있다.

> call by reference의 예시 c언어의 swap 함수 구현이 많이 사용된다.
> 참고 - [C Program to Swap two Numbers](https://www.geeksforgeeks.org/c-program-swap-two-numbers/)

## 객체 기반 언어의 메소드 호출

java, JS, python 등의 고급 언어는 객체(Object)를 기반으로 구현되어 있다. 원시값(primitive value)을 제외한 모든 것은 객체인데, 객체를 변수에 할당하면 값이 아닌 주소 값이 저장된다. 따라서 객체가 할당된 변수를 사용하는 것은 주소를 참조하는 것과 같다. 이 때문에 다음과 같은 동작이 가능하다.

```js
class Main{
    main(){
        VO vo = new VO(0);
        changeValue(vo); // vo.i == 1;
    }

    function changeValue(VO vo){
        vo.i = 1;
    }
}
```

이러한 동작 때문에 call by reference 라고 생각할 수 있지만 그렇지 않다.

> 예시(java)
>
> ```java
> public class Main{
>     public static void main(String[] args){
>         VO vo = new VO(); // vo.i ==null;
>         changeValue(vo); // vo.i == 1;
>         changeReference(vo); // vo.i == 1;
>     }
>
>     private static void changeValue(VO vo){
>         vo.i = 1;
>     }
>
>     private static void changeReference(VO vo){
>         vo = new VO();
>         vo.i = 2;
>     }
> }
>
> class VO{
>     Integer i;
> }
> ```

> 예시(JS)
>
> ```js
> var test = { i: 0 }; // test.i === 0
>
> // change value
> ((test) => {
>   test.i = 1;
> })(test); // test.i === 1
>
> // change reference
> ((test) => {
>   test = { i: 2 };
> })(test); // test.i === 1
> ```

위의 예시처럼 parameter를 바꿔도 argument가 바뀌지 않지만, parameter가 객체인 경우 그 멤버를 변경하면 argument의 멤버도 변경된다. 위의 java 예시는 아래와 같이 동작한다.

![call by sharing](../assets/images/call-by-sharing01.png)

이러한 평가 전략을 call by sharing이라고 한다.

## Call By Sharing

> call by sharing은 [CLU](<https://en.wikipedia.org/wiki/CLU_(programming_language)>) 라는 언어에서 처음 사용되었다.

call by sharing은 의 주요 컨셉은 **actual parameter와 formal parameter가 객체만을 주고받는 것**이다.

모든 값을 박스처럼 생각하는 것과 비슷하다. 박스를 주고 받을 때, 박스 자체가 바뀌지 않는다면 그 박스의 내용물은 바뀔 수 있다. 즉 객체 자체가 바뀌지 않는다면 객체의 멤버가 변화하는 것이 actual parameter에 전달된다.

call by value 방식만으로도 이러한 동작을 설명할 수 있기 때문에 call by value라고 설명하기도 하지만 call by sharing이라고 하는 것이 더 정확하다. **call by sharing은 call by value와 달리 actual parameter가 변화한다는 개념을 포함** 하고 있기 때문이다. 또한 **call by sharing은 언어의 값이 객체를 기반으로 한다는 의미를 포함** 한다는 차이가 있다.

---

#### Refereces

- [Difference between Call by Value and Call by Reference](https://www.geeksforgeeks.org/difference-between-call-by-value-and-call-by-reference/)

- [Evaluation strategy](https://en.wikipedia.org/wiki/Evaluation_strategy#Call_by_sharing)

- [[프로그래밍언어] Formal parameter, Actual parameter, 그리고 parameter passing](<[https://yunmap.tistory.com/entry/%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D%EC%96%B8%EC%96%B4-Formal-parameter-Actual-parameter-%EA%B7%B8%EB%A6%AC%EA%B3%A0-parameter-passing](https://yunmap.tistory.com/entry/프로그래밍언어-Formal-parameter-Actual-parameter-그리고-parameter-passing)>)

- [Call by Sharing](http://www.pmg.lcs.mit.edu/papers/thetaref/node34.html)
