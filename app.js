let express = require('express');
// let methodOverride = require('method-override');
const app = express();

const mongoose = require('mongoose');
const Livro = require('./models/livro')

mongoose.connect('mongodb://localhost:27017/livrosdb', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log(`Conexão estabelecida`)
})
.catch(err => {
    console.log(`Erro ao conectar com o banco de dados ... ${err}`);
})

app.set('view engine', 'ejs');
app.use(express.static("public"))

app.use(express.urlencoded({extended: true}));
// app.use(methodOverride ('_method'));


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/criarConta', (req, res) => {
    res.render('criarConta')
})

app.get('/principal', (req, res) => {
    res.render('principal')
})

app.get('/busca', (req, res) => {
    res.render('busca')
})

app.get('/avaliacao', (req, res) => {
    res.render('busca')
})

app.listen(3000, () => console.log("Servidor ligado na porta 3000!"))