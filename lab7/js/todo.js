class Task {
  constructor(text, completed) {
    this.text = text;
    this.completed = completed;
  }
}

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function countItems() {
  const incompleteTasks = tasks.filter(task => !task.completed).length;
  document.querySelector(".conditions p").textContent = `Осталось: ${incompleteTasks}`;
}

function createTask(text, completed) {
  const template = document.querySelector('template').content.cloneNode(true);
  template.querySelector("p").textContent = text;
  template.querySelector("input").checked = completed;
  if (completed) {
    template.querySelector("p").classList.add('line-through');
  }
  document.querySelector(".todo").appendChild(template);
}

function addTask() {
  const text = document.querySelector("input").value.trim();
  if (text) {
    const task = new Task(text, false);
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    createTask(text, false);
    countItems();
    document.querySelector("input").value = "";

    Toastify({
      text: "Задача добавлена!",
      duration: 1000,
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
        zIndex: 1000
      },
    }).showToast();
  }
}

function deleteTask(button) {
  const taskText = button.parentNode.querySelector("p").textContent;

  Swal.fire({
    title: 'Вы уверены?',
    text: `Вы действительно хотите удалить задачу "${taskText}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Да, удалить!',
    cancelButtonText: 'Отмена'
  }).then((result) => {
    if (result.isConfirmed) {
      tasks = tasks.filter(task => task.text !== taskText);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      button.parentNode.remove();
      countItems();

      Toastify({
        text: "Задача удалена!",
        duration: 1000,
        style: {
          background: "linear-gradient(to right, #ff5131, #dd2476)",
          zIndex: 1000
        },
      }).showToast();

    }
  });
}

function changeCondition(checkbox) {
  const taskText = checkbox.parentNode.parentNode.querySelector("p").textContent;
  const task = tasks.find(task => task.text === taskText);
  if (task) {
    task.completed = !task.completed;
    checkbox.parentNode.parentNode.querySelector("p").classList.toggle('line-through');
    localStorage.setItem("tasks", JSON.stringify(tasks));
    countItems();
  }
}

function condition(index) {
  const conditionButtons = document.querySelectorAll(".condition p");
  conditionButtons.forEach((button, i) => button.classList.toggle("active", i === index));

  const taskList = document.querySelector(".todo");
  taskList.innerHTML = taskList.querySelector('template').outerHTML;

  const filteredTasks = tasks.filter(task => {
    switch (index) {
      case 0: return true;
      case 1: return !task.completed;
      case 2: return task.completed;
      default: return false;
    }
  });

  filteredTasks.forEach(task => createTask(task.text, task.completed));
}

window.addEventListener('load', () => {
  if (tasks.length > 0) {
    tasks.forEach(task => createTask(task.text, task.completed));
    countItems();
  }
});
