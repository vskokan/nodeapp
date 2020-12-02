const ExpressFormidable = require('express-formidable')
const client = require('../db')

exports.create = (req, res) => {
    const user = {
        login: req.body.password,
        email: req.body.email,
        password: req.body.password,
        admin: req.body.admin,
        place: req.body.place,
        avatar: 'uploads/users/default.jpg',
        raiting: 0
    }
    client.query('INSERT INTO users (login, email, password, admin, place, avatar, raiting) VALUES ($1, $2, $3, $4, $5, $6, $7);', [user.login, user.email, user.password, user.admin, user.place, user.avatar, user.raiting], function (err, result) {
        if (err) {
            return next(err)
        }   
        res.send(result)
    })
}

exports.readAll = (req, res) => {
    const page = req.query.page
    const p = req.query.p
    if (p === "amount") {
        client.query('SELECT COUNT(*) AS amount FROM users', [], function(err, result) {
            if (err) {
                console.log('Что-то пошло не так')
                return
            }
            res.json(result.rows[0].amount)
        })
        return
    }
    if (page === undefined) {
        client.query('SELECT * FROM users;', [], function (err, result) {
            if (err) {
               return next(err)
           }
           res.json(result.rows)
       })
    } else {
        const data = {
            rows: '',
            maxpage:''
        }
        const rowsPerPage = 7
        client.query('SELECT COUNT(*) AS rowNumber FROM users;', [], function (err, result) {
            if (err) {
                console.log('Ошибка на этапе подсчета')
                return
            }
            console.log(result.rows[0].rownumber)
            data.maxpage = Math.ceil(result.rows[0].rownumber / rowsPerPage)
            console.log('maxpage: ' + data.maxpage)
            console.log('page from url ', page)
    
            let from = rowsPerPage * (page - 1) + 1
            let to = rowsPerPage * page
            console.log(from, to)
    
            client.query('SELECT * FROM (SELECT login, email, password, admin, place, avatar, raiting, ROW_NUMBER () OVER (ORDER BY login) FROM users) AS numberedRows WHERE row_number BETWEEN $1 AND $2;', [from, to], function (err, result) {
                if (err) {
                    console.log(err)
                }
                data.rows = result.rows
                console.log(data)
                res.json(data)
            })  
        })
    }
}

exports.readOne = (req, res) => {
    let id = String(req.params.id)
    client.query('SELECT * FROM users WHERE login = $1;', [id], function (err, result) {
        if (err) {
           return next(err)
       }
       res.json(result.rows)
   })
}

exports.update = (req, res) => {
    // let id = req.params.id
    // console.log(id)

    const place = {
        id: req.params.id,
        name: req.body.name,
        district: req.body.district
    }
    console.log(place)
    client.query('UPDATE users SET email = $1, password = $2, admin = $3, place = $4, avatar = $5, raiting = $6 WHERE login = $7;', [user.email, user.password, user.admin, user.place, user.avatar, user.raiting, user.login], function (err, result) {
        if (err) {
            console.log('Ошибка во время обновления')
            return
       }
       res.json(result.rows)
   })
}

exports.deleteById = (req, res) => {
    let id = req.params.id
    client.query('DELETE FROM users WHERE id = $1;', [id], function(err, result) {
        if(err) {
            console.log('Ошибка во время удаления')
            return
        }
        res.status(200).json({status: 'ok'})
    })
}

exports.deleteAll = (req, res) => {
    client.query('DELETE * FROM users;', [], function (err, result) {
        if (err) {
           return next(err)
       }
       result = 'Удалено'
       res.send(result)
   })
}