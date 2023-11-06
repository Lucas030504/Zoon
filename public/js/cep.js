const denForm = document.querySelector("#den-form")
const cepInput = document.querySelector("#cep")
const estadoInput = document.querySelector("#estado")
const cidadeInput = document.querySelector("#cidade")
const bairroInput = document.querySelector("#bairro")
const ruaInput = document.querySelector("#rua")
const formInputs = document.querySelectorAll("[data-input]")

cepInput.addEventListener("keypress", (e) => {
    const onlyNumbers = /[0-9]/
    const key = String.fromCharCode(e.keyCode)
    if (!onlyNumbers.test(key)) {
        e.preventDefault()
        return
    }
})

cepInput.addEventListener("keyup", (e) => {
    const inputValue = e.target.value
    if (inputValue.length === 8) {
        getAddress(inputValue)
    }
})

const getAddress = async (cep) => {
    cepInput.blur()
    const apiUrl = `https://viacep.com.br/ws/${cep}/json/`
    const response = await fetch(apiUrl)
    const data = await response.json()
    if (data.erro === true) {
        // if (!ruaInput.hasAttribute("disabled")) {
        //     toggleDisabled()
        // }
        denForm.reset()
        return
    }
    // if (estadoInput.value === "") {
    //     toggleDisabled()
    // }
    estadoInput.value = data.uf
    cidadeInput.value = data.localidade
    bairroInput.value = data.bairro
    ruaInput.value = data.logradouro
}

// const toggleDisabled = () => {
//     if (estadoInput.hasAttribute("disabled")) {
//         formInputs.forEach((input) => {
//             input.removeAttribute("disabled")
//         })
//     } else {
//         formInputs.forEach((input) => {
//             input.setAttribute("disabled","disabled")
//         })
//     }
// }

// save address
// denForm.addEventListener("submit", (e) => {
//     e.preventDefault()
//     setTimeout(() => {
//         denForm.reset()
//         toggleDisabled()
//     }, 2000)
// })