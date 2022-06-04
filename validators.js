const index=require("./index")
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
         if(locale.every((val)=>val instanceof index.Locale)){
         category.locale=locale;
         }else{
           throw err(locale,"Locale")
         }
      }else{
         throw arrErr(locale,locale.constructor.name)
       }
      if(media instanceof index.Media){
        category.media=media
      }else{
        throw new Error("media is not an instance of Media model")
      }
      if(settings instanceof index.Settings){
        category.settings=settings
      }else{
        throw new Error("settings is not an instance of Setting model")
      }
      if(locks instanceof index.Locks){
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
    makeLocksObj
  }
  