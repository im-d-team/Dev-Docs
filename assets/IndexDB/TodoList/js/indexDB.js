
(function () {
  console.log('link indexDB file')
  let idbSupported = false

  if ("indexedDB" in window) {
    idbSupported = true;
  }

  if (idbSupported) {
    // indexedDB 열기
    const openRequest = indexedDB.open("TodoListDB", 1);

    openRequest.onupgradeneeded = function (e) {
      console.log("indexedDB onupgradeneeded");
      const thisDB = e.target.result;

      // firstOS이라는 저장소가 없으면
      if (!thisDB.objectStoreNames.contains("TodoListTable")) {
        // 저장소를 만들어줌
        thisDB.createObjectStore("TodoListTable", { autoIncrement: true });
      }
    }

    openRequest.onsuccess = function (e) {
      console.log("indexedDB open Success!");

      db = e.target.result;
      const transaction = db.transaction(["TodoListTable"],"readonly");
      const store = transaction.objectStore("TodoListTable");

      //기존의 데이터를 불러오기
      store.getAll().onsuccess = function(e) {
        const result = e.target.result;

        for (let index = 0; index < result.length; index++) {
          const element = result[index];
          TODO_LIST[element.key] = element
          if(element.done){
            document.getElementById(DOINGDONE_ARR[1]).appendChild(createTodoLine(element.value, element.key, element.done));
          }else{
            document.getElementById(DOINGDONE_ARR[0]).appendChild(createTodoLine(element.value, element.key, element.done));
          }
        }
      }
      
      // 이벤트 등록
      document.querySelector("#buttonSave").addEventListener("click", addToDoList, false);
      document.querySelector("#buttonAllClear").addEventListener("click", clearToDoList, false);
    }

    openRequest.onerror = function (e) {
      console.log("Error", e);
    }
  }

  function addToDoPromise(todo) {
    const promise = new Promise(function(resolve, reject){
      const transaction = db.transaction(["TodoListTable"], "readwrite");
      const store = transaction.objectStore("TodoListTable");
      let request

      console.log('store', store) 
      request = store.add(todo);
  
      request.onerror = function (e) {
        console.warn("Error", e.target.error.name);
        reject()
      }
  
      request.onsuccess = function (e) {
        console.log("Woot! Did it", todo);
        resolve()
      }
    })
    return promise
  }

  function addToDoList(e) {
    let resolve = Promise.resolve();
    const values = Object.values(TODO_LIST);

    if(values.length === 0){
      alert("저장할 내역이 없습니다.");
      return;
    }

    const transaction = db.transaction(["TodoListTable"], "readwrite");
    const store = transaction.objectStore("TodoListTable");
    store.clear();

    for (let index = 0; index < values.length; index++) {
      const element = values[index];
      resolve = resolve.then(addToDoPromise(element))
    }

    resolve.then(() => {
      alert("저장완료")
    })
  }

  function clearToDoList(e) {
    const transaction = db.transaction(["TodoListTable"], "readwrite");
    const store = transaction.objectStore("TodoListTable");
    store.clear();
  }
})()