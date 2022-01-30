const mongoose=require("mongoose");
const answerSchema=new mongoose.Schema(
    {
        answer: String,
        // date: Date,
        likes: Number
    }
);
const questionSchema= new mongoose.Schema(
    {
        title: String,
        body: String,
        tags: String,
        answers:[answerSchema]
    }
);
module.exports=new mongoose.model("Question", questionSchema);