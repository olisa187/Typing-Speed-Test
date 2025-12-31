// get all variables

function startTest() {
  const startBTN = document.querySelector(".start-btn");

  startBTN.addEventListener("click", () => {
    const restartBTN = document.querySelector(".restart-container");
    document
      .querySelector(".type-speed-container__backdrop")
      .classList.add("hide");

    restartBTN.classList.remove("hide");
  });
}

function panelSetting() {
  const dropdownContainer = document.getElementsByClassName("drop-down");
  Array.from(dropdownContainer).forEach((dropdown) => {
    dropdown.addEventListener("click", (e) => {
      e.preventDefault();
      console.log(e.target.parentNode);
    });
  });
  //   console.log(activeSelection);
}

function init() {
  startTest();
  panelSetting();
}

init();
