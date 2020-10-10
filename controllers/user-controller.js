const client = require('../db')

exports.findAll = (req, res) => {
    client.query('SELECT * FROM users;', [], function (err, result) {
         if (err) {
            return next(err)
        }
        res.json(result.rows)
    })
}

exports.create = (req, res) => {
    const user = {
        login: req.body.login,
        password: req.body.password,
        email: req.body.email,
        accessRights: req.body.accessRights,
        realName: req.body.realName,
        city: req.body.city,
        userpicLink: req.body.userpicLink,
        raiting: req.body.raiting

    }
    client.query('INSERT INTO users (login, password, email, accessrights, realname, city, userpiclink, raiting) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);', [user.login, user.password, user.email, user.accessRights, user.realName, user.city, user.userpicLink, user.raiting], function (err, result) {
        if (err) {
            return next(err)
        }   
        res.send(result)
    })
}