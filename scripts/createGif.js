const apiKey = "VZ4N6ebz6BSdgrhUNiKAAU0dNYws5GSn";

const videoCtn = document.getElementById("video-ctn");
const videoCtnContents = Array.from(videoCtn.children).splice(5, 3);
const video = videoCtnContents[2].firstElementChild;
const processingVideoPanel = videoCtnContents[2].lastElementChild;
const steps = document.querySelectorAll(".step-number");
const confirmBtn = document.getElementById("confirm-btn");
const restartRecBtn = document.getElementById("restart-record-btn");
const timer = restartRecBtn.previousElementSibling;
let recorder = null;
let currentStep = 0;
let timerSet = null;
let seconds = 0;

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
      seconds = 0;
      timerSet = setInterval(setTimer, 1000);
      timer.classList.remove("hidden");
      currentStep++;
      return;
    case (3): //El usuario presionó en "Finalizar".
      confirmBtn.textContent = "Subir Gifo";
      recorder.stopRecording();
      clearInterval(timerSet);
      timer.textContent = "00:00:00";
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


function setTimer() { //Actualiza el timer a un segundo más.
  const timeValue = new Date(seconds * 1000).toISOString().substr(11, 8);
  timer.textContent = timeValue;
  seconds++;
};

function restartRecord() { //Vuelve la interfaz a la instancia de iniciar grabación.
  currentStep = 2;
  confirmBtn.textContent = "Grabar";
  restartRecBtn.classList.add("hidden");
}

function getVideo() { //Pide acceso a la cámara y comienza a mostrar el video por pantalla.
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
    //Error Callback. Media Access Denied.
    function (err) {
      console.log("No se puede capturar video. Ocurrió el siguiente error: \n" + err);
    }
  );
}


function uploadGif(gif) { //Sube el gif a giphy y lo agrega a la lista de 'Mis Gifos'.

  fetch(`https://upload.giphy.com/v1/gifs?file=${gif}&api_key=${apiKey}`, {
    method: 'POST',
    body: gif,
    json: true,
    mode: 'cors'
  })
    .then((res) => res.json())
    .then(res => {
      //Agrega el gif a 'Mis Gifos'.
      let myGifs = JSON.parse(localStorage.getItem("myGifs"));
      if (myGifs === null) myGifs = [];
      myGifs.push(res.data.id);
      localStorage.setItem("myGifs", JSON.stringify(myGifs));

      //Funcionalidad de los botones.
      const btnsCtn = processingVideoPanel.firstElementChild;
      btnsCtn.firstElementChild.href = window.URL.createObjectURL(recorder);
      btnsCtn.firstElementChild.dataset.downloadurl = ['application/octet-stream', 'myGifo.gif', btnsCtn.firstElementChild.href].join(':');

      btnsCtn.lastElementChild.dataset.url = `https://giphy.com/gifs/${res.data.id}`;
      btnsCtn.lastElementChild.addEventListener("click", copyToClipboard);

      //Cambia de la pantalla de loading a la de success.
      btnsCtn.classList.remove("hidden");
      processingVideoPanel.children[1].classList.remove("rotate");
      processingVideoPanel.children[1].src = "../../images/check.svg";
      processingVideoPanel.lastElementChild.textContent = "GIFO subido con éxito";
    })
    .catch( //Handle failed upload.
      (err) => console.log("No se pudo subir el gif a Giphy. \n" + err)
    )
}

function copyToClipboard() { //Copia al cortapapeles el link del gif en Giphy.
  var input = document.createElement('input');
  document.body.appendChild(input)
  input.value = this.dataset.url;
  input.select();
  document.execCommand("copy");
  input.remove();
}

