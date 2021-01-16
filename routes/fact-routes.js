module.exports = app => {
    const fact = require("../controllers/fact-controller.js");
    let router = require("express").Router();

    const multer = require("../configs/index.js")

    app.use('/api/facts', router);

    router.post("/", multer.upload.none(), fact.create);
    router.get("/", fact.readAll);
    //router.get("/:id", fishes.findOne);
    //router.put("/:id", fishes.update);
    //router.delete("/:id", fishes.delete);
    //router.delete("/", fishes.deleteAll);
}