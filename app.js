// Require express
const express = require("express");

// Create expressa app
const app = express();

// Port
const port = process.env.port || 3000;

// Require Http
const http = require("http");

// Require configs.env
const configs = require("./configs");

// Require mongoose
const mongoose = require("mongoose");

// Connect to database
mongoose.connect(configs.db.remote)
.then((conn)=>{
    console.log("DB Connected Successfully");
}).catch((err)=>{
    console.log(`Failed to connect due to ${err}`);
})

// Use JSON parser
app.use(express.json());

// Require routes
const router = require("./keep_notes/routes");

// Use routes
app.use("/api/v1/keepnotes/", router);


// Listen
const server = http.createServer(app);
server.listen(port, ()=>{
    console.log(`Server listening on port: ${port}`);
})