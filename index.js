const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const bodyParse = require("body-parser");
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)
.then((result)=>{console.log(result.connections[0].name)},(rejected)=>{console.log(rejected)});


const settingsSchema = new mongoose.Schema({
  is_premium:{type:Boolean,required:true},
  excluded_domains:[{type:[String,null],default:null}],
  excluded_countries_iso:[{type:[String,null],default:null}],
  excluded_network_endpoints:[{type:[Number,null],default:null}],
  age_rating:{type:String,required:true}
});
const Settings = mongoose.model("Settings",settingsSchema);
const mediaSchema = new mongoose.Schema({
  icon:{type:[String,null],default:null},
  portrait:[{type:[String,null],default:null}],
  landscape:[{type:[String,null],default:null}],
  square:[{type:[String,null],default:null}]
});
const Media = mongoose.model("Media",mediaSchema);
const LocaleSchema = new mongoose.Schema({
  language_iso:{type:String,required:true},
  title:{type:String,required:true},
  seo_title:{type:[String,null],default:null},
  summary:{type:[String],required:true},
  seo_summary:{type:[String,null],default:null},
  description:{type:[String],required:true},
  seo_description:{type:[String,null],default:null},
  specify_seo_values:{type:Boolean,required:true}
});
const Locale = mongoose.model("Locale",LocaleSchema);
const locksSchema = new mongoose.Schema({
  is_locked_for_editing:{type:[String,null],default:null},
  current_editor:{type:[String,null],default:null},
  is_locked_for_moderation_process:{type:[String,null],default:null},
  is_locked_for_backend_process:{type:[String,null],default:null},
  current_backend_process:{type:[String,null],default:null}
})
const Locks = mongoose.model("Locks",locksSchema);

const categorySchema = new mongoose.Schema({
slug:{type:String,unique:true, required:true,dropDups:true},
locale:[{type:mongoose.Schema.Types.ObjectId,ref:"Locale"}],
media:{type:mediaSchema,required:true},
settings:{type:settingsSchema,required:true},
locks:{type:locksSchema,required:true},
parent_id:{type:[String,null],default:null},
ancestor_ids:[{type:[String,null],default:null}],
product:{type:[String,null],default:null},
path:{type:[String,null],default:null},
is_indexed:{type:Boolean,required:true},
published_at:{type:[Date,null],default:null},
created_at:{type:[Date,null],default:null},
updated_at:{type:[Date,null],default:null}
});
const Category = mongoose.model("Category",categorySchema);


 function makeCategoryObj(slug,locale,media,settings,locks,parent_id,ancestor_ids,product,path,is_indexed,published_at,created_at,updated_at){
  let category={};
    if (typeof slug === "string"){category.slug=slug} else{throw new Error("slug is not a string")}
    if (Array.isArray(locale)){
      if(locale.length===0){
        category.locale=locale
      }else{
        if(locale.filter(value,()=>mongoose.Types.ObjectId.isValid(value)&&typeof value ==="string").length===locale.length){
          category.locale=locale
        }else{
          throw new Error("some of locale values are not a valid objext id")
        }
      }
    }else{throw new Error("locale is not an Array")}
    if (media instanceof Media){
      category.media=media
    }else{
      throw new Error("media is not an instance of Media model")
    }
    if(settings instanceof Settings){
      category.settings=settings
    }else{
      throw new Error("settings is not an instance of Setting model")
    }
    if(locks instanceof Locks){
      category.locks=locks
    }else{
      throw new Error("locks is not an instance of Locks model")
    }
    if(typeof parent_id==="string"||parent_id===null){
      category.parent_id=parent_id
    }else{
      throw new Error("parnet_id is not a string or not null")
    }
    if(Array.isArray(ancestor_ids)){
      if(ancestor_ids.every((id)=>typeof id ==="string")||null)
      category.ancestor_ids=ancestor_ids
    }else{
      throw new Error("ancestor_id is not an array of strings or not null")
    }
    if(typeof product==="string"||product===null){
      category.product=product
    }else{
      throw new Error("product is not a string or not null")
    }
    if(typeof path==="string"||path===null){
      category.path=path
    }else{
      throw new Error("path is not a string or not null")
    }
    if(typeof is_indexed==="boolean"){
      category.is_indexed=is_indexed
    }else{
      throw new Error("is indexed is not boolean")
    }
    if(published_at instanceof Date||published_at===null){
      category.published_at=published_at
    }else{
      throw new Error("published_at is not a date object or null")
    }
    if(created_at instanceof Date||created_at===null){
      category.created_at=created_at
    }else{
      throw new Error("created_at is not a date object or null")
    }
    if(updated_at instanceof Date||updated_at===null){
      category.updated_at=updated_at
    }else{
      throw new Error("updated_at is not a date object or null")
    }
  return category
}
module.exports={
  makeCategoryObj,
  Locale,Media,Settings,Locks
}


// module.exports = async function createCategory(){
//   return await Category.create({
//     slug:"games",
//     locale:await Locale.create({language_iso:"en",title:"new title"}).then((locale)=>locale._id),
//     media:await Media.create({icon:"favico"}),
//     settings:await Settings.create({is_premium:true,excluded_domains:["string1","string2"]}),
//     locks:await Locks.create({is_locked_for_editing:true}),
//     parent_id:null,
//     ancestor_id:null,
//     product:null,
//     path:null,
//     is_indexed:true,
//     published_at:null,
//     created_at:null,
//     updated_at:null
//   }).catch((err=>{throw err}));
// }








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
