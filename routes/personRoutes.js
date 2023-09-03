const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

const router = require('express').Router()

// importando Person
const Person = require('../models/Person')



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

// denúncia
router.get('/denuncia', async (req, res) => {
    res.render('denuncia')
})
router.get('/denunciar-an', async (req, res) => {
    res.render('denunciar-an')
})

// teste de localização
router.get('/localizacao', async (req, res) => {
    res.render('localizacao')
})



// cadastro e login:

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

    if (!email) {
        return res.status(422).json({msg: 'O e-mail é obrigatório'})
    }
    if (!senha) {
        return res.status(422).json({msg: 'A senha é obrigatória'})
    }
    if (senha !== confSenha) {
        return res.status(422).json({msg: 'As senhas não estão iguais'})
    }

    let userExists = await Person.findOne({email: email})
    if (userExists) {
        return res.status(422).json({msg: 'Este e-mail já está cadastrado, tente outro'})
    }

    let salt = await bcrypt.genSalt(12)
    let senhaHash = await bcrypt.hash(senha, salt)

    let newPerson = new Person({
        email,
        tel,
        nome,
        sobrenome,
        senha: senhaHash
    })
    await newPerson.save()
    // para evitar de ficar carregando infinito, enviamos o usuário para outra página
    res.redirect("/path/cadastrados")
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
        res.redirect('main')
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: 'Erro no servidor, tente novamente'})
    }
})



// READ
router.get("/cadastrados", async (req, res) => {
    try {
        let people = await Person.find()
        res.render('cadastrados', {peopleList: people})
    } catch (err) {
        console.log(err)
    }
})



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
    let tel = req.body.novoTel
    let nome = req.body.novoNome
    let sobrenome = req.body.novoSobrenome
    let senha = req.body.novaSenha
    let confSenha = req.body.confSenha

    if (!email) {
        return res.status(422).json({msg: 'O e-mail é obrigatório'})
    }
    if (!senha) {
        return res.status(422).json({msg: 'A senha é obrigatória'})
    }
    if (senha !== confSenha) {
        return res.status(422).json({msg: 'As senhas não estão iguais'})
    }

    let salt = await bcrypt.genSalt(12)
    let senhaHash = await bcrypt.hash(senha, salt)

    try {
        let updatedPerson = await Person.findByIdAndUpdate({_id: id}, {
            $set: {
                email,
                tel,
                nome,
                sobrenome,
                senha:senhaHash
            }
        })
        if (updatedPerson.matchedCount === 0) {
            res.status(422).json({msg: 'Usuário não encontrado'})
            return
        }
        res.redirect("/path/cadastrados")
    } catch (error) {
        res.status(500).json({erro: error})
    }
})



// DELETE
router.get('/deletar/:id', async (req, res) => {
    let id = req.params.id
    let deletedPerson = await Person.findOne({_id: id})
    if (!deletedPerson) {
        res.status(422).json({msg: 'Usuário não encontrado'})
        return
    }
    try {
        await Person.deleteOne({_id: id})
        // res.status(200).json({msg: 'Deletado com sucesso'})
    } catch (error) {
        res.status(500).json({erro: error})
    }
    let people = await Person.find()
    res.render('cadastrados', {
        peopleList: people
    })
})



router.get('/denunciar-log', async (req, res) => {
    res.render('denunciar-log')
})
router.post('/denunciar-log', async(req, res) => {
    let email = req.body.emailDen
    let senha = req.body.senhaDen

    // validações
    if (!email) {
        return res.status(422).json({msg: 'O e-mail é obrigatório'})
    }
    if (!senha) {
        return res.status(422).json({msg: 'A senha é obrigatória'})
    }

    let user = await Person.findOne({email: email})
    if (!user) {
        return res.status(404).json({msg: 'Usuário não encontrado'})
    }

    let checkPassword = await bcrypt.compare(senha, user.senha)
    if (!checkPassword) {
        return res.status(404).json({msg: 'Senha inválida'})
    }

    try {
        res.render('login-den', {user: user})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: 'Erro no servidor, tente novamente'})
    }
})



//exportando o router
module.exports = router