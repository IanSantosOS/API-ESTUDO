const tbody = document.querySelector('#list tbody');
const form = document.querySelector('#form-add-task');
const inputTask = document.querySelector('#inp-task');

const fetchTasks = async () => {
  const response = await fetch('http://localhost:3333/tasks');
  const tasks = await response.json()
  return tasks;
}

const addTask = async (e) => {
  e.preventDefault();

  const task = { title: inputTask.value };

  await fetch('http://localhost:3333/tasks', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  })

  loadTasks();
  inputTask.value = '';
}

const deleteTask = async (id) => {
  await fetch(`http://localhost:3333/tasks/${id}`, {
    method: 'delete'
  });

  loadTasks();
}

const updateTask = async ({ id, title, status }) => {

  await fetch(`http://localhost:3333/tasks/${id}`, {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, status })
  });

  loadTasks();
}

const formatDate = (dateUTC) => {
  const options = { 'dateStyle': 'long', 'timeStyle': 'short' };
  const date = new Date(dateUTC).toLocaleString('pt-br', options);
  return date;
}

const createElement = (tag, str = '', tagClass) => {
  const element = document.createElement(tag);
  element.innerHTML = str;

  if (tagClass)
    element.classList.add(tagClass);

  return element;
}

const createSelect = (status = 'pendente') => {
  const options = `
  <option value="pendente">pendente</option>
  <option value="em andamento">em andamento</option>
  <option value="concluído">concluído</option>
  `;

  const select = createElement('select', options, 'task-select');

  select.value = status;
  if (!select.value)
    select.value = 'pendente';

  return select;
}

const createRow = (task) => {
  const { id, title, created_at, status } = task;

  const tr = createElement('tr');
  const tdTitle = createElement('td', title);
  const tdCreatedAt = createElement('td', formatDate(created_at));
  const tdStatus = createElement('td');
  const tdActions = createElement('td');

  const select = createSelect(status);

  select.addEventListener('change', ({ target }) => updateTask({ ...task, status: target.value }));

  tdStatus.appendChild(select);

  const editBtn = createElement('button', '<img src="./img/edit.svg">', 'task-btn');
  const deleteBtn = createElement('button', '<img src="./img/delete.svg">', 'task-btn');

  const editForm = createElement('form');
  const editInput = createElement('input');
  editInput.classList.add('input');
  editForm.appendChild(editInput);

  editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    updateTask({id, title: editInput.value, status});
  });

  editInput.addEventListener('keydown', (e) => {
    if (e.key !== "Escape") return;
    loadTasks();
  });

  editBtn.addEventListener('click', () => {
    editInput.value = tdTitle.innerText;
    tdTitle.innerText = '';
    tdTitle.appendChild(editForm);
    editBtn.disabled = true;
    editInput.focus();
  });

  deleteBtn.addEventListener('click', () => deleteTask(id));

  tdActions.appendChild(editBtn);
  tdActions.appendChild(deleteBtn);

  tr.appendChild(tdTitle);
  tr.appendChild(tdCreatedAt);
  tr.appendChild(tdStatus);
  tr.appendChild(tdActions);

  return tr;
}

const loadTasks = async () => {
  const tasks = await fetchTasks();

  tbody.innerHTML = '';

  tasks.forEach(task => {
    const tr = createRow(task);
    tbody.appendChild(tr);
  });
}

form.addEventListener('submit', addTask);
loadTasks();