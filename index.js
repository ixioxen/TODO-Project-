let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';
let searchQuery = '';

const todoInput = document.querySelector('#todoInput');
const addBtn = document.querySelector('#addBtn');
const taskList = document.querySelector('#taskList');
const searchInput = document.querySelector('#searchInput');

function getFilteredTodos() {
    let list = todos;
    if (currentFilter === 'completed') {
        list = list.filter(todo => todo.completed);
    }

    if (currentFilter === 'active') {
        list = list.filter(todo => !todo.completed);
    }

    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        list = list.filter(todo => (todo.text || '').toLowerCase().includes(q));
    }

    return list;
}

function renderTodos() {
    taskList.innerHTML = '';
    const filteredTodos = getFilteredTodos();

    filteredTodos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.style.marginBottom = '8px';

        const label = document.createElement('span');
        label.textContent = todo.text;
        if (todo.completed) {
            label.style.textDecoration = 'line-through';
            label.style.color = '#888';
        }

        const completeBtn = document.createElement('button');
        completeBtn.textContent = todo.completed ? 'Undo' : 'Complete';
        completeBtn.style.marginLeft = '10px';
        completeBtn.addEventListener('click', () => {
            todo.completed = !todo.completed;
            renderTodos();
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.style.marginLeft = '5px';
        deleteBtn.addEventListener('click', () => {
            const realIndex = todos.indexOf(todo);
            if (realIndex > -1) todos.splice(realIndex, 1);
            localStorage.setItem('todos', JSON.stringify(todos));
            renderTodos();
        });

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.style.marginLeft = '5px';
        editBtn.addEventListener('click', () => {
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.value = todo.text;
            li.innerHTML = '';
            localStorage.setItem('todos', JSON.stringify(todos)); 
            li.appendChild(editInput);

            const saveBtn = document.createElement('button');
            saveBtn.textContent = 'Save';
            saveBtn.style.marginLeft = '5px';
            li.appendChild(saveBtn);

            saveBtn.addEventListener('click', () => {
                const newValue = editInput.value.trim();
                if (newValue !== '') {
                    todo.text = newValue;
                }
                localStorage.setItem('todos', JSON.stringify(todos));
                renderTodos();
            });
        });

        li.appendChild(label);
        li.appendChild(completeBtn);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

function setFilter(filter) {
    currentFilter = filter;
    renderTodos();
}

const filterButtons = document.querySelectorAll('[data-filter]');
filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        setFilter(button.dataset.filter);
    });
});

searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    renderTodos();
});

searchInput.addEventListener('focus', (e) => {
    e.target.select();
    renderTodos();
});

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        e.target.value = '';
        searchQuery = '';
        renderTodos();
        e.target.blur();
    }
});

addBtn.addEventListener('click', () => {
    if (todoInput.value.trim() !== '') {
        const value = todoInput.value.trim();
        todos.push({ text: value, completed: false });
        localStorage.setItem('todos', JSON.stringify(todos));
        todoInput.value = '';
        renderTodos();
    };
});
renderTodos();
