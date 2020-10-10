module.exports = app => {
    const fact = require("../controllers/fact-controller.js");
    let router = require("express").Router();
    app.use('/api/facts', router);

    router.post("/", fact.create);
    router.get("/", fact.findAll);
    //router.get("/:id", fishes.findOne);
    //router.put("/:id", fishes.update);
    //router.delete("/:id", fishes.delete);
    //router.delete("/", fishes.deleteAll);
}