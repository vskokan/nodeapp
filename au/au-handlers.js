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
                    exp: Math.floor(Date.now() / 1000) + 30 * 1
                }, 'secret')

                // const refreshToken = uuidv1()

                const refreshToken = jwt.sign({
                    data: {
                        login: user.login,
                        userAgent: user.userAgent,
                        created: Date.now()
                    },
                }, 'secret')

                console.log(currentUser)
                console.log('Access token: ', accessToken)
                console.log(jwt.decode(accessToken))
                console.log('Refresh Token: ', refreshToken)

                client.query('INSERT INTO sessions (login, ip, user_agent, refresh_token) VALUES ($1, $2, $3, $4)',
                                [user.login, user.ip, user.userAgent, refreshToken])
                .then((result) => {
                     result = {user: currentUser, accessToken: accessToken, refreshToken: refreshToken}
                     return result
                })
                .then((result) => {
                    res.status(200).cookie('accessToken', `${result.accessToken}`, { maxAge: 900000, httpOnly: true }).cookie('refreshToken', `${result.refreshToken}`, { maxAge: 900000, httpOnly: true }).json({user: result.user})
                })

            } else {
                console.log('Пароль неправильный!')
                res.status(500).json({error: 'Ошибка пароля'})
            }
            // result == true ? res.json({statusCode: 200, user: {login: user.login, admin: user.admin}}) : res.json({statusCode: 500})
        })
    })
}

// exports.verify = (req, res, next) => { //Тест
//     /* С клиента получаем его логин, токены, user-agent (надо бы это всё в jwt хранить?) */
//     const auth = { 
//         //user: req.cookies.user,
//         accessToken: req.cookies.accessToken,
//         refreshToken: req.cookies.refreshToken,
//         message: req.body.message
//         //userAgent: req.body.userAgent
//     }

//     //console.log(req.headers)

//     jwt.verify(auth.accessToken, 'secret', (err, decoded) => {
//         if (err) {
//             //console.log(err)
//             if(err.message == 'jwt expired') {
//                 console.log('Токен доступа устарел') // Если токен устарел, проверяем наличие refreshToken в БД
//                 const decodedToken = jwt.decode(auth.accessToken)
//                // console.log('DECODED: ', decodedToken)
//                 const user = {
//                     login: decodedToken.data.login,
//                     userAgent: decodedToken.data.userAgent,
//                     ip: req.ip
//                 }
//                 //console.log('USER: ', user)
//                 /* Теперь получим refreshToken из базы данных и сверим его дату создания с датой создания токена, который пришел от пользлователя
//                 Если они совпадают, то всё нормально и можно генерировать новую пару и продолжать сессию
//                 Если не совпадают, то завершает сессию, удалив refreshToken из БД и куки */

//                 client.query('SELECT refresh_token AS token FROM sessions WHERE login = $1 AND user_agent = $2 AND ip = $3', [user.login, user.userAgent, user.ip])
//                 .then((result) => {
//                     //console.log('Результат селекта: ', result)
//                     //console.log(jwt.decode(auth.refreshToken))
//                     const isRefreshValid = (jwt.decode(auth.refreshToken).data.created === jwt.decode(result.rows[0].token).data.created)
//                     //console.log(isRefreshValid)
//                     if (!isRefreshValid) {
//                         client.query('DELETE FROM sessions WHERE login = $1 AND user_agent = $2 AND ip = $3', [user.login, user.userAgent, user.ip])
//                         .then(() => {
//                             res.status(403).json({message: 'Токены не совпадают'}) // По идее, эта ошибка будет и если токена в принципе нет в базе, когда result === undefined
//                         })
//                         .catch((err) => {
//                             console.log('Что-то пошло не так при удалении сессии')
//                         })
                        
//                     } else {
//                         const tokens = generateTokens(user.login, user.userAgent)
//                         client.query('UPDATE sessions SET refresh_token = $1 WHERE login = $2 AND ip = $3 AND user_agent = $4', [tokens.refreshToken, user.login, user.ip, user.userAgent])
//                         .then((result) => {
//                             //console.log(result)
//                             // res.locals.tokens = tokens
//                             // res.locals.user = user
//                             console.log('Токены обновлены и передаются куками в след. обработчик')
//                             res.cookie('accessToken', `${tokens.accessToken}`, { maxAge: 900000, httpOnly: true }).cookie('refreshToken', `${tokens.refreshToken}`, { maxAge: 900000, httpOnly: true })
//                             next()
//                             //res.status(200).cookie('accessToken', `${tokens.accessToken}`, { maxAge: 900000, httpOnly: true }).cookie('refreshToken', `${tokens.refreshToken}`, { maxAge: 900000, httpOnly: true }).json({user: user})
//                         })
//                         .catch((err) => {
//                             console.log('Ошибка обновления токена: ',err)
//                             res.status(500).json({message: 'Ошибка сервера при обновлении токенов'})
//                         })
                        
//                         // updateRefreshToken(tokens.refreshToken, user)
                        
//                     }
//                 })
//                 .catch((err) => {
//                     console.log('Помогите: ', err)
//                 })
//                 //console.log('Хуй знает че тут вроде конеуц функции')
//                 // res.status(500).json({message: 'Токен доступа устарел'})
//             }
//         } else {
//             console.log('Токен доступа нормальный, декодированно: ', decoded)
//             if (auth.message === undefined) {
//                 next()
//             } else {
//                 res.status(200).json({message: 'Токен действителен'})
//             }
//         }

        
//     })

    
// }

exports.logout = (req, res) => {
    console.log(req.headers)
    client.query('DELETE FROM sessions WHERE refresh_token = $1', [req.cookies.refreshToken])
    .then((result) => {
        console.log('Сессия удалена успешно')
        res.clearCookie('accessToken').clearCookie('refreshToken')
        res.status(200).json({message: 'logout'})
        // res.status(200).cookie('accessToken', `${null}`, { maxAge: 900000, httpOnly: true }).cookie('refreshToken', `${null}`, { maxAge: 900000, httpOnly: true }).json({message: 'Logout'})
    })
    .catch((err) => {
        console.log(err)
    })
}

function generateTokens(login, userAgent) {
    const accessToken = jwt.sign({
        data: {
            login: login,
            userAgent: userAgent
        },
        exp: Math.floor(Date.now() / 1000) + 60 * 1
    }, 'secret')


    const refreshToken = jwt.sign({
        data: {
            login: login,
            userAgent: userAgent,
            created: Date.now()
        },
    }, 'secret')

    return { accessToken: accessToken, refreshToken: refreshToken }
}



exports.verify = (req, res, next) => {

    console.log(req.headers)

    if (req.cookies.accessToken === undefined || req.cookies.refreshToken === undefined) {
        res.status(404).json({message: 'No cookies'})
    }

    const auth = {
        accessToken: req.cookies.accessToken,
        refreshToken: req.cookies.refreshToken,
        message: req.body.message
    }

    console.log(auth)
    // const userData = {
    //     user: '',
    //     accessToken: '',
    //     refreshToken: ''
    // }

    // В любом случае надо проверить валидность токенов

    jwt.verify(auth.accessToken, 'secret', (err, decoded) => {
        if (err) {
            if(err.message == 'jwt expired') {
                console.log('Токен доступа устарел') // Если токен устарел, проверяем наличие refreshToken в БД

                const decodedToken = jwt.decode(auth.accessToken)
                const user = {
                    login: decodedToken.data.login,
                    userAgent: decodedToken.data.userAgent,
                    ip: req.ip
                }

                client.query('SELECT refresh_token AS token FROM sessions WHERE login = $1 AND user_agent = $2 AND ip = $3', [user.login, user.userAgent, user.ip])
                .then((result) => {
                    const isRefreshValid = (jwt.decode(auth.refreshToken).data.created === jwt.decode(result.rows[0].token).data.created)
                    if (!isRefreshValid) {
                        client.query('DELETE FROM sessions WHERE login = $1 AND user_agent = $2 AND ip = $3', [user.login, user.userAgent, user.ip])
                        .then(() => {
                            res.status(403).json({message: 'Токены не совпадают'}) // По идее, эта ошибка будет и если токена в принципе нет в базе, когда result === undefined
                        })
                        .catch((err) => {
                            console.log('Что-то пошло не так при удалении сессии')
                        })
                        
                    } else {
                        const tokens = generateTokens(user.login, user.userAgent)
                        client.query('UPDATE sessions SET refresh_token = $1 WHERE login = $2 AND ip = $3 AND user_agent = $4', [tokens.refreshToken, user.login, user.ip, user.userAgent])
                        .then((result) => {
                            console.log('Токены обновлены и передаются куками в след. обработчик')
                            res.cookie('accessToken', `${tokens.accessToken}`, { maxAge: 900000, httpOnly: true }).cookie('refreshToken', `${tokens.refreshToken}`, { maxAge: 900000, httpOnly: true })
                            if (auth.message === undefined) {
                                next()
                            } else if (auth.message === 'check session') {
                                client.query('SELECT * FROM users WHERE login = $1', [user.login])
                                .then((result) => {
                                    res.status(200).json({user: result.rows[0]})
                                })
                                .catch((err) => {
                                    console.log('Ошибка: ', err)
                                })
                            }
                        })
                        .catch((err) => {
                            console.log('Ошибка обновления токена: ',err)
                            res.status(500).json({message: 'Ошибка сервера при обновлении токенов'})
                        })
                        
                    }
                })
                .catch((err) => {
                    console.log('Помогите: ', err)
                })
                //console.log('Хуй знает че тут вроде конеуц функции')
                // res.status(500).json({message: 'Токен доступа устарел'})
            }
        } else {
            console.log('Токен доступа нормальный, декодированно: ', decoded)
            if (auth.message === undefined) {
                next()
            } else if (auth.message === 'check session') {
                client.query('SELECT * FROM users WHERE login = $1', [decoded.data.login])
                .then((result) => {
                    res.status(200).json({user: result.rows[0]})
                })
                .catch((err) => {
                    console.log('Ошибка: ', err)
                })
            } else {
                console.log('лаощушодпжло')
            }
        } 

    })


}