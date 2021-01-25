const multer  = require('multer')
const fs = require('fs')
    
    const storageConfig = multer.diskStorage({
        destination: (req, file, cb) =>{
            if (file.fieldname == "image")
                cb(null, "uploads/fishes/")
            if (file.fieldname == "avatar")
                cb(null, "uploads/users/")
            if (file.fieldname == "images") {
                const user = req.body.login

 
                    if (!fs.existsSync(`uploads/reviews/${user}`)) {
                        return fs.mkdirSync(`uploads/reviews/${user}`)
                    }
               
                cb(null, `uploads/reviews/${user}`)
            }

        },
        filename: (req, file, cb) =>{
            cb(null, Date.now() + file.originalname);
        }
    });

exports.upload = multer({storage:storageConfig})