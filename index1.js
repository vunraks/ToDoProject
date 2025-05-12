const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const counter = document.getElementById("counter");

// Массив для хранения задач
let tasks = [];
function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    renderTasks();
  }
}

// Сохраняем задачи в localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Добавляем новую задачу
function addTask() {
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({
      id: Date.now(),
      text,
      completed: false,
    });
    taskInput.value = "";
    saveTasks();
    renderTasks();
  }
}

// Отображаем список задач
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task";
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
            <input type="checkbox" class="checkbox" ${
              task.completed ? "checked" : ""
            }>
            <span class="task-text">${task.text}</span>
            <button class="delete-btn">Удалить</button>
        `;

    // Добавляем обработчики событий
    const checkbox = li.querySelector(".checkbox");
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const deleteBtn = li.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    taskList.appendChild(li);
  });

  updateCounter();
}

// Обновляем счетчик задач
function updateCounter() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  counter.textContent = `Всего: ${total} | Выполнено: ${completed}`;
}

// Обработчики событий
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

// Загружаем задачи при запуске
loadTasks();

//Погода api
const apiKey = "6a72f2de52704fd59db132501252804";
const city = "Almaty";
const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=ru`;

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    document.getElementById("temperature").textContent = data.current.temp_c;
    document.getElementById("condition").textContent =
      data.current.condition.text;
  })
  .catch((error) => {
    console.error("Ошибка при получении погоды:", error);
    document.getElementById("temperature").textContent = "Ошибка";
    document.getElementById("condition").textContent = "Ошибка";
  });
  
//game api
const gameApi = "a277732a8d744aaeb00b20c951387f15";
const apiUrl = "https://api.rawg.io/api/games";

document.getElementById("loadGamesBtn").addEventListener("click", () => {
  // Загружаем данные с API
  fetch(`${apiUrl}?key=${gameApi}&ordering=-released&page_size=5`)
    .then((response) => response.json())
    .then((data) => {
      // Очищаем список перед загрузкой новых данных
      const gameList = document.getElementById("gameList");
      gameList.innerHTML = "";

      // Добавляем игры в список
      data.results.forEach((game) => {
        const li = document.createElement("li");

        // Получаем платформы
        const platforms = game.platforms
          .map((platform) => platform.platform.name)
          .join(", ");

        // Отображаем информацию об игре
        li.innerHTML = `
                    <h3>${game.name}</h3>
                    <p><strong>Дата релиза:</strong> ${game.released}</p>
                    <p><strong>Платформы:</strong> ${
                      platforms || "Не указаны"
                    }</p>
                    <p><strong>Рейтинг:</strong> ${game.rating}</p>
                    <p><strong>Описание:</strong> ${
                      game.short_description || "Нет описания"
                    }</p>
                `;
        gameList.appendChild(li);
      });
    })
    .catch((error) => {
      console.error("Ошибка при загрузке данных:", error);
      const gameList = document.getElementById("gameList");
      gameList.innerHTML = `<li>Не удалось загрузить игры. Пожалуйста, попробуйте позже.</li>`;
    });
});