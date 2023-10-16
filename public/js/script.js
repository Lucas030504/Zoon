var header = document.getElementById('header')
var nav = document.getElementById('nav')
var article = document.getElementById('article')
// não se refere ao showSidebar do css
var showSidebar = false

// fechar clicando nos botões
function toggleSidebar() {
    showSidebar = !showSidebar
    if(showSidebar) {
        // if true
        nav.style.marginLeft = '-10vw'
        // se refere ao showSidebar do css
        nav.style.animationName = 'showSidebar'
    } else {
        // if false
        nav.style.marginLeft = '-1000vw'
        nav.style.animationName = 'hideSidebar'
    }
}

// fechar clicando fora do sidebar
function closeSidebar() {
    if(showSidebar) {
        // if aberto, então fecha
        // vai fazer a verificação (true or false) pelo próprio método toggleSidebar()
        toggleSidebar()
    }
}