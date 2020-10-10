module.exports = app => {
    const user = require("../controllers/user-controller.js");
    let router = require("express").Router();
    app.use('/api/users', router);

    router.post("/", user.create);
    router.get("/", user.findAll);
    //router.get("/:id", fishes.findOne);
    //router.put("/:id", fishes.update);
    //router.delete("/:id", fishes.delete);
    //router.delete("/", fishes.deleteAll);
}