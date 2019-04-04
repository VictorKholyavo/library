const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, type) => {
	return sequelize.define("users", {
		id: {
			type: type.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		password: {
			type: type.STRING
		},
		email: {
			type: type.STRING
		},
		role_id: {
			type: type.INTEGER,
			defaultValue: 1
		}
	}, 
	{
		hooks: {
			beforeCreate: function(user, options) {
				return new Promise((resolve, reject) => {
					bcrypt.hash(user.password, 8, (err, data) => {
						if (err) reject(err);
						user.password = data;
						resolve();
					});
				});
			}
		}
	});
};