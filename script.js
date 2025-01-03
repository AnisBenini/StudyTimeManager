let timer;
let isTimerRunning = false;
let currentTime = 25 * 60; // Default to 25 minutes (in seconds)
let workDuration = 25;
let breakDuration = 5;
let isBreakTime = false;
const taskList = [];

document.getElementById('start-btn').addEventListener('click', startPauseTimer);
document.getElementById('reset-btn').addEventListener('click', resetTimer);
document.getElementById('add-task-btn').addEventListener('click', addTask);
document.getElementById('new-task').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});
document.getElementById('work-duration').addEventListener('change', updateDurations);
document.getElementById('break-duration').addEventListener('change', updateDurations);

function startPauseTimer() {
  const startBtn = document.getElementById('start-btn');

  if (isTimerRunning) {
    // Pause the timer
    clearInterval(timer);
    startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
    startBtn.classList.remove('paused');
  } else {
    // Start the timer
    timer = setInterval(function () {
      currentTime--;
      updateTimerDisplay();
      if (currentTime <= 0) {
        clearInterval(timer);
        if (isBreakTime) {
          alert("Break time is over! Back to work.");
          currentTime = workDuration * 60;
        } else {
          alert("Work time is over! Take a break.");
          currentTime = breakDuration * 60;
          isBreakTime = true;
        }
        startPauseTimer(); // Automatically start again after break
      }
    }, 1000);
    startBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    startBtn.classList.add('paused');
  }
  
  isTimerRunning = !isTimerRunning;
}

function resetTimer() {
  clearInterval(timer);
  isTimerRunning = false;
  currentTime = workDuration * 60;
  updateTimerDisplay();
  document.getElementById('start-btn').innerHTML = '<i class="fas fa-play"></i> Start';
  document.getElementById('start-btn').classList.remove('paused');
}

function updateTimerDisplay() {
  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;
  document.getElementById('time-display').textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

function addTask() {
  const taskInput = document.getElementById('new-task');
  const taskText = taskInput.value.trim();

  if (taskText === '') return;

  const taskId = Date.now(); // Unique identifier for the task
  const task = {
    id: taskId,
    text: taskText,
    completed: false
  };

  taskList.push(task);
  taskInput.value = '';
  renderTasks();
}

function renderTasks() {
  const taskListElement = document.getElementById('task-list');
  taskListElement.innerHTML = '';

  taskList.forEach(task => {
    const li = document.createElement('li');
    li.classList.toggle('completed', task.completed);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));

    const taskText = document.createElement('span');
    taskText.textContent = task.text;

    li.appendChild(checkbox);
    li.appendChild(taskText);
    taskListElement.appendChild(li);
  });
}

function toggleTaskCompletion(taskId) {
  const task = taskList.find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    renderTasks(); // Re-render the tasks to update the UI
  }
}

function updateDurations() {
  workDuration = parseInt(document.getElementById('work-duration').value, 10);
  breakDuration = parseInt(document.getElementById('break-duration').value, 10);
  currentTime = workDuration * 60; // Reset timer to new work duration
  updateTimerDisplay();
}
