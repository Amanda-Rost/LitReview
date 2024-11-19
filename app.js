const request = require('request')
let express = require('express')
const app = express()
const path = require('path')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))

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
app.listen(3000, () => console.log("Servidor ligado na porta 3000!"))