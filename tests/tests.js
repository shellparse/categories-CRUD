const index=require("../index.js");
const chai = require("chai");
const expect = chai.expect;


describe("Test1",()=>{
    describe("created a category",()=>{
        it("category should be created successfully",()=>{
            expect(index.createCat("games").to.equal({category:"games"}))
        })
    })
})
