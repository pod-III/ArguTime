function initializeAudioHandler() {
  const audioFileInput = document.getElementById("audioFileInput");
  const soundPic = document.getElementById("soundpic");
  const checkBox = document.getElementById("uploadCheckbox");
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
    console.log("Audio File Default Loaded", audioFileInput.files.length > 0);
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
      if (audioFileInput.files.length > 0 && checkBox.checked) {
        console.log("Upload Saved");
        audioFileInputFunction(audioFileInput);
        document.getElementById("soundpic").selectedIndex = 0;
      } else {
        console.log("No file selected. Resetting to default. Saved");
        loadDefaultAudio(soundPic.value);
      }
      document.getElementById("popupOverlay").style.display = "none";
    },
  };
}

// DOM Variables
const debateStyleButton = document.getElementById("system");
const timeDisplay = document.getElementById("time");
const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");

// Audio Functions

const soundFunctions = initializeAudioHandler();

const saveSound = soundFunctions.save;
const playSound = soundFunctions.play;

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
    resetButton.style.display = "inline-block";
    isRunning = true;
    timer = setInterval(counting, 1000);
    startButton.innerHTML = '<i class="fa fa-pause"></i> Pause';
  }
};

const stop = () => {
  if (isRunning) {
    isRunning = false;
    clearInterval(timer);
    startButton.innerHTML = '<i class="fa fa-play"></i> Start';
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
  resetButton.style.display = "none";
  changeDisplay(time);
});

debateStyleButton.addEventListener("change", () => {
  isRunning ? console.log("can't change when timer running") : changeSystem();
});

let audioPicIndex;
let checkBox;

// Pop Up Function
function openPopup() {
  document.getElementById("popupOverlay").style.display = "flex";
  audioPicIndex = document.getElementById("soundpic").selectedIndex;
  checkBox = document.getElementById("uploadCheckbox").checked;
}

function closePopUp() {
  document.getElementById("uploadCheckbox").checked = checkBox;
  document.getElementById("soundpic").selectedIndex = audioPicIndex;
  document.getElementById("popupOverlay").style.display = "none";
}

// Pop Up Function Form
function openPopupForm() {
  document.getElementById("popupOverlayForm").style.display = "flex";
}

function closePopupForm() {
  document.getElementById("popupOverlayForm").style.display = "none";
}
