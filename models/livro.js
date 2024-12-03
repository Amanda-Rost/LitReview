const mongoose = require('mongoose');

const livroSchema = new mongoose.Schema({
    titulo: {
        type: String,
        require: true
    },
    autores:{
        type: String,
        require: true
    },
    emailUsuario:{
        type: String,
        require: true
    },
     isbn10:{
        type: String,
        unique: true
    },
    isbn13: {
        type: String,
        unique: true
    },
    resumo: {
        type: String,
        require: true
    },
    genero: {
        type: String,
        require: true
    },
    capalink: {
        type: String,
    }
})

const Livro = mongoose.model("Livro", livroSchema); 

module.exports = Livro;