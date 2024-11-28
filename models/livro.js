const mongoose = require('mongoose');

const livroSchema = new mongoose.Schema({
    isbn10:{
        type: String,
        unique: true
    },
    isbn13: {
        type: Number,
        unique: true
    },
    indicar:{
        type: Boolean,
        required: true
    },
     
    avaliacao:  {
        type: Number,
        required: true,
        max: 5
    },
    comentario:  {
        type: String,
        required: true,
    },
})

const Livro = mongoose.model("Livro", livroSchema); 

module.exports = Livro;