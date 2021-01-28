// module.exports = app => {
//     const au = require("./au-handlers.js");
    
//     let router = require("express").Router();

//     const multer = require("../configs/index.js")

//     app.use('/api/au', router);

//     router.post('/login', multer.upload.none(), au.verify, au.login)

//     // router.post("/", multer.upload.none(), fact.create);
//     // router.get("/", fact.readAll);
//     //router.get("/:id", fishes.findOne);
//     // router.put("/:id", multer.upload.none(), fact.update);
//     // router.delete("/:id", multer.upload.none(), fact.deleteById);
//     //router.delete("/", fishes.deleteAll);
// }

const au = require("./au-handlers.js")
var express = require('express')
var router = express.Router()
const multer = require("../configs/index.js")
router.post('/login', multer.upload.none(), au.login)
router.post('/verify', multer.upload.none(), au.verify)

module.exports = router