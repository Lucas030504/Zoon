const input = document.querySelector('tel')

tel.addEventListener('keypress', () => {
    // tamanho do input
    let inputLength = tel.value.length

    if (inputLength === 0) {
        tel.value += '('
    }
    if (inputLength === 3) {
        tel.value += ') '
    }
    if (inputLength === 10) {
        tel.value += '-'
    }
})