class Task {
  constructor(text, condition) {
    this.text = text;
    this.condition = condition;
  }
}

var tasks;

window.addEventListener('load', function () {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  if (tasks) {
    tasks.forEach(task => {
      createTask(task.text, task.condition);
    })
    countItems();
  } else {
    localStorage.setItem("tasks", JSON.stringify([]));
    tasks = [];
  }
})

function countItems() {
  let counter = 0;
  tasks.forEach(task => {
    if (!task.condition) {
      counter++;
    }
  })
  document.querySelector(".conditions p").textContent = "Осталось " + counter.toString() ;
}

function createTask(text, condition) {
  let tmp = document.querySelector('template');
  let template = tmp.content.cloneNode(true);
  template.querySelector("p").textContent = text;
  if (condition) {

    template.querySelector("input").setAttribute('checked', '');
    template.querySelector("p").classList.add('line-through');
  }
  document.querySelector(".todo").appendChild(template);
}

function addTask() {
  condition(0);
  let text = document.querySelector("input").value;
  if (text.trim()) {
    let task = new Task(text, false);
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks)); //Сохраняет обновлённый массив задач в localStorage
    createTask(text, false);
    countItems();
  }
  document.querySelector("input").value = "";
}

function deleteTask(el) {
  tasks.forEach(task => {
    if (task.text === el.parentNode.childNodes[3].textContent){
      tasks.splice(tasks.indexOf(task), 1); //индекс элемента, количество элементов, которые надо удалить
    }
  })
  countItems();
  localStorage.setItem("tasks", JSON.stringify(tasks))
  document.querySelector(".todo").removeChild(el.parentNode);
}

function changeСondition(el) {
  tasks.forEach(task => {
    if (task.text === el.parentNode.parentNode.childNodes[3].textContent){
      task.condition = !task.condition;
      if (task.condition){
        el.parentNode.parentNode.childNodes[3].classList.add('line-through');
      } else {
        el.parentNode.parentNode.childNodes[3].classList.remove('line-through');
      }
    }
  })
  countItems();
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function condition(condition) {
  for (let i = 0; i < 3; i++) {
    if (i === condition){
      document.querySelectorAll(".condition p")[i].classList.add("active");
    } else {
      document.querySelectorAll(".condition p")[i].classList.remove("active");
    }
  }
  document.querySelectorAll(".task").forEach(task => {
    task.remove();
  });
  function check (el) {
    return true
  }
  switch (condition) {
    case 1:
      check = function (el) {  /*переопределение функции*/
        return !el
      }
      break;
    case 2:
      check = function (el) {
        return el
      }
      break;
  }
  tasks.forEach(task => {
    if (check(task.condition)) {
      createTask(task.text, task.condition);
    }
  })
}
