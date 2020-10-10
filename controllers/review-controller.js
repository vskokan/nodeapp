const client = require('../db')

exports.findAll = (req, res) => {
    client.query('SELECT * FROM reviews;', [], function (err, result) {
         if (err) {
            return next(err)
        }
        res.json(result.rows)
    })
}

exports.findOneByParameter = (req, res) => {
    let parameter = req.body.parameter
    let value = String(req.body.value)
    client.query('SELECT * FROM reviews WHERE $1 = $2', [parameter, value], function (err, result) {
        if (err) {
            return next(err)
        }   
        res.send(result)
    })
}

exports.create = (req, res) => {
    const review = {
        login: req.body.login,
        reviewDate: req.body.reviewDate,
        description: req.body.description,
        isBaiting: req.body.isBaiting,
        roadQuality: req.body.roadQuality,
        fishingTime: req.body.fishingTime,
        raiting: req.body.raiting,
        latitude: req.body.latitude,
        longitude: req.body.longitude
    }
    client.query('INSERT INTO reviews (login, reviewdate, description, isbaiting, roadquality, fishingtime, raiting, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);', [review.login, review.reviewDate,review.description, review.isBaiting, review.roadQuality,review.fishingTime, review.raiting, review.latitude, review.longitude], function (err, result) {
        if (err) {
            return next(err)
        }   
        res.send(result)
    })
}