// Require mongoose
const mongoose = require("mongoose");

// Create notes schema
const noteSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    done: {
        type: Boolean,
        required: true
    }
});

// Export the model
module.exports = mongoose.model('KemerNotes', noteSchema);