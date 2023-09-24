const bcrypt = require('bcrypt')
require('dotenv').config()
const router = require('express').Router()
// importando Person
const Person = require('../models/Person')
// importando Denuncia
const Denuncia = require('../models/Denuncia')



// denúncia
router.get('/den-motivo', async (req, res) => {
    res.render('den-motivo')
})
router.get('/den-relato', async (req, res) => {
    res.render('den-relato')
})
router.get('/den-endereco', async (req, res) => {
    res.render('den-endereco')
})
router.get('/den-anexo', async (req, res) => {
    res.render('den-anexo')
})
router.get('/den-conclusao', async (req, res) => {
    res.render('den-conclusao')
})
router.get('/denunciar', async (req, res) => {
    res.render('denunciar')
})



// efetuar denúncia
router.get('/den-log', async (req, res) => {
    res.render('den-log')
})
router.post('/den-log', async(req, res) => {
    let email = req.body.emailDen
    let senha = req.body.senhaDen

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

    try {
        res.redirect('ver-den-log')
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: 'Erro no servidor, tente novamente'})
    }
})



//exportando o router
module.exports = router