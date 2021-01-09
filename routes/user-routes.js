module.exports = app => {
    const user = require("../controllers/user-controller.js");
    const router = require("express").Router();

    const multer = require("../configs/index.js")

    // var multer  = require('multer')
    
    // const storageConfig = multer.diskStorage({
    //     destination: (req, file, cb) =>{
    //         if (file.fieldname == "image")
    //             cb(null, "uploads/fishes/")
    //         if (file.fieldname == "avatar")
    //             cb(null, "uploads/users/")
    //     },
    //     filename: (req, file, cb) =>{
    //         cb(null, Date.now() + file.originalname);
    //     }
    // });

    // const upload = multer({storage:storageConfig})


    //app.use(multer({storage:storageConfig}).single("avatar"));

    app.use('/api/users', router);

    router.post("/", multer.upload.none(), user.create);
    router.post("/changepassword", multer.upload.none(), user.updatePassword);
    router.get("/", multer.upload.none(), user.readAll);
    router.get("/:login", multer.upload.none(), user.readOne);
    router.put("/:login", multer.upload.single("avatar"), user.update);
    router.delete("/:login", multer.upload.none(), user.deleteByLogin);
}