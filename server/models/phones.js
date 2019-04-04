const Sequelize = require('sequelize');

module.exports = (sequelize, type) => {
	return sequelize.define("users", {
		id: {
			type: type.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		user_id: {
			type: type.INTEGER
		},
		phone: {
			type: type.INTEGER
		},
	});
};