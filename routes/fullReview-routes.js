module.exports = app => {
    const fullReview = require("../controllers/fullReview-controller.js");
    let router = require("express").Router();
    app.use('/api/full', router);

    //router.post("/", fullReview.create);
    router.get("/:id", fullReview.findOneByParameter);
    //router.get("/:id", fishes.findOne);
    //router.put("/:id", fishes.update);
    //router.delete("/:id", fishes.delete);
    //router.delete("/", fishes.deleteAll);
}