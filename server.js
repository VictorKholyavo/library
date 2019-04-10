const mysql = require("mysql");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const UsersController = require("./server/controllers/users");
const UsersDetailesController = require("./server/controllers/usersDetailes");
const RolesController = require("./server/controllers/roles");
const GenresController = require("./server/controllers/genres");
const BooksController = require("./server/controllers/books");
const OrderController = require("./server/controllers/userOrder");
// const PhonesController = require("./server/controllers/phones");
// const { Users, Phones } = require('./sequelize');
const CoverController = require("./server/controllers/cover");
const StatusController = require("./server/controllers/status");
const StartDataController = require("./server/controllers/startData");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/users", UsersController);
app.use("/usersdetailes", UsersDetailesController);
app.use("/roles", RolesController);

app.use("/genres", GenresController);
app.use("/books", BooksController);
app.use("/cover", CoverController);

app.use("/order", OrderController);
app.use("/status", StatusController);

app.use("/startData", StartDataController);


// app.use("/phones", PhonesController);

app.listen(3016, function () {
	console.log("API app started");
});
