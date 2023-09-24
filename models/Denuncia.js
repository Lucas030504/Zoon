const mongoose = require('mongoose')

const Denuncia = mongoose.model('Denuncia', {
    motivo: String,
    relato: String,
    estado: String,
    cidade: String,
    bairro: String,
    rua: String,
    complemento: String,
    numero: Number,
    // anexo: File,
    // tipo de denúncia (anônimo ou logado)
    tipo: String,
    email: String,
    senha: String

})

// exportando o model
module.exports = Denuncia