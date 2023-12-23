//DOM Variables
const debateStyleButton = document.getElementById("system");
const timeDisplay = document.getElementById("time");
const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
const poiButton = document.getElementById("poi");
const background = document.getElementById("display");
const bellButton = document.getElementById("bell");
const beforeButton = document.getElementById("before");
const nextButton = document.getElementById("next");
const speakerText = document.getElementById("speaker");
resetButton.style.display = "none";
//Global Variables
let timer;
let bellLoop;
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
let speakersTime = [];
let styleList = system.list();
let styles = "BP";
let poiRule = system[styles].poi[0];
let timeRule = system[styles].time;
let speakerOrder = 0;
let speaker = system["BP"].speakers[speakerOrder];
let time = 0;
let poiSecond = 0;
let isRunning = false;
let isPoiAllowed = false;

// Speaker Display
speakerText.innerHTML = speaker;

//Button Display

const buttonDisplay = () => {
  switch (speakerOrder) {
    case 0:
      beforeButton.style.display = "none";
      break;
    case 1:
      beforeButton.style.display = "inline";
      break;
    case 5:
      poiRule = system[styles].poi[0];
      checkPOI();
      break;
    case 6:
      nextButton.style.display = "inline";
      checkPOI();
      break;
    case 7:
      nextButton.style.display = "none";
      checkPOI();
      break;
    default:
      break;
  }
};
buttonDisplay();

//Function to check Poi Rule
const checkPOI = () => {
  if (speakerOrder > 5) {
    poiRule = system[styles].poi[1];
  } else {
    poiRule = system[styles].poi[0];
  }
  if (!poiRule) {
    poiButton.style.display = "none";
  } else {
    poiButton.style.display = "inline";
  }
};

//Function to create a bell sound

const bellSound = (i) => {
  const bell_1 = document.getElementById("bellAudio1");
  const bell_2 = document.getElementById("bellAudio2");
  if (i == 1) {
    bell_1.play();
    console.log("test");
  } else {
    bell_2.play();
    console.log("test");
  }
};

const changeDisplay = (number) => {
  let minute = Math.floor(number / 60);
  let second = number % 60;
  function pad(value) {
    let string = value < 10 ? `0${value}` : `${value}`;
    return string;
  }
  //console.log(minute, second);
  let text = `${pad(minute)}:${pad(second)}`;
  //console.log("it loops");
  timeDisplay.innerHTML = text;
};

// Function to update speaker
const updateSpeaker = () => {
  time = speakersTime[speakerOrder];
  if (time === undefined) {
    time = 0;
  }
  changeDisplay(time);
  stop();
  changeBackground();
  speaker = system[styles].speakers[speakerOrder];
  speakerText.innerHTML = speaker;
  startButton.innerHTML = "Start";
};

// Change Debate System
const changeSystem = () => {
  let index = debateStyleButton.selectedIndex;
  styles = debateStyleButton.options[index].value;
  timeRule = system[styles].time;
  updateSpeaker();
  checkPOI();
  changeDisplay(time);
  // console.log(timeRule);
};

const changeBackground = () => {
  if (speakerOrder < 3) {
    switch (time) {
      case timeRule[0]:
        background.style.backgroundColor = "green";
        bellSound(1);
        break;
      case timeRule[1]:
        background.style.backgroundColor = "orange";
        bellSound(1);
        break;
      case timeRule[2]:
        background.style.backgroundColor = "red";
        bellSound(2);
        break;
      case timeRule[3]:
        background.style.backgroundColor = "red";
        bellLoop = setInterval(() => {
          bellSound(1);
        }, 1000);
        break;
      case 0:
        background.style.backgroundColor = "white";
        break;
      default:
        break;
    }
  } else {
    switch (time) {
      case timeRule[4]:
        background.style.backgroundColor = "green";
        bellSound(1);
        break;
      case timeRule[5]:
        background.style.backgroundColor = "orange";
        bellSound(1);
        break;
      case timeRule[6]:
        background.style.backgroundColor = "red";
        bellSound(2);
        break;
      case timeRule[7]:
        background.style.backgroundColor = "red";
        bellLoop = setInterval(() => {
          bellSound(1);
        }, 1000);
        break;
      case 0:
        background.style.backgroundColor = "white";
        break;
      default:
        break;
    }
  }
};

const start = () => {
  resetButton.style.display = "inline";
  startButton.innerHTML = "Stop";
  isRunning = true;
  timer = setInterval(counting, 100);
};

const stop = () => {
  startButton.innerHTML = "Start";
  isRunning = false;
  clearInterval(timer);
  clearInterval(bellLoop);
};

const counting = () => {
  changeBackground();
  time++;
  changeDisplay(time);
};

const countPoi = () => {
  poiButton.innerHTML = poiSecond;
  const poiTimer = setInterval(() => {
    poiSecond++;
    poiButton.innerHTML = poiSecond;
    if (poiSecond === 16 || !isPoiAllowed || !isRunning) {
      poiSecond = 0;
      clearInterval(poiTimer);
      poiButton.innerHTML = "POI";
      isPoiAllowed = false;
    }
  }, 100);
};

// Event Listener
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
  resetButton.style.display = "none";
  console.log("reset button");
  stop();
  time = 0;
  changeDisplay(0);
  changeBackground();
});
poiButton.addEventListener("click", () => {
  console.log("poi button");
  if (time >= 60 && time <= 360 && isRunning) {
    isPoiAllowed = isPoiAllowed ? false : true;
    countPoi();
  } else {
    console.log("not time yet");
  }
});
debateStyleButton.addEventListener("change", () => {
  if (isRunning) {
    console.log("can't change when timer running");
  } else {
    changeSystem();
    console.log("select");
  }
});
bellButton.addEventListener("click", () => {
  bellSound(1);
  console.log("bell button");
});
beforeButton.addEventListener("click", () => {
  speakerOrder--;
  //   console.log(speakersTime);
  //   console.log("Speaker:", speakerOrder + 1);
  updateSpeaker();
  buttonDisplay();
});
nextButton.addEventListener("click", () => {
  speakersTime[speakerOrder] = time;
  speakerOrder++;
  //   console.log(speakersTime);
  //   console.log("Speaker:", speakerOrder + 1);
  updateSpeaker();
  buttonDisplay();
});
