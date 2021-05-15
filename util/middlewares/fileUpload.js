const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        
        console.log("multer file  ", file )
        console.log("multer req.body ", req.body)
        const {userId} = req.body;
        const dir = `./public/upload/${userId}`;

        console.log("userId: " + userId)
        if( !fs.existsSync (dir)){
            return fs.mkdir(dir, error => cb(error, dir))            
        }
        return cb(null, dir)
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop()
        cb(null, `${file.originalname.replace(ext,"")}${Math.floor(Math.random()*1000000000)}.${ext}`)
    }
})



module.exports = {upload: multer({
    storage: storage,
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