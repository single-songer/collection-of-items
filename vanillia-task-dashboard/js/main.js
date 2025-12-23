import { DOM } from './dom.js'
import { loadTask, addTaskToDOM, saveTasksToStorage, updateNoTaskMessage } from './taskManager.js';
import { fetchWeather } from './weather.js'
DOM.form.addEventListener('submit', function (e) {
  e.preventDefault();
  const taskText = DOM.newTaskInput.value.trim()
  if (taskText === '') return
  if (taskText.length > 100) {
    alert('任务长度不能超过100个字符')
    DOM.newTaskInput.value = ''
    return
  }
  addTaskToDOM(taskText)
  saveTasksToStorage()
  updateNoTaskMessage()
  DOM.newTaskInput.value = ''
  DOM.newTaskInput.focus()
})
DOM.taskList.addEventListener('click', function (e) {
  if (e.target && e.target.textContent === '删除') {
    const li = e.target.closest('li');
    li.classList.add('animate-out');
    li.addEventListener('animationend', () => {
      li.remove()
      saveTasksToStorage()
      updateNoTaskMessage()
    })
  }
})
// 初始化任务列表
document.addEventListener('DOMContentLoaded', function () {
  loadTask()
  // 渲染任务列表
  setTimeout(() => fetchWeather('上海'), 100)
})
DOM.updateWeatherBtn.addEventListener('click', function () {
  const city = cityInput.value.trim()
  if (city) fetchWeather(city)
  else alert('请输入城市名称')
})