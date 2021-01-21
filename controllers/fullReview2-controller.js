const client = require('../db')
const fs = require('fs')

exports.create = (req, res) => {
    const review = {
        login: req.body.login,
        description: req.body.description,
        isBaiting: 1,
        roadQuality: 1,
        fishingTime: req.body.fishingTime,
        raiting: 0,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        facts: transformFacts(JSON.parse(req.body.facts)),
       // facts: req.body.facts,
        photos: req.body.files
    }

    console.log(review)
}

function transformFacts(facts) {
    let transformedFacts = []

    facts.forEach(fact => {
        let fishes = []
        fact.fishes.forEach(fish => {
            fishes.push(fish.id)
        })

        console.log(fishes)
        transformedFacts.push({method: fact.method.id, bait: fact.bait.id, fishes: fishes})
    })

    return transformedFacts
}