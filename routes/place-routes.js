module.exports = app => {
    const place = require("../controllers/place-controller.js");
    let router = require("express").Router();
    app.use('/api/places', router);

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

    router.post("/", place.create);
    router.get("/", place.readAll);
    router.get("/:id", place.readOne);
    router.put("/:id", place.update);
    // router.post("/update", place.update);
    router.delete("/:id", place.deleteById);
    //router.delete("/", place.deleteAll);
}