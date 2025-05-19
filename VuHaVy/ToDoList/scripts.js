// OOP
class Task {
	constructor(text) {
		this.text = text
		this.completed = false
	}

	status() {
		this.completed = !this.completed
	}

	edit(newText) {
		this.text = newText
	}
}

class TodoList {
	constructor() {
		this.tasks = []
		this.filter = 'all'
	}

	addTask(task) {
		this.tasks.push(task)
	}

	removeTask(index) {
		this.tasks.splice(index, 1)
	}

	getFilteredTasks() {
		return this.tasks.filter((task) => {
			if (this.filter === 'all') return true
			if (this.filter === 'completed') return task.completed
			if (this.filter === 'incomplete') return !task.completed
		})
	}

	setFilter(newFilter) {
		this.filter = newFilter
	}
}


// local storage
function saveTasks() {
	const tasksJSON = JSON.stringify(todoList.tasks)
	localStorage.setItem('todoTasks', tasksJSON)
}

function loadTasks() {
	const tasksJSON = localStorage.getItem('todoTasks')
	if (tasksJSON) {
		const tasks = JSON.parse(tasksJSON)
		tasks.forEach((taskData) => {
			const task = new Task(taskData.text)
			task.completed = taskData.completed
			todoList.addTask(task)
		})
	}
}


// render list
const todoList = new TodoList()
function renderList() {
	const listElement = document.getElementById('todo-list')
	listElement.innerHTML = ''

	todoList.getFilteredTasks().forEach((task, index) => {
        // create li
		const li = document.createElement('li')

        // create checkbox
		const checkbox = document.createElement('input')
		checkbox.type = 'checkbox'
		checkbox.className = 'checkbox'
		checkbox.checked = task.completed
		checkbox.onclick = function () {
			task.status()
			renderList()
            saveTasks()
		}

		li.appendChild(checkbox)
		li.appendChild(document.createTextNode(task.text))

		// create div for buttons
		const buttonDiv = document.createElement('div')
		// buttonDiv.className = 'button-container'

        // edit
		const editBtn = document.createElement('button')
		editBtn.textContent = 'Sửa'
		editBtn.className = 'edit-btn'
		editBtn.onclick = function () {
			const newText = prompt('Chỉnh sửa công việc:', task.text)
			if (newText) {
				task.edit(newText)
				renderList()
                saveTasks()
			}
		}

        // delete
		const removeBtn = document.createElement('button')
		removeBtn.textContent = 'Xóa'
		removeBtn.className = 'remove-btn'
		removeBtn.onclick = function () {
			todoList.removeTask(index)
			renderList()
			saveTasks()
		}

		// add buttons to div
		buttonDiv.appendChild(editBtn)
		buttonDiv.appendChild(removeBtn)

		// add div to li
		li.appendChild(buttonDiv)

        // adds the finished class to li if task.completed == true
		li.classList.toggle('finished', task.completed)
        
        // add li to list
		listElement.appendChild(li)
	})
}


// event listeners
document.addEventListener('DOMContentLoaded', function () {
	loadTasks()
	renderList()
})


document.getElementById('add-btn').onclick = function () {
	const input = document.getElementById('todo-input')
	const taskText = input.value.trim()
	if (taskText) {
		const newTask = new Task(taskText)
		todoList.addTask(newTask)
		input.value = ''
		renderList()
        saveTasks()
	}
}

document.getElementById('filter-btn').onclick = function () {
	const nextFilter =
		todoList.filter === 'all'
			? 'incomplete'
			: todoList.filter === 'incomplete'
			? 'completed'
			: 'all'
            
	todoList.setFilter(nextFilter)
	this.textContent =
		nextFilter === 'all'
			? 'Tất cả'
			: nextFilter === 'incomplete'
			? 'Chưa hoàn thành'
			: 'Đã hoàn thành'
	renderList()
}

renderList()
