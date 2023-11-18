// Clase que representa la lista de tareas
class ToDoList {
  constructor() {
    // Array para almacenar las tareas
    this.tasks = [];
    // Referencia al contenedor de la lista de tareas en el DOM
    this.taskListContainer = document.querySelector("#taskList");
  }

  // Método para agregar una nueva tarea a la lista
  addTask(title, date) {
    // Crear una nueva instancia de la clase Task
    const newTask = new Task(title, date);
    // Agregar la nueva tarea al array
    this.tasks.push(newTask);
    // Actualizar la interfaz de usuario
    this.updateUI();
    // Devolver la nueva tarea
    return newTask;
  }

  // Método para actualizar la interfaz de usuario con las tareas actuales
  updateUI() {
    // Verificar si hay tareas en la lista
    if (this.tasks.length === 0) {
      // Si no hay tareas, mostrar un mensaje en el contenedor
      this.taskListContainer.innerHTML = "<li>No hay tareas</li>";
      return;
    }

    // Si hay tareas, generar el HTML para cada tarea y agregarlo al contenedor
    this.taskListContainer.innerHTML = this.tasks
      .map((task, index) => `<li class="task-item">
        <span class="task-title">${task.title}</span>
        <span class="task-date">${task.date.toLocaleDateString()}</span>
        <button class="delete" onclick="todoList.tasks[${index}].deleteTask(${index})">&#10006;</button>
      </li>`)
      .join("");

    // Llamar a la función matchComplete después de actualizar la interfaz
    this.matchComplete();
  }

  // Método para agregar un evento de clic a las tareas para marcarlas como completadas
  matchComplete() {
    // Seleccionar todos los elementos con la clase 'task-title'
    const taskTitles = document.querySelectorAll(".task-title");

    // Iterar sobre cada tarea
    taskTitles.forEach(taskTitle => {
      // Agregar un evento de clic a cada tarea
      taskTitle.addEventListener("click", function () {
        // Toggle (agregar o quitar) la clase 'completed' al hacer clic
        taskTitle.classList.toggle("completed");
      });
    });
  }

  // Método para convertir la instancia de ToDoList a un objeto serializable
  toJSON() {
    return {
      tasks: this.tasks.map(task => ({
        title: task.title,
        date: task.date.toISOString() // Convertir la fecha a formato ISO para serializar
      }))
    };
  }

  // Método para cargar datos de un objeto serializable en la instancia de ToDoList
  fromJSON(data) {
    this.tasks = data.tasks.map(taskData => new Task(taskData.title, new Date(taskData.date)));
    this.updateUI(); // Actualizar la interfaz después de cargar los datos
  }
}

// Clase que representa una tarea individual
class Task {
  constructor(title, date) {
    // Propiedades de la tarea: título y fecha
    this.title = title;
    this.date = date;
  }

  // Método para eliminar una tarea según su índice en la lista de tareas
  deleteTask(index) {
    // Verificar que el índice esté dentro de los límites y que la tarea esté marcada como completa
    if (index >= 0 && index < todoList.tasks.length  ) {
      // Eliminar la tarea del array de tareas en ToDoList
      todoList.tasks.splice(index, 1);
      // Actualizar la interfaz de usuario después de eliminar la tarea
      todoList.updateUI();
      // Guardar la instancia actualizada en localStorage
      localStorage.setItem('todoListData', JSON.stringify(todoList.toJSON()));
    }
  }
}

// Obtener referencias a elementos del DOM
const taskInput = document.querySelector("#taskInput");
const addTaskBtn = document.querySelector("#addTaskBtn");

// Crear o cargar una instancia de ToDoList desde localStorage
let todoList;

const savedData = localStorage.getItem('todoListData');

if (savedData) {
  todoList = new ToDoList();
  todoList.fromJSON(JSON.parse(savedData));
} else {
  todoList = new ToDoList();
}

// Agregar un evento de clic al botón "Agregar"
addTaskBtn.addEventListener("click", function () {
  // Obtener el título de la tarea desde el campo de entrada
  const title = taskInput.value;
  // Obtener la fecha actual
  const date = new Date();
  // Agregar una nueva tarea a la lista de tareas en ToDoList
  todoList.addTask(title, date);
  // Limpiar el campo de entrada
  taskInput.value = "";
});
