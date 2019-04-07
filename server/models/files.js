const Sequelize = require('sequelize');

module.exports = (sequelize, type) => {
	return sequelize.define("files", {
		id: {
			type: type.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
    fileType: {
      type: type.STRING
    },
		path: {
			type: type.INTEGER
		},
	});
};
