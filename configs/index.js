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

exports.upload = multer({storage:storageConfig})