const Sequelize = require("sequelize");
const UserModel = require("./server/models/users");
const UserDetailesModel = require("./server/models/usersDetailes");
const RolesModel = require("./server/models/roles");
const GenresModel = require("./server/models/genres");
const BooksModel = require("./server/models/books");
const PhonesModel = require("./server/models/phones");
const FilesModel = require("./server/models/files");

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
const User = UserModel(sequelize, Sequelize);
const UserDetailes = UserDetailesModel(sequelize, Sequelize);
const Roles = RolesModel(sequelize, Sequelize);
const Phones = PhonesModel(sequelize, Sequelize);
User.hasOne(UserDetailes);
User.belongsTo(Roles);
User.hasMany(Phones);

//BOOKS AND GENRES//
const Books = BooksModel(sequelize, Sequelize);
const Genres = GenresModel(sequelize, Sequelize);
const Files = FilesModel(sequelize, Sequelize);
// const GenresBooks = sequelize.define("genresbooks", {
// });
Genres.belongsToMany(Books, {through: "GenresBooks"});
Books.belongsToMany(Genres, {through: "GenresBooks"});
Books.hasMany(Files);
// GenresBooks.belongsTo(Genres);
// GenresBooks.belongsTo(Books);

// Phones.belongsTo(Users, {foreignKey: 'id', sourceKey: 'phone'});
sequelize.sync()
	.then(() => {
		console.log("Database & tables created!")
	});

module.exports = {
	User,
	UserDetailes,
	Roles,
	Books,
	Genres,
	Phones,
	Files
};
