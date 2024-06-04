document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".todolist_section form");
  const titleInput = document.querySelector(".todolist_section .title");
  const commentInput = document.querySelector(".todolist_section .comm");
  const categoryInput = document.querySelector(".todolist_section .category");
  const dueDateInput = document.querySelector(".todolist_section .due_date");
  const isCompletedInput = document.querySelector(
    ".todolist_section .is_completed"
  );
  const container = document.querySelector(".con");

  let editingTaskId = null; // Store the task ID being edited

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const comment = commentInput.value.trim();
    const category = categoryInput.value;
    const dueDate = dueDateInput.value;
    const isCompleted = isCompletedInput.checked ? 1 : 0;
    const user_id = localStorage.getItem("user_id"); /// getting user id

    if (title !== "" && comment !== "") {
      // Check if we are editing an existing task or creating a new one
      if (editingTaskId) {
        editTask(
          editingTaskId,
          title,
          comment,
          category,
          dueDate,
          isCompleted,
          user_id
        );
        editingTaskId = null; // Reset editingTaskId after editing
      } else {
        sendTaskData(title, comment, category, dueDate, isCompleted, user_id);
      }
      titleInput.value = "";
      commentInput.value = "";
    } else {
      alert("Please enter both title and comment");
    }
  });

  // Function to send task data to API
  function sendTaskData(
    title,
    comment,
    category,
    dueDate,
    isCompleted,
    user_id
  ) {
    // Construct request body
    const requestBody = {
      user_id: user_id,
      task_name: title,
      description: comment,
      category_id: category,
      due_date: dueDate,
      is_completed: isCompleted,
    };

    // Send POST request to addTask API endpoint
    fetch("https://77fhquitji.execute-api.us-east-1.amazonaws.com/addTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Task created successfully");
          alert("Task created successfully");
          fetchAndDisplayTasks(); // Fetch and display updated tasks after creating a new task
        } else {
          throw new Error("Failed to create task");
        }
      })
      .catch((error) => {
        console.error("Error creating task:", error);
        alert("Failed to create task");
      });
  }

  // Function to fetch tasks from the API and display them
  function fetchAndDisplayTasks() {
    const user_id = localStorage.getItem("user_id");
    fetch(
      "https://77fhquitji.execute-api.us-east-1.amazonaws.com/tasks?user_id=" +
        user_id
    )
      .then((response) => response.json())
      .then((data) => {
        container.innerHTML = ""; // Clear existing tasks before displaying new ones
        data.forEach((task) => {
          createBox(task.task_name, task.description, task.task_id);
        });
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }

  // Call the function to fetch and display tasks when the page loads
  fetchAndDisplayTasks();

  // Function to create a task box
  function createBox(title, comment, taskId) {
    // Add taskId parameter
    const box = document.createElement("div");
    box.classList.add("box_one");

    const trashIcon = document.createElement("span");
    trashIcon.innerHTML = '<i class="fa-solid fa-trash"></i>';
    trashIcon.classList.add("trash");
    trashIcon.addEventListener("click", function () {
      console.log(taskId);
      deleteTask(taskId); // Pass taskId when calling deleteTask
      box.remove();
    });

    const editIcon = document.createElement("span");
    editIcon.innerHTML = '<i class="fa-solid fa-user-pen"></i>';
    editIcon.classList.add("edit");
    editIcon.addEventListener("click", function () {
      editingTaskId = taskId; // Set editingTaskId to the taskId being edited
      titleInput.value = title;
      commentInput.value = comment;
    });

    const heading = document.createElement("h1");
    heading.textContent = title;

    const paragraph = document.createElement("p");
    paragraph.textContent = comment;

    box.appendChild(trashIcon);
    box.appendChild(editIcon);
    box.appendChild(heading);
    box.appendChild(paragraph);

    container.appendChild(box);
  }

  // Function to delete a task
  function deleteTask(taskId) {
    const requestBody = {
      task_id: taskId,
    };

    fetch("https://77fhquitji.execute-api.us-east-1.amazonaws.com/deleteTask", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Task deleted successfully");
          alert("Task deleted successfully");
        } else {
          throw new Error("Failed to delete task");
        }
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
        alert("Failed to delete task");
      });
  }

  // Function to edit a task
  function editTask(
    taskId,
    title,
    comment,
    category,
    dueDate,
    isCompleted,
    user_id
  ) {
    // Construct request body
    const requestBody = {
      task_id: taskId,
      user_id: user_id,
      task_name: title,
      description: comment,
      category_id: category,
      due_date: dueDate,
      is_completed: isCompleted,
    };

    // Send PUT request to editTask API endpoint
    fetch("https://77fhquitji.execute-api.us-east-1.amazonaws.com/editTask", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Task updated successfully");
          alert("Task updated successfully");
          fetchAndDisplayTasks(); // Fetch and display updated tasks after editing
        } else {
          throw new Error("Failed to update task");
        }
      })
      .catch((error) => {
        console.error("Error updating task:", error);
        alert("Failed to update task");
      });
  }
});
