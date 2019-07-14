const TODO_LIST = {};
const DOINGDONE_ARR = ["newTodoList", "doneTodoList"];

const createTodoLine = (inputValue, key, done = 'false') => {
  const newTodoContainer = document.createElement("div");
  const newCheckbox = document.createElement("input");
  const newSpan = document.createElement("span");

  newTodoContainer.dataset.key = key
  newTodoContainer.className = "todoContainer"

  newSpan.textContent = inputValue
  newSpan.className = "newTodoText"

  newCheckbox.setAttribute("type", "checkbox");
  newCheckbox.checked = done
  newCheckbox.addEventListener("click", moveTodo);

  newTodoContainer.appendChild(newCheckbox);
  newTodoContainer.appendChild(newSpan);

  return newTodoContainer;
}

const moveTodo = (e) => {
  const checkbox = e.target;
  const parentId = checkbox.parentNode.parentNode.getAttribute("id");
  const moveIndex = Math.abs(DOINGDONE_ARR.length - DOINGDONE_ARR.indexOf(parentId) - 1)

  TODO_LIST[checkbox.parentNode.dataset.key].done = !TODO_LIST[checkbox.parentNode.dataset.key].done

  document.getElementById(DOINGDONE_ARR[moveIndex]).appendChild(checkbox.parentNode);
}

(function () {
  console.log('Run Todo JS file')

  // keydown과 관련된 handler추가
  const keydownHandler = (e) => {
    switch (e.keyCode) {
      case 13:
        generateTodo(e.target.value);
        break;

      default:
        break;
    }
  }

  // Create Todo
  const generateTodo = function (inputValue) {
    if (inputValue === '') {
      alert('내용을 입력해주세요')
      return
    }
    const todo = {
      key: '_' + Math.random().toString(36).substr(2, 9),
      value: inputValue,
      done: false,
      created: new Date()
    }

    // Append New Todo
    document.getElementById(DOINGDONE_ARR[0]).appendChild(createTodoLine(inputValue, todo.key, false));
    TODO_LIST[todo.key] = todo
    // Reset InputBox
    document.getElementById("newTodoInput").value = "";
  }

  const removeAllTodo = function () {
    removeNewTodo();
    removeDoneTodo();
  }

  const removeNewTodo = function () {
    const newTodoContainer = document.getElementById(DOINGDONE_ARR[0]);

    while (newTodoContainer.firstChild) {
      delete TODO_LIST[newTodoContainer.firstChild.dataset.key]
      newTodoContainer.removeChild(newTodoContainer.firstChild);
    }
  }

  const removeDoneTodo = function () {
    const doneTodoContainer = document.getElementById(DOINGDONE_ARR[1]);

    while (doneTodoContainer.firstChild) {
      delete TODO_LIST[doneTodoContainer.firstChild.dataset.key]
      doneTodoContainer.removeChild(doneTodoContainer.firstChild);
    }
  }

  document.getElementById("newTodoInput").addEventListener("keydown", keydownHandler, false)
  document.getElementById("newTodoBtn").addEventListener("click", () => generateTodo(document.getElementById("newTodoInput").value), false)
  document.getElementById("removeButton").addEventListener("click", removeDoneTodo, false)
  document.getElementById("buttonAllClear").addEventListener("click", removeAllTodo, false)
})()

