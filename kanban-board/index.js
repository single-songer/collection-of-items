let boardState = JSON.parse(localStorage.getItem('kanbanBoard')) || {
    columns: [
        { id: "todo", title: '待办', tasks: [] },
        { id: "doing", title: '进行中', tasks: [] },
        { id: "done", title: '已完成', tasks: [] },
    ]
}
const boardEl = document.getElementById('board');
const addColumnBtn = document.getElementById('add-column-btn');
// 渲染整个看板
function renderBoard() {
    boardEl.innerHTML = '' 
    boardState.columns.forEach(col => {
        const colEL = createColumnElement(col)
        boardEl.appendChild(colEL);
    });
}
// 创建列元素
function createColumnElement(column) {
    const colEL = document.createElement('div')
    colEL.className = 'column'
    colEL.dataset.columnId = column.id
    colEL.innerHTML = `
        <div class="column-header">
            <strong class="column-title">${column.title}</strong>
            <span class="column-count">${column.tasks.length}</span>
        </div>
        <div class="add-task-form">
            <input type="text" class="add-task-input" placeholder="添加任务..." />
        </div>
        <div class="task-list" data-column="${column.id}"></div>
    `
    // 添加事件
    const input = colEL.querySelector('.add-task-input')
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && input.value.trim() ) {
            addTask(column.id, input.value.trim())
            input.value = ''
            e.preventDefault()
        }
    })
    // 渲染任务
    const taskList = colEL.querySelector('.task-list')
    column.tasks.forEach(task => {
        taskList.appendChild(createTaskElement(task))
    })
    return colEL
}
// 创建任务卡片
function createTaskElement(task){
    const taskEl = document.createElement('div')
    taskEl.className = 'task-card'
    taskEl.dataset.taskId = task.id
    taskEl.draggable = true;
    taskEl.innerHTML = `
        ${task.text}
        <button class="delete-btn">x</button>
    `
    taskEl.addEventListener('dragstart',()=>{
        taskEl.classList.add('dragging')
    })
    taskEl.addEventListener('dragend',()=>{
        taskEl.classList.remove('dragging')
    })
    // 删除任务
    taskEl.querySelector('.delete-btn').addEventListener('click',()=>{
        deleteTask(task.id)
    })
    // 双击编辑
    taskEl.addEventListener('dblclick',()=>{
        const newText = prompt('请输入新的任务内容',task.text)
        if(newText!==null && newText.trim()!==''){
            updateTask(task.id,newText)
        }
    })
    return  taskEl
}
// 添加任务
function addTask(columnId,text){
    const newTask = {
        id:Date.now(),
        text,
    }
    const column = boardState.columns.find(col=>col.id===columnId)
    if(column){
        column.tasks.push(newTask)
        saveAndRender()
    }
}
// 删除任务
function deleteTask(taskId){
    boardState.columns.forEach(column=>{
       column.tasks = column.tasks.filter(task=>task.id!==taskId)
    })
    saveAndRender()
}
// 更新任务
function updateTask(taskId,text){
    boardState.columns.forEach(col=>{
        col.tasks.forEach(task=>{
            if(task.id === taskId){
                task.text = text
            }
        })
    })
    saveAndRender()
}
// 拖放逻辑：初始化所有列的drop事件
function initDragAndDrop(){
    const taskList = document.querySelectorAll('.task-list')    
    taskList.forEach(list=>{
        list.addEventListener('dragover',e=>{
            e.preventDefault();
            const dragging = document.querySelector('.dragging')            
            if(dragging){
                list.classList.add('drop-zone')
            }
        })
        list.addEventListener('dragleave',()=>{
                list.classList.remove('drop-zone')
        })
        list.addEventListener('drop',e=>{
            e.preventDefault();
            list.classList.remove('drop-zone')
            const dragging = document.querySelector('.dragging')            
            if(dragging){
                const taskId = +dragging.dataset.taskId
                const targetColumnId = list.dataset.column                
                // 移动任务
                let taskToMove = null;
                boardState.columns.forEach(col=>{
                    const index= col.tasks.findIndex(task=>task.id===taskId)                    
                    if(index!==-1){                        
                        taskToMove = col.tasks.splice(index,1)[0]
                    }
                })
                if(taskToMove){
                    const targetColumn = boardState.columns.find(col=>col.id===targetColumnId)
                    if(targetColumn){
                        targetColumn.tasks.push(taskToMove)
                        saveAndRender()
                    }
                }
            }
        })
    })
}
// 添加新列
addColumnBtn.addEventListener('click',()=>{
    const title = prompt('请输入新列名称','新列')
    const newColumn = {
        id:'col-'+Date.now(),
        title:title.trim() || '新列',
        tasks:[],
    }
    boardState.columns.push(newColumn)
    saveAndRender()
})
// 保存并重新渲染
function saveAndRender(){    
    localStorage.setItem('kanbanBoard',JSON.stringify(boardState))
    renderBoard()
    setTimeout(initDragAndDrop,100) // 等待DOM更新完成
}
// 初始化
renderBoard()
setTimeout(initDragAndDrop,100)


