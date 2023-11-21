// Clase que representa la lista de tareas
class ToDoList {
  constructor() {
    // Array para almacenar las tareas
    this.tasks = JSON.parse(localStorage.getItem("tasks"))?.map(task => {
      task.date = new Date(task.date);
      return task;
    }) || [];
    // Referencia al contenedor de la lista de tareas en el DOM
    this.taskListContainer = document.querySelector("#taskList");
    this.updateUI();
  }

  // Método para agregar una nueva tarea a la lista
  addTask(title, date) {
    if(title === ""){
      alert("No has ingresado ninguna tarea");
    }
    else{
      const newTask = new Task(title, date);
      this.tasks.push(newTask);
      this.updateUI();
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
      return newTask;
    }
  }

  // Método para actualizar la interfaz de usuario con las tareas actuales
  updateUI() {
    if (this.tasks.length === 0) {
      this.taskListContainer.innerHTML = "<li>No hay tareas</li>";
      return;
    }

    this.taskListContainer.innerHTML = this.tasks
      .map((task, index) => `<li class="task-item">
        <span class="task-title">${task.title}</span>
        <span class="task-date">${this.formatDate(task.date)}</span>
        <button class="delete" onclick="todoList.deleteTask(${index})">&#10006;</button>
      </li>`)
      .join("");

    this.matchComplete();
  }

  formatDate(date){
    if(date instanceof Date && !isNaN(date)){
      return date.toLocaleDateString();
    }
    else{
      return  "Fecha no válida";
    }
  }

  matchComplete() {
    const taskTitles = document.querySelectorAll(".task-title");

    taskTitles.forEach(taskTitle => {
      taskTitle.addEventListener("click", function () {
        taskTitle.classList.toggle("completed");
      });
    });
  }

  deleteTask(index) {
    if (index >= 0 && index < this.tasks.length) {
      this.tasks.splice(index, 1);
      this.updateUI();
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }
  }
}

// Clase que representa una tarea individual
class Task {
  constructor(title, date) {
    this.title = title;
    this.date = date;
  }
}

const taskInput = document.querySelector("#taskInput");
const addTaskBtn = document.querySelector("#addTaskBtn");

const todoList = new ToDoList();

addTaskBtn.addEventListener("click", function () {
  const title = taskInput.value;
  const date = new Date();
  todoList.addTask(title, date);
  taskInput.value = "";
});
