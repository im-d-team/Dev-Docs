# bind() 메소드

## 정의

```js
func.bind(thisArg[, arg1[, arg2[, ...]]])
```

`bind()` 메서드는 새로운 함수를 생성한다. `bind()` 가 호출된 함수의 `this` 키워드를 주어진 값으로 설정하고, 새로운 함수의 인수(argument) 앞에 지정한 인수(arg1, arg2, ...)가 사용된다.

ECMAScript 5.1 (ECMA-262)에 추가되었다.

<br/>

## bind()가 사용될 수 있는 상황들

```js
var healthObj = {
  name: "달리기",
  lastTime: "PM10:12",
  showHealth: function() {
    console.log(
      this.name + "님, 오늘은 " + this.lastTime + "에 운동을 하셨네요"
    );
  }
};

healthObj.showHealth(); // "달리기님, 오늘은 PM10:12,에 운동을 하셨네요"
```

`showHealth` 안의 `this` 는 해당 함수가 참조하는 객체에 있는 `name` 과 `lastTime` 을 참조한다.

<br/>

```js
var healthObj = {
  name: "달리기",
  lastTime: "PM10:12",
  showHealth: function() {
    test();
  }
};

var test = function() {
  console.log(this.name + "님, 오늘은 " + this.lastTime + "에 운동을 하셨네요");
};

healthObj.showHealth(); // 님, 오늘은 undefined에 운동을 하셨네요
```

현재 `test`는 `window` 아래에 생성되어 있다. 따라서 `test` 를 호출하면 `test` 는 `window.name` 과 `window.lastTime` 을 호출하게 된다.

<br/>

```js
var healthObj = {
  name: "달리기",
  lastTime: "PM10:12",
  showHealth: function() {
    console.log(
      this.name + "님, 오늘은 " + this.lastTime + "에 운동을 하셨네요"
    );
  }
};

var test = healthObj.showHealth;
test(); // 님, 오늘은 undefined에 운동을 하셨네요
```

마찬가지로, 함수가 전역 컨텍스트에서 호출되었기 때문에 `this` 가 `window` 를 가리킨다.

<br/>

```js
var healthObj = {
  name: "달리기",
  lastTime: "PM10:12",
  showHealth: function() {
    setTimeout(function() {
      console.log(
        this.name + "님, 오늘은 " + this.lastTime + "에 운동을 하셨네요"
      );
    }, 1000);
  }
};

healthObj.showHealth(); // 님, 오늘은 undefined에 운동을 하셨네요
```

새로 만들어진 콜백 함수 안의 `this` 는 `window` 를 가리킨다. 콜백 함수는 `showHealth` 가 실행되는 순간 바로 실행되는 것이 아니고, `showHealth` 가 실행 된 뒤 이벤트 큐에 저장 되어 있다가 실행되기 때문이다.

<br/>

## 바인딩된 함수 생성

위와 같은 경우들에서, 함수가 호출된 객체에 `this` 를 바인딩하고 싶다면 해당 함수 뒤에 `bind()` 를 사용하면 된다.

```js
var healthObj = {
  name: "달리기",
  lastTime: "PM10:12",
  showHealth: function() {
    test();
  }
};

var test = function() {
  console.log(this.name + "님, 오늘은 " + this.lastTime + "에 운동을 하셨네요");
}.bind(healthObj);
```

```js
var healthObj = {
  name: "달리기",
  lastTime: "PM10:12",
  showHealth: function() {
    console.log(
      this.name + "님, 오늘은 " + this.lastTime + "에 운동을 하셨네요"
    );
  }
};

var test = healthObj.showHealth.bind(healthObj);
```

```js
var healthObj = {
  name: "달리기",
  lastTime: "PM10:12",
  showHealth: function() {
    setTimeout(
      function() {
        console.log(
          this.name + "님, 오늘은 " + this.lastTime + "에 운동을 하셨네요"
        );
      }.bind(this),
      1000
    );
  }
};
```

> `setTimeout` 은 `healthObj` 에 바인딩 되어 있다. 이 때, 콜백함수 또한 해당 컨텍스트 안에서 정의되기 때문에 `bind(this)` 가 유효하다.<br/>
> 또한 이와 같은 이유로 화살표 함수를 사용하여 동일한 효과를 낼 수 있다.

함수 뒤에 `.` 를 사용하면 함수가 객체로 변하고, `function native` 객체에 있는 메서드들을 부를 수 있게 된다. `bind()` 도 그 중 하나인데, 해당 함수 안의 `this` 를 원하는 객체에 바인딩 시킨다.

더욱 정확히 말하면 `bind()`가 `this`를 해당되는 객체로 바꾸어 새로운 함수를 리턴한다.

```js
var test = function() {
  console.log(this.name + "님, 오늘은 " + this.lastTime + "에 운동을 하셨네요");
}.bind(healthObj);
```

위의 코드에서 `bind(healthObj)` 는 다음과 같은 함수를 리턴한다.

```js
function(){
    console.log(healthObj.name + "님, 오늘은 " + healthObj.lastTime + "에 운동을 하셨네요");
}
```

<br/>

## 부분 적용 함수

이외에도 `bind()` 는 초기 인수 값을 지정할 수 있다.

```js
function addArguments(arg1, arg2) {
  return arg1 + arg2;
}

var result1 = addArguments(1, 2); // 3

// 첫 번째 인수를 지정하여 함수를 생성
var addThirtySeven = addArguments.bind(null, 37);

var result2 = addThirtySeven(5); // 37 + 5 = 42

// 두 번째 인수는 무시됩니다.
var result3 = addThirtySeven(5, 10); // 37 + 5 = 42
```

## 생성자

또한, 생성자에서 쓰일 때는 첫 번째 매개변수가 무시된다.

```js
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function() {
  return this.x + "," + this.y;
};

var YAxisPoint = Point.bind(null, 0);
var axisPoint = new YAxisPoint(5);
axisPoint.toString(); // '0,5'
```

<br/>

---

#### References

- [부스트코스 - bind메소드로 this제어하기](https://www.edwith.org/boostcourse-web/lecture/16780/)
- [MDN - Function.prototype.bind()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
