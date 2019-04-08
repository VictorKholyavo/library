const express = require("express");
const app = express();
const multer  = require("multer");
const { Books, Genres, Cover } = require("../../sequelize");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./public/uploads");
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});

const upload = multer({ storage: storage });

// BOOKS //

app.get("/", async (req, res) => {
    const books = await Books.findAll({include: [Genres, Cover]}).then(booksBooks => {
        booksBooks.map(function (book) {
            book = book.dataValues;            
            book.genres.map(function (genreOfOneBook) {
                let genre = {id: genreOfOneBook.dataValues.id, genre: genreOfOneBook.dataValues.genre};
                genreOfOneBook = genre;
                return genreOfOneBook
            });            
            return book;
        });
        res.json(booksBooks);
    });
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
        .then(function (updatedBook) {
            // return res.json(updatedBook[0])
        });
    let sendData = [];
    Books.findOne({where: {id: req.body.id}, include: [Genres] }).then((book) => {
        
        book.genres.map(function (genre) {
            genre.removeBook(req.body.id)
        })
        let genresOfUpdatedBook = [];
        for (const key in req.body) {
            if (key.substring(0, 5) === "genre" && key.substring(5, 6) !== "s") {              
                genresOfUpdatedBook.push(req.body[key]);
            }
        }
        genresOfUpdatedBook.map((genreOfUpdatedBook) => {
            Genres.findOne({where: {id: genreOfUpdatedBook}})
                .then((genre) => {
                    genre.addBook(req.body.id);
                });
        })
        Promise.all(genresOfUpdatedBook).then((completed) => console.log(completed));
    });
    return 
    // .then((book) => {
    //     book = book.dataValues;
    //     console.log(book.genres);
        
    //     // book.genres.map(function (genreOfOneBook) {
    //     //     let genre = {id: genreOfOneBook.dataValues.id, genre: genreOfOneBook.dataValues.genre};
    //     //     genreOfOneBook = genre;
    //     //     return genreOfOneBook
    //     // });
    //     // return res.send(book)
    // })
});

app.post("/add", upload.single("upload"), async (req, res) => {
    try {
        let newBook = req.body;
        
        Books.create(newBook).then((book) => {
            let genresOfNewBook = [];
            for (const key in newBook) {
                if (key.substring(0, 5) === "genre") {              
                    genresOfNewBook.push(newBook[key]);
                }
            }
            genresOfNewBook.map(function (genreOfNewBook) {
                Genres.findOne({where: {id: genreOfNewBook}})
                .then((genre) => {
                    genre.addBook(book.dataValues.id);
                })
            });
            return book
        })
        .then((book) => {
            let path = req.file.destination + "/" + req.file.filename;
            book.createCover({path: path, fileType: req.file.mimetype, bookId: book.dataValues.id});
            res.send(book);
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