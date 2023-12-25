// Audio Handler
function initializeAudioHandler() {
  const audioFileInput = document.getElementById("audioFileInput");
  const playButton = document.getElementById("playButton");
  let audioContext;
  let audioBuffer;

  // Function to load a default audio file
  function loadDefaultAudio() {
    const defaultAudioPath = "media/bell.mp3";
    const xhr = new XMLHttpRequest();
    xhr.open("GET", defaultAudioPath, true);
    xhr.responseType = "arraybuffer";

    xhr.onload = function () {
      const audioData = xhr.response;
      audioContext = new window.AudioContext();

      audioContext.decodeAudioData(audioData, function (buffer) {
        audioBuffer = buffer;
      });
    };

    xhr.send();
  }

  // Load default audio when the page loads
  loadDefaultAudio();

  audioFileInput.addEventListener("change", function (event) {
    playButton.disabled = false;

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const audioData = e.target.result;

      audioContext = new (window.AudioContext || window.webkitAudioContext)();

      audioContext.decodeAudioData(audioData, function (buffer) {
        audioBuffer = buffer;
      });
    };

    reader.readAsArrayBuffer(file);
  });

  playButton.addEventListener("click", function () {
    console.log("clicked");
    if (audioContext && audioBuffer) {
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    }
  });

  return {
    play: function () {
      if (audioContext && audioBuffer) {
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
      }
    },
  };
}

document.addEventListener("DOMContentLoaded", function () {
  const audioHandler = initializeAudioHandler();
});
