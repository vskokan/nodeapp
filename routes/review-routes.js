module.exports = app => {
    const review = require("../controllers/review-controller.js");
    let router = require("express").Router();
    app.use('/api/reviews', router);

    router.post("/", review.create);
    router.get("/", review.findAll);
    //router.get("/:id", fishes.findOne);
    //router.put("/:id", fishes.update);
    //router.delete("/:id", fishes.delete);
    //router.delete("/", fishes.deleteAll);
}