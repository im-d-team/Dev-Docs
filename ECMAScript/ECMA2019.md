# ECMAScript 2019

기본적으로 여기에 나오는 내용들은 TC39 committee에서 승인처리가 된 새로 추가가 되는 기능이다.

1. [Array#{flat,flatMap}]
2. [Object.fromEntries]
3. [String#{trimStart,trimEnd}]
4. [Symbol#description]
5. [try { } catch {} // optional binding]
6. [JSON ⊂ ECMAScript]
7. [Well-formed JSON.stringify]
8. [Stable Array#sort]
9. [Revised Function#toString]

## Array#{flat,flatMap}

Array 함수에 2가지 메소드가 추가가 되었다.

> [https://tc39.github.io/proposal-flatMap/](https://tc39.github.io/proposal-flatMap/)

### flat()

이 메서드는 호출 된 배열의 병합된 모양을 반환한다.

```js
const arr = [1,2,[1,2],[2,3]];
const flatArr = arr.flat();
    
console.log(flatArr); // [1,2,1,2,2,3]
```

추가적으로 선택적인 옵션을 제공하는데 내가 원하는 `depth`를 정할 수 있다. `default` 값은 1이다. 중첩 수준이 1보다 큰 배열에서 `flat` 메서드를 호출하게 되면 첫 번째 수준만 병합되는 것이다.

```js
const arr = [1,2,[1,2,[4,5]],[2,3]];
const flatArr = arr.flat();
    
console.log(flatArr); // [1, 2, 1, 2, [4 5], 2, 3]
```

위에서 보이듯이 아무 설정값을 주지 않아 1이 기본값이 된다. 옵션으로 넣고 싶다면 아래와 같이 하면 된다.

```js
const arr = [1,2,[1,2,[4,5]],[2,3]];
const flatArr = arr.flat(2);
    
console.log(flatArr); // [1, 2, 1, 2, 4, 5, 2, 3]
```

그러나 경우에 따라 모든 깊이를 `flat`하게 만들고 싶어지는 경우가 생긴다.

```js
const arr = [1,2,[1,2,[4,5,[6,7]]],[2,3]];
const flatArr = arr.flat(Infinity);
    
console.log(flatArr); // [1, 2, 1, 2, 4, 5, 6, 7, 2, 3]
```

### flatMap()

이 메서드는 `map () + flat ()` 을 사용하는 것과 동일한 효과 / 기능을 갖는다. 

즉, 값을 새로운 것으로 매핑한 다음 결과를 병합한다. 차이점은 평면에 있는 것과 같이 깊이에 대한 옵션을 지원하지 않는다. 1의 깊이를 사용한다.

```js
const names = ["John", "Johny", "Peter"];
const mapOnly = names.map((name, idx) => [idx, name]);
const flatMap = names.flatMap((name, idx) => [idx, name]);
    
console.log(mapOnly); // [[0, “John”],[1, “Johny”],[2, “Peter”]]
console.log(flatMap); // [0, “John”,1, “Johny”,2, “Peter”]
```

## Object.fromEntries

이 메소드는 `Object.entries ()` 의 반대이다.

`Object.entries()` 는 객체 항목을 [key, value] 쌍의 **배열로 변형**하지만 `Object.fromEntries()` 는 [key, value] 쌍의 목록을 **객체로 변환**합니다.

```js
const map = new Map().set("id", 1).set("name", "John");
const arr = [["id", 1], ["name", "John"]];
    
const mapObj  = Object.fromEntries(map);
const arrObj = Object.fromEntries(arr);
    
console.log(mapObj); // {id: 1, name: ‘John’}
console.log(arrObj); // {id: 1, name: ‘John’}
```

## String#{trimStart,trimEnd}

많은 브라우저가 이미 `trimRight` 및 `trimLeft` 를 지원하지만 `padStart` 및 `padLeft` 와 일관성을 유지하기 위해 `trimStart` 및 `trimEnd` 를 만들었다고 한다.

```js
const exampleStr = "      first class js     ";
const trimStart = exampleStr.trimStart();
const trimEnd = exampleStr.trimEnd();
    
console.log(trimStart); // "first class js     "
console.log(trimEnd);   // "      first class js"
```

## Symbol#description

Symbol 객체에 새로운 읽기 전용 속성이 추가되었다. 선택 사항이며 심볼의 설명을 반환한다.

```js
const mySymbol = Symbol(“first”);
const description = mySymbol.description;
    
console.log(description); // “first”
```

## try { } catch {} // optional binding

선택적 `catch` 바인딩이 도입이 되었다. 

우리는 `catch` 절에 대한 예외 변수를 다음과 같이 바인딩 해야했다.

```js
try {
 // do something
} catch(err) {
 // throw custom error, i.e. don’t use the err variable
}
```

예외 변수를 생략하고 다음을 수행 할 수 있다.(`throw custom error`가 가능해지는 것이다.)

```js
try {
 // do something
} catch {
 // throw custom error
}
```

## JSON ⊂ ECMAScript

줄 분리 기호 (U + 2028) 및 단락 분리 기호 (U + 2029) 기호는 **문자열 리터럴**에 사용할 수 없다.

기존에는 사용하게 되면 SyntaxError가 나왔으나, 앞으로는 사용이 가능하다.

```js
// Produces invalid string before ES2019
eval('"\u2028"');
eval('"\u2029”’);
    
// Valid in ES2019
eval('"\u2028"');
eval('"\u2029”’);
```

## Well-formed JSON.stringify

`ES2019` 이전에는 대용 `UTF-8` 코드(U + D800에서 U + DFFF까지)로 `JSON.stringify()` 를 호출하면 단일 `UTF-16` 코드 단위가 리턴되었지만 이제는 문자열로 나타내게 된다.

이렇게하면 `JSON.parse ()`를 사용하여 원래 표현으로 다시 변환 할 수 있다.

```js
// Before ES2019
JSON.stringify('\uD800'); // "" 
    
// Now 
JSON.stringify('\uD800'); // "\ud800" => 현재 크롬에서는 이렇게 나오고 있다.
```

## Stable Array#sort

`Mathias Bynens`의 트윗에 따르면 배열의 정렬 방법은 안정적으로 되었다고 한다. 불안정한 `QuickSort`가 아닌 10 개 이상의 요소에 대한 배열을 위해 안정적인 `TimSort` 알고리즘을 사용한다고 한다.

> Array.prototype.sort is now stable in @v8js v7.0 / Chrome 70!
>
> Previously, V8 used an unstable QuickSort for arrays with more than 10 elements. Now, we use the stable TimSort algorithm.
>
> — Mathias Bynens

## Revised Function#toString

이 메소드는 우리가 이미 알고있고 사용하는 것이라고 하는데, **무엇이 바뀌었을까?**

기존에는 `toString()`을 하게 되면 공백과 주석을 제거하고 코드를 반환을 했다.

그러나 이제는 그렇게 안 한다는 것이다.

```js
Before:
function /* this is comment */ testFunc() {}
console.log(testFunc.toString()); // function testFunc() {}

Now:
function /* this is comment */ testFunc() {}
console.log(testFunc.toString()); // function /* this is comment */ testFunc() {}
```

---

#### reference

- [ECMAScript 2019(ES2019) – New Features with Examples]([https://firstclassjs.com/ecmascript-2019es2019-new-features-with-examples/#stable-array-sort])