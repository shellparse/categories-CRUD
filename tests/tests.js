const index=require("../index")
const  expect = require("chai").expect;
// to be used across the test for more readability
const itExpectProperty=(beingtested,propString,prop)=>{
    it(propString,function(){
        expect(beingtested).to.have.property(propString, prop);
    })
}

describe("Unit tests",function(){
    describe("#1 createCategoryObj() returning the required object to create category from",function(){
        //set test parameters
        let slug="games";
        let locale=[];
        let media=new index.Media();
        let settings=new index.Settings(index.makeSettingsObj(true,[],[],[],"16"));
        let locks=new index.Locks();
        let parent_id=null;
        let ancestor_ids=[];
        let product=null;
        let path=null;
        let is_indexed=true;
        let published_at=null;
        let created_at=null;
        let updated_at=null;
        let result = index.makeCategoryObj(slug,locale,media,settings,locks,
        parent_id,ancestor_ids,product,path,is_indexed,published_at,created_at,updated_at);
        // test
        itExpectProperty(result,"slug",slug);
        itExpectProperty(result,"locale",locale);
        itExpectProperty(result,"media",media);
        itExpectProperty(result,"settings",settings);
        itExpectProperty(result,"locks",locks);
        itExpectProperty(result,"parent_id",parent_id);
        itExpectProperty(result,"ancestor_ids",ancestor_ids);
        itExpectProperty(result,"product",product);
        itExpectProperty(result,"path",path);
        itExpectProperty(result,"is_indexed",is_indexed);
        itExpectProperty(result,"published_at",published_at);
        itExpectProperty(result,"created_at",created_at);
        itExpectProperty(result,"updated_at",updated_at);     
    })//end of category creation test
    describe("#2 makeSettingsObj() return the required object to create setting from",function(){
        // set test parameters
        let is_premium=true;
        let excluded_domains=[];
        let excluded_countries_iso=[];
        let excluded_network_endpoints=[];
        let age_rating="16";
        let result=index.makeSettingsObj(is_premium,excluded_domains,excluded_countries_iso,excluded_network_endpoints,age_rating);
        // test
        itExpectProperty(result,"is_premium",is_premium);
        itExpectProperty(result,"excluded_domains",excluded_domains);
        itExpectProperty(result,"excluded_countries_iso",excluded_countries_iso);
        itExpectProperty(result,"excluded_network_endpoints",excluded_network_endpoints);
        itExpectProperty(result,"age_rating",age_rating);
    })
    describe("#3 makeMediaObj() return the required object to create media from",function(){
        // set test parameters
        let icon =null;
        let portrait=null;
        let landscape=null;
        let square=null;
        let result=index.makeMediaObj(icon,portrait,landscape,square);
        //test
        itExpectProperty(result,"icon",icon);
        itExpectProperty(result,"portrait",portrait);
        itExpectProperty(result,"landscape",landscape);
        itExpectProperty(result,"square",square);
    })
    describe("#4 makeLocaleObj() return the required object to create locale from",function(){
        // set test parameters
        let language_iso="en";
        let title="locale title";
        let seo_title=null;
        let summary="the summary is short string";
        let seo_summary=null;
        let description="the description";
        let seo_description=null;
        let specify_seo_values=false;
        let result=index.makeLocaleObj(language_iso,title,seo_title,summary,seo_summary,description,seo_description,specify_seo_values);
        //test
        itExpectProperty(result,"language_iso",language_iso);
        itExpectProperty(result,"title",title);
        itExpectProperty(result,"seo_title",seo_title);
        itExpectProperty(result,"summary",summary);
        itExpectProperty(result,"seo_summary",seo_summary);
        itExpectProperty(result,"description",description);
        itExpectProperty(result,"seo_description",seo_description);
        itExpectProperty(result,"specify_seo_values",specify_seo_values);
    })
    describe("#5 makeLocksObj() return the required object to create locks from",function(){
        // set test parameters
        let is_locked_for_editing=null;
        let current_editor=null;
        let is_locked_for_moderation_process=null;
        let is_locked_for_backend_process=null;
        let current_backend_process=null;
        let result=index.makeLocksObj(is_locked_for_editing,current_editor,is_locked_for_moderation_process,is_locked_for_backend_process,current_backend_process);
        //test
        itExpectProperty(result,"is_locked_for_editing",is_locked_for_editing);
        itExpectProperty(result,"current_editor",current_editor);
        itExpectProperty(result,"is_locked_for_moderation_process",is_locked_for_moderation_process);
        itExpectProperty(result,"is_locked_for_backend_process",is_locked_for_backend_process);
        itExpectProperty(result,"current_backend_process",current_backend_process);
    })
})//end of unit test

