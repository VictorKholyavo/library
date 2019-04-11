const express = require("express");
const app = express();
const passport = require('passport');
const { Comment, User, Books } = require("../../sequelize");

app.get("/", async (req, res) => {
    const comments = await Comment.findAll();
    return res.send(comments);
});

app.get("/:id", async (req, res) => {
  const commentsForBook = await Comment.findAll({where: {bookId: req.params.id}});
  if (commentsForBook.length !== 0) {
  	return res.json(commentsForBook);
  }
	else {
		return res.status(400).send("No comments");
	}
});



app.post("/addcomment", async (req, res) => {
    try {
			Comment.create({bookId: req.body.bookId, user_id: req.user.id, text: req.body.text, date: req.body.date}).then((comment) => {
				return res.send(comment)
			});
    } catch (error) {
        res.send(error)
    }

});

module.exports = app;
