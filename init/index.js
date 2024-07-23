const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing =  require('../models/listing.js');

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main().then(()=>{
    console.log('connected to db');
})
.catch((err)=>{
    console.error(err);
})

const initDB = async ()=>{
    await Listing.deleteMany({});  //cleaning previously saved data
    initData.data = initData.data.map((obj) => ({...obj, owner: "66825874d5b577250df983ce"})); //inserting owner property
    await Listing.insertMany(initData.data);   //initializing data
    console.log("data was initialized");
};

initDB();