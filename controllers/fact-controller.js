const client = require('../db')

exports.findAll = (req, res) => {
    client.query('SELECT * FROM facts;', [], function (err, result) {
         if (err) {
            return next(err)
        }
        res.json(result.rows)
    })
}

exports.create = (req, res) => {
    const fact = {
        reviewId: req.body.reviewId,
        baitId: req.body.baitId,
        methodId: req.body.methodId,
        fishId: req.body.fishId,
        waterbodyId:req.body.waterbodyId
    }
    client.query('INSERT INTO facts (reviewid, baitid, methodid, fishid, waterbodyid) VALUES ($1, $2, $3, $4, $5);', [fact.reviewId, fact.baitId, fact.methodId, fact.fishId, fact.waterbodyId], function (err, result) {
        if (err) {
            return next(err)
        }   
        res.send(result)
    })
}