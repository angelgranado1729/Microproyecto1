const tiempo = document.getElementById("time");
const reiniciar = document.getElementById("reset");
const tarjetas = document.querySelectorAll(".tarjeta");
const iniciar = document.getElementById("start");
const container_inicio = document.querySelector(".container-inicio");
const container_principal = document.querySelector(".container");
const container_final = document.querySelector(".container-final");
const mensaje_final = document.getElementById("Mensaje");

// Tarjetas seleccionadas
let carta_1;
let carta_2;
// Bloquea para que no se pueda seleccionar más de 2 cartas al mismo tiempo
let bloquear = false;
let tiempo_juego = 0;
let intervalo;
let segundos = 0;
let minutos = 0;
let aciertos = 8;


function iniciar_juego() {
    mezclar();
    aciertos = 0;
    result.innerText = "";
    tiempo_juego = 10000; // Establecer el límite de tiempo en 10 segundos
  }
  

iniciar.addEventListener("click", () => {
    console.log("Sí funcionó bb jejejejeje");
    minutos = 0;
    segundos = 0;
    aciertos = 0;
    container_inicio.classList.add("ocultar");
    container_principal.classList.remove("ocultar");
    intervalo = setInterval(cronometro, 1000);
    iniciar_juego();

  });
  

  const cronometro = () => {
    segundos++;
    if (segundos === 60) {
      segundos = 0;
      minutos++;
    }
    let segundos_aux = segundos < 10 ? `0${segundos}` : segundos;
    let minutos_aux = minutos < 10 ? `0${minutos}` : minutos;
    tiempo.innerHTML = `${minutos_aux}:${segundos_aux}`;
  
    tiempo_juego -= 1000; // Reducir el tiempo de juego en 1 segundo (1000 milisegundos)
  
    if (tiempo_juego <= 0) {
      detener_juego();
    }
  };
  


// Mezcla las cartas aleatoriamente
function mezclar() {
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener("click", voltear);
        let random = Math.floor(Math.random() * 16);
        tarjeta.style.order = random;
    });
}

// Compara las imagenes de las tarjetas
function comparar(carta1, carta2) {
    if (carta1 === carta2) {
        setTimeout(() => { 
            carta_1.classList.add("match");
            carta_2.classList.add("match");
            carta_1.removeEventListener("click", voltear);
            carta_2.removeEventListener("click", voltear);

        }, 450);

        setTimeout(() => {
            carta_1.classList.remove("match");
            carta_2.classList.remove("match");
            carta_1 = carta_2 = null;
            bloquear = false;
            aciertos++;
        }, 400);   

    }else {
        setTimeout(() => {
            carta_1.classList.add("no-match");
            carta_2.classList.add("no-match");
            carta_1.classList.remove("voltear");
            carta_2.classList.remove("voltear");
        }, 400);
    
        setTimeout(() => {
            carta_1.classList.remove("no-match");
            carta_2.classList.remove("no-match");
            carta_1 = carta_2 = null;
            bloquear = false;
        }, 450);
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

function reiniciarTiempo() {
    clearInterval(intervalo);
    segundos = 0;
    minutos = 0;
    tiempo.innerHTML = "00:00";
    tiempo_juego = 10000; // Reiniciar el tiempo de juego a 10 segundos
    cronometro(); // Ejecutar el cronómetro una vez para mostrar "00:00" inmediatamente
  }
  
reiniciar.addEventListener("click", () => {
  tarjetas.forEach((tarjeta) => {
    tarjeta.classList.remove("voltear");
  });
  mezclar();
  bloquear = false;
  carta_1 = carta_2 = null;
  reiniciarTiempo();
  clearInterval(intervalo); // Detener el intervalo actual
  intervalo = setInterval(cronometro, 1000); // Iniciar un nuevo intervalo
  console.log("Reiniciar");
});

//detiene el juego
function detener_juego() {
    clearInterval(intervalo);
    tiempo.innerHTML = "00:00";
    segundos = 0;
    minutos = 0;
    container_principal.classList.add("ocultar");
    container_final.classList.remove("ocultar");
    if (aciertos === 8) {
        mensaje_final.innerText = "¡Felicidades! Has ganado el juego";
    } else {
        mensaje_final.innerText = "¡Lo siento! Has perdido el juego";
    }

    reiniciar.classList.remove("ocultar");

}


  
