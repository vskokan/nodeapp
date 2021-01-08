module.exports = app => {
    const fish = require("../controllers/fish-controller.js");
    let router = require("express").Router();
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

    //app.use(multer({storage:storageConfig}).single("image", "avatar"));
    // app.use(multer({storage:storageConfig}).array("image"));
    var upload = multer({storage:storageConfig})

    app.use('/api/fish', router);

    router.post("/", upload.single("image"), fish.create);
    // router.get("/", fish.findAll);
    router.get("/", fish.readAll);
    router.get("/pag/", fish.findAllPagination);
    // router.post("/test/", fish.parse);
    //router.post("/test/", upload.single('image'), fish.parse);

    //router.get("/:id", fishes.findOne);
    router.put("/:id", upload.single("image"), fish.update);
    router.delete("/:id", fish.deleteById);
    //router.delete("/", fishes.deleteAll);
}