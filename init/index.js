const mongoose=require("mongoose");
const initData=require("./data");
const Listing=require("../models/listing");

const MonogoURL="mongodb://127.0.0.1:27017/WanderLust";


main().then(()=>{
    console.log("Connected to db");
})
.catch((err)=>{
    console.log("Eror in connection");
})


async function main(){
    await mongoose.connect(MonogoURL);
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"66b5ed3c1f3c42b2089a0a98"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialised");
}


initDB();






