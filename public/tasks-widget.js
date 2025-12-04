class TasksWidget {
    constructor() {
        this.newTaskInput = document.getElementById('newTaskInput');
        this.addTaskButton = document.getElementById('addTaskButton');
        this.tasksList = document.getElementById('tasksList');
        this.completedTasksText = document.getElementById('completedTasksText');
        this.remainingTasksText = document.getElementById('remainingTasksText');

        this.tasks = [];
        this.setupEventListeners();
        this.loadTasks();
    }

    setupEventListeners() {
        this.addTaskButton.addEventListener('click', () => this.addTask());
        this.newTaskInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
    }

    addTask() {
        const text = this.newTaskInput.value.trim();
        if (!text) return;

        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.newTaskInput.value = '';
        this.saveTasks();
        this.renderTasks();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
        this.renderTasks();
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }

    renderTasks() {
        this.tasksList.innerHTML = '';

        this.tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `task-${task.id}`;
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => this.toggleTask(task.id));

            const label = document.createElement('label');
            label.htmlFor = `task-${task.id}`;
            label.textContent = task.text;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-delete';
            deleteBtn.innerHTML = '✕';
            deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

            taskItem.appendChild(checkbox);
            taskItem.appendChild(label);
            taskItem.appendChild(deleteBtn);
            this.tasksList.appendChild(taskItem);
        });

        this.updateStats();
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const remaining = total - completed;

        this.completedTasksText.textContent = total > 0 ? `${completed}/${total}` : '0/0';
        this.remainingTasksText.textContent = remaining.toString();
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const saved = localStorage.getItem('tasks');
        if (saved) {
            try {
                this.tasks = JSON.parse(saved);
                this.renderTasks();
            } catch (e) {
                console.log('Failed to load tasks:', e);
            }
        }
    }
}

// クラス定義のみ（dashboard.htmlで初期化）
