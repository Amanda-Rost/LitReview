let express = require('express');
let methodOverride = require('method-override');
let request = require('request');
const app = express();
const path = require('path');
const session = require('express-session');


const mongoose = require('mongoose');
const Livro = require('./models/livro');
const Usuario = require('./models/usuario');
const Avaliacao = require('./models/avaliacao');

mongoose.connect('mongodb://localhost:27017/livrosdb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(`Conexão estabelecida`)
    })
    .catch(err => {
        console.log(`Erro ao conectar com o banco de dados ... ${err}`);
    })

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname)))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// // app.use(session({secret:'seu segredo ...', resave: false, saveUninitialized: false}));

// request('https://www.googleapis.com/books/v1/volumes?q=isbn:144934013X', (error, response, body) => {
//     if (!error && response.statusCode==200){
//         let resposta = JSON.parse(body);
//         console.log(resposta)
//     }
// })
// app.get('/', (req, res) => {
//     if(!req.session.usuario)
//         req.session.usuario = null;
//     res.render('home')
// })

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/login', (req, res) => {
    res.render('login', { errorMessage: undefined })
})

app.get('/criarConta', (req, res) => {
    res.render('criarConta')
})

app.get('/principal', async (req, res) => {
    const livros = await Livro.find({});
    res.render('principal', { livros });
})

app.get('/suasAvaliacoes', async (req, res) => {
    const avaliacoes = await Avaliacao.find({})
    res.render('suasAvaliacoes', { avaliacoes })
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

app.get('/maisInformacoes/:livro', async (req, res) => {
    const { livro } = req.params;
    let resposta = {}
    const adicionado = req.query.adicionado === 'true';

    await request("https://www.googleapis.com/books/v1/volumes?q=isbn:" + livro, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            resposta = JSON.parse(body)
        }

        res.render('maisInformacoes', { resposta, adicionado })
    })
})

app.get('/pesquisa', async (req, res) => {
    let { algo, tipo } = req.query
    if (!tipo)
        tipo = ""

    let resposta = {}
    await request("https://www.googleapis.com/books/v1/volumes?q=" + tipo + algo, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            resposta = JSON.parse(body)
        }
        res.render('resultadoBusca', { resposta })
    })
});

app.get('/avaliacao/:id', async (req, res) => {
    const { id } = req.params;
    const avaliacao = await Avaliacao.findById(id);
    res.render('verAvaliacao', { avaliacao })
})

app.get('/editAvaliacao/:id', async (req, res) => {
    const { id } = req.params;
    const avaliacao = await Avaliacao.findById(id)
    res.render('editAvaliacao', { avaliacao });
})

app.post('/novaAvaliacao/:isbn', async (req, res) => {
    const { isbn } = req.params;

    await request("https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn, async (error, response, body) => {
        if (!error && response.statusCode == 200) {
            const resposta = JSON.parse(body);

            res.render('adicionarAvaliacao', { resposta });
        } else {
            res.status(500).send('Erro ao buscar dados do livro.');
        }
    });
});


app.post('/adicionarAvaliacao/:id', async (req, res) => {
    const { id } = req.params;
    await request("https://www.googleapis.com/books/v1/volumes?q=isbn:" + id, async (error, response, body) => {
        const resposta = JSON.parse(body);
        if (resposta.items && Array.isArray(resposta.items)) {
            for (let item of resposta.items) {
                const livro = item.volumeInfo;
                const adi = {
                    email: req.body.email,
                    titulo: livro.title,
                    isbn: livro.industryIdentifiers && livro.industryIdentifiers[0]?.identifier
                        ? livro.industryIdentifiers[1].identifier
                        : "Não disponível",
                    recomenda: req.body.recomenda,
                    comentario: req.body.comentario
                };

                await Avaliacao.insertMany([adi]).catch(e => {
                    console.log(`Erro ao salvar no banco... ${e}`);
                })
                res.redirect('/principal')
            }
        }
    })
})

app.post('/adicionaNaLista/:id', async (req, res) => {
    const { id } = req.params;

    await request("https://www.googleapis.com/books/v1/volumes?q=isbn:" + id, async (error, response, body) => {
        if (!error && response.statusCode == 200) {
            const resposta = JSON.parse(body);
            const { email } = req.body;
            if (resposta.items && Array.isArray(resposta.items)) {
                for (let item of resposta.items) {
                    const livro = item.volumeInfo;

                    const autores = livro.authors ? livro.authors.join(", ") : "Sem autores";
                    const genero = livro.categories ? livro.categories.join(", ") : "Sem gêneros";

                    const adi = {
                        titulo: livro.title,
                        autores: autores,
                        emailUsuario: email,
                        isbn10: livro.industryIdentifiers?.[0]?.identifier || "Não disponível",
                        isbn13: livro.industryIdentifiers?.[1]?.identifier || "Não disponível",
                        resumo: livro.description || "Sem resumo",
                        genero: genero,
                        capalink: livro.imageLinks?.thumbnail || "Sem imagem"
                    };

                    await Livro.insertMany([adi]).catch(e => {
                        console.log(`Erro ao salvar no banco... ${e}`);
                    });
                }
            }
        }

        res.redirect(`/maisInformacoes/${id}?adicionado=true`);
    });
});

app.post('/principalUsuario', async (req, res) => {
    try {
        const novoUsuario = new Usuario(req.body);
        await novoUsuario.save();
        res.redirect('/principal');
    } catch (err) {
        console.error('Erro ao salvar usuário:', err);
        res.status(500).send('Erro no servidor. Verifique os logs.');
    }
})

app.put('/avaliacao/:id', async (req, res) => {
    const { id } = req.params;
    await Avaliacao.findByIdAndUpdate(id, req.body, { runValidators: true });
    res.redirect('/avaliacao/' + id);
})

app.delete('/avaliacao/:id', async (req, res) => {
    const { id } = req.params;
    await Avaliacao.findByIdAndDelete(id)
    res.redirect('/principal');
})

app.delete('/livro/:id', async (req, res) => {
    const { id } = req.params;
    await Livro.findByIdAndDelete(id)
    res.redirect('/principal');
})
app.listen(5000, () => console.log("Servidor ligado na porta 5000!"))