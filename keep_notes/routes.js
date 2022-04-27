// Require express
const express = require("express");

// Call router method
const route = express.Router();    

// Require controller
const controller = require("./controller")

// Create APIs
route.post("/", controller.checkBody, controller.createNoteOnMongo);

// Get all notes
route.get("/", controller.getAllNotesFromMongo);

// Get note by id
route.get("/:id", controller.getNoteByIdFromMongo);

// Update note
route.patch("/:id", controller.updateNoteFromMongo);

// Delete route
route.delete("/:id", controller.deleteNoteFromMongo);

// Export routes
module.exports = route;

