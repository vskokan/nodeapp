module.exports = app => {
    const user = require("../controllers/user-controller.js");
    const router = require("express").Router();

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
    //app.use(multer({storage:storageConfig}).single("avatar"));

    app.use('/api/users', router);

    router.post("/", user.create);
    router.post("/changepassword", upload.none(), user.updatePassword);
    router.get("/", user.readAll);
    router.get("/:login", user.readOne);
    router.put("/:login", upload.single("avatar"), user.update);
    router.delete("/:login", user.deleteByLogin);
}