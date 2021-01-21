module.exports = app => {
    const method = require("../controllers/method-controller.js");
    let router = require("express").Router();
    app.use('/api/methods', router);

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

    router.post("/", upload.none(), method.create);
    router.get("/", method.readAll);
    router.get("/:id", method.readOne);
    router.post("/update", upload.none(), method.update);
    router.delete("/:id", method.deleteById);
    router.delete("/", method.deleteAll);
}