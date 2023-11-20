const bcrypt = require('bcrypt')
require('dotenv').config()
const router = require('express').Router()
require('dotenv').config()
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

    let status = 'Enviado para análise'
    let status_motivo = ""

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

    let id_usuario
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
        id_usuario = user._id
    } else {
        email = "Anônimo"
        id_usuario = ""
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
        id_usuario,
        data,
        status,
        status_motivo
    })
    await newDenuncia.save()

    if (email == "Anônimo") {
        res.redirect("/path/ver-denuncias")
    } else {
        res.redirect(`/path/minhas-denuncias/${id_usuario}`)
    }
})


router.get("/em-analise", async (req, res) => {
    try {
        let status = "Enviado para análise"
        let denuncias = await Denuncia.find({status: status})
        res.render('em-analise', {denunciasLista:denuncias})
    } catch (err) {
        console.log(err)
    }
})

router.get("/em-andamento", async (req, res) => {
    try {
        let status = "Em andamento"
        let denuncias = await Denuncia.find({status: status})
        res.render('em-andamento', {denunciasLista:denuncias})
    } catch (err) {
        console.log(err)
    }
})

router.get("/finalizados", async (req, res) => {
    try {
        let status = "Finalizado"
        let denuncias = await Denuncia.find({status: status})
        res.render('finalizados', {denunciasLista:denuncias})
    } catch (err) {
        console.log(err)
    }
})

router.get("/cancelados", async (req, res) => {
    try {
        let status = "Cancelado"
        let denuncias = await Denuncia.find({status: status})
        res.render('cancelados', {denunciasLista:denuncias})
    } catch (err) {
        console.log(err)
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

    let id_usuario = user._id
    try {
        res.redirect(`/path/minhas-denuncias/${id_usuario}`)
    } catch (err) {
        console.log(err)
    }
})



router.get("/minhas-denuncias/:id", async(req, res) => {
    let id = req.params.id
    let denuncias = await Denuncia.find({id_usuario:id})
    res.render('minhas-denuncias', {denuncias:denuncias})
})



// UPDATE DENÚNCIAS
router.get("/atualizar-den/:id", async (req, res) => {
    let id = req.params.id
    let denuncia = await Denuncia.findOne({_id: id})
    res.render('atualizar-den', {denuncia: denuncia})
})
// atualizando dado
router.post('/atualizar-den/:id', async (req, res) => {
    let id = req.body.denuncia_id
    let status = req.body.novoStatus
    let status_motivo = req.body.status_motivo

    try {
        let updatedDenuncia = await Denuncia.findByIdAndUpdate({_id: id}, {
            $set: {
                status,
                status_motivo
            }
        })
        if (updatedDenuncia.matchedCount === 0) {
            res.status(422).json({msg: 'Denúncia não encontrada'})
            return
        }

        res.redirect(`/path/em-analise`)
    } catch (error) {
        res.status(500).json({msg: 'Erro no servidor, tente novamente'})
    }
})



//exportando o router
module.exports = router