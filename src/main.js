// get all variables

function getRandomInt(num) {
  return Math.floor(Math.random() * (num + 1));
}

function setDifficulty(param) {
  console.log(param.toLowerCase());

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

function setMode(param) {
  console.log(param, param === "Timed (60s)" ? 60 : "free");
  return param === "Timed (60s)" ? 60 : "free";
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
  //   console.log(splittedText);
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
        : setMode(e.target.innerText);
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

function getRandomText(panelSettingFunc, randomIntFunc, data) {
  const difficulty = panelSettingFunc("difficulty", "selected-option");
  console.log(difficulty);
  //   const randomInt = randomIntFunc(data["difficulty"].length);
  //   const text = data[difficulty][randomInt];
  //   console.log(text);
  //   return text;
}

function init() {
  startTest();
  panelSetting("mode", "selected-option");
  //   spanText(".type-test-text");
  panelSetting("difficulty", "selected-option");
  //   (async () => {
  //     const data = await readJSONData("./src/data.json");
  //     console.log(data);
  //   })();
  //   getRandomText(panelSetting, getRandomInt, readJSONData);
}

init();
