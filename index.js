//import the express module and then we store the express app object in an app variable.
const express = require("express");
//  Node.js module for handling and transforming file paths.
const path = require("path");

const dotenv = require("dotenv");
dotenv.config();

//Classes from the MongoDB library. MongoClient is used to connect to MongoDB, and ObjectId is used to handle MongoDB document IDs.
const { MongoClient, ObjectId } = require("mongodb");

// "app" is used to call various routing calls and server listening
const app = express();

const mongoURI = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPWD}@${process.env.DBHOST}`;

const client = new MongoClient(mongoURI);

// Sets the port to either an environment variable or 8888.
const port = process.env.port || "8888";

// The app.set() function in Express is used to set various settings for your Express application.
// Purpose: Sets the directory where the view templates (like Pug, EJS, etc.) are located.
// Usage: When rendering a view, Express looks in this directory for the template files
app.set("views" , path.join(__dirname, "views"));

//Purpose: Specifies the template engine to use (in this case, Pug).
// Usage: Allows you to render templates without specifying the file extension
app.set("view engine","pug");

//Serves static files from the public directory.
app.use(express.static(path.join(__dirname, "public")));

//convert query string format in form data to JSON format
//Parses URL-encoded data (form submissions).
app.use(express.urlencoded({ extended: true })); 

// Parses JSON data in requests.
app.use(express.json());



//SETUP ROUTES
// home route setup
//app.get("/"): This defines a route handler for GET requests to the root URL (/) of the application.
// app: This is the Express application instance.
// get("/"): This method registers a route handler for HTTP GET requests to the specified path (/).
// async (request, response) => { ... }: This is an asynchronous arrow function that will handle incoming requests to this route.
// request: Represents the incoming request from the client.
// response: Represents the outgoing response that will be sent back to the client.
app.get("/", async (request, response) => {

    //fetching data from mongodb
    response.render("index", { title: "Home" });
});


app.get("/about", async (request, response) => {

    //fetching data from mongodb
    response.render("about", { title: "About" });
});


app.get("/catalogue", async (request, response) => {
    let items = await showItems();
    //fetching data from mongodb
    response.render("catalogue", { title: "Catalogue" , items:items });
});


app.get("/catalogue/add", async (request, response) => {
    
    let items = await showItems();
    //fetching data from mongodb
    response.render("add-item", { title: "Add Flower" ,items:items});
});

app.post("/catalogue/add/submit", async (request, response) => {
    let name = request.body.itemName;
    let price = request.body.itemPrice;
    let desc = request.body.itemDesc;
    let img = request.body.itemImage;

    let item = {
        itemName: name,
        itemPrice: price,
        itemDesc: desc,
        itemImg: img
    };

    await addItem(item);
    response.redirect("/catalogue");
    
});





//setup server listening
app.listen(port, () => {
  console.log(`listening to http://localhost:${port}`);
});



//Functions
async function conn() {
    db = client.db("floristshop");
    return db;
}

async function showItems() {
    db = await conn();
    let results = db.collection("items").find({});
    console.log(results);
    return await results.toArray();

}

async function addItem(item) {
    db = await conn();
    let flower = await db.collection("items").insertOne(item);
    console.log(flower);
}


//all images are taken from unsplash