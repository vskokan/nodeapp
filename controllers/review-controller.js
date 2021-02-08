const { json } = require('body-parser')
const client = require('../db')

// exports.findAll = (req, res) => {
//     client.query('SELECT id, login, to_char(reviews.reviewDate, $2) AS date, description, isbaiting, roadquality, fishingtime, raiting, latitude, longitude FROM reviews;', [], function (err, result) {
//          if (err) {
//             return next(err)
//         }
//         res.json(result.rows)
//     })
// }

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
        //reviewDate: req.body.reviewDate,
        description: req.body.description,
        isBaiting: req.body.isBaiting,
        roadQuality: req.body.roadQuality,
        fishingTime: req.body.fishingTime,
        raiting: 0,
        latitude: req.body.latitude,
        longitude: req.body.longitude
    }
    console.log(review)
    client.query('INSERT INTO reviews (login, date, description, isbaiting, roadquality, fishingtime, raiting, latitude, longitude) VALUES ($1, current_date, $2, $3, $4, $5, $6, $7, $8);', [review.login, review.description, review.isBaiting, review.roadQuality,review.fishingTime, review.raiting, review.latitude, review.longitude], function (err, result) {
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
        client.query('SELECT COUNT(*) AS amount FROM reviews', [], function (err, result) {
            if (err) {
                console.log('Что-то пошло не так')
                return
            }
            res.json(result.rows[0].amount)
        })
        return
    }
    if (page === undefined) {

        client.query("SELECT id, login, to_char(date, 'DD.MM.YYYY') AS date, description, isbaiting, roadquality, fishingtime, raiting, latitude, longitude FROM reviews;", [], function (err, result) {
            if (err) {
                return next(err)
            }
            res.json(result.rows)
        })
    } else {
        const data = {
            rows: '',
            maxpage: ''
        }
        const rowsPerPage = 7
        client.query('SELECT COUNT(*) AS rowNumber FROM reviews;', [], function (err, result) {
            if (err) {
                console.log('Ошибка на этапе подсчета')
                return
            }
            //console.log(result.rows[0].rownumber)
            data.maxpage = Math.ceil(result.rows[0].rownumber / rowsPerPage)
            //console.log('maxpage: ' + data.maxpage)
            //console.log('page from url ', page)

            let from = rowsPerPage * (page - 1) + 1
            let to = rowsPerPage * page
            //console.log(from, to)

            client.query("SELECT * FROM (SELECT id, login, to_char(date, 'DD.MM.YYYY') AS date, description, isbaiting, roadquality, fishingtime, raiting, latitude, longitude, ROW_NUMBER () OVER (ORDER BY id) FROM reviews) AS numberedRows WHERE row_number BETWEEN $1 AND $2;", [from, to], function (err, result) {
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

exports.createWithPromises = (req, res) => {
    const review = {
        login: req.body.login,
        description: req.body.description,
        isBaiting: req.body.isBaiting,
        roadQuality: req.body.roadQuality,
        fishingTime: req.body.fishingTime,
        raiting: 0,
        latitude: req.body.latitude,
        longitude: req.body.longitude
    }

    client.query('BEGIN')
    .then((result) => {
        return client.query('INSERT INTO reviews (login, date, description, isbaiting, roadquality, fishingtime, raiting, latitude, longitude) VALUES ($1, current_date, $2, $3, $4, $5, $6, $7, $8)',
                            [review.login, review.description, review.isBaiting, review.roadQuality,review.fishingTime, review.raiting, review.latitude, review.longitude])
    })
    .then((result) => {
        return client.query('UPDATE users SET raiting = raiting + 10 WHERE login = $1', 
                            [review.login])
    })
    .then((result) => {
        return client.query('commit')
    })
    .then((result) => {
        console.log('Транзакция вроде сработала')
        result = { status: 'ok' }
        res.send(result)
    })
    .catch((err) => {
        console.log('Ошибка в транзакции, откат: ', err)
        return client.query('ROLLBACK')
    })
    .catch((err) => {
        console.log('Ошибка во время отката: ', err)
    })
}

exports.update = (req, res) => {
    const review = {
        id: req.params.id,
        description: req.body.description,
        isBaiting: req.body.isBaiting,
        roadQuality: req.body.isBaiting,
        fishingTime: req.body.fishingTime,
        raiting: req.body.raiting,
        latitude: req.body.latitude,
        longitude: req.body.longitude
    }

    // client.query('UPDATE reviews SET desription = $1, isbaiting = $2, roadquality = $3, fishingtime = $4, raiting = $5, latitude = $6, longitude = $7 WHERE id = $8', [review.description, review.isBaiting, review.roadQuality, review.fishingTime, review.raiting, review.latitude, review.longitude], function (err, result) {
    //     if (err) {
    //         console.log('Ошибка на этапе обновления')
    //         return
    //     }
    //     client.query('UPDATE users SET raiting = raiting + 10 WHERE login in (SELECT login FROM reviews WHERE id = $1)', [review.id], function(err, result) {
    //         if (err) {
    //             console.log('Ошибка на этапе зачисления рейтинга')
    //         }
    //         return
    //     })
    //     res.send(result)
    // })

    client.query('UPDATE reviews SET description = $1, isbaiting = $2, roadquality = $3, fishingtime = $4, raiting = $5, latitude = $6, longitude = $7 WHERE id = $8', 
                [review.description, review.isBaiting, review.roadQuality, review.fishingTime, review.raiting, review.latitude, review.longitude, review.id])
    .then((result) => {
        res.send(result)
    })
    .catch((err) => {
        console.log('Ошибо4ка: ', err)
    })

    console.log(review)
}

// exports.update = (err, res) => {
//     client
//     .query('begin')
//     .then((res) => {
//         const review = {
//                     id: req.params.id,
//                     description: req.body.description,
//                     isBaiting: req.body.isBaiting,
//                     roadQuality: req.body.isBaiting,
//                     fishingTime: req.body.fishingTime,
//                     raiting: req.body.raiting,
//                     latitude: req.body.latitude,
//                     longitude: req.body.longitude
//         }

//         return client.query(
//             "UPDATE reviews SET desription = $1, isbaiting = $2, roadquality = $3, fishingtime = $4, raiting = $5, latitude = $6, longitude = $7 WHERE id = $8",
//             [review.description, review.isBaiting, review.roadQuality, review.fishingTime, review.raiting, review.latitude, review.longitude]
//         )
//     })
//     .then((res) => {
//         return client.query(
//             "UPDATE users SET raiting = raiting + 10 WHERE login in (SELECT login FROM reviews WHERE id = $1)",
//             ["Dog Biscuit", 3, "Cat Food", 5]
//         )
//     })
//     .then((res) => {
//         return client.query("commit")
//     })
//     .then((res) => {
//         console.log("transaction completed")
//     })
//     .catch((err) => {
//         console.error("error while querying:", err)
//         return client.query("rollback")
//     })
//     .catch((err) => {
//         console.error("error while rolling back transaction:", err)
//     })
// }

exports.getPhotos = (req, res) => {
    const id = req.params.id

    client.query('SELECT * FROM reviewphotos WHERE review = $1', [id])
    .then((result) => {
        res.status(200).json(result.rows)
    })
    .catch((err) => {
        console.log(err)
    })
}