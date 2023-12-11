const connection = require('./connection');

const getAll = async () => {
	const tasks = await connection.execute('select * from tasks');
	return tasks;
};

module.exports = {
	getAll
}