// Declaración de variables y selección de elementos del DOM
const container_inicio = document.querySelector(".container-inicio");
const container_principal = document.querySelector(".container");
const container_final = document.querySelector(".mensaje-final");
const tarjetas = document.querySelectorAll(".tarjeta");
const tiempo = document.getElementById("time");
const reiniciar = document.getElementById("reset");
const iniciar = document.getElementById("start");
const points = document.getElementById("score");
const username = document.getElementById("username");
const mensaje_long_error = document.querySelector(".error_long");


/**
 * Variables globales
 */
// Tarjetas seleccionadas
let carta_1;
let carta_2;

// Bloqueo para evitar seleccionar de más de 2 cartas al mismo tiempo
let bloquear = false;
// Tiempo de juego
let tiempo_juego = 180000;
let intervalo;
let segundos = 0;
let minutos = 3;
// Aciertos
let aciertos = 0;
// Puntaje
let puntaje = 0;
// Usuario
let usuario = "";

/**
 * Inicializa el juego al mezclar las tarjetas.
 */
function iniciar_juego() {
  container_inicio.classList.add("ocultar");
  container_principal.classList.remove("ocultar");
  intervalo = setInterval(cronometro, 1000);
  tiempo.innerHTML = `<span id="minutes">3</span>:<span id="seconds">00</span>`;
  points.innerHTML = `<span id="puntos">0</span>`;
  mezclar();
  // detener_juego();
}

////////////////////// Eventos //////////////////////

/**
 * Evento al hacer clic en el botón "Iniciar".
 */
iniciar.addEventListener("click", () => {
  usuario = username.value.trim();
  if (usuario !== "") {
    if (usuario.length > 15) {
      // Nombre de usuario demasiado largo
      username.value = "";
      username.classList.add("error-longitud");
      mensaje_long_error.classList.remove("ocultar");
      setTimeout(() => {
        mensaje_long_error.innerHTML = `<div class="error_long">
          <span class="material-symbols-outlined">
            error
          </span>
          <p id="error_long--p">Ingrese un nombre con menos de 16 caracteres</p>
        </div>`;
      }, 150);
    } else {
      // Nombre de usuario válido, iniciar el juego
      username.classList.remove("error");
      username.classList.remove("error-longitud");
      mensaje_long_error.classList.add("ocultar");
      setTimeout(() => {
        iniciar_juego();
      }, 150);
    }
  } else {
    // Nombre de usuario vacío
    username.value = "";
    username.placeholder = "Nombre de usuario";
    username.classList.add("error");
    mensaje_long_error.classList.remove("ocultar");
    setTimeout(() => {
      mensaje_long_error.innerHTML = `<div class="error_long">
        <span class="material-symbols-outlined">
          error
        </span>
        <p id="error_long--p">Ingrese un nombre para iniciar el juego</p>
      </div>`;
    }, 150);
  }
});

/**
 * Evento al hacer clic en el botón "Reiniciar".
 */
reiniciar.addEventListener("click", reiniciar_config);

////////////////////// Funcionalidades Tarjetas //////////////////////

/**
 * Compara las imágenes de dos tarjetas y realiza las acciones correspondientes en caso de acierto o error.
 * @param {string} carta1 - URL de la imagen de la primera tarjeta.
 * @param {string} carta2 - URL de la imagen de la segunda tarjeta.
 */
function comparar(carta1, carta2) {
  if (carta1 === carta2) {
    // Acierto
    aciertos++;
    points.innerHTML = `<span id="puntos">${aciertos}</span>`;
    setTimeout(() => {
      carta_1.classList.add("match");
      carta_2.classList.add("match");
      carta_1.removeEventListener("click", voltear);
      carta_2.removeEventListener("click", voltear);
    }, 450);

    setTimeout(() => {
      carta_1 = carta_2 = null;
      bloquear = false;
    }, 460);

    if (aciertos === 8) {
      detener_juego();
    }
    console.log(aciertos);
  } else {
    // Error
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

/**
 * Voltea una tarjeta al hacer clic en ella y realiza la comparación si hay dos tarjetas seleccionadas.
 * @param {Event} e - Evento de clic en una tarjeta.
 */
function voltear(e) {
  let carta_selec = e.target;
  if (carta_selec !== carta_1 && !bloquear) {
    carta_selec.classList.add("voltear");
    if (!carta_1) {
      carta_1 = carta_selec;
    } else {
      carta_2 = carta_selec;
      bloquear = true;
      comparar(
        carta_1.querySelector("img").src,
        carta_2.querySelector("img").src
      );
    }
  }
}

////////////////////// Calcular puntaje //////////////////////

/**
 * Calcula el puntaje obtenido en base al tiempo restante.
 * @returns {number} - Puntaje obtenido.
 */
function calcular_puntaje() {
  const puntaje_max = 500;
  puntaje = parseFloat((puntaje_max * (tiempo_juego / 180000)).toFixed(2));
  return puntaje;
}

////////////////////// Función del cronómetro //////////////////////

/**
 * Actualiza el cronómetro cada segundo y detiene el juego cuando se agota el tiempo.
 */
const cronometro = () => {
  if (segundos === 0) {
    minutos--;
    segundos = 60;
  }
  segundos--;
  tiempo_juego -= 1000;
  let segundos_aux = segundos < 10 ? `0${segundos}` : segundos;
  let minutos_aux = minutos < 10 ? `0${minutos}` : minutos;
  tiempo.innerHTML = `<span id="minutes">${minutos_aux}</span>:<span id="seconds">${segundos_aux}</span>`;

  if (tiempo_juego <= 0) {
    detener_juego();
  }
};

///////////////////////// Funciones Auxiliares  /////////////////////////

/**
 * Mezcla las tarjetas de forma aleatoria.
 */
function mezclar() {
  tarjetas.forEach((tarjeta) => {
    tarjeta.addEventListener("click", voltear);
    let random = Math.floor(Math.random() * 16);
    tarjeta.style.order = random;
  });
}

/**
 * Reinicia el tiempo del juego.
 */
function reiniciarTiempo() {
  minutos = 3;
  segundos = 1;
  tiempo_juego = 180000;
  tiempo.innerHTML = `<span id="minutes">3</span>:<span id="seconds">00</span>`;
  clearInterval(intervalo);
  intervalo = setInterval(cronometro, 1000);
  cronometro();
}

/**
 * Detiene el juego y muestra el mensaje final.
 */
function detener_juego() {
  clearInterval(intervalo);
  puntaje = calcular_puntaje();
  container_principal.classList.add("ocultar");
  container_final.classList.remove("ocultar");
  guardarUsuario();

  var mensajeFinalHTML = '';
  var aciertosText = aciertos === 1 ? "acierto" : "aciertos";

  if (aciertos === 8) {
    mensajeFinalHTML = `
      <h2 id="mensaje">¡Felicitaciones ${usuario}!</h2> 
      <p>Has logrado ${calcular_puntaje()} puntos</p>`;
  } else {
    mensajeFinalHTML = `
      <h2 id="mensaje">¡Has perdido!</h2>
      <h3 id="mensaje__h3-p">Se acabó el tiempo, ${usuario}</h3>
      <p>Obtuviste ${aciertos} ${aciertosText}</p>`;
  }

  container_final.innerHTML = `
    <div class="mensaje-final">
      ${mensajeFinalHTML}
      <h3>Top puntajes registrados</h3>
      <div class="tabla_puntajes">
        <ol id="puntajes">
          ${generarMensajeFinal()}
        </ol>
      </div>
      <button id="reiniciar" onclick="container_principal.classList.remove('ocultar');
        container_final.classList.add('ocultar');
        reiniciar_config();">Reiniciar</button> 
    </div>`;
}

function generarMensajeFinal() {
  var mensaje = mejoresPuntajes();
  var mensaje_final = "";
  mensaje.forEach((element, index) => {
    var fecha = new Date(element.date);

    // Obtener el día, mes y año
    var fechaString =
      fecha.getDate() +
      "/" +
      (fecha.getMonth() + 1) +
      "/" +
      fecha.getFullYear();

    // Obtener la hora y los minutos
    var horas = fecha.getHours();
    var minutos = fecha.getMinutes();

    // Obtener la parte AM/PM
    var periodo = horas >= 12 ? "PM" : "AM";

    // Ajustar el formato de las horas
    if (horas > 12) {
      horas -= 12;
    } else if (horas === 0) {
      horas = 12;
    }

    // Formatear los minutos con ceros a la izquierda si es necesario
    var minutosString = ("0" + minutos).slice(-2);

    // Combinar la fecha y la hora en un solo string
    var fechaHoraString =
      fechaString + " - " + horas + ":" + minutosString + " " + periodo;

    mensaje_final += `<li id="top-player">
    <div id="user">${element.username}</div>
    <div id="ptos">${element.score} puntos</div>
    <div id="fecha">(${fechaHoraString})</div>
    </li>`;
  });
  return mensaje_final;
}

{/* <div id="posicion">${index + 1} </div> */}


function mejoresPuntajes() {
  var users_data = [],
    keys = Object.keys(localStorage),
    i = keys.length;

  // Obtener los datos del localStorage y almacenarlos en el array users_data
  while (i--) {
    users_data.push(JSON.parse(localStorage.getItem(keys[i])));
  }

  // Ordenar los datos de mayor a menor según el puntaje
  users_data.sort(function (a, b) {
    return b.score - a.score;
  });

  // Eliminar los puntajes que no estén entre los 3 mejores
  if (users_data.length > 3) {
    return users_data.slice(0, 3);
  }
  return users_data;
}

function guardarUsuario() {
    var num = localStorage.length;
    localStorage.setItem(
    `info_usuario_${num + 1}`,
    JSON.stringify({username: usuario, score: 3224, date: new Date()})
  );
}

/**
 * Reinicia el juego al hacer clic en el botón "Reiniciar".
 */
function reiniciar_config() {
  reiniciarTiempo();
  points.innerHTML = `<span id="puntos">0</span>`;
  tarjetas.forEach((tarjeta) => {
    tarjeta.classList.remove("voltear");
  });
  bloquear = false;
  carta_1 = null;
  carta_2 = null;
  aciertos = 0;
  puntaje = 0;
  mezclar();
}
