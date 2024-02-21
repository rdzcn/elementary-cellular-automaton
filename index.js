// Utility functions
function convertToBinary(number) {
  let binary = number.toString(2);
  while (binary.length < 8) {
    binary = "0" + binary;
  }
  return binary;
}
// End of utility functions

//Global variables

const squareWidth = 5;
const squareHeight = 5;
const totalCells = window.innerWidth / squareWidth;

let rule = 0;
let cells = [];
let isGenerating = false;
// End of global variables


function calculateNewState(left, center, right) {
  const ruleArray = convertToBinary(rule).split("");
  const input = `${left}${center}${right}`;
  const ruleIndex = 7 - parseInt(input, 2);
  return ruleArray[ruleIndex];
}

function generateCell() {
  let nextGen = [];
  for (let i = 0; i < totalCells; i++) {
    const left = cells[(i - 1 + totalCells) % totalCells];
    const right = cells[(i + 1 + totalCells) % totalCells];
    const center = cells[i];
    const newState = calculateNewState(left, center, right);
    nextGen[i] = +newState;
  }
  cells = nextGen;
}

function generateAutomaton(automatonRule) {
    console.log("isGenerating", isGenerating);
    if (isGenerating) return;
    isGenerating = true;
    let canvas = document.querySelector("#automata");
    canvas.style.backgroundColor = "#fff";
    canvas.width = window.innerWidth - 15;
    canvas.height = 960;
    rule = automatonRule;
    const ctx = canvas.getContext("2d");

    for (let i = 0; i < totalCells; i++) {
      if (i === Math.ceil(totalCells / 2)) {
        cells[i] = 1;
      } else cells[i] = 0;
    }

    let row = 0;
    const animate = () => {
      ctx.beginPath();
      for (let i = 0; i < totalCells; i++) {
        const x = i * squareWidth;
        const y = row * squareHeight;
        ctx.fillStyle = cells[i] ? "#000" : "#fff";
        ctx.fillRect(x, y, squareWidth, squareHeight);
        ctx.closePath();
      }
      generateCell();
      if (row < canvas.height / squareHeight) {
        requestAnimationFrame(animate);
      } else {
        isGenerating = false;
      }
      row += 1;
    };

    animate();
  }

const ruleInput = document.querySelector("#rule-input");
const generateButton = document.querySelector("#generate");
const prevButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");

generateButton.onclick = (event) => {
  event.preventDefault();
  generateAutomaton(+ruleInput.value)
};
prevButton.onclick = (event) => {
  event.preventDefault();
  if (isGenerating) return;
  ruleInput.value = +ruleInput.value - 1;
  generateAutomaton(+ruleInput.value)
}
nextButton.onclick = (event) => {
  event.preventDefault();
  if (isGenerating) return;
  ruleInput.value = +ruleInput.value + 1;
  generateAutomaton(+ruleInput.value)
};

console.log("isGenerating", isGenerating);
console.log("rule input", ruleInput.value);
console.log("rule", rule);