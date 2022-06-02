const index= require("../index");
const  expect = require("chai").expect;


describe("Unit tests",function(){
    describe("created a category",function(){
        it("category should be created successfully",async function(){
        let result = await index();
        expect(typeof result).to.equal("object");
        })
    })
})
