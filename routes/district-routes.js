module.exports = app => {
    const district = require("../controllers/district-controller.js");
    let router = require("express").Router();
    app.use('/api/districts', router);

    router.post("/", district.create);
    router.get("/", district.readAll);
    router.get("/:id", district.readOne);
    router.put("/:id", district.update);
    // router.post("/update", district.update);
    router.delete("/:id", district.deleteById);
    router.delete("/", district.deleteAll);
}