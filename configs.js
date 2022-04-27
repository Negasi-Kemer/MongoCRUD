/**
 *  Exports environtmental varibales
 */

// Require dotenv -  loads environment variables from a .env file into process.env.
const dotEnv = require("dotenv");

// Load config.env 
dotEnv.config({path:"config.env"});

// Export environmental varibales
module.exports = {
    env: process.env.NODE_ENV,
    db: {
        remote: process.env.DB_REMOTE,
        local: ""
    }
}