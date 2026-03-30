 const projectForm = document.getElementById("projectForm");
    const projectsContainer = document.getElementById("projectsContainer");
    const API_BASE = "http://localhost:5000/api";

    // Stats tracking
    let stats = {
      projects: 0,
      tasks: 0,
      completed: 0
    };

    function updateStats() {
      document.getElementById('totalProjects').textContent = stats.projects;
      document.getElementById('totalTasks').textContent = stats.tasks;
      document.getElementById('completedTasks').textContent = stats.completed;
    }

    // ======================
    // Fetch all projects
    // ======================
    async function fetchProjects() {
      projectsContainer.innerHTML = "";
      stats = { projects: 0, tasks: 0, completed: 0 };
      
      try {
        const res = await fetch(`${API_BASE}/projects`);
        const projects = await res.json();
        
        stats.projects = projects.length;
        
        if (projects.length === 0) {
          projectsContainer.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
              <div class="empty-state-icon">📋</div>
              <h3>No projects yet</h3>
              <p>Create your first project to get started</p>
            </div>
          `;
          updateStats();
          return;
        }

        projects.forEach((project, index) => {
          const div = document.createElement("div");
          div.className = "project-card";
          div.style.animationDelay = `${index * 0.1}s`;
          div.innerHTML = `
            <div class="project-header">
              <h3 class="project-title">${escapeHtml(project.title)}</h3>
              <p class="project-description">${escapeHtml(project.description)}</p>
            </div>

            <div class="task-section">
              <form class="task-form" onsubmit="createTask(event, '${project._id}')">
                <input type="text" placeholder="Add a new task..." required>
                <button type="submit" class="btn btn-secondary btn-small">Add Task</button>
              </form>

              <div class="task-list" id="tasks-${project._id}"></div>
            </div>
          `;
          projectsContainer.appendChild(div);
          fetchTasks(project._id);
        });
        
        updateStats();
      } catch (err) {
        console.error("Error fetching projects:", err);
        projectsContainer.innerHTML = `
          <div class="empty-state" style="grid-column: 1/-1;">
            <div class="empty-state-icon">⚠️</div>
            <h3>Connection Error</h3>
            <p>Unable to load projects. Please check your connection.</p>
          </div>
        `;
      }
    }

    // ======================
    // Create Project
    // ======================
    projectForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("projectTitle").value;
      const description = document.getElementById("projectDesc").value;
      const submitBtn = e.target.querySelector('button[type="submit"]');
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="loading"></span>';

      try {
        await fetch(`${API_BASE}/projects/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, createdBy: "Basil" }),
        });

        projectForm.reset();
        fetchProjects();
      } catch (err) {
        console.error("Error creating project:", err);
        alert("Failed to create project. Please try again.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>Create</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        `;
      }
    });

    // ======================
    // Create Task
    // ======================
    async function createTask(e, projectId) {
      e.preventDefault();
      const input = e.target.querySelector("input");
      const title = input.value;
      const btn = e.target.querySelector("button");
      
      btn.disabled = true;
      btn.textContent = "Adding...";

      try {
        await fetch(`${API_BASE}/tasks/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, projectId }),
        });

        input.value = "";
        fetchTasks(projectId);
      } catch (err) {
        console.error("Error creating task:", err);
        alert("Failed to create task");
      } finally {
        btn.disabled = false;
        btn.textContent = "Add Task";
      }
    }

    // ======================
    // Fetch Tasks by Project
    // ======================
    async function fetchTasks(projectId) {
      const container = document.getElementById(`tasks-${projectId}`);
      container.innerHTML = '<div class="loading"></div>';

      try {
        const res = await fetch(`${API_BASE}/tasks/${projectId}`);
        const tasks = await res.json();
        
        // Update stats
        stats.tasks += tasks.length;
        stats.completed += tasks.filter(t => t.status === "Done").length;
        updateStats();

        container.innerHTML = "";

        if (tasks.length === 0) {
          container.innerHTML = '<p style="color: var(--brown-light); font-size: 0.9rem; text-align: center; padding: 20px;">No tasks yet</p>';
          return;
        }

        tasks.forEach((task, index) => {
          const div = document.createElement("div");
          div.className = `task-item ${task.status === "Done" ? "done" : ""}`;
          div.style.animationDelay = `${index * 0.05}s`;
          div.innerHTML = `
            <div class="task-status ${task.status === "Done" ? "done" : "pending"}"></div>
            <div class="task-content">
              <div class="task-title">${escapeHtml(task.title)}</div>
              <div class="task-meta">${task.status} • ${new Date(task.createdAt).toLocaleDateString()}</div>
            </div>
            <button 
              onclick="toggleStatus('${task._id}', '${projectId}', '${task.status}')" 
              class="toggle-btn ${task.status === "Done" ? "completed" : ""}"
            >
              ${task.status === "Done" ? "Completed" : "Mark Done"}
            </button>
          `;
          container.appendChild(div);
          
          // Add comments section for each task
          const commentsDiv = document.createElement("div");
          commentsDiv.className = "comments-section";
          commentsDiv.id = `comments-section-${task._id}`;
          commentsDiv.innerHTML = `
            <form class="comment-form" onsubmit="addComment(event, '${task._id}')">
              <input type="text" placeholder="Write a comment..." required>
              <button type="submit" class="btn btn-small btn-secondary">Post</button>
            </form>
            <div class="comment-list" id="commentList-${task._id}"></div>
          `;
          div.appendChild(commentsDiv);
          fetchComments(task._id);
        });
      } catch (err) {
        console.error("Error fetching tasks:", err);
        container.innerHTML = '<p style="color: #e74c3c; font-size: 0.9rem;">Failed to load tasks</p>';
      }
    }

    // ======================
    // Toggle Task Status
    // ======================
    async function toggleStatus(taskId, projectId, currentStatus) {
      const newStatus = currentStatus === "Pending" ? "Done" : "Pending";
      const btn = event.target;
      btn.disabled = true;
      btn.textContent = "Updating...";

      try {
        await fetch(`${API_BASE}/tasks/status/${taskId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });

        fetchTasks(projectId);
      } catch (err) {
        console.error("Error updating status:", err);
        btn.disabled = false;
        btn.textContent = currentStatus === "Pending" ? "Mark Done" : "Completed";
      }
    }

    // ======================
    // Add Comment
    // ======================
    async function addComment(e, taskId) {
      e.preventDefault();
      const input = e.target.querySelector("input");
      const content = input.value;
      const btn = e.target.querySelector("button");
      
      btn.disabled = true;
      btn.textContent = "Posting...";

      try {
        await fetch(`${API_BASE}/comments/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taskId, content, author: "Basil" }),
        });

        input.value = "";
        fetchComments(taskId);
      } catch (err) {
        console.error("Error adding comment:", err);
        alert("Failed to add comment");
      } finally {
        btn.disabled = false;
        btn.textContent = "Post";
      }
    }

    // ======================
    // Fetch Comments
    // ======================
    async function fetchComments(taskId) {
      const container = document.getElementById(`commentList-${taskId}`);
      
      try {
        const res = await fetch(`${API_BASE}/comments/${taskId}`);
        const comments = await res.json();

        container.innerHTML = "";

        if (comments.length === 0) {
          container.innerHTML = '<p style="color: var(--brown-light); font-size: 0.8rem; font-style: italic;">No comments yet</p>';
          return;
        }

        comments.forEach(c => {
          const div = document.createElement("div");
          div.className = "comment-item";
          div.innerHTML = `
            <div class="comment-author">${escapeHtml(c.author)}</div>
            <div class="comment-text">${escapeHtml(c.content)}</div>
          `;
          container.appendChild(div);
        });
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    }

    // Utility function to prevent XSS
    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // ======================
    // Initial Load
    // ======================
    fetchProjects();