const client = require('../db')

exports.findAll = (req, res) => {
    client.query('SELECT * FROM methods;', [], function (err, result) {
         if (err) {
            return next(err)
        }
        res.json(result.rows)
    })
}

exports.create = (req, res) => {
    const method = {
        id: req.body.id,
        name: req.body.name,
        description: req.body.description
    }
    client.query('INSERT INTO methods (id, name, description) VALUES ($1, $2, $3);', [method.id, method.name, method.description], function (err, result) {
        if (err) {
            return next(err)
        }   
        res.send(result)
    })
}