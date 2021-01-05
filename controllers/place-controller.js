const client = require('../db')

exports.create = (req, res) => {
    const place = {
        name: req.body.name,
        district: req.body.district
    }
    client.query('INSERT INTO places (name, district) VALUES ($1, $2);', [place.name, place.district], function (err, result) {
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
        client.query('SELECT COUNT(*) AS amount FROM places', [], function (err, result) {
            if (err) {
                console.log('Что-то пошло не так')
                return
            }
            res.json(result.rows[0].amount)
        })
        return
    }
    if (page === undefined) {
        client.query('SELECT * FROM places;', [], function (err, result) {
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
        client.query('SELECT COUNT(*) AS rowNumber FROM places;', [], function (err, result) {
            if (err) {
                console.log('Ошибка на этапе подсчета')
                return
            }
            console.log(result.rows[0].rownumber)
            data.maxpage = Math.ceil(result.rows[0].rownumber / rowsPerPage)
            console.log('maxpage: ' + data.maxpage)
            console.log('page from url ', page)

            let from = rowsPerPage * (page - 1) + 1
            let to = rowsPerPage * page
            console.log(from, to)

            client.query('SELECT * FROM (SELECT id, name, district, ROW_NUMBER () OVER (ORDER BY id) FROM places) AS numberedRows WHERE row_number BETWEEN $1 AND $2;', [from, to], function (err, result) {
                if (err) {
                    console.log(err)
                }
                data.rows = result.rows
                console.log(data)
                res.json(data)
            })
        })
    }
}

exports.readOne = (req, res) => {
    let id = String(req.params.id)
    client.query('SELECT * FROM places WHERE id = $1;', [id], function (err, result) {
        if (err) {
            return next(err)
        }
        res.json(result.rows)
    })
}

exports.update = (req, res) => {
    // let id = req.params.id
    // console.log(id)

    const place = {
        id: req.params.id,
        name: req.body.name,
        district: req.body.district
    }
    console.log(place)
    client.query('UPDATE places SET name = $1, district = $2 WHERE id = $3;', [place.name, place.district, place.id], function (err, result) {
        if (err) {
            console.log('Ошибка во время обновления')
            return
        }
        res.json(result.rows)
    })
}

exports.deleteById = (req, res) => {
    let id = req.params.id
    client.query('DELETE FROM places WHERE id = $1;', [id], function (err, result) {
        if (err) {
            console.log('Ошибка во время удаления')
            return
        }
        res.status(200).json({
            status: 'ok'
        })
    })
}

exports.deleteAll = (req, res) => {
    client.query('DELETE * FROM places;', [], function (err, result) {
        if (err) {
            return next(err)
        }
        result = 'Удалено'
        res.send(result)
    })
}