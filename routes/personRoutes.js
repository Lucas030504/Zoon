const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()
const router = require('express').Router()
// importando Person
const Person = require('../models/Person')



// isso não tem a ver com o usuário

// clima
router.get('/clima', async (req, res) => {
    res.render('clima')
})
// notícias
router.get('/noticia-principal', async (req, res) => {
    res.render('noticia-principal')
})
router.get('/noticia-lateral-1', async (req, res) => {
    res.render('noticia-lateral-1')
})
router.get('/noticia-lateral-2', async (req, res) => {
    res.render('noticia-lateral-2')
})
router.get('/noticia-abaixo-1', async (req, res) => {
    res.render('noticia-abaixo-1')
})
router.get('/noticia-abaixo-2', async (req, res) => {
    res.render('noticia-abaixo-2')
})
router.get('/noticia-abaixo-3', async (req, res) => {
    res.render('noticia-abaixo-3')
})
// zoonoses
router.get('/zoonose-principal', async (req, res) => {
    res.render('zoonose-principal')
})
router.get('/zoonose-lateral-1', async (req, res) => {
    res.render('zoonose-lateral-1')
})
router.get('/zoonose-lateral-2', async (req, res) => {
    res.render('zoonose-lateral-2')
})
router.get('/zoonose-abaixo-1', async (req, res) => {
    res.render('zoonose-abaixo-1')
})
router.get('/zoonose-abaixo-2', async (req, res) => {
    res.render('zoonose-abaixo-2')
})
router.get('/zoonose-abaixo-3', async (req, res) => {
    res.render('zoonose-abaixo-3')
})



// a partir daqui tem

// PRIVATE ROUTE - ROTA PRIVADA
router.get('/usuario/:id', checkToken, async (req, res) => {
    let id = req.params.id
    // checando se usuário existe
    let user = await Person.findById(id)
    if (!user) {
        return res.status(404).json({msg: 'Usuário não encontrado'})
    }
    // res.status(200).json({user})
    res.status(200).json({msg: 'Olá ' + user.nome})
    // res.status(200).json({msg: 'Usuário encontrado'})
    // res.redirect("/")
})

function checkToken(req, res, next) {
    let authHeader = req.headers['authorization']
    let token = authHeader && authHeader.split(" ")[1]
    if (!token) {
        return res.status(401).json({msg: "Acesso negado"})
    }
    try {
        let secret = process.env.SECRET
        jwt.verify(token, secret)
        next()
    } catch (error) {
        res.status(400).json({msg: "Token inválido"})
    }
}



// CREATE
router.get("/cadastrar", async (req, res) => {
    res.render('cadastrar')
})
// criando dado
router.post("/cadastrar", async (req, res) => {
    let email = req.body.email
    let tel = req.body.tel
    let nome = req.body.nome
    let sobrenome = req.body.sobrenome
    let senha = req.body.senha
    let confSenha = req.body.confSenha

    let date = new Date()
    // getDay() pega o dia da semana
    // getDate() pega o dia do mês
    let dia = date.getDate()
    let mes = date.getMonth()+1
    let ano = date.getFullYear()
    let data = `${dia}/${mes}/${ano}`

    // validações
    if (!email) {
        return res.status(422).json({msg: 'O e-mail é obrigatório'})
    }
    if (!senha) {
        return res.status(422).json({msg: 'A senha é obrigatória'})
    }
    if (senha !== confSenha) {
        return res.status(422).json({msg: 'As senhas não estão iguais'})
    }
    // checando se usuário existe
    let userExists = await Person.findOne({email: email})
    if (userExists) {
        return res.status(422).json({msg: 'Este e-mail já está cadastrado, tente outro'})
    }
    // adicionando dificuldade na senha
    let salt = await bcrypt.genSalt(12)
    let senhaHash = await bcrypt.hash(senha, salt)

    // adicionando no bd
    let newPerson = new Person({
        email,
        tel,
        nome,
        sobrenome,
        senha: senhaHash,
        data
    })
    await newPerson.save()

    let person = await Person.findOne({email:email})
    let id = person._id
    // para evitar de ficar carregando infinito, envia o usuário para outra página
    res.redirect(`/path/minha-conta/${id}`)
})



// LOGIN
router.get('/logar', async (req, res) => {
    res.render('logar')
})
router.post('/logar', async(req, res) => {
    let email = req.body.emailLog
    let senha = req.body.senhaLog

    // validações
    if (!email) {
        return res.status(422).json({msg: 'O e-mail é obrigatório'})
    }
    if (!senha) {
        return res.status(422).json({msg: 'A senha é obrigatória'})
    }
    // checando se usuário existe
    let user = await Person.findOne({email: email})
    if (!user) {
        return res.status(404).json({msg: 'Usuário não encontrado'})
    }
    // checando se a senha bate
    // a primeira senha é a que o usuário enviou e a segunda é a que está salva no banco
    let checkPassword = await bcrypt.compare(senha, user.senha)
    if (!checkPassword) {
        return res.status(404).json({msg: 'Senha inválida'})
    }

    // try {
    //     // mandando o secret junto com o token
    //     let secret = process.env.SECRET
    //     // o id tá aqui como exemplo
    //     let token = jwt.sign({id: user._id}, secret)
    //     res.status(200).json({msg: 'Autenticação realizada com sucesso', token})
    // } catch (error) {
    //     console.log(error)
    //     res.status(500).json({msg: 'Erro no servidor, tente novamente'})
    // }
    try {
        let id = await user._id
        res.redirect(`/path/minha-conta/${id}`)
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: 'Erro no servidor, tente novamente'})
    }
})



// READ ONE
router.get("/minha-conta/:id", async (req, res) => {
    let id = req.params.id
    let person = await Person.findOne({_id: id})
    res.render('minha-conta', {user: person})
})

// READ ALL
// router.get("/cadastrados", async (req, res) => {
//     try {
//         let people = await Person.find()
//         res.render('cadastrados', {peopleList: people})
//     } catch (err) {
//         console.log(err)
//     }
// })



// UPDATE
router.get("/atualizar/:id", async (req, res) => {
    let id = req.params.id
    let person = await Person.findOne({_id: id})
    res.render('atualizar', {person: person})
})
// atualizando dado
router.post('/atualizar/:id', async (req, res) => {
    let id = req.body.person_id

    let email = req.body.novoEmail
    let nome = req.body.novoNome
    let sobrenome = req.body.novoSobrenome
    let tel = req.body.novoTel

    try {
        let updatedPerson = await Person.findByIdAndUpdate({_id: id}, {
            $set: {
                email,
                nome,
                sobrenome,
                tel
            }
        })
        if (updatedPerson.matchedCount === 0) {
            res.status(422).json({msg: 'Usuário não encontrado'})
            return
        }
        res.redirect(`/path/minha-conta/${id}`)
    } catch (error) {
        res.status(500).json({msg: 'Erro no servidor, tente novamente'})
    }
})



// DELETE
router.get('/deletar/:id', async (req, res) => {
    let id = req.params.id
    let deletedPerson = await Person.findOne({_id: id})
    if (!deletedPerson) {
        return res.status(422).json({msg: 'Usuário não encontrado'})
    }
    try {
        await Person.deleteOne({_id: id})
        // res.status(200).json({msg: 'Deletado com sucesso'})
    } catch (error) {
        res.status(500).json({msg: 'Erro no servidor, tente novamente'})
    }
    res.redirect('/')
})



//exportando o router
module.exports = router