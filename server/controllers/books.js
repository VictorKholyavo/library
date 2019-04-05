const express = require("express");
const app = express();
const { Books, Genres } = require("../../sequelize");

// BOOKS //

app.get("/", async (req, res) => {
    const books = await Books.findAll({include: [Genres]}).then(booksBooks => {
        booksBooks.map(function (book) {
            book = book.dataValues;            
            book.genres.map(function (genreOfOneBook) {
                let genre = {id: genreOfOneBook.dataValues.id, genre: genreOfOneBook.dataValues.genre};
                genreOfOneBook = genre;
                console.log(genreOfOneBook);
                
                return genreOfOneBook
            });
            console.log(book);
            
            return book
            // book.map(function (genre) {
            //     console.log(genre);
                
            // })
            // console.log(book.dataValues.genres);
        });
        res.json(booksBooks);

    })
        // console.log(booksBooks.getGenres())
        // booksBooks.getGenres().then(function (genres) {
        //     console.log(genres)
        // });

    // console.log(books.getGenres())

    // books.map(function (book) {
    //     console.log(book.dataValues);
    //     console.log(book.dataValues.genres);
    // })
    // const usersToAdmin = users.map(function(user) {
    //     let role = user.dataValues.role;
    //     user = user.usersdetaile.dataValues;
    //     user.role = role;
    //     return user;
    // });
    // Promise.all(books).then((completed) => console.log(books.getGenres()));
    // res.json(books);
});
app.put("/:id", async (req, res) => {
    let updateBook = {
        title: req.body.title,
        pages: req.body.pages,
        year: req.body.year,
        author: req.body.author,
        publisher: req.body.publisher,
        country: req.body.country,
        availableCount: req.body.availableCount
    }
    let options = {
        where: {id: req.body.id}
    }
    Books.update(updateBook, options)
        .then(function (rowsUpdate, [updatedBook]) {
            return res.json(updatedBook)
        });
});

app.post("/add", async (req, res) => {
    try {
        let newBook = req.body;
        console.log(newBook);
        
        // Books.create(newBook).then((book) => {
        //     Genres.findOne({
        //         where: {id: req.body.genre}
        //     }).then((genre) => {
        //         genre.addBook(book.dataValues.id)
        //     })
        // });
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