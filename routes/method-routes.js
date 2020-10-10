module.exports = app => {
    const method = require("../controllers/method-controller.js");
    let router = require("express").Router();
    app.use('/api/methods', router);

    router.post("/", method.create);
    router.get("/", method.findAll);
    //router.get("/:id", fishes.findOne);
    //router.put("/:id", fishes.update);
    //router.delete("/:id", fishes.delete);
    //router.delete("/", fishes.deleteAll);
}