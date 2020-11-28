module.exports = app => {
    const fish = require("../controllers/fish-controller.js");
    let router = require("express").Router();
    var multer  = require('multer')
    
    const storageConfig = multer.diskStorage({
        destination: (req, file, cb) =>{
            cb(null, "uploads/fishes/");
        },
        filename: (req, file, cb) =>{
            cb(null, file.originalname);
        }
    });

    app.use(multer({storage:storageConfig}).single("image"));

    //var upload = multer({ dest: 'uploads/fishes/' })

    app.use('/api/fish', router);

    router.post("/", fish.create);
    // router.get("/", fish.findAll);
    router.get("/", fish.readAll);
    router.get("/pag/", fish.findAllPagination);
    // router.post("/test/", fish.parse);
    //router.post("/test/", upload.single('image'), fish.parse);

    //router.get("/:id", fishes.findOne);
    //router.put("/:id", fishes.update);
    router.delete("/:id", fish.deleteById);
    //router.delete("/", fishes.deleteAll);
}