const mongoose= require('mongoose');

const connect = async()=>{
    await mongoose.connect("mongodb+srv://admin:KYKgMKI8hEmTbKNo@cluster0.0fq8njz.mongodb.net/chat-app?retryWrites=true&w=majority");
   
}
mongoose.set('strictQuery', true);
module.exports=connect;