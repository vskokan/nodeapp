const client = require('../db')
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10)

exports.login = (req, res) => {
    const user = {
        login: req.body.login,
        password: req.body.password,
    }

    console.log(user)
    //bcrypt.compare(user.oldPassword, passwordFromDB)

    client.query('SELECT password AS hash, admin from users WHERE login = $1', [user.login])
    .then((result) => {
        const hash = result.rows[0].hash
        user.admin = result.rows[0].admin
        bcrypt.compare(user.password, hash)
        .then((result) => {
            result == true ? res.json({statusCode: 200, user: {login: user.login, admin: user.admin}}) : res.json({statusCode: 500})
        })
    })
}