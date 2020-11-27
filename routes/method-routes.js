module.exports = app => {
    const method = require("../controllers/method-controller.js");
    let router = require("express").Router();
    app.use('/api/methods', router);

    router.post("/", method.create);
    router.get("/", method.readAll);
    router.get("/:id", method.readOne);
    router.post("/update", method.update);
    router.delete("/:id", method.deleteById);
    router.delete("/", method.deleteAll);
}