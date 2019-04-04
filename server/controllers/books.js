const express = require("express");
const app = express();
const { Books, Genres } = require("../../sequelize");

// BOOKS //

app.get("/", async (req, res) => {
    const books = await Books.findAll({include: [Genres]});
    console.log(users)
    // const usersToAdmin = users.map(function(user) {
    //     let role = user.dataValues.role;
    //     user = user.usersdetaile.dataValues;
    //     user.role = role;
    //     return user;
    // });
    res.json(usersToAdmin);
});
app.put("/:id", async (req, res) => {
    let updateUserDetailes = {
        firstname: req.body.firstname,
        surname: req.body.surname,
        patronymic: req.body.patronymic,
        passport: req.body.passport,
        dateofbirth: req.body.dateofbirth,
        address: req.body.address,
        phones: req.body.phones,
        cardnumber: req.body.cardnumber,
    }
    let options = {
        where: {id: req.body.id}
    }
    UsersDetailes.update(updateUserDetailes, options)
        .then(function (rowsUpdate, [updatedUserDetailes]) {
            return res.json(updatedUserDetailes)
        });

    // const users = await Users.findAll({include: [UsersDetailes]});
    // const usersToAdmin = users.map(function(user) {
    //     let role = user.dataValues.role;
    //     user = user.usersdetaile.dataValues;
    //     user.role = role;
    //     return user;
    // });
    // res.json(usersToAdmin);
});

app.post("/add", async (req, res) => {
    try {
        let newBook = req.body;
        Books.create(newBook).then((book) => {
            console.log(book.dataValues)
            Genres.findOne({
                where: {id: req.body.genre}
            }).then((genre) => {
                console.log(genre.dataValues)
                genre.addBooks([book.dataValues.id])
            })
        });
    } catch (error) {
        
    }
	
});


// app.put("/:id", (req, res) => {
// 	let values = {
// 		firstname: req.body.firstname,
// 		surname: req.body.surname,
// 		dateofbirth: req.body.dateofbirth,
// 		salary: req.body.salary,
// 	};
// 	let options = {
// 		where: { id: req.body.id }
// 	};
// 	Employees.update(values, options)
// 		.then(function (rowsUpdate, [updatedEmployeer]) {
// 			return res.json(updatedEmployeer);
// 		});
// });

// app.delete("/:id", (req, res) => {
// 	Employees.destroy({ where: { id: req.body.id } })
// 		.then(function () {
// 			return res.send(req.body.id);
// 		});
// });
// app.get('/', (req, res) => {
//     let sql = "SELECT * FROM employees";
//     let query = db.query(sql, (err, results) => {
//         if(err) throw err;
//         console.log(results);
//         res.json(results)
//     })
// });

module.exports = app;