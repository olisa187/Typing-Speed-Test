// get all variables

// Declare global variable
let difficultySelected = "medium";
let modeSelected = "";
let wpmValue = 0;
let accuracyValue = 100;
let userInputSet = [];
let mainTextSet = [];
let correctSet = [];
let errorSet = [];
let currentTextPosition = 0;
let currentTime = 60;
let timeInterval;

function getRandomInt(num) {
  return Math.floor(Math.random() * (num + 1));
}

function setDifficulty(param) {
  // console.log(param.toLowerCase());

  difficultySelected = param.toLowerCase();

  const getData = async () => {
    const data = await readJSONData("./src/data.json");
    // console.log(data);
    const randomInt = getRandomInt(data[param.toLowerCase()].length);
    const text = data[param.toLowerCase()][randomInt];
    // console.log(text.text);
    mainTextSet = [...text.text];
    spanText(".type-test-text", text.text);
  };
  getData();
  //   return param.toLowerCase();
}

function setMode(param, query) {
  console.log(param, param === "Timed (60s)" ? 60 : "free");
  const timeValue = param === "Timed (60s)" ? `0:59` : "free";
  modeSelected = param.toLowerCase();
  document.querySelector(query).innerText = timeValue;
}

function spanText(query, data) {
  const paragraph = data || document.querySelector(query).innerText;

  let splittedText = "";
  paragraph.split("").forEach((letter, i) => {
    if (i === 0) {
      splittedText += `<span class="pending" data-index="0">${letter}</span>`;
    } else {
      splittedText += `<span data-index="${i}">${letter}</span>`;
    }
  });
  // location to insert
  document.querySelector(query).innerHTML = splittedText;
}

function startTest() {
  const startBTN = document.querySelector(".start-btn");

  startBTN.addEventListener("click", () => {
    // get the restart btn to show it
    const restartBTN = document.querySelector(".restart-container");

    // get the backdrop container and hide
    document
      .querySelector(".type-speed-container__backdrop")
      .classList.add("hide");

    restartBTN.classList.remove("hide");
    timeChange(".timer-tracker", 60);
    KeyInputListener();
  });
}

function panelSetting(parentClassName, selectedClassName) {
  const dropdownContainer = document.getElementsByClassName(parentClassName);

  Array.from(dropdownContainer).forEach((dropdown) => {
    dropdown.addEventListener("click", (e) => {
      e.preventDefault();

      //   get all the child element with the specified class and remove them all
      const el = document.querySelectorAll(
        `.${parentClassName} .${selectedClassName}`
      );

      el.forEach((element) => {
        element.classList.remove(selectedClassName);
      });

      // Add the selected class to the target
      e.target.parentNode.classList.add(selectedClassName);

      parentClassName === "difficulty"
        ? setDifficulty(e.target.innerText)
        : setMode(e.target.innerText, ".timer-tracker");
    });
  });
}

async function readJSONData(filePath) {
  try {
    const res = await fetch(filePath);
    return await res.json();
  } catch (err) {
    return console.error("Error:", err);
  }
}

function timeChange(query) {
  if (modeSelected !== "passage") {
    timeInterval = setInterval(() => {
      document.querySelector(query).innerText = timeUpdate(currentTime);
      currentTime--;
      if (currentTime === -1) done();
    }, 1000);
  }
}

// v2 of time change function to be renamed timeUpdate
function timeUpdate(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const result = `${String(mins)}:${String(secs).padStart(2, "0")}`;
  // console.log(result);
  return result;
}

function done() {
  clearInterval(timeInterval);

  const hidePanel = document.getElementsByClassName("typing-test-panel");
  const textcontainer = document.getElementsByClassName("show-on-load");
  const restartBTN = document.getElementsByClassName("restart-container");
  const showResult = document.getElementsByClassName("show-on-test-completed");

  // var to write to the document when timer or user completes the typing
  const wpmFinalValue = document.querySelector(".wpm-final");
  const accuracyFinalValue = document.querySelector(".acurracy-final");
  const totalCharacterFinalValue = document.querySelector(".characters-final");
  const totalErrorFinalValue = document.querySelector(".error-final");

  Array.from(hidePanel).forEach((el) => el.classList.add("hide"));
  Array.from(textcontainer).forEach((el) => el.classList.add("hide"));
  Array.from(restartBTN).forEach((el) => el.classList.add("hide"));
  Array.from(showResult).forEach((el) => el.classList.remove("hide"));

  // write to the document the final values
  wpmFinalValue.innerText = wpmValue.toFixed(0);
  accuracyFinalValue.innerText = accuracyValue;
  totalCharacterFinalValue.innerText = userInputSet.length;
  totalErrorFinalValue.innerText = errorSet.length;
}

function restartTest() {
  const hidePanel = document.getElementsByClassName("typing-test-panel");
  const textcontainer = document.getElementsByClassName("show-on-load");
  const backdrop = document.getElementsByClassName(
    "type-speed-container__backdrop"
  );
  const restartBTN = document.getElementsByClassName("restart-container");
  const showResult = document.getElementsByClassName("show-on-test-completed");

  Array.from(hidePanel).forEach((el) => el.classList.remove("hide"));
  Array.from(textcontainer).forEach((el) => el.classList.remove("hide"));
  Array.from(backdrop).forEach((el) => el.classList.remove("hide"));
  Array.from(restartBTN).forEach((el) => el.classList.add("hide"));
  Array.from(showResult).forEach((el) => el.classList.add("hide"));

  clearInterval(timeInterval);
  wpmValue = 0;
  accuracyValue = 100;
  userInputSet = [];
  mainTextSet = [];
  correctSet = [];
  errorSet = [];
  currentTextPosition = 0;
  currentTime = 60;

  // var to write to the document when timer or user completes the typing
  const wpmTracker = document.querySelector(".wpm-tracker");
  const accuracyTracker = document.querySelector(".accuracy-tracker");
  const timerTracker = document.querySelector(".timer-tracker");
  // write to the document the final values
  wpmTracker.innerText = wpmValue.toFixed(0);
  accuracyTracker.innerText = `${accuracyValue}%`;
  timerTracker.innerText = timeUpdate(currentTime);

  window.removeEventListener("keyup", handleInput);
  setDifficulty(difficultySelected);
}

function reset() {
  const reloadBTN = document.getElementsByClassName("reload-btn");
  Array.from(reloadBTN).forEach((el) => {
    el.addEventListener("click", restartTest);
  });
}

function nextText(index) {
  if (index < mainTextSet.length) {
    document
      .querySelector(`span[data-index="${index}"]`)
      .classList.remove("pending");
    document
      .querySelector(
        `span[data-index="${
          index + 1 < mainTextSet.length ? index + 1 : index
        }"]`
      )
      .classList.add("pending");
  }
}

function handleInput(e) {
  // console.log(e.key);
  if (e.key !== "Shift" && e.key !== "CapsLock") {
    userInputSet.push(e.key);
    if (
      mainTextSet[currentTextPosition] === userInputSet[currentTextPosition]
    ) {
      correctSet.push(e.key);
      document
        .querySelector(`span[data-index="${currentTextPosition}"]`)
        .classList.add("correct");
    } else {
      errorSet.push(e.key);
      document
        .querySelector(`span[data-index="${currentTextPosition}"]`)
        .classList.add("error");
    }
    nextText(currentTextPosition);
    currentTextPosition++;
  }
  // accuracyCalculator(correctSet.length, userInputSet.length);
  writeResult(
    "div.accuracy-tracker",
    accuracyCalculator,
    correctSet.length,
    userInputSet.length
  );

  writeResult(".wpm-tracker", wpmCalculator, userInputSet.length, currentTime);
  // wpmCalculator(userInputSet.length, currentTime);
  currentTextPosition === mainTextSet.length ? done() : "";
}

function KeyInputListener() {
  window.addEventListener("keyup", handleInput);
}

function accuracyCalculator(upperBound, lowerBound) {
  const cal = (upperBound / lowerBound) * 100;
  // console.log(`${!isNaN(cal.toFixed(0)) ? cal.toFixed(0) : 0}%`);
  accuracyValue = `${!isNaN(cal.toFixed(0)) ? cal.toFixed(0) : 0}%`;
  return `${!isNaN(cal.toFixed(0)) ? cal.toFixed(0) : 0}%`;
}

function wpmCalculator(totalCharacter, timeValue) {
  // this function calculates the gross wpm
  const grossWPM = totalCharacter / 5 / (timeValue / 60); // in seconds divifing by 60 to give time in minutes
  // console.log(grossWPM.toFixed(0));
  wpmValue = grossWPM;
  return grossWPM.toFixed(0);
  // (totalCharacter / 5 / (timeValue / 1000)) * 60
}

function writeResult(query, callback, ...args) {
  const result = callback(...args);
  // console.log(result);
  const resultPosition = document.querySelector(query);
  resultPosition.innerText = result;
}

function handleMobileDropDown() {
  const mobileBTN = document.getElementsByClassName("mobile-btn");
  Array.from(mobileBTN).forEach((el) => {
    el.addEventListener("click", (e) => {
      // let buttonClicked = `.${e.target.getAttribute("data-value")}`;
      // const removeDropDown = document.querySelector(".show-drop-down");
      // removeDropDown?.classList?.contains("show-drop-down")
      //   ? removeDropDown.classList.remove("show-drop-down")
      //   : "";
      e.preventDefault();
      console.log(`${e.target.getAttribute("data-value")}`);
      let elementTarget = document.querySelector(
        `.${e.target.getAttribute("data-value")}`
      );
      elementTarget.classList.contains("show-drop-down")
        ? elementTarget.classList.remove("show-drop-down")
        : elementTarget.classList.add("show-drop-down");
    });
  });
}

function init() {
  startTest();
  panelSetting("mode", "selected-option");
  //   spanText(".type-test-text");
  panelSetting("difficulty", "selected-option");

  // run on load / refresh
  setDifficulty(difficultySelected);

  // getKeyInput();

  handleMobileDropDown();

  reset();
}

init();
