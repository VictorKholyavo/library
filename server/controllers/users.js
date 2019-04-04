const express = require("express");
const app = express();
const { Users, UsersDetailes } = require("../../sequelize");
const jwt = require('jsonwebtoken');
const passportJWT = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const passport = require('passport');
const bcrypt = require('bcrypt');

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : "secret for library"
  },
    function (jwtPayload, cb) {
        return Users.findOne({
            where: {id: jwtPayload.id}
                }).then(user => {
                    return cb(null, user.dataValues);
                })
                .catch(err => {
                    return cb(err);
                });
    }
));

passport.use(new LocalStrategy({ usernameField: "email" },
  function (username, password, done) {
        Users.findOne({
            where: {email: username}
        }).then(user => {
            if (!user) {
                console.log('!user');
                return done(null, false);
            }
            if (!bcrypt.compareSync(password, user.password)) {
                console.log('!password');
                return done(null, false);
            }
            return done(null, user.dataValues);
        });
  }
));

app.post("/login", (req, res, next) => {
	passport.authenticate('local', {session: false},
		function(err, user) {
			if (err) {
				return next(err);
			}
			if (!user) {
				return res.status(403).send('Укажите правильный email или пароль!');
			}
			req.logIn(user, {session: false}, function(err) {
				if (err) {
					return next(err);
                }
                const token = jwt.sign({id: user.id}, "secret for library");
                console.log(token)
	            return res.json({token: token});
			});
	})(req, res, next);
});

app.post("/login/status", passport.authenticate('jwt', {session: false}), async (req, res, next) => {
    if (req.user) {
		let token = jwt.sign({id: req.user.id}, "secret for library");
		return res.json({token: token, role: req.user.role_id});
	}
	return res.json(null);
});

app.get("/getInfo", passport.authenticate('jwt', {session: false}), async (req, res, next) => {
    const userDetailes = await Users.findOne({where: {id: req.user.id}, include: [UsersDetailes]});
    return res.json(userDetailes.usersdetaile.dataValues);
})

app.post("/logout", (req, res) => {
	req.logout();
	res.json({});
});


// ADMIN //
app.get("/", async (req, res) => {
    const users = await Users.findAll({include: [UsersDetailes]});
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

// let orderDirection = "";
// let orderColumn = "";
// if (req.query.sort) {
// 	orderColumn = Object.keys(req.query.sort)[0];
// }
// for (const key in req.query.sort) {
// 	if (req.query.sort.hasOwnProperty(key)) {
// 		orderDirection = req.query.sort[key];
// 	}
// }
// let sortColumn = req.query.sort ? [orderColumn, orderDirection] : ['id', 'ASC'];
// let data = [];
// if (req.query.start && req.query.count) {
//     data = await Employees.findAll({order: [sortColumn], offset: +req.query.start, limit: +req.query.count});
// }
// Employees.count().then(function (count) {
//     res.json({"pos": +req.query.start, "data": data, "total_count": +count})
// })
// });

app.post("/registration", async (req, res) => {
    try {
        let newUser = req.body;
        Users.create(newUser)
            .then((newUser) => {
                let userDetailes = {user_id: newUser.dataValues.id}
                UsersDetailes.create(userDetailes). 
                    then((newUser) => {
                        res.send("You have been registered");
                    });
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