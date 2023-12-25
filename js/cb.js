document.addEventListener("DOMContentLoaded", function () {
  //DOM Variables
  const debateStyleButton = document.getElementById("system");
  const timeDisplay = document.getElementById("time");
  const startButton = document.getElementById("start");
  const resetButton = document.getElementById("reset");

  //Global Variables
  let timer;
  let bellLoop;
  let system = {
    BP: {
      name: "British Parliamentary",
      time: [900],
    },
    Asian: {
      name: "Asian Parliamentary",
      time: [1800],
    },
    NSDC: {
      name: "NSDC",
      time: [1800],
    },
    Austral: {
      name: "Australian Parliamentary",
      time: [1800],
    },
    list: function () {
      let list = [];
      for (let key in this) {
        if (this.hasOwnProperty(key) && typeof this[key] !== "function") {
          list.push(this[key].name);
        }
      }
      console.log(list);
      return list;
    },
  };

  let timeRule = system["BP"].time;
  let time = timeRule;
  let isRunning = false;

  //Function to create a bell sound

  const bellSound = (i) => {
    const play = audioHandler.play;
    if (i == 1) {
      play();
      console.log("test");
    } else {
      play();
      setTimeout(play, 500);
    }
  };

  // Change Debate System
  const changeSystem = () => {
    let index = debateStyleButton.selectedIndex;
    let style = debateStyleButton.options[index].value;
    timeRule = system[style].time;
    time = timeRule;
    changeDisplay(time);
    console.log(timeRule);
  };

  // Change Timer Display
  const changeDisplay = (number) => {
    let minute = Math.floor(number / 60);
    let second = number % 60;
    function pad(value) {
      let string = value < 10 ? `0${value}` : `${value}`;
      return string;
    }
    let text = `${pad(minute)}:${pad(second)}`;
    timeDisplay.innerHTML = text;
  };

  // Function to Start and Stop
  const start = () => {
    if (!isRunning) {
      isRunning = true;
      timer = setInterval(counting, 1000);
      startButton.innerHTML = "Stop";
    }
  };

  const stop = () => {
    if (isRunning) {
      isRunning = false;
      clearInterval(timer);
      clearInterval(bellLoop);
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

  // Event Listerner for HTML Element
  startButton.addEventListener("click", () => {
    if (isRunning) {
      console.log("stop button");
      stop();
    } else {
      console.log("start button");
      start();
    }
  });
  resetButton.addEventListener("click", () => {
    console.log("reset button");
    stop();
    time = timeRule;
    changeDisplay(time);
  });
  debateStyleButton.addEventListener("change", () => {
    if (isRunning) {
      console.log("can't change when timer running");
    } else {
      changeSystem();
      console.log("select");
    }
  });

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
});

// Pop Up Function
function openPopup() {
  document.getElementById("popupOverlay").style.display = "flex";
}

function closePopup() {
  document.getElementById("popupOverlay").style.display = "none";
}
