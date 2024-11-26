let express = require('express');
let methodOverride = require('method-override');
const app = express();

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

app.set('view engine', 'ejs');
app.use(express.static("public"))

app.use(express.urlencoded({extended: true}));
app.use(methodOverride ('_method'));


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/login', (req, res) => {
    res.render('login',  { errorMessage: undefined })
})

app.get('/criarConta', (req, res) => {
    res.render('criarConta')
})


app.get('/principal', async (req, res) => {
    const livros = await Livro.find({});
    res.render('principal', {livros});
})

app.post('/confirmaUsuario', async (req, res) => {
    try {
    
        const { email, senha } = req.body;

        const usuario = await Usuario.findOne({ email: email, senha: senha }).exec();
        if (usuario) {
            res.redirect('/principal');
        } else {
            res.render('login', { errorMessage: 'E-mail ou senha estão incorretos!' });
        }
    } catch (err) {
        console.error('Erro ao verificar usuário:', err);
        res.status(500).send('Erro no servidor.');
    }
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

app.post('/principalUsuario', async (req,res) =>{
    try {
        const novoUsuario = new Usuario(req.body);
        await novoUsuario.save();
        res.redirect('/principal');
    } catch (err) {
        console.error('Erro ao salvar usuário:', err);
        res.status(500).send('Erro no servidor. Verifique os logs.');
    }
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