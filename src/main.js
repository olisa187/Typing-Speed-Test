// get all variables

// Declare global variable
let difficultySelected = "medium";
let modeSelected = "";
let timeInterval;

function getRandomInt(num) {
  return Math.floor(Math.random() * (num + 1));
}

function setDifficulty(param) {
  console.log(param.toLowerCase());

  difficultySelected = param.toLowerCase();

  const getData = async () => {
    const data = await readJSONData("./src/data.json");
    // console.log(data);
    const randomInt = getRandomInt(data[param.toLowerCase()].length);
    const text = data[param.toLowerCase()][randomInt];
    // console.log(text.text);
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
      splittedText += `<span class="pending">${letter}</span>`;
    } else {
      splittedText += `<span>${letter}</span>`;
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
  let second_remaining = 59;

  if (modeSelected !== "passage") {
    timeInterval = setInterval(() => {
      document.querySelector(query).innerText = `${
        second_remaining === 59 ? 0 : 0
      }:${
        second_remaining > 9 ? second_remaining-- : "0" + second_remaining--
      }`;

      if (second_remaining === -1) done();
    }, 1000);
  }
  // console.log(second_remaining);
}

function done() {
  clearInterval(timeInterval);

  const hidePanel = document.getElementsByClassName("typing-test-panel");
  const textcontainer = document.getElementsByClassName("show-on-load");
  const restartBTN = document.getElementsByClassName("restart-container");
  const showResult = document.getElementsByClassName("show-on-test-completed");

  Array.from(hidePanel).forEach((el) => el.classList.add("hide"));
  Array.from(textcontainer).forEach((el) => el.classList.add("hide"));
  Array.from(restartBTN).forEach((el) => el.classList.add("hide"));
  Array.from(showResult).forEach((el) => el.classList.remove("hide"));
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
}

function reset() {
  const reloadBTN = document.getElementsByClassName("reload-btn");
  Array.from(reloadBTN).forEach((el) =>
    el.addEventListener("click", restartTest)
  );
}

function init() {
  startTest();
  panelSetting("mode", "selected-option");
  //   spanText(".type-test-text");
  panelSetting("difficulty", "selected-option");

  // run on load / refresh
  setDifficulty(difficultySelected);

  reset();
  //   done();

  //   restartTest();
  //   (async () => {
  //     const data = await readJSONData("./src/data.json");
  //     console.log(data);
  //   })();
  //   getRandomText(panelSetting, getRandomInt, readJSONData);
}

init();
