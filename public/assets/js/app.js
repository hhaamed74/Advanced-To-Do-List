document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("task-form");
  const taskList = document.getElementById("task-list");
  const emptyState = document.getElementById("empty-state");
  const searchInput = document.getElementById("search-input");
  const filterPriority = document.getElementById("filter-priority");
  const sortBy = document.getElementById("sort-by");
  const taskTemplate = document.getElementById("task-template");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Render tasks
  function renderTasks() {
    taskList.innerHTML = "";
    let filteredTasks = [...tasks];

    // Search filter
    const searchText = searchInput.value.toLowerCase();
    if (searchText) {
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchText) ||
          task.description.toLowerCase().includes(searchText)
      );
    }

    // Priority filter
    const priorityValue = filterPriority.value;
    if (priorityValue !== "all") {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority === priorityValue
      );
    }

    // Sorting
    if (sortBy.value === "due") {
      filteredTasks.sort((a, b) => new Date(a.due) - new Date(b.due));
    } else if (sortBy.value === "priority") {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      filteredTasks.sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    } else {
      filteredTasks.sort((a, b) => b.created - a.created); // created
    }

    // Render each task
    filteredTasks.forEach((task) => {
      const taskEl = taskTemplate.content.cloneNode(true);
      const li = taskEl.querySelector(".task-item");
      li.dataset.taskId = task.id;
      li.querySelector(".task-title").textContent = task.title;
      li.querySelector(".task-meta").textContent = `${
        task.due || "No date"
      } • ${task.priority} • ${task.tags.join(", ") || "No tags"}`;
      li.querySelector(".task-checkbox").checked = task.completed;

      // Checkbox toggle
      li.querySelector(".task-checkbox").addEventListener("change", () => {
        task.completed = !task.completed;
        saveTasks();
      });

      // Delete
      li.querySelector(".task-delete").addEventListener("click", () => {
        tasks = tasks.filter((t) => t.id !== task.id);
        saveTasks();
        renderTasks();
      });

      // Edit (basic prompt version)
      li.querySelector(".task-edit").addEventListener("click", () => {
        const newTitle = prompt("Edit title:", task.title);
        if (newTitle !== null) {
          task.title = newTitle.trim() || task.title;
          saveTasks();
          renderTasks();
        }
      });

      taskList.appendChild(taskEl);
    });

    // Toggle empty state
    emptyState.style.display = filteredTasks.length === 0 ? "block" : "none";
  }

  // Save tasks to localStorage
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Add new task
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("task-title").value.trim();
    const description = document.getElementById("task-desc").value.trim();
    const due = document.getElementById("task-date").value;
    const priority = document.getElementById("task-priority").value;
    const tags = document
      .getElementById("task-tags")
      .value.split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    if (!title) return alert("Title is required");

    const newTask = {
      id: Date.now(),
      title,
      description,
      due,
      priority,
      tags,
      completed: false,
      created: Date.now(),
    };

    tasks.push(newTask);
    saveTasks();
    taskForm.reset();
    renderTasks();
  });

  // Filters listeners
  searchInput.addEventListener("input", renderTasks);
  filterPriority.addEventListener("change", renderTasks);
  sortBy.addEventListener("change", renderTasks);

  // Initial render
  renderTasks();
});
const themeToggleBtn = document.getElementById("theme-toggle");
const body = document.body;

// Load saved theme from localStorage
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  themeToggleBtn.textContent = "☀️ Light Mode";
}

// Toggle theme on button click
themeToggleBtn.addEventListener("click", () => {
  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    themeToggleBtn.textContent = "☀️ Light Mode";
  } else {
    localStorage.setItem("theme", "light");
    themeToggleBtn.textContent = "🌙 Dark Mode";
  }
});

// toggle responsive
document.getElementById("menu-toggle").addEventListener("click", function () {
  document.getElementById("menu-items").classList.toggle("show");
});
