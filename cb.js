      //DOM Variables
      const debateStyleButton = document.getElementById("system");
      const timeDisplay = document.getElementById("time");
      const startButton = document.getElementById("start");
      const stopButton = document.getElementById("stop");
      const resetButton = document.getElementById("reset");
      const background = document.getElementById("display");
      const bellButton = document.getElementById("bell");

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

      let styleList = system.list();
      let timeRule = system["BP"].time;
      let time = timeRule;
      let isRunning = false;

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

      // Change Debate System
      const changeSystem = () => {
        let index = debateStyleButton.selectedIndex;
        let style = debateStyleButton.options[index].value;
        timeRule = system[style].time;
        time = timeRule;
        changeDisplay(time)
        console.log(timeRule);
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

      // const changeBackground = () => {
      //     switch (time) {
      //       case timeRule[0]:
      //         background.style.backgroundColor = "green";
      //         bellSound(1);
      //         break;
      //       case timeRule[1]:
      //         background.style.backgroundColor = "orange";
      //         bellSound(1);
      //         break;
      //       case timeRule[2]:
      //         background.style.backgroundColor = "red";
      //         bellSound(2);
      //         break;
      //       case timeRule[3]:
      //         background.style.backgroundColor = "red";
      //         bellLoop = setInterval(() => {
      //           bellSound(1);
      //         }, 1000);
      //         break;
      //       case 0:
      //         background.style.backgroundColor = "white";
      //         break;
      //       default:
      //         break;
      //     }
      //   };


      const start = () => {
        if (!isRunning) {
          isRunning = true;
          timer = setInterval(counting, 100);
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

      const counting = () => {
        //changeBackground();
        if (time === 0) {
          stop();
          bellSound(2);
        } else {
          time--;
          changeDisplay(time);
        }
      };

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
        //changeBackground();
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


// Pop Up Function
function openPopup() {
    document.getElementById("popupOverlay").style.display = "flex";
  }
  
  function closePopup() {
    document.getElementById("popupOverlay").style.display = "none";
  }
  
  // Audio Handler
  document.addEventListener("DOMContentLoaded", function () {
    const audioFileInput = document.getElementById("audioFileInput");
    const playButton = document.getElementById("playButton");
    let audioContext;
    let audioBuffer;
  
    audioFileInput.addEventListener("change", function (event) {
      playButton.disabled = false;
  
      const file = event.target.files[0];
      const reader = new FileReader();
  
      reader.onload = function (e) {
        const audioData = e.target.result;
  
        // Initialize the audio context
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
        // Decode the audio data
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
  });
  