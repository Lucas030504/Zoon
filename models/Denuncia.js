const mongoose = require('mongoose')

const Denuncia = mongoose.model('Denuncia', {
    motivo: String,
    relato: String,
    cep: Number,
    estado: String,
    cidade: String,
    bairro: String,
    rua: String,
    complemento: String,
    numero: String,
    email: String,
    // anexo: File
    data: String,
    status: String

})

// exportando o model
module.exports = Denuncia