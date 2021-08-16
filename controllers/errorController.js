module.exports = {
    notFoundError : (req,res) => { //404
        res.status(404);
        res.render("error");
    },
    logError : (err,req,res,next) => { //?
        console.log(err.stack);
        next(err);
    },
    internalServerError : (err,req,res,next) => { //500
        res.status(500).send(err);
    }
}