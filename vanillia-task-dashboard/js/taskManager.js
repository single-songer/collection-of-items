import { DOM } from './dom.js'
const STORAGE_KEY = 'taskDashboard_tasks'
export function loadTask() {
  const saveTasks = localStorage.getItem(STORAGE_KEY)
  let tasks = []
  try {
    tasks = saveTasks ? JSON.parse(saveTasks) : []
    if (!Array.isArray(tasks)) throw new Error('Invalid data format')
    tasks.forEach(taskText => addTaskToDOM(taskText))
  } catch (error) {
    console.log('failed to parse tasks from localStorage', error)
    tasks = []; // 出错时，清空本地存储
  }
}
export function saveTasksToStorage() {
  const taskElements = DOM.taskList.querySelectorAll('li span');
  const tasks = Array.from(taskElements).map(span => span.textContent.trim());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
export function addTaskToDOM(taskText) {
  const exists = Array.from(DOM.taskList.querySelectorAll('li span')).some(span => span.textContent.trim() === taskText)
  if (exists) {
    DOM.newTaskInput.select(); // 重新聚焦并选中文字
    return;
  }
  const li = document.createElement('li')
  const span = document.createElement('span')
  span.textContent = taskText
  span.style.marginRight = '.5rem'
  const deleteBtn = document.createElement('button')
  deleteBtn.textContent = '删除'
  deleteBtn.ariaLabel = '删除任务';
  deleteBtn.type = 'button'
  deleteBtn.setAttribute('aria-label', '删除任务：' + taskText);
  li.appendChild(span)
  li.appendChild(deleteBtn)
  DOM.taskList.appendChild(li)
  requestAnimationFrame(() => {
    li.classList.add('animate-in')
  })
}

export function updateNoTaskMessage() {
  const noMsg = document.getElementById('no-tasks-message')
  noMsg.style.display = DOM.taskList.children.length <= 1 ? 'block' : 'none'
}