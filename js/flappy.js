// Para criar novos elementos
function novoElemento(tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

// Para verificar quem vem primeiro (corpo ou borda)
function Barreira(reversa) {
    this.elemento = novoElemento('div', 'barreira')

    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')
    this.elemento.appendChild(reversa ? corpo : borda) //se false: borda - corpo
    this.elemento.appendChild(reversa ? borda : corpo) //se false: corpo - borda

    // Funcao p alterar a altura da barreira
    this.setAltura = altura => corpo.style.height = `${altura}px`
}

// Para testar altura
// const barreira1 = new Barreira(true)
// barreira1.setAltura(200)
// document.querySelector('[wm-flappy]').appendChild(barreira1.elemento)

// Altura, abertura entre elas, posicao x que quer colocar o par
function ParDeBarreiras(altura, abertura, x) { //Criar: par de barreiras, inferior e superior, sortear abertura, pegar posicao X
    this.elemento = novoElemento('div', 'par-de-barreiras')

    // This: deixa o atributo visivel para fora da funcao para verificar colisoes posteriormente
    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    this.sortearAbertura = () => {
        //Math.random() vai de 0 a 1
        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }

    // Pegar a posicao X da barreira
    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    this.setX = x => this.elemento.style.left = `${x}px`
    this.getLargura = () => this.elemento.clientWidth

    this.sortearAbertura()
    this.setX(x)
}

// Teste
// const b = new ParDeBarreiras(700, 350, 800)
// document.querySelector('[wm-flappy]').appendChild(b.elemento)

function Barreiras(altura, largura, abertura, espaco, notificarPonto) { //Criar: 4 barreiras, animar com deslocamento, verificar quando sair da tela, verificar ao passar no meio
    this.pares = [
        new ParDeBarreiras(altura, abertura, largura),
        new ParDeBarreiras(altura, abertura, largura + espaco),
        new ParDeBarreiras(altura, abertura, largura + espaco * 2),
        new ParDeBarreiras(altura, abertura, largura + espaco * 3)
    ]

    const deslocamento = 3
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)

            // qnd o elemento sair da area do jogo
            if (par.getX() < -par.getLargura()) {
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortearAbertura()
            }

            // Quando a barreira cruzar o meio
            const meio = largura / 2

            const cruzaMeio = par.getX() + deslocamento >= meio && par.getX() < meio
            cruzaMeio && notificarPonto() // se cruzaMeio for TRUE, lanca o notificarPonto() OU if (cruzaMeio) notificarPonto()
        })
    }
}

// Teste
const barreiras = new Barreiras(700, 1200, 300, 400)
const areaDoJogo = document.querySelector('[wm-flappy]')
barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))
setInterval(() => {
    barreiras.animar()
}, 20)