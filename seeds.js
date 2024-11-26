const mongoose = require('mongoose');
const Livro = require('./models/livro')

mongoose.connect('mongodb://localhost:27017/livrosdb', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log(`Conexão estabelecida`)
})
.catch(err => {
    console.log(`Erro ao conectar com o banco de dados ... ${err}`);
})

const livro1 = new  Livro({
    capa: '/public/css/img/estrelasPerdidas.jpg',
    titulo: 'Star Wars: Estrelas Perdidas',
    genero1: 'Ficção científica',
    genero2: 'Ficção juvenil',
    genero3: 'Romance',
    resumo: 'É um romance do universo Star Wars, parte do projeto Jornada para O Despertar da Força. O livro explora eventos centrais da saga de uma perspectiva única, acompanhando dois protagonistas, Thane Kyrell e Ciena Ree, que vivem em lados opostos do conflito galáctico. Eles crescem juntos no planeta Jelucan, sonhando em se tornar pilotos imperiais. Apesar de entrarem para o Império, suas visões começam a divergir: Thane passa a enxergar a corrupção imperial, enquanto Ciena permanece leal por causa de sua honra e dever. Essa divisão coloca o amor deles à prova, à medida que Thane se junta à Aliança Rebelde e os dois enfrentam os horrores da guerra.'

})

const livro2 = new  Livro({
    capa: '/public/css/img/anne.jpeg',
    titulo: 'Anne de Green Gables',
    genero1: 'Ficção',
    genero2: 'Literatura juvenil',
    genero3: 'Romance',
    resumo: 'é um clássico da literatura infantojuvenil que narra a história de Anne Shirley, uma órfã de 11 anos, imaginativa e espirituosa. Por engano, ela é enviada para Green Gables, uma fazenda no interior de Avonlea, onde os irmãos Matthew e Marilla Cuthbert haviam solicitado um menino para ajudá-los com o trabalho. Apesar da surpresa inicial, Anne conquista os Cuthberts e os moradores da comunidade com seu entusiasmo, inteligência e charme único. Ao longo da história, Anne enfrenta desafios, constrói amizades, aprende com seus erros e transforma Green Gables com sua presença vibrante. O livro celebra temas como família, aceitação, crescimento pessoal e a beleza da simplicidade na vida rural.'
})

Livro.insertMany([livro1, livro2])
.then(res => {
    console.log(res);
})
.catch(e => {
    console.log(`Não salvo no banco... ${e}`);
})