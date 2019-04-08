const express = require("express");
let app = express();
const multer  = require("multer");
const { Files } = require("../../sequelize");

// const storage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 		cb(null, "./public/uploads");
// 	},
// 	filename: function (req, file, cb) {
// 		cb(null, file.originalname);
// 	}
// });

// const upload = multer({ storage: storage });

// app.post("/text", upload.single("upload"), async (req, res) => {
// 	console.log(req.file);
  
  
// 	let path = req.file.destination + "/" + req.file.filename;
// 	console.log(path);
// 	// Files.create({fileType: req.file.mimetype, path: path, bookId: })
// 	// const imageOne = await FilesSchema ({
// 	// 	_id: new mongoose.Types.ObjectId(),
// 	// 	name: req.body.name,
// 	// })
// 	// imageOne.save();


// 	// let path = req.file.destination + "/" + req.file.originalname;
// 	// res.send({"server": "server", "path": path})
// });

module.exports = app;
