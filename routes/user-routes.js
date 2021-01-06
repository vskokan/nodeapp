module.exports = app => {
    const user = require("../controllers/user-controller.js");
    let router = require("express").Router();
    app.use('/api/users', router);

    router.post("/", user.create);
    router.get("/", user.readAll);
    router.get("/:login", user.readOne);
    router.put("/:login", user.update);
    router.delete("/:login", user.deleteByLogin);
}