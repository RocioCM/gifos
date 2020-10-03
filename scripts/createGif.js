const videoCtn = document.getElementById("video-ctn");
let videoCtnContents = Array.from(videoCtn.children).splice(4, 3);
console.log(videoCtnContents)

const steps = Array.from(document.getElementById("steps-ctn").children);
console.log(steps);

const confirmBtn = document.getElementById("confirm-btn");

//getVideo();

function getVideo() {
  navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);
  navigator.getUserMedia(

    // constraints
    {
      video: true,
      audio: false
    },

    // successCallback
    function (localMediaStream) {

      video.srcObject = localMediaStream;
    },

    // errorCallback
    function (err) {
      console.log("Ocurrió el siguiente error: " + err);
    }

  );
}
