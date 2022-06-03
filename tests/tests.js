const index= require("../index");
const  expect = require("chai").expect;


describe("Unit tests",function(){
    describe("#1 validate category document properties required for creation",function(){
        let slug="games";
        let locale=[];
        let media=new index.Media();
        let settings=new index.Settings();
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
        it("has slug",function(){
            expect(result).to.have.property('slug', "slug");
        })
        it("has locale",function(){
            expect(result).to.have.property('locale', locale);
        })
        it("has media",function(){
            expect(result).to.have.property('media', media,"no media");
        })
        it("has settings",function(){
            expect(result).to.have.property('settings', settings,"no settings");
        })
        it("has settings",function(){
            expect(result).to.have.property('locks', locks,"no locks");
        })
        it("has settings",function(){
            expect(result).to.have.property('parent_id', parent_id,"no parent_id");
        })
        it("has settings",function(){
            expect(result).to.have.property('ancestor_ids', ancestor_ids,"no ancestor_ids");
        })
        it("has settings",function(){
            expect(result).to.have.property('product', product,"no product");
        })
        it("has settings",function(){
            expect(result).to.have.property('path', path,"no path");
        })


            
            
            
            
            expect(result).to.have.property('is_indexed', is_indexed,"no is_indexed");
            expect(result).to.have.property('published_at', published_at,"no published_at");
            expect(result).to.have.property('created_at', created_at,"no created_at");
            expect(result).to.have.property('updated_at', updated_at,"no updated_at");
    })
})

