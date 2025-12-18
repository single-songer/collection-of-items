const taskList = document.querySelector('#task-list')
const taskInput = document.querySelector('#task-input')
const addBtn = document.querySelector('#add-btn')
const totalCount = document.querySelector('#total-count')
const remainingCount = document.querySelector('#remaining-count')
const clearCompletedBtn = document.querySelector('#clear-completed-btn')

let tasks = JSON.parse(localStorage.getItem('tasks')) || []

function renderTasks() {
  taskList.innerHTML = ''
  tasks.forEach((task, index) => {
    console.log(task);

    const li = document.createElement('li')
    li.className = 'task-item'
    const span = document.createElement('span')
    span.className = `task-text ${task.completed ? 'completed' : ''}`
    span.innerHTML = task.text
    span.addEventListener('click', () => toggleTask(index))
    const deleteBtn = document.createElement('button')
    deleteBtn.className = 'delete-btn'
    deleteBtn.innerHTML = ' x '
    deleteBtn.addEventListener('click', () => deleteTask(index))
    li.appendChild(span)
    li.appendChild(deleteBtn)
    taskList.appendChild(li)
  })
}
updateCounts()

function addTask() {
  const text = taskInput.value.trim()
  if (text) {
    tasks.push({ text, completed: false })
    saveTasks()
    renderTasks()
    taskInput.value = ''
    taskInput.focus()
  }
}
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed
  saveTasks()
  renderTasks()
}
function deleteTask(index) {
  tasks.splice(index, 1)
  saveTasks()
  renderTasks()
}

function updateCounts() {
  totalCount.textContent = tasks.length
  remainingCount.textContent = tasks.filter((task) => !task.completed).length
}

function clearCompleted() {
  tasks = tasks.filter((task) => !task.completed)
  saveTasks()
  renderTasks()
}
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks))
  updateCounts()
}

addBtn.addEventListener('click', addTask)
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask()
})
clearCompletedBtn.addEventListener('click', clearCompleted)
renderTasks()
taskInput.focus()
