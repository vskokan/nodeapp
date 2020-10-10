module.exports = app => {
    const bait = require("../controllers/bait-controller.js");
    let router = require("express").Router();
    app.use('/api/baits', router);

    router.post("/", bait.create);
    router.get("/", bait.findAll);
    //router.get("/:id", fishes.findOne);
    //router.put("/:id", fishes.update);
    //router.delete("/:id", fishes.delete);
    //router.delete("/", fishes.deleteAll);
}