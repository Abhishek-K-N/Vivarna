const mongoose=require("mongoose");
const answerSchema=new mongoose.Schema(
    {
        answer: String,
        // date: Date,
        likes: Number
    }
);

module.exports=mongoose.model("Answer", answerSchema);