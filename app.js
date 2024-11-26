let express = require('express');
let methodOverride = require('method-override');
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
app.use(methodOverride ('_method'));


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/criarConta', (req, res) => {
    res.render('criarConta')
})

app.get('/principal', async (req, res) => {
    const livros = await Livro.find({});
    res.render('principal', {livros});
})

app.get('/busca', (req, res) => {
    res.render('busca')
})

app.get('/adicionarLivro', (req, res) => {
    res.render('adicionarLivro')
})

app.get('/livro/:id', async (req, res) => {
    const {id} = req.params;
    const livro =  await Livro.findById(id);
    res.render('show', {livro})
})

app.post('/principal', async (req,res) =>{
    const novoLivro = new Livro(req.body);
    await novoLivro.save();
    res.redirect('/principal')
})

app.get('/livro/:id/edit', async (req, res) => {
    const {id} = req.params;
    const livro = await Livro.findById(id)
    res.render('edit', {livro});
})

app.put('/livro/:id', async (req, res) =>{
    const {id} = req.params;
    await Livro.findByIdAndUpdate(id, req.body, {runValidators: true});
    res.redirect('/livro/'+ id);
})

app.delete('/livro/:id', async (req, res) => {
    const {id} = req.params;
    await Livro.findByIdAndDelete(id)
    res.redirect('/principal');
})
app.get('/avaliacao', (req, res) => {
    res.render('busca')
})

app.listen(5000, () => console.log("Servidor ligado na porta 5000!"))