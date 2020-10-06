const apiKey = "VZ4N6ebz6BSdgrhUNiKAAU0dNYws5GSn";

const videoCtn = document.getElementById("video-ctn");
const videoCtnContents = Array.from(videoCtn.children).splice(4, 3);
const video = videoCtnContents[2].firstElementChild;
console.log(video)
const processingVideoPanel = videoCtnContents[2].lastElementChild;
const steps = document.querySelectorAll(".step-number");
const confirmBtn = document.getElementById("confirm-btn");
const restartRecBtn = document.getElementById("restart-record-btn");
const timer = restartRecBtn.previousElementSibling;
let currentStep = 0;

confirmBtn.addEventListener("click", recordNextStep);
restartRecBtn.addEventListener("click", restartRecord);

function recordNextStep() {
  switch (currentStep) {
    case (0): //El usuario ha presionado en "Comenzar".
      confirmBtn.classList.add("btn-hidden");
      steps[0].classList.add("current-step");
      videoCtnContents[0].classList.add("hidden");
      videoCtnContents[1].classList.remove("hidden");
      currentStep++;
      getVideo();
      return;
    case (1): //El usuario aceptó el permiso de la cámara. 
      confirmBtn.textContent = "Grabar";
      confirmBtn.classList.remove("btn-hidden");
      steps[0].classList.remove("current-step");
      steps[1].classList.add("current-step");
      videoCtnContents[1].classList.add("hidden");
      videoCtnContents[2].classList.remove("hidden");
      currentStep++;
      return;
    case (2): //El usuario presionó en "Grabar".
      confirmBtn.textContent = "Finalizar";
      //1. Comenzar la grabación.
      timer.classList.remove("hidden");
      //2. Setear el time counter para que funcione.
      currentStep++;
      return;
    case (3): //El usuario presionó en "Finalizar".
      confirmBtn.textContent = "Subir Gifo";
      //1. Detener la grabación.
      //2. Parar el time counter (sí, remover el interval es necesario porque sigue corriendo).
      timer.classList.add("hidden");
      restartRecBtn.classList.remove("hidden");
      currentStep++;
      return;
    case (4): //El usuario presionó "Subir Gifo".
      confirmBtn.classList.add("btn-hidden");
      steps[1].classList.remove("current-step");
      steps[2].classList.add("current-step");
      restartRecBtn.classList.add("hidden");
      processingVideoPanel.classList.remove("hidden");
      //2. Subir gif a Giphy.
      //3. Mostrar el "subido" y los botoncitos en la esquinita.
      //3. Agregar el id del gif a la lista de mis gifos.
      return;
  }
}

function restartRecord() {
  currentStep = 2;
  confirmBtn.textContent = "Grabar";
  restartRecBtn.classList.add("hidden");
}



function getVideo() {
  navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

  navigator.getUserMedia(
    {
      video: true,
      audio: false
    },
    // successCallback
    function (localMediaStream) {
      video.srcObject = localMediaStream;
      recordNextStep();
    },
    // errorCallback
    function (err) {
      console.log("No se puede capturar video. Ocurrió el siguiente error: \n" + err);
    }
  );
}


//TESTING ZONE

function uploadGif(gif) {

  //COMPLETE THIIIIIS.
  fetch(`https://upload.giphy.com/v1/gifs?api_key=${apiKey}&file=${gif}`) ///Es fetch lo que tengo que usar?
    .then(
      //Handle successfully uploaded file.
    )
    .catch(
      //Handle failed upload.
    )
}

////Para cambiar la pantalla de "subiendo gifo" a "gifo subido". Falta:
//1. Darle estilo a la tipografía.
//2. Sacarle la animación giratoria al iconito cuando cambia.
//3. Hacer la misma pantalla para el case "no se pudo subir".
// setTimeout(3000);
// //Case ok:
// processingVideoPanel.firstElementChild.src = "../../images/check.svg";
// processingVideoPanel.lastElementChild.textContent = "GIFO subido con éxito";



///PENDIENTE:
//1.Sacarle la ficha a la cámara y su position (y al rollo también).
//2.Darle estilos al repetir y el timer y posicionarlos.
//3.Todo lo de los comentarios del nextStep() y lo de acá arriba de subir gifo.
//4.Estilos mobile-friendly.
