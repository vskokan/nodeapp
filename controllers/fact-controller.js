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
        review: req.body.review,
        bait: req.body.bait,
        method: req.body.method,
        fish: req.body.fish,
    }

    client.query('INSERT INTO facts (review, bait, method, fish) VALUES ($1, $2, $3, $4);', [fact.review, fact.bait, fact.method, fact.fish])
    .then((result) => {
        result = {status:"ok"}
        res.send(result)
    })
    .catch((err) => {
        console.log('Ошибка при добавлении факта: ', err)
    }) 
}

exports.readAll = (req, res) => {
    const page = req.query.page
    const p = req.query.p
    if (p === "amount") {
        client.query('SELECT COUNT(*) AS amount FROM facts', [])
        .then((result) => {
            return res.json(result.rows[0].amount)
        })
        .catch((err) => {
            console.log('Ошибка чтения фактов: ', err)
            return res.json(err)
        })
    }
    if (page === undefined) {
        
        client.query("SELECT id, review, fish, bait, method FROM facts;", [])
        .then((result) => {
            //console.log(result)
            // res.statusCode = 200;
            // res.setHeader('Content-Type', 'json');
            return res.json(result.rows) //тут ошибка Cannot set headers after they are sent to the client
            //return
        })
        .catch((err) => {
            console.log('Ошибка чтения фактов там где неопределенная страница: ', err)
            return res.json(err) //И тут
            //return
        })        
    } else {
        const data = {
            rows: '',
            maxpage: ''
        }
        const rowsPerPage = 7
        client.query('SELECT COUNT(*) AS rowNumber FROM facts;', [])
        .then((result) => {
            console.log(result.rows[0].rownumber)
            data.maxpage = Math.ceil(result.rows[0].rownumber / rowsPerPage)
            console.log('maxpage: ' + data.maxpage)
            console.log('page from url ', page)

            let from = rowsPerPage * (page - 1) + 1
            let to = rowsPerPage * page
            console.log(from, to)

            client.query('SELECT * FROM (SELECT facts.id AS id, reviews.id AS review, fishes.id AS fish, fishes.name AS fishname, baits.id AS bait, baits.name AS baitname, methods.id AS method, methods.name AS methodname, ROW_NUMBER () OVER (ORDER BY facts.id) FROM facts JOIN reviews ON reviews.id = facts.review JOIN fishes ON fishes.id = facts.fish JOIN baits ON baits.id = facts.bait JOIN methods ON methods.id = facts.method) AS numberedRows WHERE row_number BETWEEN $1 AND $2',
                        [from, to])
            .then((result) => {
                data.rows = result.rows
                console.log(data)
                return res.json(data)
            })
            .catch((err) => {
                console.log('Ошибка в пагинации: ', err)
                return res.json(err)
            })   
        })      
    }
}

exports.update = (req, res) => {
    const fact = {
        id: req.params.id,
        review: req.body.review,
        fish: req.body.fish,
        bait: req.body.bait,
        method: req.body.method
    }

    console.log(fact)

    client.query('UPDATE facts SET review = $1, fish = $2, bait = $3, method = $4 WHERE id = $5',
                [fact.review, fact.fish, fact.bait, fact.method, fact.id])
    .then((result) => {
        console.log('Факт обновлен')
        console.log(result.rows)
        res.json(result.rows)
    })
    .catch((err) => {
        console.log('Ошибка в обновлении факта: ', err)
    })
}

exports.deleteById = (req, res) => {
    let id = req.params.id
    console.log('УДАЛЕНИЕ!!!!!!!!!!', id)
    client.query('DELETE FROM facts WHERE id = $1;', [id])
    .then((result) => {
        res.status(200).json({status: 'ok'})
    })
    .catch((err) => {
        console.log('Ошибка удаления факта: ', err)
    })
}