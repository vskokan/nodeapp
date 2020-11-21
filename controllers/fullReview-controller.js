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

    let value = String(req.params.id)
    let dateFormat = 'DD/Mon/YYYY'
    console.log(value)
    client.query('SELECT users.login as USERLOGIN, reviews.id AS REVIEWID, reviews.latitude AS LATITUDE, reviews.longitude AS LONGITUDE, reviews.isBaiting as ISBAITING, reviews.roadQuality AS ROADQUALITY, reviews.fishingTime AS FISHINGTIME, to_char(reviews.reviewDate, $2) AS DATE, reviews.description AS DESCRIPTION, facts.id AS FACTID, fishes.id AS FISHID, fishes.name AS FISH, baits.id AS BAITID, baits.name AS BAIT, methods.id AS METHODID, methods.name AS METHOD FROM (((((users INNER JOIN reviews ON reviews.login = users.login) INNER JOIN facts ON facts.reviewid = reviews.id) INNER JOIN fishes ON fishes.id = facts.fishid) INNER JOIN baits ON baits.id = facts.baitid) INNER JOIN methods ON methods.id = facts.methodid) INNER JOIN waterbodies ON waterbodies.id = facts.waterbodyid  WHERE reviews.id = $1;', [value, dateFormat], function (err, result) {
        if (err) {
            return next(err)
        } 

        const fullReview = {
            login: "",
            reviewId: "",
            latitude: "",
            longitude: "",
            isBaiting: "",
            roadQuality: "",
            fishingTime: "",
            reviewDate: "",
            description: "",
            waterbody: {
                id: "",
                name: ""
            },
            catch: []
        }

        let catchRows = []

        fullReview.login = result.rows[0].userlogin
        fullReview.reviewId = result.rows[0].reviewid
        // fullReview.waterbody.id = result.rows[0].waterbodyid
        // fullReview.waterbody.name = result.rows[0].waterbody
        fullReview.latitude = result.rows[0].latitude
        fullReview.longitude = result.rows[0].longitude
        fullReview.isBaiting = result.rows[0].isbaiting
        fullReview.roadQuality = result.rows[0].roadquality
        fullReview.fishingTime = result.rows[0].fishingtime
        fullReview.reviewDate = result.rows[0].date
        fullReview.description = result.rows[0].description
        
        result.rows.forEach(row => {
            catchRows.push({fish: {id: row.fishid, name: row.fish}, bait: {id: row.baitid, name: row.bait}, method: {id: row.methodid, name: row.method},})
        })

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



