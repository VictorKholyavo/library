const express = require("express");
const app = express();
const multer  = require("multer");
const moveFile = require('move-file');
const { Books, Genres, Cover, BookFiles } = require("../../sequelize");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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
	let titleFilter = req.query.filter && req.query.filter.title ? {[Op.like]: '%'+req.query.filter.title+'%'} : {[Op.like]: '%%'};
	let authorNameFilter = req.query.filter && req.query.filter.author ? {[Op.like]: '%'+req.query.filter.author+'%'} : {[Op.like]: '%%'};
	let authorSurnameFilter = req.query.filter && req.query.filter.author ? {[Op.like]: '%'+req.query.filter.author+'%'} : {[Op.like]: '%%'};
	let authorPatronymicFilter = req.query.filter && req.query.filter.author ? {[Op.like]: '%'+req.query.filter.author+'%'} : {[Op.like]: '%%'};
	let data = [];
	if (req.query.start && req.query.count) {
			data = await Books.findAll({where: {title: titleFilter, [Op.or]: [{authorName: authorNameFilter}, {authorSurname: authorSurnameFilter}, {authorPatronymic: authorPatronymicFilter}]}, offset: +req.query.start, limit: +req.query.count, include: [Genres, Cover]}).then(booksBooks => {
	        booksBooks.map(function (book) {
	            book = book.dataValues;
	            book.genres.map(function (genreOfOneBook) {
	                let genre = {id: genreOfOneBook.dataValues.id, genre: genreOfOneBook.dataValues.genre};
	                genreOfOneBook = genre;
	                return genreOfOneBook
	            });
	            return book;
	        });
					return booksBooks
	    });
	}
	Books.count().then(function (count) {
			res.json({"pos": +req.query.start, "data": data, "total_count": +count})
	});

    // const books = await Books.findAll({include: [Genres, Cover]}).then(booksBooks => {
    //     booksBooks.map(function (book) {
    //         book = book.dataValues;
    //         book.genres.map(function (genreOfOneBook) {
    //             let genre = {id: genreOfOneBook.dataValues.id, genre: genreOfOneBook.dataValues.genre};
    //             genreOfOneBook = genre;
    //             return genreOfOneBook
    //         });
    //         return book;
    //     });
    //     res.json(booksBooks);
    // });
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

        let sendData = genresOfUpdatedBook.map((genreOfUpdatedBook) => {
            return Genres.findOne({where: {id: genreOfUpdatedBook}})
                .then((genre) => {
                    return genre.addBook(req.body.id);
                });
        });
        // let sendData = genresOfUpdatedBook.map(async (genreOfUpdatedBook) => {
        //     const genre = await Genres.findOne({where: {id: genreOfUpdatedBook}});
        //     await  genre.addBook(req.body.id);
        // });
        Promise.all(sendData).then((completed) => {
            Books.findOne({where: {id: req.body.id}, include: [Genres] }).then((book) => {
                return res.send(book)
            })
        });
    });
});

app.put("/order/:id", async (req, res) => {
    console.log(req.body);
    Books.findOne({where: {id: req.body.id}}).then((book) => {
        return book.decrement("availableCount", {by: 1})
    }).then(book => {
        book.reload().then((book) => {
            return res.send(book)
        })
    });
})

app.post("/uploadFiles", upload.fields([{name: "text", maxCount: 3}, {name: "audio", maxCount: 3}]), async (req, res) => {
    let text = await req.files.text;
    let audio = await req.files.audio;

    if (req.body.id) {
        Books.findOne({where: {id: req.body.id} }).then((book) => {
            if (text) {
                text.map(function (textfile) {
                    let oldPath = textfile.destination + "/" + textfile.filename;
                    let newPath = textfile.destination + "/textfiles/" + textfile.filename;
                    moveFile(oldPath, newPath)
                    book.createBookFile(({fileType: textfile.mimetype, path: newPath, size: textfile.size, bookId: req.body.id}));
                    return textfile
                });
            }
            if (audio) {
                audio.map(function (audiofile) {
                    let oldPath = audiofile.destination + "/" + audiofile.filename;
                    let newPath = audiofile.destination + "/audiofiles/" + audiofile.filename;
                    moveFile(oldPath, newPath)
                    book.createBookFile(({fileType: audiofile.mimetype, path: newPath, size: audiofile.size, bookId: req.body.id}));
                    return audiofile
                })
            }
        })
    }
})

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


//GET BOOK FULL INFORMATION//

app.get("/book", async (req, res) => {
    const book = await Books.findOne({include: [Genres, Cover]}).then(bookFullInfo => {
        console.log(bookFullInfo);

        // booksBooks.map(function (book) {
        //     book = book.dataValues;
        //     book.genres.map(function (genreOfOneBook) {
        //         let genre = {id: genreOfOneBook.dataValues.id, genre: genreOfOneBook.dataValues.genre};
        //         genreOfOneBook = genre;
        //         return genreOfOneBook
        //     });
        //     return book;
        // });
        // res.json(booksBooks);
    });
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
