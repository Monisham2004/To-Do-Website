const taskInput = document.getElementById("taskInput");
    const taskDateTime = document.getElementById("taskDateTime");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    const filterSelect = document.getElementById("filter");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    addTaskBtn.addEventListener("click", () => {
      const title = taskInput.value.trim();
      const dateTime = taskDateTime.value;
      if (!title) return alert("Please enter a task!");

      const task = { id: Date.now(), title, dateTime, completed: false };
      tasks.push(task);
      saveTasks();
      renderTasks();
      taskInput.value = "";
      taskDateTime.value = "";
    });

    function renderTasks() {
      taskList.innerHTML = "";
      const filterValue = filterSelect.value;
      tasks.forEach(task => {
        if ((filterValue === "completed" && !task.completed) || (filterValue === "pending" && task.completed)) return;

        const li = document.createElement("li");
        li.classList.add("task");
        if(task.completed) li.classList.add("completed");

        li.innerHTML = `
          <div class="task-info">
            <div class="task-title">${task.title}</div>
            <div class="task-time">${task.dateTime ? "⏰ " + task.dateTime : ""}</div>
          </div>
          <div class="actions">
            <button class="complete">${task.completed ? "Undo" : "Done"}</button>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
          </div>
        `;

        li.querySelector(".complete").addEventListener("click", () => {
          task.completed = !task.completed;
          saveTasks();
          renderTasks();
        });

        li.querySelector(".edit").addEventListener("click", () => {
          const newTitle = prompt("Edit task:", task.title);
          const newDateTime = prompt("Edit date & time:", task.dateTime);
          if(newTitle && newTitle.trim() !== ""){
            task.title = newTitle;
            task.dateTime = newDateTime;
          }
          saveTasks();
          renderTasks();
        });

        li.querySelector(".delete").addEventListener("click", () => {
          tasks = tasks.filter(t => t.id !== task.id);
          saveTasks();
          renderTasks();
        });

        taskList.appendChild(li);
      });
    }

    filterSelect.addEventListener("change", renderTasks);
    renderTasks();