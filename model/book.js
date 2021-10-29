const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let book_schema = new Schema({
    title: {type: String,unique: true},
    author: {type: String},
    pages: {type: Number},
    categories: {type: Array},
    summary: {type:String},
    createdAt: {type: Number},
});
module.exports = mongoose.model('Book', book_schema);
