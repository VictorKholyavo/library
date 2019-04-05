const Sequelize = require("sequelize");
const UsersModel = require("./server/models/users");
const UsersDetailesModel = require("./server/models/usersDetailes");
const RolesModel = require("./server/models/roles");
const GenresModel = require("./server/models/genres");
const BooksModel = require("./server/models/books");
// const PhonesModel = require("./server/models/phones");

const sequelize = new Sequelize("library", "root", "", {
	host: "localhost",
	dialect: "mysql",
	pool: {
		max: 10,
		min: 0,
		acquire: 30000,
		idle: 10000
	},
	define: {
		timestamps: false
	}
});

// USERS, USER DETAILES AND ROLES OF USERS//
const Users = UsersModel(sequelize, Sequelize);
const UsersDetailes = UsersDetailesModel(sequelize, Sequelize);
const Roles = RolesModel(sequelize, Sequelize);
Users.hasOne(UsersDetailes);
Users.belongsTo(Roles);

//BOOKS AND GENRES//
const Books = BooksModel(sequelize, Sequelize);
const Genres = GenresModel(sequelize, Sequelize);
// const GenresBooks = sequelize.define("genresbooks", {
// });
Genres.belongsToMany(Books, {through: "GenresBooks"});
Books.belongsToMany(Genres, {through: "GenresBooks"});
// GenresBooks.belongsTo(Genres);
// GenresBooks.belongsTo(Books);

// const Phones = PhonesModel(sequelize, Sequelize);
// Users.hasMany(Phones, {foreignKey: 'id', sourceKey: 'phone'});
// Phones.belongsTo(Users, {foreignKey: 'id', sourceKey: 'phone'});
sequelize.sync()
	.then(() => {
		console.log("Database & tables created!")
	});

module.exports = {
	Users,
	UsersDetailes,
	Roles,
	Books,
	Genres
	// Phones
};