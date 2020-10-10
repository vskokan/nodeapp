const client = require('../db')

// exports.findAll = (req, res) => {
//     client.query('SELECT * FROM reviews;', [], function (err, result) {
//          if (err) {
//             return next(err)
//         }
//         res.json(result.rows)
//     })
// }

exports.findOneByParameter = (req, res) => {
    //let parameter = 'reviews.id' //req.body.parameter
    //let value = '2'//String(req.body.value)
    client.query('SELECT users.login as USERLOGIN, reviews.id AS REVIEWID, facts.id AS FACTID, fishes.id AS FISHID, fishes.name AS FISH, baits.id AS BAITID, baits.name AS BAIT, methods.id AS METHODID, methods.name AS METHOD, waterbodies.id AS WATERBODYID, waterbodies.name AS WATERBODY FROM (((((users INNER JOIN reviews ON reviews.login = users.login) INNER JOIN facts ON facts.reviewid = reviews.id) INNER JOIN fishes ON fishes.id = facts.fishid) INNER JOIN baits ON baits.id = facts.baitid) INNER JOIN methods ON methods.id = facts.methodid) INNER JOIN waterbodies ON waterbodies.id = facts.waterbodyid WHERE reviews.id = 2;', [], function (err, result) {
        if (err) {
            return next(err)
        } 

        const fullReview = {
            login: "",
            reviewId: "",
            waterbody: {
                id: "",
                name: ""
            },
            catch: []
        }

        let catchRows = []

        fullReview.login = result.rows[0].userlogin
        fullReview.reviewId = result.rows[0].reviewid
        fullReview.waterbody.id = result.rows[0].waterbodyid
        fullReview.waterbody.name = result.rows[0].waterbody
        
        result.rows.forEach(row => {
            catchRows.push({fish: {id: row.fishid, name: row.fish}, bait: {id: row.baitid, name: row.bait}, method: {id: row.methodid, name: row.method},})
        })

        let temp = [

        ]
        
        
        
        function formBaitAndMethod(array) {
            let combinations  = []
            if (array.length === 1) {
                combinations.push({bait: array[0].bait, method: array[0].method})
            } else {
                
                for (let i = 0; i < array.length; i++) {
                    let isExist = false
                    for (let j = 0; j < combinations.length; j++) {
                        if ((array[i].method.id === combinations[j].method.id) && (array[i].bait.id === combinations[j].bait.id)) {
                            isExist = true
                        }
                        
                    }
                    if (!isExist) combinations.push({bait:array[i].bait, method: array[i].method })
                }
            }

            return combinations
        }
            
        let combinations = formBaitAndMethod(catchRows)
        let rows = []

        function formFishGroups(array, combinations) {
            let fishes = []
            
            for (let i = 0; i < combinations.length; i++) {
                
                for (let j = 0; j < array.length; j++) {
                    if ((combinations[i].method.id === array[j].method.id) && (combinations[i].bait.id === array[j].bait.id)) {
                        let isExist = false
                        for (let k = 0; k < fishes.length; k++) {
                            if ((array[j].fish.name === fishes[k]) && (fishes.length !== 0)) {
                                isExist = true
                            }
                        }
                        if (!isExist) fishes.push(array[j].fish.name)
                        
                    }
                }

                rows.push({fish: fishes, combination: combinations[i]})
                fishes = []
                fullReview.catch[i] = rows[i]
            }
            
        }

        formFishGroups(catchRows, combinations)
        console.log(rows)
        res.json(fullReview)
    })
}



