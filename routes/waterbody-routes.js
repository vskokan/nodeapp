module.exports = app => {
    const waterbody = require("../controllers/waterbody-controller.js");
    let router = require("express").Router();
    app.use('/api/waterbodies', router);

    router.post("/", waterbody.create);
    router.get("/", waterbody.findAll);
    //router.get("/:id", fishes.findOne);
    //router.put("/:id", fishes.update);
    //router.delete("/:id", fishes.delete);
    //router.delete("/", fishes.deleteAll);
}