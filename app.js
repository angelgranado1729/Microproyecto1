



const tiempo = document.getElementById("time");
const reiniciar = document.getElementById("reset");
const tarjetas = document.querySelectorAll(".tarjeta")
const comenzar = document.getElementById("start");



// Tarjetas seleccionadas
let carta_1;
let carta_2;
// Bloquea para que no se pueda seleccionar mas de 2 cartas al mismo tiempo
let bloquear = false;
let login = false;
let nombre = "";
let tiempo_juego = 0;

// Comienza el juego
// comenzar.addEventListener("click", () => {


// Mezcla las cartas aleatoriamente
function mezclar() {
    tarjetas.forEach(tarjeta => {
        let random = Math.floor(Math.random() * 16);
        tarjeta.style.order = random;
    });
}

mezclar();


// Compara las imagenes de las tarjetas
function comparar(carta1, carta2) {
    if (carta1 === carta2) {
        setTimeout(() => { 
            carta_1.classList.add("match");
            carta_2.classList.add("match");
            carta_1.removeEventListener("click", voltear);
        carta_2.removeEventListener("click", voltear);
        }, 300);

        setTimeout(() => {
            carta_1.classList.remove("match");
            carta_2.classList.remove("match");
            carta_1 = carta_2 = null;
            bloquear = false;
        }, 750);   
    }else {
        setTimeout(() => {
            carta_1.classList.add("no-match");
            carta_2.classList.add("no-match");
            carta_1.classList.remove("voltear");
            carta_2.classList.remove("voltear");
        }, 300);
    
        setTimeout(() => {
            carta_1.classList.remove("no-match");
            carta_2.classList.remove("no-match");
            carta_1 = carta_2 = null;
            bloquear = false;
        }, 750);
    }      
}
    

// Funcion para voltear las cartas
function voltear(e) {

    let carta_selec = e.target;
    if (carta_selec !== carta_1 && !bloquear) {
        carta_selec.classList.add("voltear");
        if (!carta_1) {
            carta_1 = carta_selec;
        } else{
            carta_2 = carta_selec;
            //Bloquea la seleccion de mas cartas
            bloquear = true;
            comparar(carta_1.querySelector("img").src, carta_2.querySelector("img").src);
        }
    }

}


tarjetas.forEach(
    tarjeta => {
        tarjeta.addEventListener("click", voltear);
    }
)

// reiniciar el juego
reiniciar.addEventListener("click", () => {
    tarjetas.forEach(tarjeta => {
        tarjeta.classList.remove("voltear");
    });
    mezclar();
    bloquear = false
    carta_1 = carta_2 = null;
}
);