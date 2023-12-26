document.addEventListener("DOMContentLoaded", function () {
  // DOM Variables
  const debateStyleButton = document.getElementById("system");
  const timeDisplay = document.getElementById("time");
  const startButton = document.getElementById("start");
  const resetButton = document.getElementById("reset");

  // Global Variables
  let timer;

  let system = {
    BP: {
      name: "British Parliamentary",
      time: [900],
    },
    Asian: {
      name: "Asian Parliamentary",
      time: [1800],
    },
    WSDC: {
      name: "WSDC",
      time: [1800],
    },
    Austral: {
      name: "Australian Parliamentary",
      time: [1800],
    },
    list: function () {
      return Object.values(this)
        .filter((item) => typeof item !== "function")
        .map((item) => item.name);
    },
  };

  let timeRule = system["BP"].time;
  let time = timeRule;
  let isRunning = false;

  // Audio Handler
  function initializeAudioHandler() {
    const audioFileInput = document.getElementById("audioFileInput");
    const playButton = document.getElementById("playButton");
    let audioContext;
    let audioBuffer;

    // Function to load a default audio file
    function loadDefaultAudio() {
      const defaultAudioPath = "../media/bell.mp3";
      const xhr = new XMLHttpRequest();
      xhr.open("GET", defaultAudioPath, true);
      xhr.responseType = "arraybuffer";

      xhr.onload = function () {
        const audioData = xhr.response;
        audioContext = new (window.AudioContext || window.webkitAudioContext)();

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
        console.log("reached");
        if (audioContext && audioBuffer) {
          console.log("reached II");
          const source = audioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContext.destination);
          source.start();
        }
      },
    };
  }
  const audioHandler = initializeAudioHandler();

  // Function to create a bell sound
  const bellSound = (i) => {
    const play = audioHandler.play;
    if (i === 1) {
      play();
    } else {
      play();
      setTimeout(play, 500);
    }
  };

  // Change Debate System
  const changeSystem = () => {
    const index = debateStyleButton.selectedIndex;
    const style = debateStyleButton.options[index].value;
    timeRule = system[style].time;
    time = timeRule;
    changeDisplay(time);
    console.log(timeRule);
  };

  // Change Timer Display
  const changeDisplay = (number) => {
    const minute = Math.floor(number / 60);
    const second = number % 60;

    function pad(value) {
      return value < 10 ? `0${value}` : `${value}`;
    }

    const text = `${pad(minute)}:${pad(second)}`;
    timeDisplay.innerHTML = text;
  };

  // Function to Start and Stop
  const start = () => {
    if (!isRunning) {
      resetButton.style.display = "inline"
      isRunning = true;
      timer = setInterval(counting, 1000);
      startButton.innerHTML = "Stop";
    }
  };

  const stop = () => {
    if (isRunning) {
      isRunning = false;
      clearInterval(timer);
      startButton.innerHTML = "Start";
    }
  };

  // Function to count
  const counting = () => {
    if (time === 0) {
      stop();
      bellSound(2);
    } else {
      time--;
      changeDisplay(time);
    }
  };

  // Event Listener for HTML Elements
  startButton.addEventListener("click", () => {
    isRunning ? stop() : start();
  });

  resetButton.addEventListener("click", () => {
    stop();
    time = timeRule;
    resetButton.style.display = "none"
    changeDisplay(time);
  });

  debateStyleButton.addEventListener("change", () => {
    isRunning ? console.log("can't change when timer running") : changeSystem();
  });
});

// Pop Up Function
function openPopup() {
  document.getElementById("popupOverlay").style.display = "flex";
}

function closePopup() {
  document.getElementById("popupOverlay").style.display = "none";
}

// Pop Up Function Form
function openPopupForm() {
  document.getElementById("popupOverlayForm").style.display = "flex";
}

function closePopupForm() {
  document.getElementById("popupOverlayForm").style.display = "none";
}
