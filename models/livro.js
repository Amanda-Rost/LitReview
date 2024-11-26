const mongoose = require('mongoose');

const livroSchema = new mongoose.Schema({
    capa: String, 
    titulo: {
        type: String,
        required: true,
    } ,
    genero1:  {
        type: String,
        required: true,
    },
    genero2:  {
        type: String,
        required: true,
    },
    genero3: String,
    resumo:{
        type: String,
        required: true,
    } 
})

const Livro = mongoose.model("Livro", livroSchema); 

module.exports = Livro;