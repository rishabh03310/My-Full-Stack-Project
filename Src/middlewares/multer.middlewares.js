import multer from "multer";


const storage = multer.diskStorage({
    destination: function(req, res, callback){
        callback(null, '/Temp')
    },
    filename: function(req, File, callback){
        callback(null, File.originalname)
    }
})

export const upload = multer({
    storage: storage,
})