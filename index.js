const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const bodyParse = require("body-parser");
const mult=require("multer");
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


function arrErr(prop,type){
  return new Error(`${prop} is not an array of ${type}s or null`);
}
function err(prop,type){
  return new Error(`${prop} is not a ${type} or null`);
}
function matchTypeOrnull(prop,type){
  if(typeof prop===type||prop===null){
    return true;
}else{
  return false;
}
}
function matchArrTypeOrnull(prop,type){
  if(Array.isArray(prop)){
    if(prop.every((val)=>typeof val===type)){
      return true;
    }else{
      return false;
    }
  }else if(prop===null){
    return true;
  }else{
    return false;
  }
}
 function makeCategoryObj(slug,locale,media,settings,locks,parent_id,ancestor_ids,product,path,is_indexed,published_at,created_at,updated_at){
  let category={};
    if (matchTypeOrnull(slug,"string")){
      category.slug=slug
    } else{
      throw err(slug,"string")
    }
    if(Array.isArray(locale)){
       if(locale.every((val)=>val instanceof Locale)){
       category.locale=locale;
       }else{
         throw err(locale,"Locale")
       }
    }else{
       throw arrErr(locale,locale.constructor.name)
     }
    if(media instanceof Media){
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
    if(matchTypeOrnull(parent_id,"string")){
      category.parent_id=parent_id
    }else{
      throw err(parent_id,"string")
    }
    if(matchArrTypeOrnull(ancestor_ids,"string")){
      category.ancestor_ids=ancestor_ids
    }else{
      throw arrErr(ancestor_ids,"string");
    }
    if(matchTypeOrnull(product,"string")){
      category.product=product
    }else{
      throw err(product,"string");
    }
    if(matchTypeOrnull(path,"string")){
      category.path=path
    }else{
      throw err(path,"string");
    }
    if(matchTypeOrnull(is_indexed,"boolean")){
      category.is_indexed=is_indexed;
    }else{
      throw err(is_indexed,"boolean")
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
function makeSettingsObj(is_premium,excluded_domains,excluded_countries_iso,excluded_network_endpoints,age_rating){
  let settings={};
  if(typeof is_premium==="boolean"){
    settings.is_premium=is_premium;
  }else{
    throw new Error("is_premium is not boolean")
  }
  if(Array.isArray(excluded_domains)){
    if(excluded_domains.every((domain)=>typeof domain==="string")){
      settings.excluded_domains=excluded_domains;
    }else{
      throw new Error("excluded_domains is not an array of strings");
    }
  }else if(excluded_domains===null){
    settings.excluded_domains=excluded_domains;
  }else{
    throw new Error("excluded_domains is not an array of strings or null");
  }
  if(Array.isArray(excluded_countries_iso)){
    if(excluded_countries_iso.every((iso)=>typeof iso==="string")){
      settings.excluded_countries_iso=excluded_countries_iso;
    }else{
      throw new Error("excluded_countries_iso is not an array of strings");
    }
  }else if(excluded_domains===null){
    settings.excluded_countries_iso=excluded_countries_iso;
  }else{
    throw new Error("excluded_countries is not an array of strings or null");
  }
  if(Array.isArray(excluded_network_endpoints)){
    if(excluded_network_endpoints.every((domain)=>typeof domain==="number")){
      settings.excluded_network_endpoints=excluded_network_endpoints;
    }else{
      throw new Error("excluded_domains is not an array of numbers");
    }
  }else if(excluded_network_endpoints===null){
    settings.excluded_network_endpoints=excluded_network_endpoints;
  }else{
    throw new Error("excluded_network_endpoints is not an array of numbers or null");
  }
  if(typeof age_rating==="string"||age_rating===null){
    settings.age_rating=age_rating;
  }else{
    throw err(age_rating,"string");
  }
  return settings;
}
function makeMediaObj(icon,portrait,landscape,square){
  let media={}

  if(matchTypeOrnull(icon,"string")){
    media.icon=icon
  }else{
    throw new Error("icon is not a string or null");
  }
  if(matchArrTypeOrnull(portrait,"string")){
    media.portrait=portrait
  }else{
    throw err(portrait,"string")
  }
  if(matchArrTypeOrnull(landscape,"string")){
    media.landscape=landscape;
  }else{
    throw arrErr(landscape,"string")
  }
  if(matchArrTypeOrnull(square,"string")){
    media.square=square;
  }else{
    throw arrErr(square,"string")
  }
  return media;
}
function makeLocaleObj(language_iso,title,seo_title,summary,seo_summary,description,seo_description,specify_seo_values){
  let locale={}
  if(typeof language_iso==="string"){
    locale.language_iso=language_iso;
  }else{
    throw err(language_iso,"string")
  }
  if(typeof title==="string"){
    locale.title=title;
  }else{
    throw err(title,"string");
  }
  if(matchTypeOrnull(seo_title,"string")){
    locale.seo_title=seo_title;
  }else{
    throw err(seo_title,"string");
  }
  if(typeof summary==="string"){
    locale.summary=summary;
  }else{
    throw err(summary,"string");
  }
  if(matchTypeOrnull(seo_summary,"string")){
    locale.seo_summary=seo_summary;
  }else{
    throw err(seo_summary,"string");
  }
  if(typeof description==="string"){
    locale.description=description;
  }else{
    throw err(description,"string");
  }
  if(matchTypeOrnull(seo_description,"string")){
    locale.seo_description=seo_description;
  }else{
    throw err(seo_description,"string");
  }
  if(typeof specify_seo_values==="boolean"){
    locale.specify_seo_values=specify_seo_values;
  }else{
    throw err(specify_seo_values,"boolean");
  }
  return locale;
}
function makeLocksObj(is_locked_for_editing,current_editor,is_locked_for_moderation_process,is_locked_for_backend_process,current_backend_process){
  let locks={};
  if(matchTypeOrnull(is_locked_for_editing,"string")){
    locks.is_locked_for_editing=is_locked_for_editing;
  }else{
    throw err(is_locked_for_editing,"string");
  }
  if(matchTypeOrnull(current_editor,"string")){
    locks.current_editor=current_editor;
  }else{
    throw err(current_editor,"string");
  }
  if(matchTypeOrnull(is_locked_for_moderation_process,"string")){
    locks.is_locked_for_moderation_process=is_locked_for_moderation_process;
  }else{
    throw err(is_locked_for_moderation_process,"string")
  }
  if(matchTypeOrnull(is_locked_for_backend_process,"string")){
    locks.is_locked_for_backend_process=is=is_locked_for_backend_process;
  }else{
    throw err(is_locked_for_backend_process,"string")
  }
  if(matchTypeOrnull(current_backend_process,"string")){
    locks.current_backend_process=current_backend_process;
  }else{
    throw err(current_backend_process,"string")
  }
  return locks;
}

module.exports={
  makeCategoryObj,
  makeSettingsObj,
  makeMediaObj,
  makeLocaleObj,
  makeLocksObj,
  Locks,Locale,Media,Settings
}


//server code
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended:true}));
app.use(mult().array())
app.use(cors());
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
//create a category
app.post("/api/create",(req,res)=>{
  const {slug,locale=[],media=new Media(),settings=new Settings(),locks=new Locks(),parent_id=null,ancestor_ids=null,product=null,path=null,is_indexed,published_at=null,created_at=null,updated_at=null}=req.body;
Category.create(makeCategoryObj(slug,locale,media,settings,locks,parent_id,ancestor_ids,
  product,path,is_indexed==="true"?true:false,published_at,created_at,updated_at),(err,result)=>{
    if(err){
      throw err;
    }
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
