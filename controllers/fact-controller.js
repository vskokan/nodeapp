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

            client.query('SELECT * FROM (SELECT id, review, fish, bait, method, ROW_NUMBER () OVER (ORDER BY id) FROM facts) AS numberedRows WHERE row_number BETWEEN $1 AND $2',
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