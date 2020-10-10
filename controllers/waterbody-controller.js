const client = require('../db')

exports.findAll = (req, res) => {
    client.query('SELECT * FROM waterbodies;', [], function (err, result) {
         if (err) {
            return next(err)
        }
        res.json(result.rows)
    })
}

exports.create = (req, res) => {
    const waterbody = {
        id: req.body.id,
        name: req.body.name,
        type: req.body.type,
        district: req.body.district
    }
    client.query('INSERT INTO waterbodies (id, name, type, district) VALUES ($1, $2, $3, $4);', [waterbody.id, waterbody.name, waterbody.type, waterbody.district], function (err, result) {
        if (err) {
            return next(err)
        }   
        res.send(result)
    })
}