module.exports = app => {
    const fish = require("../controllers/fish-controller.js");
    let router = require("express").Router();
    app.use('/api/fish', router);

    router.post("/", fish.create);
    router.get("/", fish.findAll);
    //router.get("/:id", fishes.findOne);
    //router.put("/:id", fishes.update);
    //router.delete("/:id", fishes.delete);
    //router.delete("/", fishes.deleteAll);
}