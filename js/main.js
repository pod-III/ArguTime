// Audio Handler
function initializeAudioHandler() {
  const audioFileInput = document.getElementById("audioFileInput");
  const soundPic = document.getElementById("soundpic");
  const checkBox = document.getElementById("uploadCheckbox");
  const soundList = {
    bell: "media/bell.mp3",
    cow: "media/moo.mp3",
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
const poiButton = document.getElementById("poi");
const beforeButton = document.getElementById("before");
const nextButton = document.getElementById("next");
const speakerText = document.getElementById("speaker");

// SetInterval declaration as global variables
let timer;
let bellLoop;
let poiTimer;

// Sound Function
const soundFunctions = initializeAudioHandler();

const saveSound = soundFunctions.save;
const playSound = soundFunctions.play;

// Debating System Rule as object
let system = {
  BP: {
    name: "British Parliamentary",
    speakers: [
      "Prime Minister",
      "Leader of Opposition",
      "Deputy Prime Minister",
      "Deputy Leader of Opposition",
      "Government Member",
      "Opposition Member",
      "Government Whip",
      "Opposition Whip",
    ],
    time: [60, 360, 420, 440, 60, 360, 420, 440],
    poi: [true, true],
  },
  Asian: {
    name: "Asian Parliamentary",
    speakers: [
      "Prime Minister",
      "Leader of Opposition",
      "Deputy Prime Minister",
      "Deputy Leader of Opposition",
      "Government Whip",
      "Opposition Whip",
      "Opposition Reply",
      "Government Reply",
    ],
    time: [60, 360, 420, 440, 60, 180, 240, 260],
    poi: [true, false],
  },
  WSDC: {
    name: "World School",
    speakers: [
      "Prime Minister",
      "Leader of Opposition",
      "Deputy Prime Minister",
      "Deputy Leader of Opposition",
      "Government Whip",
      "Opposition Whip",
      "Opposition Reply",
      "Government Reply",
    ],
    time: [60, 420, 480, 500, 60, 240, 300, 320],
    poi: [true, false],
  },
  Austral: {
    name: "Australian Parliamentary",
    speakers: [
      "Prime Minister",
      "Leader of Opposition",
      "Deputy Prime Minister",
      "Deputy Leader of Opposition",
      "Government Whip",
      "Opposition Whip",
      "Opposition Reply",
      "Government Reply",
    ],
    time: [60, 420, 480, 500, 60, 240, 300, 320],
    poi: [false, false],
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

// Global Variables
let styles = "BP";
let timeRule = system[styles].time;
let speakerOrder = 0;
let speaker = system["BP"].speakers[speakerOrder];
let isRunning = false;
let speakersTime = [];
let microSecond = 0;
let poiMicroSecond = 0;
let time = 0;
let poiSecond = 0;

// POI Variables
let poiRule = system[styles].poi[0];
let isPoiAllowed = false;
let isPoiRunning = false;
let poiRule1 = time >= timeRule[0];
let poiRule2 = time <= timeRule[1] || time <= timeRule[5];
let audioHandler;

// Function to check the button display rule
const buttonDisplay = () => {
  switch (speakerOrder) {
    case 0:
      beforeButton.style.visibility = "hidden";
      break;
    case 1:
      beforeButton.style.visibility = "visible";
      break;
    case 5:
      poiRule = system[styles].poi[0];
      checkPOI();
      break;
    case 6:
      nextButton.style.visibility = "visible";
      checkPOI();
      break;
    case 7:
      nextButton.style.visibility = "hidden";
      checkPOI();
      break;
    default:
      break;
  }
};

// Function to create a bell sound
const bellSound = (i) => {
  if (i === 1) {
    playSound()

  } else {
    playSound()
    setTimeout(playSound, 500);
  }
};

// Function to update the timer display
const changeDisplay = (number) => {
  const minute = Math.floor(number / 60);
  const second = number % 60;
  const pad = (value) => (value < 10 ? `0${value}` : `${value}`);
  const text = `${pad(minute)}:${pad(second)}`;
  timeDisplay.innerHTML = text;
};

// Function to update speaker position
const updateSpeaker = () => {
  time = speakersTime[speakerOrder] || 0;
  checkPOI();
  poiButtonChecker();
  changeDisplay(time);
  stop();
  speaker = system[styles].speakers[speakerOrder];
  speakerText.innerHTML = speaker;
  startButton.innerHTML = '<i class="fa fa-play"></i> Start';
};

// Function to change the debate system
const changeSystem = () => {
  const index = debateStyleButton.selectedIndex;
  styles = debateStyleButton.options[index].value;
  timeRule = system[styles].time;
  updateSpeaker();
  checkPOI();
  changeDisplay(time);
};

// Function to bell a sound based on the amount of time passed
const timeKeeperFunction = () => {
  if (timeRule.includes(time)) {
    if (speakerOrder < 7) {
      switch (time) {
        case timeRule[0]:
          poiButtonChecker();
          bellSound(1);
          break;
        case timeRule[1]:
          poiButtonChecker();
          bellSound(1);
          break;
        case timeRule[2]:
          bellSound(2);
          break;
        case timeRule[3]:
          bellLoop = setInterval(() => {
            bellSound(1);
          }, 1000);
          break;
        default:
          break;
      }
    } else {
      switch (time) {
        case timeRule[4]:
          poiButtonChecker();
          bellSound(1);
          break;
        case timeRule[5]:
          poiButtonChecker();
          bellSound(1);
          break;
        case timeRule[6]:
          bellSound(2);
          break;
        case timeRule[7]:
          bellLoop = setInterval(() => {
            bellSound(1);
          }, 1000);
          break;
        default:
          break;
      }
    }
  }
};

// Function that starts the counting process
const start = () => {
  resetButton.style.display = "inline-block";
  startButton.innerHTML = '<i class="fa fa-pause"></i> Pause';
  debateStyleButton.disabled = true;
  isRunning = true;
  timer = setInterval(counting, 100);
  if (isPoiRunning) {
    startPoi();
  }
};

// Function to stop the counting process
const stop = () => {
  startButton.innerHTML = '<i class="fa fa-play"></i> Start';
  isRunning = false;
  clearInterval(timer);
  clearInterval(bellLoop);
  stopPoi(2);
};

// Function to count normal timer/stopwatch
const counting = () => {
  microSecond++;
  if (microSecond === 10) {
    time++;
    timeKeeperFunction();
    changeDisplay(time);
    microSecond = 0;
  }
};

// POI FUNCTIONS
// Function to check Poi Rule
const checkPOI = () => {
  if (speakerOrder > 5) {
    poiRule = system[styles].poi[1];
  } else {
    poiRule = system[styles].poi[0];
  }
  poiButton.style.display = poiRule ? "inline-block" : "none";
};

// Function to check current POI time rule
const checkPoiTime = () => {
  poiRule1 = time >= timeRule[0];
  poiRule2 = time <= timeRule[1] || time <= timeRule[5];
  console.log(poiRule1, poiRule2);
  if (poiRule1 && poiRule2) {
    isPoiAllowed = true;
  } else {
    isPoiAllowed = false;
  }
};

// Change POI Button Color
const poiColor = function (i) {
  poiButton.style.backgroundColor = i === 1 ? "#5eb97d" : "grey";
  poiButton.disabled = i === 1 ? false : true;
  console.log("called");
};

// Check POI Button
const poiButtonChecker = () => {
  checkPoiTime();
  if (poiRule) {
    if (isPoiAllowed) {
      poiColor(1);
    } else {
      poiColor(2);
    }
  }
};

// Function to start counting POI timer/stopwatch
const startPoi = () => {
  checkPoiTime();
  if (isPoiAllowed && isRunning) {
    isPoiRunning = true;
    poiButton.innerHTML = poiSecond;
    poiTimer = setInterval(countPoi, 100);
  }
};

// Function to stop POI counting
const stopPoi = (i) => {
  if (i === 1) {
    poiSecond = 0;
    clearInterval(poiTimer);
    poiButton.innerHTML = "POI";
    isPoiRunning = false;
  } else {
    clearInterval(poiTimer);
  }
};

// Funtion too count the second of POI
const countPoi = () => {
  poiMicroSecond++;
  if (poiMicroSecond === 10) {
    if (poiSecond === 15) {
      bellSound(1);
      stopPoi(1);
    } else {
      poiSecond++;
      poiButton.innerHTML = poiSecond;
      poiMicroSecond = 0;
    }
  }
};

// Event Listeners for the HTML Elements
startButton.addEventListener("click", () => {
  isRunning ? stop() : start();
});

resetButton.addEventListener("click", () => {
  stop();
  stopPoi(1);
  time = 0;
  resetButton.style.display = "none";
  debateStyleButton.disabled = false;
  changeDisplay(0);
  poiButtonChecker();
});

poiButton.addEventListener("click", () => {
  isPoiRunning && isRunning ? stopPoi(1) : startPoi();
});

debateStyleButton.addEventListener("change", () => {
  isRunning ? console.log("can't change when timer running") : changeSystem();
});

beforeButton.addEventListener("click", () => {
  speakersTime[speakerOrder] = time;
  speakerOrder--;
  updateSpeaker();
  buttonDisplay();
});

nextButton.addEventListener("click", () => {
  speakersTime[speakerOrder] = time;
  speakerOrder++;
  updateSpeaker();
  buttonDisplay();
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
