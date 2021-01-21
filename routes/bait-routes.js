module.exports = app => {
    const bait = require("../controllers/bait-controller.js");
    let router = require("express").Router();
    app.use('/api/baits', router);

    var multer  = require('multer')
    
    const storageConfig = multer.diskStorage({
        destination: (req, file, cb) =>{
            if (file.fieldname == "image")
                cb(null, "uploads/fishes/")
            if (file.fieldname == "avatar")
                cb(null, "uploads/users/")
                if (file.fieldname == "images")
                cb(null, `uploads/reviews/`)
        },
        filename: (req, file, cb) =>{
            cb(null, Date.now() + file.originalname);
        }
    });

    const upload = multer({storage:storageConfig})

    router.post("/", upload.none(), bait.create);
    router.get("/", bait.readAll);
    router.get("/:id", bait.readOne);
    router.post("/update", upload.none(), bait.update);
    router.delete("/:id", bait.deleteById);
    router.delete("/", bait.deleteAll);
}