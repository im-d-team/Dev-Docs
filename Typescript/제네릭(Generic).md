# 제네릭(Genenric)

## 제네릭을 사용하는 이유

제네릭(Generic)이란 데이터의 타입(data type)을 일반화한다(generalize)는 것을 의미한다.<br/>
제네릭은 클래스나 함수에서 사용할 데이터 타입을 미리 지정하는 방법이다.

제네릭을 사용하여 타입을 미리 지정하면 다음과 같은 장점을 얻을 수 있다.

- 클래스나 함수 내부에서 사용되는 데이터의 타입 안정성을 높일 수 있다.
- 반환 값에 대한 타입 변환 및 타입 검사에 들어가는 노력을 줄일 수 있다.

<br/>

## Javascript vs Typescript

기존에 `Javascript`에서 Queue를 구현하는 클래스를 작성하면 다음과 같이 작성할 수 있다.

```js
class NumberQueue {
    protected arr = [];

    push(item) {
        this.arr.push(item);
    }

    pop() {
        return this.arr.shift();
    }
}

const queue = new NumberQueue([]);

queue.push(1);
queue.push('2');

console.log(queue.pop().toFixed());
console.log(queue.pop().toFixed());
``` 

위와 같이 `Javascript`에서 `NumberQueue`클래스를 작성하고 결과 값을 출력한다면 어떻게 될까?

아마 2번 째 값을 출력하려고 할 때 `string`타입에는 `toFixed()`함수가 없기 때문에 `TypeError`가 발생할 것이다. 

위와 같은 코드를 안짜면 된다고 생각할 수 있지다. 하지만 실제로 애플리케이션을 만들다 보면 서버에서 준 데이터를 가지고 코딩을 해야한다거나 코드가 복잡해진다거나 하면 충분히 일어날 수 있는 실수다.

`Typescript`로 위의 코드를 수정하면 다음과 같다.

```ts
class NumberQueue {
    protected arr:number[] = [];

    push(item: number) {
        this.arr.push(item);
    }

    pop(): number {
        return this.arr.shift();
    }
}

const queue = new NumberQueue();

queue.push(1);
queue.push('2');

console.log(queue.pop().toFixed());
console.log(queue.pop().toFixed());
```

위와 같이 클래스를 작성한다면 `Argument of type '"2"' is not assignable to parameter of type 'number'.`과 같은 에러를 사전에 감지하고 수정할 수 있게 된다.

하지만 위와 같이 작성했을 때 약간의 문제가 있다.

`Queue`는 굉장히 일반적인 개념이기 때문에 위와 같이 작성하면 모든 타입의 `Queue`클래스를 작성해줘야 한다. `NumberQueue`, `StringQueue` 등과 같이 말이다. 즉, 재사용성이 떨어지게 된다.

이럴 때 사용할 수 있는 것이 **제네릭(Generic)** 이다.

<br/>

## 제네릭(Generic)의 활용

제네릭은 선언 시점이 아니라 생성 시점에 타입을 명시하여 하나의 타입만이 아닌 다양한 타입을 사용할 수 있도록 하는 기법이다.<br/> 즉, 한 번의 선언으로 다양한 타입으로 재사용이 가능해진다.

```ts
class Queue<T> {
  protected arr: Array<T> = [];

  push(item: T) {
    this.data.push(item);
  }

  pop(): T {
    return this.data.shift();
  }
}

const numberQueue = new Queue<number>();

numberQueue.push(1);
numberQueue.push(2);

console.log(numberQueue.pop().toFixed()); //1
console.log(numberQueue.pop().toFixed()); //2

const stringQueue = new Queue<string>();

stringQueue.push('BKJang');
stringQueue.push('Hello');

console.log(numberQueue.pop().toUpperCase()); //BKJang
console.log(numberQueue.pop().toUpperCase()); //Hello

const objQueue = new Queue<{name: string, age: number}>();

objQueue.push({name: 'BKJang', age: 27}); 
objQueue.push({name: 'JHKim', age: 25});

console.log(objQueue.pop()); //27
console.log(objQueue.pop()); //25
```

위의 코드를 보면 `T`라는 것을 볼 수 있는데 이는 제네릭을 선언할 때 `Typescript`에서 뿐만이 아니라 다른 언어에서도 관용적으로 사용되는 표현이다. `T`는 타입 파라미터(Type Parameter)라고 한다.

제네릭을 사용하면 위와 같이 `Queue`클래스 하나만 작성해두고 `number`든 `string`이든 `object`든 모든 타입에 대해서 재사용이 가능해진다.

### 함수에서의 제네릭(Generic)

함수도 마찬가지로 제네릭을 사용할 수 있으며 함수는 인수의 타입에 의해 매개변수의 타입도 결정된다.

```ts
function foo<T>(arr: T[]): T[] {
    return { ...arr };
}

console.log(foo([1, 2, 3, 4, 5])); //{ '0': 1, '1': 2, '2': 3, '3': 4, '4': 5 }
console.log(foo(['a', 'b', 'c'])); //{ '0': 'a', '1': 'b', '2': 'c' }
```

`foo`함수는 배열을 객체로 변환하는 함수이다. 다양한 타입의 배열을 인자로 전달받아 매개변수의 타입을 결정한다.

참고로 화살표 함수를 사용하여 선언할 때는 다음과 같이 선언할 수 있다.

```ts
const foo = <T> (arr: T[]) => {
    return { ...arr };
}
```

<br/>

---

#### Reference

- [Poiemaweb - 제네릭](https://poiemaweb.com/typescript-generic)
- [Typescript hand book - Generic](https://www.typescriptlang.org/docs/handbook/generics.html)