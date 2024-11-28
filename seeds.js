const mongoose = require('mongoose');
const Livro = require('./models/livro')
const Usuario = require('./models/usuario')

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
    isbn10:'383323203X',
    isbn13:9783833232039,
    indicar: true,
    avaliacao: 4.5,
    comentario: usuario1.email + ': Um lindo romance para um dia de chuva, seu único defeito é que precisa conhecer a saga de star wars para entender completamente a história!'
})

const livro2 = new  Livro({
    isbn10:'0681007702',
    isbn13:9780681007703,
    indicar: true,
    avaliacao: 4.7,
    comentario: usuario1.email + ': Otimo livro, principalmente quando você quer ler algo para passar o tempo, é incrível aconpanhar a história de Anne, ele realmente de transporta para dentro da história :D'
})

Livro.insertMany([livro1, livro2])
.then(res => {
    console.log(res);
})
.catch(e => {
    console.log(`Não salvo no banco... ${e}`);
})

