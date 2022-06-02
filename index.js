const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const bodyParse = require("body-parser");
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)
.then((result)=>{console.log(result.connections[0].name)},(rejected)=>{console.log(rejected)});


const settingsSchema = new mongoose.Schema({
  is_premium:{type:Boolean},
  excluded_domains:[{type:String}],
  excluded_countries_iso:[{type:String}],
  excluded_network_endpoints:[{type:Number}],
  age_rating:{type:String}
});
const Settings = mongoose.model("Settings",settingsSchema);
const mediaSchema = new mongoose.Schema({
  icon:{type:String},
  portrait:[{type:String}],
  landscape:[{type:String}],
  square:[{type:String}]
});
const Media = mongoose.model("Media",mediaSchema);
const LocaleSchema = new mongoose.Schema({
  language_iso:{type:String},
  title:{type:String},
  seo_title:{type:String},
  summary:{type:String},
  seo_summary:{type:String},
  description:{type:String},
  seo_description:{type:String},
  specify_seo_values:{type:Boolean}
});
const Locale = mongoose.model("Locale",LocaleSchema);
const locksSchema = new mongoose.Schema({
  is_locked_for_editing:{type:String},
  current_editor:{type:String},
  is_locked_for_moderation_process:{type:String},
  is_locked_for_backend_process:{type:String},
  current_backend_process:{type:String}
})
const Locks = mongoose.model("Locks",locksSchema);

const categorySchema = new mongoose.Schema({
slug:{type:String,unique:true, required:true,dropDups:true},
locale:[{type:mongoose.Schema.Types.ObjectId,ref:"Locale"}],
media:{type:mediaSchema},
settings:{type:settingsSchema},
locks:{type:locksSchema},
parent_id:{type:String},
ancestor_id:[{type:String}],
product:{type:String},
path:{type:String},
is_indexed:{type:Boolean},
published_at:{type:Date},
created_at:{type:Date},
updated_at:{type:Date}
});
const Category = mongoose.model("Category",categorySchema);


module.exports = async function createCategory(){
  return await Category.create({
    slug:"games",
    locale:await Locale.create({language_iso:"en",title:"new title"}).then((locale)=>locale._id),
    media:await Media.create({icon:"favico"}),
    settings:await Settings.create({is_premium:true,excluded_domains:["string1","string2"]}),
    locks:await Locks.create({is_locked_for_editing:true}),
    parent_id:null,
    ancestor_id:null,
    product:null,
    path:null,
    is_indexed:true,
    published_at:null,
    created_at:null,
    updated_at:null
  }).catch((err=>{throw err}));
}


//first step to create a test is to detrmine what you want to do






const userSchema = new mongoose.Schema({username:String,exercise:[{type:mongoose.Schema.Types.ObjectId,ref:"Exercise"}]});
const User = mongoose.model("User",userSchema);
const exerciseSchema = new mongoose.Schema({username:String,description:String,duration:Number,date:String,user_id:{type:mongoose.Schema.Types.ObjectId,ref:"User"}});
const Exercise = mongoose.model("Exercise",exerciseSchema);


app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended:true}));
app.use(cors());
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.post("/api/users",(req,res)=>{
User.create({username:req.body.username},(err,result)=>{
  res.json(result);
})
})
async function getAllUsers(){
   return await User.find();
}
app.get("/api/users",(req,res)=>{
  getAllUsers().then((result)=>{res.json(result)})
})
async function createEx(result,req){
  console.log(result)
  let waiting = await Exercise.create({username:result.username,description:req.body.description,duration:req.body.duration,date:req.body.date?new Date(req.body.date).toDateString():new Date().toDateString(),user_id:result._id})
      .catch((err)=>console.log(err));
      return waiting;
}
app.post("/api/users/:_id/exercises",(req,res)=>{
  User.findById(req.params._id,(err,result)=>{if(err)console.error(err)
    else{
      console.log(result);
      createEx(result,req).then(result2=>{
        result.exercise.push(result2);
        result.save();
        res.json({_id:result._id,username:result.username,date:result2.date,duration:result2.duration,description:result2.description,});
      }); 
    }
    }
  )//end of find
});
app.get("/api/users/:id/logs/",(req,res)=>{
  let dateRegex= /^(19|20)\d\d[-\.](0[1-9]|1[012])[-\.](0[1-9]|[12][0-9]|3[01])$/;
  User.findById(req.params.id).populate("exercise").then((pop)=>{
    let filterdEx;
    if(dateRegex.test(req.query.from)&&dateRegex.test(req.query.to)){
      filterdEx=pop.exercise.filter((obj)=>{
       return new Date(obj.date)>new Date(req.query.from)&&new Date(obj.date)<new Date(req.query.to)
     });
     if(Number.isInteger(parseInt(req.query.limit))){
      filterdEx=filterdEx.slice(0,Number.parseInt(req.query.limit))
      res.json({username:pop.username,count:pop.exercise.length,_id:pop._id,log:filterdEx})
     }else{res.json({username:pop.username,count:filterdEx.length,_id:pop._id,log:filterdEx})}    
    }
    else{
      if(Number.isInteger(parseInt(req.query.limit))){
        filterdEx=pop.exercise.slice(0,Number.parseInt(req.query.limit))
        res.json({username:pop.username,count:pop.exercise.length,_id:pop._id,log:filterdEx})
       }else{
    res.json({username:pop.username,count:pop.exercise.length,_id:pop._id,log:pop.exercise})
        } }
  }).catch((err)=>console.error(err))
})
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
