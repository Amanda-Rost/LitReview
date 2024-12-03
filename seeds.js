const mongoose = require('mongoose');
const Livro = require('./models/livro')
const Usuario = require('./models/usuario')
const Avaliacao = require('./models/avaliacao');

mongoose.connect('mongodb://localhost:27017/livrosdb', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log(`Conexão estabelecida`)
})
.catch(err => {
    console.log(`Erro ao conectar com o banco de dados ... ${err}`);
})

const usuario1 = new Usuario({
    nome:  "Amanda Rost",
    dataNasc:'2006/01/02',
    email:'amanda@gmail.com',
    senha:'12345', 
})

const usuario2 = new Usuario({
    nome:  "Arthur da Costa",
    dataNasc:'2004/01/01',
    email:'arthurdacosta@gmail.com',
    senha:'arthur', 
})

Usuario.insertMany([usuario1, usuario2])
.then(res => {
    console.log(res);
})
.catch(e => {
    console.log(`Não salvo no banco... ${e}`);
})

const livro1 = new  Livro({
    titulo: 'Harry Potter e a pedra filosofal',
    autores:'J. K.',
    emailUsuario: usuario1.email,
    isbn10:'0054506967X',
    isbn13:'9780545069670',
    resumo: 'Rescued from the outrageous neglect of his aunt and uncle, a young boy with a great destiny proves his worth while attending Hogwarts School for Wizards and Witches. 180,000 first printing.',
    genero: 'Juvenile Fiction',
    capalink: 'http://books.google.com/books/content?id=gW36ngEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api'
})

Livro.insertMany([livro1])
.then(res => {
    console.log(res);
})
.catch(e => {
    console.log(`Não salvo no banco... ${e}`);
})

const avaliacao1 = new  Avaliacao({
    email:"amanda@gmail.com",
    titulo:"Harry Potter e a pedra filosofal",
    isbn:'9780545069670',
    recomenda:true,
    comentario: "É um ótimo livro pra quando você quer sair da sua realidade!"
})

Avaliacao.insertMany([avaliacao1])
.then(res => {
    console.log(res);
})
.catch(e => {
    console.log(`Não salvo no banco... ${e}`);
})
