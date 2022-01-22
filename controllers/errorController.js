const {BadRequest,Unauthorized,Forbidden,RequestTimeout,Gone,InternalServerError} = require("http-errors");

module.exports = {
    NotFoundError : (req,res) => {
        res.status(404).json({
            type : 'NotFoundError',
            errors : [
                {
                    status : 404,
                    message : 'page not found',
                    address : req.url
                }
            ]
        });
    },
    ErrorHandler : (err,req,res,next) => {
        console.error(err.stack)
        
        if(err instanceof BadRequest){
            err.message = 'please put in form';
        }else if(err instanceof Unauthorized){
            err.message = 'please login to view this page';
        }else if(err instanceof Forbidden){
            err.message = 'you cannot access this page';
        }else if(err instanceof RequestTimeout){
            err.message = 'your request is not returned in time';
        }else if(err instanceof Gone){
            err.message = 'your request is not available';
        }else if(err instanceof InternalServerError){
            err.message = 'error has occured in our server'
        }

        if(err.constructor.name === "Result"){ //validationの際のエラーを作成した。ただし、①分岐の方法（nameを用いている点）②errが他のと違うため、err.stackが取れない点などは修正したい（後者はcustomErrorの作成しかないかも）
            const errors = [];
            err.errors.forEach(e => {
                errors.push({
                    params : e.param,
                    value : e.value,
                    message : e.msg
                });
            });

            return res.status(422).json({
                type : 'Validation Error',
                status : 422,
                address : req.url,
                errors : errors
            });
        }

        res.status(err.status||500).json({
            type : err.name,
            errors : [
                {
                    status : err.status,
                    message : err.message,
                    address : req.url,
                }
            ]
        });
    },
}