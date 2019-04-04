const Sequelize = require('sequelize');

module.exports = (sequelize, type) => {
	return sequelize.define("roles", {
		id: {
			type: type.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		role: {
			type: type.STRING
		}
	});
};