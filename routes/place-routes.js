module.exports = app => {
    const place = require("../controllers/place-controller.js");
    let router = require("express").Router();
    app.use('/api/places', router);

    router.post("/", place.create);
    router.get("/", place.readAll);
    router.get("/:id", place.readOne);
    router.put("/:id", place.update);
    // router.post("/update", place.update);
    router.delete("/:id", place.deleteById);
    //router.delete("/", place.deleteAll);
}