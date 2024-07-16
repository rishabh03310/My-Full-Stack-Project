import multer from "multer";


let storage = multer.diskStorage({
    destination: function(req, res, callback){
        callback(null, '/temp')
    },
    filename: function(req, File, callback){
        callback(null, File.originalname)
    }
})

export let upload = multer({
    storage: storage,
})