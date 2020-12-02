module.exports = app => {
    const user = require("../controllers/user-controller.js");
    let router = require("express").Router();
    app.use('/api/users', router);

    router.post("/", user.create);
    router.get("/", user.readAll);
    router.get("/:id", user.readOne);
    router.put("/:id", user.update);
    router.delete("/:id", user.deleteById);
}