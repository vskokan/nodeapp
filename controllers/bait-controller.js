const client = require('../db')

exports.create = (req, res) => {
    const bait = {
        name: req.body.name,
        description: req.body.description
    }
    client.query('INSERT INTO baits (name, description) VALUES ($1, $2);', [bait.name, bait.description], function (err, result) {
        if (err) {
            return next(err)
        }   
        res.send(result)
    })
}

exports.readAll = (req, res) => {
    client.query('SELECT * FROM baits;', [], function (err, result) {
         if (err) {
            return next(err)
        }
        res.json(result.rows)
    })
}

exports.readOne = (req, res) => {
    // тут будет вывод одной записи по id
    let id = String(req.params.id)
    client.query('SELECT * FROM baits WHERE id = $1;', [id], function (err, result) {
        if (err) {
           return next(err)
       }
       res.json(result.rows)
   })
}

exports.update = (req, res) => {
    //сюда изменение одной записи
    let id = String(req.params.id)
    let name = req.body.name
    let description = req.body.description

    client.query('UPDATE baits SET values(name, description) = ($1, $2) WHERE id = $3;', [name, description, id], function (err, result) {
        if (err) {
           return next(err)
       }
       res.json(result.rows)
   })
}

exports.deleteOne = (req, res) => {
    //сюда удаление одной записи
}

exports.deleteAll = (req, res) => {
    //сюда удаление одной записи
    client.query('DELETE * FROM baits;', [], function (err, result) {
        if (err) {
           return next(err)
       }
       result = 'Удалено'
       res.send(result)
   })
}