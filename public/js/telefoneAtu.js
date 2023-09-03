const input = document.querySelector('novoTel')

novoTel.addEventListener('keypress', () => {
    // tamanho do input
    let inputLength = novoTel.value.length

    if (inputLength === 0) {
        novoTel.value += '('
    }
    if (inputLength === 3) {
        novoTel.value += ')'
    }
    if (inputLength === 9) {
        novoTel.value += '-'
    }
})