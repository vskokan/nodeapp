module.exports = app => {
    const district = require("../controllers/district-controller.js");
    let router = require("express").Router();
    app.use('/api/districts', router);

    var multer  = require('multer')
    
    const storageConfig = multer.diskStorage({
        destination: (req, file, cb) =>{
            if (file.fieldname == "image")
                cb(null, "uploads/fishes/")
            if (file.fieldname == "avatar")
                cb(null, "uploads/users/")
        },
        filename: (req, file, cb) =>{
            cb(null, Date.now() + file.originalname);
        }
    });

    const upload = multer({storage:storageConfig})

    router.post("/", district.create);
    router.get("/", district.readAll);
    router.get("/:id", district.readOne);
    router.put("/:id", district.update);
    // router.post("/update", district.update);
    router.delete("/:id", district.deleteById);
    router.delete("/", district.deleteAll);
}