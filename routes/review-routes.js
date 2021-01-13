module.exports = app => {
    const review = require("../controllers/review-controller.js");
    let router = require("express").Router();

    const multer = require("../configs/index.js")

    app.use('/api/reviews', router);

    router.post("/", multer.upload.none(), review.create);
    router.get("/", review.readAll);
    //router.get("/:id", fishes.findOne);
    //router.put("/:id", fishes.update);
    //router.delete("/:id", fishes.delete);
    //router.delete("/", fishes.deleteAll);
}