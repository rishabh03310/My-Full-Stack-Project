import multer from "multer";

const storage= multer.diskStorage({
    destination: function(req, res, callback){
        callback(null, "/temp");
    },
    filename: function(req, res , callback){
        callback(null, file.originalname);
    }
})

export const upload = multer({
    storage: storage,
})