//import { fish } from '../models/fish-model.js'
const client = require('../db')



exports.findAll = (req, res) => {
    client.query('SELECT * FROM fishes;', [], function (err, result) {
         if (err) {
            return next(err)
        }
        res.json(result.rows)
    })
}

exports.create = (req, res) => {
    const fish = {
        id: req.body.id,
        name: req.body.name,
        photoLink: req.body.photoLink,
        description: req.body.description
    }
    client.query('INSERT INTO fishes (id, name, photoLink, description) VALUES ($1, $2, $3, $4);', [fish.id, fish.name, fish.photoLink, fish.description], function (err, result) {
        if (err) {
            return next(err)
        }   
        res.send(result)
    })
}

exports.create = (req, res) => {
    const fish = {
        id: req.body.id,
        name: req.body.name,
        photoLink: req.body.photoLink,
        description: req.body.description
    }
    client.query('INSERT INTO fishes (id, name, photoLink, description) VALUES ($1, $2, $3, $4);', [fish.id, fish.name, fish.photoLink, fish.description], function (err, result) {
        if (err) {
            return next(err)
        }   
        res.send(result)
    })
}

exports.parse = (req, res) => {
    const test = {
        name: req.file
        //description: req.body.get('description')
    }
    res = test
    console.log(test)
}