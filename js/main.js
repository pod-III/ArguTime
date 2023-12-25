document.addEventListener("DOMContentLoaded", function () {
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
    NSDC: {
      name: "NSDC",
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
  let speakersTime = [];
  let styles = "BP";
  let poiRule = system[styles].poi[0];
  let timeRule = system[styles].time;
  let speakerOrder = 0;
  let speaker = system["BP"].speakers[speakerOrder];
  let time = 0;
  let poiSecond = 0;
  let isRunning = false;
  let isPoiAllowed = false;

  // Initial Edit for DOM
  beforeButton.style.visibility = "hidden";
  resetButton.style.display = "none";

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
  const audioHandler = initializeAudioHandler();

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

  // Function to check Poi Rule
  const checkPOI = () => {
    if (speakerOrder > 5) {
      poiRule = system[styles].poi[1];
    } else {
      poiRule = system[styles].poi[0];
    }
    poiButton.style.display = poiRule ? "inline" : "none";
  };

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
    startButton.innerHTML = "Start";
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

  // Check POI Button
  const poiColor = function (i) {
    poiButton.style.backgroundColor = i === 1 ? "#28a745" : "grey";
    poiButton.disabled = i === 1? false : true
  };

  const poiButtonChecker = () => {
    const rule1 = time >= timeRule[0];
    const rule2 = time <= timeRule[1] || time <= timeRule[5];
    if (poiRule) {
      if (rule1 && rule2) {
        poiColor(1);
      } else {
        poiColor(2);
      }
    }
  };

  // Function to bell a sound based on the amount of time passed
  const timeKeeperFunction = () => {
    if (timeRule.includes(time)) {
      if (speakerOrder < 7) {
        switch (time) {
          case timeRule[0]:
            poiColor(1);
            bellSound(1);
            break;
          case timeRule[1]:
            poiColor(2);
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
            poiColor(1);
            bellSound(1);
            break;
          case timeRule[5]:
            poiColor(2);
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
    resetButton.style.display = "inline";
    startButton.innerHTML = "Stop";
    isRunning = true;
    timer = setInterval(counting, 1000);
  };

  // Function to stop the counting process
  const stop = () => {
    startButton.innerHTML = "Start";
    isRunning = false;
    clearInterval(timer);
    clearInterval(bellLoop);
  };

  // Function to count normal timer/stopwatch
  const counting = () => {
    timeKeeperFunction();
    time++;
    changeDisplay(time);
  };

  // Function to count POI timer/stopwatch
  const countPoi = () => {
    poiButton.innerHTML = poiSecond;
    const poiTimer = setInterval(() => {
      poiSecond++;
      poiButton.innerHTML = poiSecond;
      if (poiSecond === 16 || !isPoiAllowed || !isRunning) {
        bellSound(1);
        poiSecond = 0;
        clearInterval(poiTimer);
        poiButton.innerHTML = "POI";
        isPoiAllowed = false;
      }
    }, 1000);
  };

  // Initial DOM edit
  speakerText.innerHTML = speaker;
  resetButton.style.display = "none";
  buttonDisplay();

  // Event Listeners for the HTML Elements
  startButton.addEventListener("click", () => {
    isRunning ? stop() : start();
  });

  resetButton.addEventListener("click", () => {
    resetButton.style.display = "none";
    stop();
    time = 0;
    changeDisplay(0);
    poiButtonChecker()
  });

  poiButton.addEventListener("click", () => {
    if (time >= 60 && time <= 360 && isRunning) {
      isPoiAllowed = !isPoiAllowed;
      countPoi();
    } else {
      console.log("not time yet");
    }
  });

  debateStyleButton.addEventListener("change", () => {
    isRunning ? console.log("can't change when timer running") : changeSystem();
  });

  beforeButton.addEventListener("click", () => {
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
