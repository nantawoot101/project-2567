const db = require('../models/db'); 

exports.getAllComment = async (req , res , next) => {
    try{
        const comment = await db.comment.findMany();
        res.json(comment);
    }catch(err){
        next(err);
    }
}

exports.getByIdComment = async (req , res , next) => {
    const {id_comment} = req.params;
    try{
        const comment = await db.comment.findUnique({
            where: {
                id_comment: parseInt(id_comment)  // Convert to Int if necessary
            }
        });
        res.json(comment);
    }catch(err)
    {
        next(err)
    }
}