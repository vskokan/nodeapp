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

exports.deleteById = (req, res) => {
    let id = req.params.id
    console.log(id)
    client.query('DELETE FROM fishes WHERE id = $1;', [id], function(err, result) {
        if(err) {
            console.log('Ошибка во время удаления')
            return
        }
        res.status(200).json({status: 'ok'})
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

    // res = fish
    // console.log(res)
    res.status(200).json({status:"ok"})
}

exports.findAllPagination = (req, res) => {
    const rowsPerPage = 10;
    let page = req.query.page
    //console.log(page)

    const data = {
        rows: '',
        maxpage:''
    }

    client.query('SELECT COUNT(*) AS rowNumber FROM fishes;', [], function (err, result) {
        if (err) {
            console.log('Ошибка на этапе подсчета')
            return
        }
        //console.log(result.rows[0].rownumber)
        data.maxpage = Math.ceil(result.rows[0].rownumber / rowsPerPage)
        //console.log('maxpage: ' + data.maxpage)


        let from = rowsPerPage * (page - 1) + 1
        let to = rowsPerPage * page
        //console.log(from, to)

        client.query('SELECT * FROM (SELECT id, name, image, description, ROW_NUMBER () OVER (ORDER BY id) FROM fishes) AS numberedRows WHERE row_number BETWEEN $1 AND $2;', [from, to], function (err, result) {
            if (err) {
                console.log(err)
            }
            data.rows = result.rows
            //console.log(data)
            res.json(data)
    })



         
    })
    
}