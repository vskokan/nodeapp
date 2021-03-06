//import { fish } from '../models/fish-model.js'
const client = require('../db')
const fs = require('fs')

exports.readAll = (req, res) => {
    const page = req.query.page
    const p = req.query.p
    if (p === "amount") {
        client.query('SELECT COUNT(*) AS amount FROM fishes', [], function(err, result) {
            if (err) {
                console.log('Что-то пошло не так')
                return
            }
            res.json(result.rows[0].amount)
        })
        return
    }
    if (page === undefined) {
        client.query('SELECT * FROM fishes;', [], function (err, result) {
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
        client.query('SELECT COUNT(*) AS rowNumber FROM fishes;', [], function (err, result) {
            if (err) {
                console.log('Ошибка на этапе подсчета')
                return
            }
            console.log(result.rows[0].rownumber)
            data.maxpage = Math.ceil(result.rows[0].rownumber / rowsPerPage)
           // console.log('maxpage: ' + data.maxpage)
           // console.log('page from url ', page)
    
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
}

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

exports.update = (req, res) => {
    const fish = {
        id: req.params.id,
        name: req.body.name,
        description: req.body.description,
    }

    console.log(fish)

    if (req.file !== undefined) {
        fish.image = 'uploads/fishes/' + req.file.filename
        console.log(fish)

        client.query('SELECT image AS image FROM fishes WHERE id = $1', [fish.id], function(err, result) {
            if(err) {
                console.log('Ошибка во время поиска ссылки на изображение')
                res.json({status:"error"})
            }
            console.log(result.rows[0].image)
            const oldLink = result.rows[0].image
            fs.unlinkSync(oldLink)

            client.query('UPDATE fishes SET name = $1, description = $2, image = $3 WHERE id = $4', [fish.name, fish.description, fish.image, fish.id], function (err, res) {
                if (err) {
                    console.log('Ошибка во время обновления данных')
                    return
                    // res.json({status:"error"})
                }
                
            })

        })
    } else {
        client.query('UPDATE fishes SET name = $1, description = $2 WHERE id = $3', [fish.name, fish.description, fish.id], function (err, res) {
            if (err) {
                console.log('Ошибка во время обновления данных')
                return
                // res.json({status:"error"})
            }
            
        })
    }

    //res.status(200).json({status:"ok"})
    res.json({status:"ok"})
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