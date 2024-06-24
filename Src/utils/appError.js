class ApiError extends Error{
    constructor(
        statuscode, 
        message= "Somthing went wrong",
        Error = [],
        statck = ""
    ){
        super(message)
        this.statuscode = statuscode;
        this.data = null;
        this.message= message;
        this.success = false;
        this.Error = Error > 400;

        if(statck){
            this.statck = statck;
        }
        else{
            Error.captureStackTrace(this, this.constructor);

        }
    }
}

export {ApiError}