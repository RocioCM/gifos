const apiKey = "VZ4N6ebz6BSdgrhUNiKAAU0dNYws5GSn";

const videoCtn = document.getElementById("video-ctn");
const videoCtnContents = Array.from(videoCtn.children).splice(4, 3);
const video = videoCtnContents[2].firstElementChild;
const processingVideoPanel = videoCtnContents[2].lastElementChild;
const steps = document.querySelectorAll(".step-number");
const confirmBtn = document.getElementById("confirm-btn");
const restartRecBtn = document.getElementById("restart-record-btn");
const timer = restartRecBtn.previousElementSibling;
let recorder = null;
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
      recorder.startRecording();
      //2. Setear el time counter para que funcione.
      timer.classList.remove("hidden");

      currentStep++;
      return;
    case (3): //El usuario presionó en "Finalizar".
      confirmBtn.textContent = "Subir Gifo";
      recorder.stopRecording()
      //2. Parar el time counter (sí, remover el interval es necesario porque sigue corriendo).
      timer.classList.add("hidden");
      restartRecBtn.classList.remove("hidden");
      currentStep++;
      return;
    case (4): //El usuario presionó "Subir Gifo".
      video.srcObject.stop();
      confirmBtn.classList.add("btn-hidden");
      steps[1].classList.remove("current-step");
      steps[2].classList.add("current-step");
      restartRecBtn.classList.add("hidden");
      processingVideoPanel.classList.remove("hidden");
      //Subir gif a Giphy:
      let form = new FormData();
      recorder = recorder.getBlob();
      form.append('file', recorder, "myGif.gif")
      uploadGif(form);
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
    navigator.msGetUserMedia ||
    navigator.mediaDevices.getUserMedia);

  navigator.getUserMedia(
    {
      video: { width: 720, height: 480 },
      audio: false
    },
    //Success Callback
    function (localMediaStream) {
      video.srcObject = localMediaStream;
      video.play();
      recorder = RecordRTC(localMediaStream, {
        type: 'gif',
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
      })
      recordNextStep();
    },
    //Error Callback
    function (err) {
      console.log("No se puede capturar video. Ocurrió el siguiente error: \n" + err);
      ///Poner pantalla de failed y reload option.
    }
  );
}


function uploadGif(gif) {

  fetch(`https://upload.giphy.com/v1/gifs?file=${gif}&api_key=${apiKey}`, {
    method: 'POST',
    body: gif,
    json: true,
    mode: 'cors'
  })
    .then((res) => res.json())
    .then(res => {
      //Agrega el gif a favoritos.
      let myGifs = JSON.parse(localStorage.getItem("myGifs"));
      if (myGifs === null) myGifs = [];
      myGifs.push(res.data.id);
      console.log(myGifs);
      localStorage.setItem("myGifs", JSON.stringify(myGifs));

      //Funcionalidad de los botones.
      const btnsCtn = processingVideoPanel.firstElementChild;
      btnsCtn.firstElementChild.href = window.URL.createObjectURL(recorder);
      btnsCtn.firstElementChild.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');

      btnsCtn.lastElementChild.dataset.url = `https://giphy.com/gifs/${res.data.id}`;
      btnsCtn.lastElementChild.addEventListener("click", copyToClipboard);

      //Cambia de la pantalla de loading a la de success.
      btnsCtn.classList.remove("hidden");
      processingVideoPanel.children[1].classList.remove("rotate");
      processingVideoPanel.children[1].src = "../../images/check.svg";
      processingVideoPanel.lastElementChild.textContent = "GIFO subido con éxito";
    })
    .catch(
      (err) => console.log(err)
      ///Handle failed upload. Show failed screen.
    )
}

function copyToClipboard() {
  console.log("Copiar Link"); ///
}

////Para cambiar la pantalla de "subiendo gifo" a "gifo subido". Falta:
//3. Hacer la misma pantalla para el case "no se pudo subir".


///PENDIENTE:
//1.Sacarle la ficha al dibujito de la cámara y su position (y al rollo también).
//3.Ordenar y embellecer el código.
//4.Estilos mobile-friendly.
//6. Poner pantalla de error cuando el gif no se pudo subir. Y reintentar.
///Te puede servir para el timer: https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript .
///Te puede servir para parar el video: https://developer.mozilla.org/en-US/docs/Web/API/MediaStream .