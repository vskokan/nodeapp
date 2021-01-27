const client = require('../db')
const bcrypt = require('bcrypt')
// const salt = bcrypt.genSaltSync(10)
const jwt = require('jsonwebtoken')
const { v1: uuidv1 } = require('uuid')

exports.login = (req, res) => {
    /* Получили логин и пароль с клиента */
    const user = {
        login: req.body.login,
        password: req.body.password,
        ip: req.ip,
        userAgent: req.body.userAgent
    }

    console.log(user)

    /* Проверяем, совпадают ли хэши паролей */
    client.query('SELECT password AS hash, admin from users WHERE login = $1', [user.login])
    .then((result) => {
        const hash = result.rows[0].hash
        user.admin = result.rows[0].admin
        bcrypt.compare(user.password, hash)
        .then((result) => {
            if (result === true) { //если пароль верный, то надо создать сессию, т.е. выдать токены и сделать запись в БД об этом
                const accessToken = jwt.sign({
                    data: {
                        login: user.login,
                        admin: user.admin
                    },
                    exp: Math.floor(Date.now() / 1000) + 60 * 10
                }, 'secret')

                const refreshToken = uuidv1()

                console.log('Access token: ', accessToken)
                console.log('Refresh Token: ', refreshToken)

                client.query('INSERT INTO sessions (login, ip, user_agent, refresh_token, last_update) VALUES ($1, $2, $3, $4, current_timestamp)',
                                [user.login, user.ip, user.userAgent, refreshToken])
                .then((accessToken, refreshToken) => {
                    res.status(200).json({access: accessToken, refresh: refreshToken})
                })

            } else {
                console.log('Пароль неправильный!')
                res.status(500).json({error: 'Ошибка пароля'})
            }
            // result == true ? res.json({statusCode: 200, user: {login: user.login, admin: user.admin}}) : res.json({statusCode: 500})
        })
    })
}

exports.verify = (req, res) => { //Тест
    const auth = {
        access: req.cookie.access,
        refresh: req.body.refresh
    }

    console.log(auth)
}

// exports.startSession = (req, res) => {

// }