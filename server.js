/*********************************************************************************
 *  BTI425 – Assignment 1** 
 * I declare that this assignment is my own work in accordance with Seneca's* Academic Integrity Policy:
 * ** https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html** 
 * Name: ______Riya________________
 *  Student ID: ___170900211___________
 *  Date: _____1/19/2024_________**
 *  Published URL: ___________________________________________________________
 * *********************************************************************************/


const express=require("express");
const app = express();
app.use(express.json());
const mongoose = require('mongoose');

const HTTP_PORT= process.env.PORT || 8080;
const cors = require('cors');
app.use(cors());

require('dotenv').config();
const ListingsDB = require("./modules/listingsDB.js"); 
const db = new ListingsDB();

app.get("/", (req,res)=>{
    res.send("API Listing");
});


// Add the listing                                              DONE
app.post("/api/listings", async(req, res)=>{
   try{
   let newListing = await db.addNewListing(req.body);
    res.status(201).send({message: "Listing is added"});
    /*res.send(newListing)*/
    }
    catch(err){
        res.status(500).send("Internal Server Error");
    }
})

// Get a Specific Listing with the help of the id                   DONE
app.get("/api/listings/:id", async(req, res)=>{
    try{
        let listing=await db.getListingById(req.params.id);
        res.send(listing);
    }
    catch(err)
    {
        res.status(404).send({message: err});
    }
})

// Get                                                               Done
app.get("/api/listings", async (req, res) => {   
    try {
     
      const page = parseInt(req.query.page, 10);
      const perPage = parseInt(req.query.perPage, 10);
      const name = req.query.name || '';
  
   
      if (isNaN(page) || isNaN(perPage) || page <= 0 || perPage <= 0) {
        return res.status(400).json({ error: 'Invalid page or perPage values' });
      }
  
      // Call the getAllListings method from your ListingsDB module
      const listings = await db.getAllListings(page, perPage, name);
  
      // Respond with the retrieved listings
      res.json(listings);
    } catch (err) {
      res.status(500).send({message: err});
    }
  });

// Update the listing by ID                                              Done
app.put("/api/listings/:id",async(req, res)=>{
    try{
        let listing= await db.updateListingById( req.body,req.params.id);
        res.send("Success");
    }
    catch(err)
    {
        res.status(404).send("Failed");
    }
})

// Delete the listing by ID                                                 Done
app.delete("/api/listings/:id",async(req, res)=> {
    try{
        await db.deleteListingById(req.params.id);
        res.send("Deleted successful");
    }
    catch(err)
    {
        res.status(204).send("Failed");
    }
})


/*
app.listen(HTTP_PORT, ()=> {
    console.log(`server listening on: ${HTTP_PORT}`);
});*/

db.initialize(process.env.MONGODB_CONN_STRING).then(() => { 
    app.listen(HTTP_PORT, () => {
         console.log(`server listening on: ${HTTP_PORT}`);
     });
    }).catch((err) => {
     console.log(err); 
 });

 