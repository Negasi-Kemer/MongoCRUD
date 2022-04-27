// Require express
const express = require("express");
const { all } = require("express/lib/application");
const res = require("express/lib/response");

// Create express app
const app = express();

// Call the model
const Note = require("./model");

// Require file system module
const fs = require("fs");

// Path
const path = require("path");

// Prepare path for various types of OS
const filePath = path.join(process.cwd(), "data/notes.json");

// Read file
const allNotes = JSON.parse(fs.readFileSync(filePath, "utf-8"));

// Create note on mongo
exports.createNoteOnMongo = (req, res, next)=>{
    const notes = new Note({
        id: req.body.id,
        title: req.body.title,
        done: req.body.done,
    });

    notes.save()
            .then(data => {
                res.status(200).json(data);
            })
            .catch(err=>{
                res.status(400).json({
                    message: err
                })
            });
}

// Get all notes from mongo
exports.getAllNotesFromMongo = async (req, res, next) => {
    try {
        const allNotesOnMongo = await Note.find();
        res.json(allNotesOnMongo);
    } catch (error) {
        res.json({message: error});
    }
}

// Get note by Id from mongo
exports.getNoteByIdFromMongo = async (req, res, next) => {
    try {
        const noteById = await Note.findById(req.params.id);
          res.json(noteById);
    } catch (error) {
        res.json({message: error});
    }
}

// Delete note from mongo
exports.deleteNoteFromMongo = async (req, res)=>{
    try {
        const deletedNote = await Note.remove({_id: req.params.id});
        res.json(deletedNote);
    } catch (error) {
        res.json({message: error});
    }
}

// Update note from mongo
exports.updateNoteFromMongo = async (req, res, next) => {
    try {
        const updatedNote = await Note.updateOne({_id: req.params.id}, {$set:{title: req.body.title}});
        res.json(updatedNote);
    } catch (error) {
        res.json({message: error})
    }
}
// Get all notes 
exports.getAllNotes = (req, res)=>{
    res.status(200).json({
        data:{
            allNotes
        }
    })
}

// Get note by id
exports.getNoteById = (req, res)=>{
    const noteById = allNotes.filter((el)=>el.id==req.params.id);
    if(Object.keys(noteById).length ==0 ){
        res.status(200).json({
            message: "Oops, result not found"
        })
    }else{
        res.status(200).json({
            message: "Note found",
            data:{
                noteById
            }
        })
    }
}

// Update note
exports.updateNote = (req, res)=>{
    const selectedNote = allNotes.filter((el)=>el.id == req.params.id);
    const {title, done} = req.body;

    // Check if both "title" and "done" are not null at the same
    if(!title && !done){
        return res.status(400).json({
            message: "All fileds cannot be empty"
        })
    }
    // Check if there is no any note
    else if(Object.keys(selectedNote).length ==0){
        return res.status(400).json({
            message: "Note with the specified id not found"
        })
    }
    // Edit only "done" when "title" is not in the body
    else if(!title && done){
        selectedNote[0].done = done;
    }
    // Edit only "title" when "done" is not in the body
    else if(title && !done){
        selectedNote[0].title = title;
    }
    // Edit both "title" and "done" when both are given in the body
    else{
         selectedNote[0].title = title;
         selectedNote[0].done = done;
    }
    // Replace old values
    allNotes.indexOf(selectedNote[0].id);
    // Overwrite the old file
    fs.writeFileSync(filePath, JSON.stringify(allNotes)); 
    res.status(200).json({
        message: "Updated successfully",
        data:{
            allNotes
        }
    })
}

// Delete
exports.deleteNote = (req, res)=>{
    const selectedNote = allNotes.filter((el)=> el.id == req.params.id);
    if(Object.keys(selectedNote).length ==0){
        res.status(400).json({
            message: "Note is not found"
        });
    }else{
        // Delete the item
        allNotes.splice(allNotes.indexOf(selectedNote[0]));
        // Overwrite the json file
        fs.writeFileSync(filePath, JSON.stringify(allNotes));
        res.status(200).json({
            message: "Note deleted",
            data: {
                allNotes
            }
        })
    }

}

// Validate/check content
exports.checkBody = (req, res, next)=>{
    const body = req.body;
    if(!body.title || !body.done || !body.id){
        return res.status(400).json({
            message: "Title and Done are required"
        });
    }else{
        next();
    }
}

// Create note
exports.createNote = (req, res)=>{
    const note = req.body;

    // Push to "allNotes"
    allNotes.push(note);
    fs.writeFileSync(filePath, JSON.stringify(allNotes)); // Write to the JSON file
    res.status(200).json({
        message: "Note created",
        data:{
            allNotes
        }    });
}
