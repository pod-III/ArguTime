// HTML DOM Variables
const debateStyleButtonElement = document.getElementById("system");
const timerDisplayElement = document.getElementById("time");
const startButtonElement = document.getElementById("start");
const resetButtonElement = document.getElementById("reset");

// Popup DOM
const popupButtonSoundCloseElement = document.getElementById("close-btn-sound");
const popupButtonFormCloseElement = document.getElementById("close-btn-form");
const popupButtonSoundOpenElement = document.getElementById("setting");
const popupButtonFormOpenElement = document.getElementById("feedback-button");

// Sound HTML DOM Variables
const soundPopupOverlayElement = document.getElementById("popupOverlay");
const uploadCheckboxElement = document.getElementById("uploadCheckbox");
const soundPickElement = document.getElementById("soundpic");
const formPopupOverlayElement = document.getElementById("popupOverlayForm");
const audioFileInputElement = document.getElementById("audioFileInput");

// Audio Function Handler
function initializeAudioHandler() {
  const soundList = {
    bell: "../media/bell.mp3",
    cow: "../media/moo.mp3",
  };
  let audioContext;
  let audioBuffer;

  // Function to load a default audio file
  function loadDefaultAudio(key) {
    const defaultAudioPath = soundList[key];
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
    console.log(
      "Audio File Default Loaded",
      audioFileInputElement.files.length > 0
    );
  }

  loadDefaultAudio("bell");

  function audioFileInputFunction(fileInput) {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const audioData = e.target.result;

      audioContext = new (window.AudioContext || window.webkitAudioContext)();

      audioContext.decodeAudioData(audioData, function (buffer) {
        audioBuffer = buffer;
      });
    };
    reader.readAsArrayBuffer(file);
  }

  return {
    play: function () {
      if (audioContext && audioBuffer) {
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer || null;
        source.connect(audioContext.destination);
        source.start();
      }
    },
    save: function () {
      if (
        audioFileInputElement.files.length > 0 &&
        uploadCheckboxElement.checked
      ) {
        console.log("Upload Saved");
        audioFileInputFunction(audioFileInput);
        soundPickElement.selectedIndex = 0;
      } else {
        console.log("No file selected. Resetting to default. Saved");
        loadDefaultAudio(soundPickElement.value);
      }
      soundPopupOverlayElement.style.display = "none";
    },
  };
}

// Audio Functions
const soundFunctions = initializeAudioHandler();
const saveSound = soundFunctions.save;
const playSound = soundFunctions.play;

// Main Timer Function
const mainFunction = () => {
  // Loop Interval Variable
  let timer;

  // Debate system object
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

  // Global Vairables
  let timeRule = system["BP"].time;
  let time = timeRule;
  let isRunning = false;

  // Function to create a bell sound
  const bellSound = (i) => {
    if (i === 1) {
      playSound();
    } else {
      playSound();
      setTimeout(playSound, 500);
    }
  };

  // Change Debate System
  const changeSystem = () => {
    const index = debateStyleButtonElement.selectedIndex;
    const style = debateStyleButtonElement.options[index].value;
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
    timerDisplayElement.innerHTML = text;
  };

  // Function to Start and Pause the Timer
  const start = () => {
    if (!isRunning) {
      resetButtonElement.style.display = "inline-block";
      isRunning = true;
      timer = setInterval(counting, 1000);
      startButtonElement.innerHTML = '<i class="fa fa-pause"></i> Pause';
    }
  };

  const stop = () => {
    if (isRunning) {
      isRunning = false;
      clearInterval(timer);
      startButtonElement.innerHTML = '<i class="fa fa-play"></i> Start';
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
  startButtonElement.addEventListener("click", () => {
    isRunning ? stop() : start();
  });

  resetButtonElement.addEventListener("click", () => {
    stop();
    time = timeRule;
    resetButtonElement.style.display = "none";
    changeDisplay(time);
  });

  debateStyleButtonElement.addEventListener("change", () => {
    isRunning ? console.log("can't change when timer running") : changeSystem();
  });

  // Variable to store temp setting
  let audioPicIndex;
  let checkBox;

  // Pop Up Function Sound
  popupButtonSoundOpenElement.addEventListener("click", function openPopup() {
    soundPopupOverlayElement.style.display = "flex";
    audioPicIndex = soundPickElement.selectedIndex;
    checkBox = uploadCheckboxElement.checked;
  });

  popupButtonSoundCloseElement.addEventListener("click", function closePopUp() {
    soundPopupOverlayElement.style.display = "none";
    soundPickElement.selectedIndex = audioPicIndex;
    uploadCheckboxElement.checked = checkBox;
  });

  // Pop Up Function Form
  popupButtonFormOpenElement.addEventListener(
    "click",
    function openPopupForm() {
      formPopupOverlayElement.style.display = "flex";
    }
  );

  popupButtonFormCloseElement.addEventListener(
    "click",
    function closePopupForm() {
      formPopupOverlayElement.style.display = "none";
    }
  );
};

// Global Loader
document.addEventListener("DOMContentLoaded", mainFunction);
