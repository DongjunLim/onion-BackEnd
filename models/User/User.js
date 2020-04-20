var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// let db = mongoose.connection;
// const DB_options = {
//     autoIndex: false, // Don't build indexes
//     reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
//     reconnectInterval: 500 , // Reconnect every 500ms
//     poolSize: 10 , // Maintain up to 10 socket connections
//     // If not connected, return errors immediately rather than waiting for reconnect
//     bufferMaxEntries: 0
// }


// console.log(123)
// console.log(mongoose.connection.readyState)
// console.log(456)
var USER_AUTH_INFO_Schema = new Schema(
  {
    user_email: String,
    user_nickname: String,
   user_password: String,
   user_status: { type: String, enum: ['Y', 'N', 'D'], default: 'Y'},
   user_cert: { type: String, enum: ['Y', 'N'], default: 'N'},
   user_auth: { type: String, enum: ['U', 'A', 'B'], default: 'U'},
   created_at: { type: Date, default: Date.now },
   updated_at: { type: Date, default: Date.now },
   deleted_at: Date
  },
  { collection: 'USER_AUTH_INFO', versionKey: "__v" }
);

module.exports = mongoose.model("default_collection", USER_AUTH_INFO_Schema);