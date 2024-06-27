import { v2 } from 'cloudinary';
import FileSystem from fs;


    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: CLOUDINARY_API_SECRET
    });

    const uploadonCloud = async (FilePath)=>{
        try{
            if(!FilePath) return "Fill Path is Invaild"
            const response = await cloudinary.uploader.upload(FilePath,{
                response_type : "auto"
            });
            console.log("file is Uploaded", response.url)
            return response;
        }
        catch(error){
            fs.unlinksync(FilePath)
            return "file is Removed"
        }

    }

export {uploadonCloud}