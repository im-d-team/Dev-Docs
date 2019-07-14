# IndexDB WebSQL

데이터 저장소는 서버 DB를 사용해서 데이터를 저장하고 꺼내서 보여줄 수 있도록 데이터를 저장하는 공간이다. 이러한 데이터를 저장할 수 있는 공간이 브라우저에도 존재하는데 이것을 통틀어서 스토리지라고 부른다. 

스토리지에는 여러 종류가 존재하는데 로컬 스토리지, 세션 스토리지, 쿠키, indexedDB, Web SQL 이렇게 5가지가 존재한다. 그중에서 오늘 살펴볼 내용은 **indexedDB와 Web SQL이다.**

나머지 3가지에 대해 알아보길 원하면 아래의 링크를 확인하면 됩니다.

> [Cookie, Local Storage](https://github.com/SeonHyungJo/FrontEnd-Dev/blob/master/Browser/Cookie_Storage_Local.md)

<br/>

## IndexedDB

먼저 어디서 볼 수 있나?

개발자들이 많이 사용하는 브라우저 중 하나인 크롬을 열어서 Dev Tool을 열고 Application 탭에 들어가면 좌측에 좀 전에 말했던 5가지의 저장소가 있는 것을 볼 수 있다.

그중에서 우리가 보려는 **IndexedDB**도 있다. 

IndexedDB는 새로 등장했다고 하기에는 오래되었는데 2009년 말경 Web SQL의 대안으로 탄생했다. 즉 현재 Web SQL은 사양 책정이 중지된 상태이다. IndexedDB는 자바스크립트 객체 단위의 데이터 저장이 용이하고 객체를 대상으로 인덱스를 걸 수 있어 간단한 구현과 효율적인 검색을 수행할 수 있다.

> `많은 양의 구조화된 데이터를 클라이언트 측에 저장하기 위한 저수준의 API` - Mozilla

IndexedDB는 SQL언어와 무관하며 단순한 저장구조(Key-Value Storage)를 갖추고 있다. 간단한 자바스크립트 API만으로도 데이터베이스 조작이 가능하며, 브라우저 친화적이고 표준화 작업을 쉽게 이끌 수 있다는 장점이 있다. 결국 모바일 환경에서의 가벼운 로컬 DB 컨셉은 관계형 DB보다는 IndexedDB와 같은 객체기반의 비 관계형 DB가 더 어울린다고 할 수 있다.

흔히 PWA에서, IndexedDB를 사용해서 어떻게 오프라인 기반의 애플리케이션을 만들 수 있는지 자세하게 다루고 있다.

> [Progressive Web App용 오프라인 저장소](https://developers.google.com/web/fundamentals/instant-and-offline/web-storage/offline-for-pwa?hl=ko)

- IndexedDB는 브라우저에 많은 양의 구조화된 데이터를 영구적으로 저장할 수 있으며, 네트워크 상태에 상관없이 여러 기능을 사용할 수 있다. (최대 하드디스크의 50%라고 한다. => 실제로 컴퓨터의 하드디스크 50%를 채울 수 있는지에 대한 테스트를 진행하지 못했습니다.)
- IndexedDB는 서비스 워커를 사용한다면 동기적으로 사용이 가능하나 그렇지 않을 경우는 비동기가 기본이다. 그래서 대부분은 Promise로 만들어진 라이브러리를 사용한다. - [idb](https://www.npmjs.com/package/idb)

<br/>

## 실제로 사용해보기

### 브라우저 지원여부확인

```js
if (!window.indexedDB) {
    console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.")
}
```

<br/>    

### 데이터베이스 열기

기본적으로 비동기로 작동을 하며, 작동의 결과를 4가지의 콜백 이벤트로 전달받는다.

- success : 데이터베이스 연결 성공
- error : 데이터베이스 연결 실패
- upgradeneeded : 데이터베이스를 처음 만들거나, 데이터베이스 버전이 변경되었을 때 작동하는 함수
- blocked : 이전의 연결을 닫지 않았을 경우 실행됨(이번에 사용하지 않을 예정)

```js
// indexedDB 지원유무
if ("indexedDB" in window) {
  idbSupported = true;
}

if (idbSupported) {
  // indexedDB 열기
  const openRequest = indexedDB.open("test", 1);

  openRequest.onupgradeneeded = function (e) {
    console.log("Upgrading");
  }

  openRequest.onsuccess = function (e) {
    console.log("Success!");
    db = e.target.result;
  }

  openRequest.onerror = function (e) {
    console.log("Error");
    console.dir(e);
  }
}
```

### 처음 접속시

처음 접속 시 `onupgradeneeded`를 타게 되며 이후 버전업이 이루어지지 않는 한 실행되지 않는다.

![image](https://user-images.githubusercontent.com/24274424/59140159-18e1c780-89d5-11e9-99d3-896ca66b2a9b.png)

### 2번째 접속시

![image](https://user-images.githubusercontent.com/24274424/59140161-1bdcb800-89d5-11e9-9fa6-3f5ed4bf073b.png)

### 에러 발생시

![image](https://user-images.githubusercontent.com/24274424/59140165-1e3f1200-89d5-11e9-90e6-3c0b21cbf9c6.png)

### Object Stores(객체 저장소)

위에서 말했듯이 IndexedDB의 컨셉은 객체 저장소이다. 

```js
if ("indexedDB" in window) {
  idbSupported = true;
}

if (idbSupported) {
  const openRequest = indexedDB.open("test_2", 1);

  openRequest.onupgradeneeded = function (e) {
    console.log("running onupgradeneeded");
    const thisDB = e.target.result;
    if (!thisDB.objectStoreNames.contains("testBox")) {
      thisDB.createObjectStore("testBox");
    }
  }

  openRequest.onsuccess = function (e) {
    console.log("Success!");
    db = e.target.result;
  }

  openRequest.onerror = function (e) {
    console.log("Error");
    console.dir(e);
  }
}
```

<br/>

### 데이터 추가하기

데이터를 조작하기 위해서는 `transaction`을 사용해야한다. transaction는 2개의 인자를 받는데 첫번째는 우리가 조작할 테이블이 `Array`로 들어가며, 두번째 인자는 `readonly`, `readwrite` 둘 중의 1개로 타입을 명시해준다.

`const transaction = db.transaction(["people"], "readwrite");` 

`const store = transaction.objectStore("people");`

```html
<!doctype html>
<html>
<head>
</head>
<body>
  <input type="text" id="name" placeholder="Name"><br />
  <input type="email" id="email" placeholder="Email"><br />
  <button id="addButton">Add Data</button>
</body>
<script>
    let db;

    function indexedDBOk() {
      return "indexedDB" in window;
    }

    document.addEventListener("DOMContentLoaded", function () {

      //indexedDB 지원 유무
      if (!indexedDBOk) return;
      //idarticle_people 네임인 DB생성.
      const openRequest = indexedDB.open("idarticle_people", 1);
      openRequest.onupgradeneeded = function (e) {
        const thisDB = e.target.result;
        // people ObjectStore 생성(테이블이라고 생각하면 될것 같음..)
        if (!thisDB.objectStoreNames.contains("people")) {
          thisDB.createObjectStore("people");
        }
      }

      openRequest.onsuccess = function (e) {
        console.log("running onsuccess");
        db = e.target.result;

        //Listen for add clicks
        document.querySelector("#addButton").addEventListener("click", addPerson, false);
      }

      openRequest.onerror = function (e) {
      }
    }, false);

    function addPerson(e) {
      const name = document.querySelector("#name").value;
      const email = document.querySelector("#email").value;

      console.log("About to add " + name + "/" + email);
      //people 테이블에 데이터 add 선언..
      const transaction = db.transaction(["people"], "readwrite");
      const store = transaction.objectStore("people");

      //Define a person
      const person = {
        name: name,
        email: email,
        created: new Date()
      }

      //Perform the add
      const request = store.add(person, 1);

      request.onerror = function (e) {
        console.log("Error", e.target.error.name);
        //some type of error handler
      }

      request.onsuccess = function (e) {
        console.log("Woot! Did it");
      }
    }
  </script>

</html>
```

위의 경우는 2번째 추가를 하게 될 경우 키가 같아서 에러가 발생한다.

![image](https://user-images.githubusercontent.com/24274424/59140257-1d5ab000-89d6-11e9-97b2-6200c263f278.png)

<br/>

### Keys

키를 지정하는 것은 총 3가지의 방법이 있다. 

1. 위에서처럼 직접 명시하는 것이다. 자신이 직접 만든 로직으로 **unique한 키**를 만들 수 있다.
2. **keypath**를 사용하는 것으로, 데이터 자체의 속성을 기반으로 하는 방법이다.
3. 우리가 많이 알고 제일 쉬운 방법으로 키 생성기를 사용하는 것이다. 자동 번호 기본키와 매우 유사하며 키를 지정하는 가장 간단한 방법이다.

```js
// second option : keypath
thisDb.createObjectStore("test1", { keyPath : "email" });
// third option : key generator
thisDb.createObjectStore("test2", { autoIncrement : true });
```

<br/>

### 데이터 읽기

아래의 예제는 개별 데이터를 읽는 방법이다. 테이블로 말하면 하나의 row만 갖고 오는 것이다.

```js
// db에서 test 객체(테이블)을 읽는다고 선언.
const transaction = db.transaction(["test"], "readonly");
const objectStore = transaction.objectStore("test");

//x is some value
const ob = objectStore.get(x);

// 가져오는 것을 성공했을 경우
ob.onsuccess = function(e) {
  consoel.log(e.target.result)
}

// 한줄로 만들기
// db.transaction(["test"], "readonly").objectStore("test").get(X).onsuccess = function(e) { }
```

<br/>

### 범위 조회

범위조회를 위해서는 `createIndex`가 선행되어야한다.

```js
const store = thisDB.createObjectStore("people", { autoIncrement: true });
store.createIndex("name","name", {unique:false});

```

```js
//Values over 39
const oldRange = IDBKeyRange.lowerBound(39);
//Values 40a dn over
const oldRange2 = IDBKeyRange.lowerBound(40,true);
//39 and smaller...
const youngRange = IDBKeyRange.upperBound(40);
//39 and smaller...
const youngRange2 = IDBKeyRange.upperBound(39,true);
//not young or old
const okRange = IDBKeyRange.bound(20,40)
```

```js
function getPeople(e) {
    const name = document.querySelector("#nameSearch").value;
    const endname = document.querySelector("#nameSearchEnd").value;

    if(name == "" && endname == "") return;

    const transaction = db.transaction(["people"],"readonly");
    const store = transaction.objectStore("people");
    const index = store.index("name");

    let range;
    if(name != "" && endname != "") {
        range = IDBKeyRange.bound(name, endname);
    } else if(name == "") {
        range = IDBKeyRange.upperBound(endname);
    } else {
        range = IDBKeyRange.lowerBound(name);
    }

    let s = "";

    index.openCursor(range).onsuccess = function(e) {
        const cursor = e.target.result;

        if(cursor) {
            s += "<h2>Key "+cursor.key+"</h2><p>";
            for(var field in cursor.value) {
                s+= field+"="+cursor.value[field]+"<br/>";
            }
            s+="</p>";
            cursor.continue();
        }

        document.querySelector("#status").innerHTML = s;
    }
}
```

### Can I use...

![image](https://user-images.githubusercontent.com/24274424/59140311-c73a3c80-89d6-11e9-99e2-3eb5f947aade.png)

<br/>

## WebSQL

WebSQL은 **클라이언트 측의 관계형 데이터베이스를 위한 API**로, SQLite와 유사하다. 2010년 이후로 W3C 웹 어플리케이션 워킹 그룹은 이 스펙에 대한 작업을 중단했다. WebSQL은 이제 더이상 HTML 스펙이 아니므로, 사용하지 말자

<br/>

#### Reference

- [https://github.com/wonism/TIL/blob/master/front-end/javascript/client-storage.md](https://github.com/wonism/TIL/blob/master/front-end/javascript/client-storage.md)
- [https://iamawebdeveloper.tistory.com/99](https://iamawebdeveloper.tistory.com/99)
- [https://code-examples.net/ko/docs/dom/indexeddb_api](https://code-examples.net/ko/docs/dom/indexeddb_api)
- [https://dongwoo.blog/2016/12/19/클라이언트-측의-저장소-살펴보기/](https://dongwoo.blog/2016/12/19/%ED%81%B4%EB%9D%BC%EC%9D%B4%EC%96%B8%ED%8A%B8-%EC%B8%A1%EC%9D%98-%EC%A0%80%EC%9E%A5%EC%86%8C-%EC%82%B4%ED%8E%B4%EB%B3%B4%EA%B8%B0/)