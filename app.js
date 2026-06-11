class Jugador {
    //Propiedades privadas, solo puede la misma clase usarlas.
    #nombre;
    #puntaje;
    #respuestasCorrectas;
    constructor(nombre) {
        this.nombre = nombre;
        this.#puntaje = 0;
        this.#respuestasCorrectas = 0;
    }

    //Metodo geter me devuelve el valor de un atributo
    get nombre() {
        return this.#nombre
    }

    //Metodo seter nos permiten asignarle un valor a un atributo y podemos realizar una validacion
    set nombre(value) {
        this.#nombre = value
    }

    get puntaje() {
        return `Tienes ${this.#puntaje} puntos`
    }

    //Propiedades virtuales: para mostrar solo el puntaje pero como number
    get puntos() {
        return this.#puntaje
    }

    set puntaje(value) {
        this.#puntaje = value
    }

    get respuestasCorrectas() {
        return this.#respuestasCorrectas
    }

    set respuestasCorrectas(value) {
        this.#respuestasCorrectas = value
    }

    sumarPuntos(puntos) {
        this.#puntaje = this.#puntaje + puntos
    }

    aumentarCorrectas() {
        this.respuestasCorrectas = this.respuestasCorrectas + 1
    }

    reiniciar() {
        this.nombre = ''
        this.puntaje = 0
        this.respuestasCorrectas = 0
    }
}

class Pregunta {
    #texto;
    #opciones;
    #respuestaCorrecta;
    #puntos;

    constructor(texto, opciones, respuestaCorrecta, puntos) {
        this.texto = texto
        this.opciones = opciones
        this.respuestaCorrecta = respuestaCorrecta
        this.puntos = puntos
    }

    get texto() {
        return this.#texto
    }

    set texto(value) {
        this.#texto = value
    }

    get opciones() {
        return this.#opciones
    }

    set opciones(value) {
        if (Array.isArray(value)) {
            this.#opciones = value
        } else {
            throw new Error('No se aceptan valores diferentes a un arreglo')
        }
    }

    get respuestaCorrecta() {
        return this.#respuestaCorrecta
    }

    set respuestaCorrecta(value) {
        this.#respuestaCorrecta = value
    }

    set puntos(value) {
        this.#puntos = value
    }

    get puntos() {
        return this.#puntos
    }

    validarRespuesta(respuesta) {
        return respuesta == this.#respuestaCorrecta
    }
}

class Quiz {
    #preguntas;
    #preguntaActual;
    #jugador;
    #indice;

    constructor(preguntas, jugador) {
        this.preguntas = preguntas
        this.jugador = jugador
        this.#indice = 0
    }

    get preguntas() {
        return this.#preguntas
    }

    set preguntas(value) {
        this.#preguntas = value
    }

    get jugador() {
        return this.#jugador
    }

    set jugador(value) {
        this.#jugador = value
    }

    get preguntaActual() {
        return this.#preguntaActual
    }

    set preguntaActual(value) {
        this.#preguntaActual = value
    }

    iniciar() {
        this.#indice = 0
        this.preguntaActual = this.preguntas[this.#indice]
    }

    mostrarPregunta() {
        return this.preguntaActual
    }

    siguientePregunta() {
        this.#indice++;
        this.preguntaActual = this.preguntas[this.#indice]
    }

    estadoPregunta() {
        return `Pregunta ${this.#indice + 1} de ${this.#preguntas.length}`
    }

    estadoPreguntaPorcentaje() {
        let porcentaje = 100 / this.#preguntas.length
        return (this.#indice + 1) * porcentaje
    }

    responder(respuesta) {
        let res = this.preguntaActual.validarRespuesta(respuesta)
        if (res) {
            this.jugador.aumentarCorrectas()
            this.jugador.sumarPuntos(this.preguntaActual.puntos)
        }
    }

    finalizarQuiz() {
        return { nombre: this.jugador.nombre, puntaje: this.jugador.puntos, correctas: this.jugador.respuestasCorrectas }
    }
}

let pantalla1 = document.querySelector('#pantalla-inicio')
let pantalla2 = document.querySelector('#pantalla-quiz')
let pantallaFinal = document.querySelector('#pantalla-final')

let estadoJugador = document.querySelector('#estado-jugador')
let estadoPuntaje = document.querySelector('#estado-puntaje')
let estadoCorrectas = document.querySelector('#estado-correctas')
let estadoPregunta = document.querySelector('#estado-pregunta')
let barraProgreso = document.querySelector('#barra-progreso')

let preguntaVisual = document.querySelector('#texto-pregunta')
let respuestaVisual = document.querySelector('#opciones-respuesta')

let feedbackRespuesta = document.querySelector('#feedback-respuesta')
let btnSiguiente = document.querySelector('#btn-siguiente')
let btnFilazido = document.querySelector('#btn-finalizado')
let btnReiniciar = document.querySelector('#btn-reiniciar')

let resultadoJugador = document.querySelector('#resultado-jugador')
let resultadoPuntaje = document.querySelector('#resultado-puntaje')
let resultadoCorrectas = document.querySelector('#resultado-correctas')

let formInicio = document.querySelector('#form-iniciar')

const pregunta1 = new Pregunta('Cual es mi edad', ['10', '20', '30', '50'], '30', 10)
const pregunta2 = new Pregunta('Cual es mi sue;o', ['10', '20', '30', '50'], '30', 10)
const pregunta3 = new Pregunta('Cual es mi mercado', ['10', '20', '30', '50','60'], '30', 10)
const pregunta4 = new Pregunta('Cual es mi fjfjf', ['10', '20', '30', '50'], '30', 10)
const pregunta5 = new Pregunta('Cual es mi comida Favorita', ['10', '20', '30', '50'], '30', 10)

const arregloDePreguntas = [pregunta1, pregunta2, pregunta3, pregunta4, pregunta5]

let QuizOne;

formInicio.addEventListener('submit', (event) => {
    event.preventDefault()

    let playerOne = new Jugador(event.target['nombre-jugador'].value)
    QuizOne = new Quiz(arregloDePreguntas, playerOne)
    QuizOne.iniciar()
    formInicio.reset()

    pantalla1.classList.add('d-none')
    pantalla2.classList.remove('d-none')
    renderizar(playerOne)
})

respuestaVisual.addEventListener('click', (event) => {
    if (event.target.disabled != undefined) {
        event.target.classList.add('active')

        let esCorrecta = QuizOne.preguntaActual.validarRespuesta(event.target.textContent)
        feedbackRespuesta.textContent = `Su respuesta es ${esCorrecta ? 'correcta' : 'incorrecta'}`

        if (!esCorrecta) {
            feedbackRespuesta.classList.remove('alert-success')
            feedbackRespuesta.classList.add('alert-danger')
        }
        feedbackRespuesta.classList.remove('d-none')

        let hijos = respuestaVisual.childNodes
        hijos.forEach(btn => btn.disabled = true)

        QuizOne.responder(event.target.textContent)
        btnSiguiente.disabled = false

        if (!btnFilazido.classList.contains('d-none')) {
            btnFilazido.disabled = false
        }
    }
})

btnSiguiente.addEventListener('click', (event) => {
    QuizOne.siguientePregunta()
    renderizar(QuizOne.jugador)
})

btnFilazido.addEventListener('click', (event) => {
    pantalla2.classList.add('d-none')
    pantallaFinal.classList.remove('d-none')
    let fin = QuizOne.finalizarQuiz()
    resultadoJugador.textContent = fin.nombre
    resultadoCorrectas.textContent = fin.correctas
    resultadoPuntaje.textContent = fin.puntaje
    btnFilazido.classList.add('d-none')
    btnSiguiente.classList.remove('d-none')
})

btnReiniciar.addEventListener('click', (event) => {
    QuizOne.jugador.reiniciar()
    pantallaFinal.classList.add('d-none')
    pantalla1.classList.remove('d-none')
    btnFilazido.disabled = true
})

const renderizar = (playerOne) => {
    estadoPregunta.textContent = QuizOne.estadoPregunta()
    barraProgreso.style = `width: ${QuizOne.estadoPreguntaPorcentaje()}%`
    feedbackRespuesta.classList.add('d-none')
    feedbackRespuesta.classList.add('alert-success')
    feedbackRespuesta.classList.remove('alert-danger')

    estadoJugador.textContent = `Jugador: ${playerOne.nombre}`
    estadoPuntaje.textContent = `Puntaje: ${playerOne.puntaje}`
    estadoCorrectas.textContent = `Correctas: ${playerOne.respuestasCorrectas}`
    preguntaVisual.textContent = QuizOne.preguntaActual.texto

    respuestaVisual.innerHTML = ''

    QuizOne.preguntaActual.opciones.forEach(element => {
        let btnRespuesta = document.createElement('button')
        btnRespuesta.className = 'btn btn-outline-primary text-start py-3'
        btnRespuesta.textContent = element
        respuestaVisual.append(btnRespuesta)
    })

    if (QuizOne.estadoPreguntaPorcentaje() == 100) {
        btnFilazido.classList.remove('d-none')
        btnSiguiente.classList.add('d-none')
    }
    btnSiguiente.disabled = true
}