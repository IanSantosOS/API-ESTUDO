const connection = require('./connection');

const getAll = async () => {
	const [tasks, buffer] = await connection.execute('select * from tasks');
	return tasks;
};

const createTask = async (task) => {
	const { title } = task;
	const dateUTC = new Date(Date.now()).toUTCString();
	const query = 'insert into tasks(title, status, created_at) values (?, ?, ?)';
	const [createdTask, buffer] = await connection.execute(query, [title, 'pendente', dateUTC]);

	return { insertId: createdTask.insertId };
}

const deleteTask = async (id) => {
	const removedTask = await connection.execute('delete from tasks where id = ?', [id]);
	return removedTask;
}

const updateTask = async (id, task) => {
	const { title, status } = task;
	const query = 'update tasks set title = ?, status = ? where id = ?';
	const updatedTask = await connection.execute(query, [title, status, id]);
	return updatedTask;
}

module.exports = {
	getAll,
	createTask,
	deleteTask,
	updateTask
}