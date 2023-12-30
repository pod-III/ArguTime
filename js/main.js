// HTML DOM Variables
const debateStyleButtonElement = document.getElementById("system");
const timerDisplayElement = document.getElementById("time");
const startButtonElement = document.getElementById("start");
const resetButtonElement = document.getElementById("reset");
const poiButtonElement = document.getElementById("poi");
const beforeButtonElement = document.getElementById("before");
const nextButtonElement = document.getElementById("next");
const speakerTextElement = document.getElementById("speaker");

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
  // Built-in audio dir path
  const soundList = {
    bell: "media/bell.mp3",
    cow: "media/moo.mp3",
  };

  // Audio File Variables
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

  // Function for uploading constum audio file
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

// Sound Function
const soundFunctions = initializeAudioHandler();

const saveSound = soundFunctions.save;
const playSound = soundFunctions.play;

function mainFunction() {
  // SetInterval declaration as global variables
  let timer;
  let bellLoop;
  let poiTimer;

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
        beforeButtonElement.style.visibility = "hidden";
        break;
      case 1:
        beforeButtonElement.style.visibility = "visible";
        break;
      case 5:
        poiRule = system[styles].poi[0];
        checkPOI();
        break;
      case 6:
        nextButtonElement.style.visibility = "visible";
        checkPOI();
        break;
      case 7:
        nextButtonElement.style.visibility = "hidden";
        checkPOI();
        break;
      default:
        break;
    }
  };

  // Function to create a bell sound
  const bellSound = (i) => {
    if (i === 1) {
      playSound();
    } else {
      playSound();
      setTimeout(playSound, 500);
    }
  };

  // Function to update the timer display
  const changeDisplay = (number) => {
    const minute = Math.floor(number / 60);
    const second = number % 60;
    const pad = (value) => (value < 10 ? `0${value}` : `${value}`);
    const text = `${pad(minute)}:${pad(second)}`;
    timerDisplayElement.innerHTML = text;
  };

  // Function to update speaker position
  const updateSpeaker = () => {
    time = speakersTime[speakerOrder] || 0;
    checkPOI();
    poiButtonChecker();
    changeDisplay(time);
    stop();
    speaker = system[styles].speakers[speakerOrder];
    speakerTextElement.innerHTML = speaker;
    startButtonElement.innerHTML = '<i class="fa fa-play"></i> Start';
  };

  // Function to change the debate system
  const changeSystem = () => {
    const index = debateStyleButtonElement.selectedIndex;
    styles = debateStyleButtonElement.options[index].value;
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
    resetButtonElement.style.display = "inline-block";
    startButtonElement.innerHTML = '<i class="fa fa-pause"></i> Pause';
    debateStyleButtonElement.disabled = true;
    isRunning = true;
    timer = setInterval(counting, 100);
    if (isPoiRunning) {
      startPoi();
    }
  };

  // Function to stop the counting process
  const stop = () => {
    startButtonElement.innerHTML = '<i class="fa fa-play"></i> Start';
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
    poiButtonElement.style.display = poiRule ? "inline-block" : "none";
  };

  // Function to check current POI time rule
  const checkPoiTime = () => {
    poiRule1 = time >= timeRule[0];
    poiRule2 = time < timeRule[1] || time < timeRule[5];
    console.log(poiRule1, poiRule2);
    if (poiRule1 && poiRule2) {
      isPoiAllowed = true;
    } else {
      isPoiAllowed = false;
    }
  };

  // Change POI Button Color
  const poiColor = (i) => {
    poiButtonElement.style.backgroundColor = i === 1 ? "#5eb97d" : "grey";
    poiButtonElement.disabled = i === 1 ? false : true;
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
      poiButtonElement.innerHTML = poiSecond;
      poiTimer = setInterval(countPoi, 100);
    }
  };

  // Function to stop POI counting
  const stopPoi = (i) => {
    if (i === 1) {
      poiSecond = 0;
      clearInterval(poiTimer);
      poiButtonElement.innerHTML = "POI";
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
        poiButtonElement.innerHTML = poiSecond;
        poiMicroSecond = 0;
      }
    }
  };

  // Event Listeners for the HTML Elements
  startButtonElement.addEventListener("click", () => {
    isRunning ? stop() : start();
  });

  resetButtonElement.addEventListener("click", () => {
    stop();
    stopPoi(1);
    time = 0;
    resetButtonElement.style.display = "none";
    debateStyleButtonElement.disabled = false;
    changeDisplay(0);
    poiButtonChecker();
  });

  poiButtonElement.addEventListener("click", () => {
    isPoiRunning && isRunning ? stopPoi(1) : startPoi();
  });

  debateStyleButtonElement.addEventListener("change", () => {
    isRunning ? console.log("can't change when timer running") : changeSystem();
  });

  beforeButtonElement.addEventListener("click", () => {
    speakersTime[speakerOrder] = time;
    speakerOrder--;
    updateSpeaker();
    buttonDisplay();
  });

  nextButtonElement.addEventListener("click", () => {
    speakersTime[speakerOrder] = time;
    speakerOrder++;
    updateSpeaker();
    buttonDisplay();
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
}

// Global Loader
document.addEventListener("DOMContentLoaded", mainFunction);
