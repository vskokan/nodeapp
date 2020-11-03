module.exports = app => {
    const bait = require("../controllers/bait-controller.js");
    let router = require("express").Router();
    app.use('/api/baits', router);

    router.post("/", bait.create);
    router.get("/", bait.readAll);
    router.get("/:id", bait.readOne);
    router.put("/:id", bait.update);
    router.delete("/:id", bait.deleteOne);
    router.delete("/", bait.deleteAll);
}