const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        
        // console.log("multer file  ", file )
        // console.log("multer req.body ", req.body)
        const {userId} = req.body;
        const dir = `./public/upload/${userId}`;

        console.log("userId: " + userId)
        fs.exists(dir, exist => {
            if (!exist) {
                return fs.mkdir(dir, error => cb(error, dir))
            }
            return cb(null, dir)
        })
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop()
        cb(null, `${file.originalname.replace(ext,"")}${Date.now()}.${ext}`)
    }
})

module.exports = {upload: multer({ 
    storage,
    fileFilter: function (req, file, callback) {
        if (
            (file.mimetype.startsWith('image/') 
            || file.mimetype.startsWith('text/') 
            || file.mimetype.startsWith('application/'))
            && file.originalname.split('.').pop() !== "exe"){
            callback(null,true)
        }else{
            callback(null,false)
        }
    }
 })}