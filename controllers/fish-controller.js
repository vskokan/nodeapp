//import { fish } from '../models/fish-model.js'
const client = require('../db')



exports.findAll = (req, res) => {
    client.query('SELECT * FROM fishes;', [], function (err, result) {
         if (err) {
            return next(err)
        }
        res.json(result.rows)
    })
}

// exports.create = (req, res) => {
//     const fish = {
//         id: req.body.id,
//         name: req.body.name,
//         photoLink: req.body.photoLink,
//         description: req.body.description
//     }
//     client.query('INSERT INTO fishes (id, name, photoLink, description) VALUES ($1, $2, $3, $4);', [fish.id, fish.name, fish.photoLink, fish.description], function (err, result) {
//         if (err) {
//             return next(err)
//         }   
//         res.send(result)
//     })
// }

// exports.create = (req, res) => {
//     const fish = {
//         id: req.body.id,
//         name: req.body.name,
//         photoLink: req.body.photoLink,
//         description: req.body.description
//     }
//     client.query('INSERT INTO fishes (id, name, photoLink, description) VALUES ($1, $2, $3, $4);', [fish.id, fish.name, fish.photoLink, fish.description], function (err, result) {
//         if (err) {
//             return next(err)
//         }   
//         res.send(result)
//     })
// }

exports.create = (req, res) => {
    const fish = {
        name: req.body.name,
        image: 'uploads/fishes/' + req.file.filename,
        description: req.body.description
    }

    client.query('INSERT INTO fishes (name, image, description) VALUES ($1, $2, $3);', [fish.name, fish.image, fish.description], function (err, result) {
        if (err) {
            console.log('Ошибка, не удалось выполнить запрос')
        }
        console.log('Успех')
        //res.send(result) 
    })

    res = fish
    console.log(res)
}

exports.findAllPagination = (req, res) => {
    const rowsPerPage = 1;
    let page = req.params.page

    let maxpage = 1

    client.query('SELECT COUNT(*) FROM fishes', [], function (err, result) {
        if (err) {
            console.log('Ошибка')
            return
        }
        maxpage = Math.ceil(result / rowsPerPage)
    })

    client.query('SELECT * FROM fishes;', [], function (err, result) {
         if (err) {
            return next(err)
        }
        res.json(result.rows)
    })
}