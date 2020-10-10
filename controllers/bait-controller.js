const client = require('../db')

exports.findAll = (req, res) => {
    client.query('SELECT * FROM baits;', [], function (err, result) {
         if (err) {
            return next(err)
        }
        res.json(result.rows)
    })
}

exports.create = (req, res) => {
    const bait = {
        id: req.body.id,
        name: req.body.name,
        description: req.body.description
    }
    client.query('INSERT INTO baits (id, name, description) VALUES ($1, $2, $3);', [bait.id, bait.name, bait.description], function (err, result) {
        if (err) {
            return next(err)
        }   
        res.send(result)
    })
}