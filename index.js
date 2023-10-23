const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()
const ejs = require('ejs')
const app = express()



// css no ejs
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')



// importando personRoutes
const personRoutes = require('./routes/personRoutes')
app.use('/path', personRoutes)
// importando denunciaRoutes
const denunciaRoutes = require('./routes/denunciaRoutes')
app.use('/path', denunciaRoutes)



// tela principal
app.get("/", async (req, res) => {
    res.render('principal')
})



// conectando ao atlas
const db_user = process.env.DB_USER
const db_pass = process.env.DB_PASS
mongoose.connect(
    // podemos criar um banco pela própria url de conexão inserindo o nome antes do ?
    `mongodb+srv://${db_user}:${db_pass}@clusterzoon.wekproe.mongodb.net/zoon?retryWrites=true&w=majority`//, {useNewUrlParser: true}, {useUnifiedTopology: true}
    )
    .then(() => {
        console.log('mongodb conectado')
        app.listen(3000)
    })
    .catch((err) => console.log(err))