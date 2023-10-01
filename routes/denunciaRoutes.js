const bcrypt = require('bcrypt')
require('dotenv').config()
const router = require('express').Router()
// importando Person
const Person = require('../models/Person')
// importando Denuncia
const Denuncia = require('../models/Denuncia')



// criando denúncia
router.get("/denunciar", async (req, res) => {
    res.render('denunciar')
})
router.post("/denunciar", async (req, res) => {
    let motivo = req.body.motivo
    let relato = req.body.relato
    let cep = req.body.cep
    let estado = req.body.estado
    let cidade = req.body.cidade
    let bairro = req.body.bairro
    let rua = req.body.rua
    let complemento = req.body.complemento
    let numero = req.body.nmr_moradia
    let email = req.body.emailDen
    let senha = req.body.senhaDen

    let date = new Date()
    // getDay() pega o dia da semana
    // getDate() pega o dia do mês
    let dia = date.getDate()
    let mes = date.getMonth()+1
    let ano = date.getFullYear()
    let data = `${dia}/${mes}/${ano}`

    // validações
    if (!motivo) {
        return res.status(422).json({msg: 'O motivo é obrigatório'})
    }
    if (!relato) {
        return res.status(422).json({msg: 'O relato é obrigatório'})
    }
    if (!cep && !rua) {
        return res.status(422).json({msg: 'O endereço é obrigatório, digite o cep ou informe o endereço'})
    }

    if (email) {
        // checando se usuário existe
        let user = await Person.findOne({email: email})
        if (!user) {
            return res.status(404).json({msg: 'Usuário não encontrado'})
        }
        // checando se a senha bate
        let checkPassword = await bcrypt.compare(senha, user.senha)
        if (!checkPassword) {
            return res.status(404).json({msg: 'Senha inválida'})
        }
    } else {
        email = "Anônimo"
    }

    // adicionando no bd
    let newDenuncia = new Denuncia({
        motivo,
        relato,
        cep,
        estado,
        cidade,
        bairro,
        rua,
        complemento,
        numero,
        email,
        data
    })
    await newDenuncia.save()
    if (email == "Anônimo") {
        res.redirect("/path/ver-denuncias")
    } else {
        res.redirect("/")
    }
})



// recuperando denúncias anônimas
router.get("/ver-denuncias", async (req, res) => {
    try {
        let denuncias = await Denuncia.find({email:"Anônimo"})
        res.render('ver-denuncias', {denunciasList:denuncias})
    } catch (err) {
        console.log(err)
    }
})
// recuperando denúncias logadas
router.get("/ver-minha-den", async (req, res) => {
    res.render("ver-minha-den")
})
router.post("/ver-minha-den", async (req, res) => {
    let email = req.body.emailVerDen
    let senha = req.body.senhaVerDen

    // checando se usuário existe
    let user = await Person.findOne({email: email})
    if (!user) {
        return res.status(404).json({msg: 'Usuário não encontrado'})
    }
    // checando se a senha bate
    let checkPassword = await bcrypt.compare(senha, user.senha)
    if (!checkPassword) {
        return res.status(404).json({msg: 'Senha inválida'})
    }

    try {
        let denuncias = await Denuncia.find({email:email})
        res.render('minhas-denuncias', {denunciasList:denuncias})
    } catch (err) {
        console.log(err)
    }
})



//exportando o router
module.exports = router