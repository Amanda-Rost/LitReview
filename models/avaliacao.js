const mongoose = require('mongoose');

const avaliacaoSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    titulo:{
        type: String,
        require: true
    },
    isbn:{
        type: String,
        require: true
    },
    recomenda:{
        type: Boolean,
        require: true
    },
    comentario: {
        type: String,
        
    },
})

const Avaliacao = mongoose.model("Avaliacao", avaliacaoSchema); 

module.exports = Avaliacao;