const Sequelize = require("sequelize");
const UserModel = require("./server/models/users");
const UserDetailesModel = require("./server/models/usersDetailes");
const RolesModel = require("./server/models/roles");
const GenresModel = require("./server/models/genres");
const BooksModel = require("./server/models/books");
const PhonesModel = require("./server/models/phones");
const CoverModel = require("./server/models/cover");
const BookFilesModel = require("./server/models/bookFiles");
const UserOrderModel = require("./server/models/userOrder");
const StatusModel = require("./server/models/status");

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

//BOOKS, GENRES, COVERS OF BOOKS, TEXT AND AUDIO FILES//
const Books = BooksModel(sequelize, Sequelize);
const Genres = GenresModel(sequelize, Sequelize);
const Cover = CoverModel(sequelize, Sequelize);
const BookFiles = BookFilesModel(sequelize, Sequelize);
Genres.belongsToMany(Books, {through: "GenresBooks"});
Books.belongsToMany(Genres, {through: "GenresBooks"});
Books.hasOne(Cover);
Cover.belongsTo(Books);
Books.hasMany(BookFiles);
BookFiles.belongsTo(Books);

// USER ORDERS //
const UserOrder = UserOrderModel(sequelize, Sequelize);
const Status = StatusModel(sequelize, Sequelize);
User.hasMany(UserOrder);
Books.hasOne(UserOrder);
UserOrder.belongsTo(Books);
UserOrder.belongsTo(Status);
UserOrder.belongsTo(User);

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
	Cover,
	BookFiles,
	UserOrder,
	Status
};
