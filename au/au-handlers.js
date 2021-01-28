const client = require('../db')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
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
    client.query('SELECT login, password AS hash, admin, email, place, avatar, raiting, name from users WHERE login = $1', [user.login])
    .then((result) => {
        const hash = result.rows[0].hash
        const currentUser = result.rows[0]
        bcrypt.compare(user.password, hash)
        .then((result) => {
            if (result === true) { //если пароль верный, то надо создать сессию, т.е. выдать токены и сделать запись в БД об этом
                const accessToken = jwt.sign({
                    data: {
                        login: user.login,
                        userAgent: user.userAgent
                    },
                    exp: Math.floor(Date.now() / 1000) + 60 * 1
                }, 'secret')

                const refreshToken = uuidv1()

                console.log(currentUser)
                console.log('Access token: ', accessToken)
                console.log('Refresh Token: ', refreshToken)

                client.query('INSERT INTO sessions (login, ip, user_agent, refresh_token, last_update) VALUES ($1, $2, $3, $4, current_timestamp)',
                                [user.login, user.ip, user.userAgent, refreshToken])
                .then((result) => {
                     result = {user: currentUser, access: accessToken, refresh: refreshToken}
                     return result
                })
                .then((result) => {
                    res.status(200).json(result)
                })

            } else {
                console.log('Пароль неправильный!')
                res.status(500).json({error: 'Ошибка пароля'})
            }
            // result == true ? res.json({statusCode: 200, user: {login: user.login, admin: user.admin}}) : res.json({statusCode: 500})
        })
    })
}

exports.verify = (req, res, next) => { //Тест
    /* С клиента получаем его логин, токены, user-agent (надо бы это всё в jwt хранить?) */
    const auth = { 
        //user: req.cookies.user,
        accessToken: req.cookies.token,
        refreshToken: req.body.refreshToken,
        //userAgent: req.body.userAgent
    }

    jwt.verify(auth.accessToken, 'secret', (err, decoded) => {
        if (err) {
            if(err.message = 'jwt expired') {
                console.log('Токен доступа устарел')
                const decoded = jwt.decode(auth.accessToken)
                console.log(decoded)
            }
        } else {
            console.log('Токен доступа нормальный, декодированно: ', decoded)
        }

        
    })

    next()
}

// exports.startSession = (req, res) => {

// }