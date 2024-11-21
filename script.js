
const gridElement = document.getElementById('grid');
const commandInput = document.getElementById('commandInput');
const executeButton = document.getElementById('executeButton');
const speedRange = document.getElementById('speedRange');
const speedLabel = document.getElementById('speedLabel');
const historyElement = document.getElementById('history');

let position = { x: 0, y: 0 };
let isExecuting = false;

const createGrid = () => {
  gridElement.innerHTML = '';
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      if (x === position.x && y === position.y) {
        cell.classList.add('active');
      }
      gridElement.appendChild(cell);
    }
  }
};

const updateGrid = () => createGrid();

const moveManipulatorStep = (char) => {
  switch (char.toUpperCase()) {
    case 'L': position.x = Math.max(0, position.x - 1); break;
    case 'R': position.x = Math.min(9, position.x + 1); break;
    case 'T': position.y = Math.max(0, position.y - 1); break;
    case 'B': position.y = Math.min(9, position.y + 1); break;
    default: break;
  }
  updateGrid();
};

const executeCommandStepByStep = () => {
  if (isExecuting || !commandInput.value) return;
  isExecuting = true;
  executeButton.disabled = true;

  const commands = commandInput.value.split('');
  const optimized = optimizeCommand(commandInput.value);
  const oldPosition = { ...position };
  let index = 0;

  const interval = setInterval(() => {
    if (index < commands.length) {
      moveManipulatorStep(commands[index]);
      index++;
    } else {
      clearInterval(interval);
      isExecuting = false;
      executeButton.disabled = false;
      addHistoryEntry(commandInput.value, optimized, oldPosition, position);
      commandInput.value = '';
    }
  }, 5000 / parseInt(speedRange.value, 10));
};

const optimizeCommand = (cmd) => {
  return cmd.split('').filter((char, index, arr) => char !== arr[index + 1]).join('');
};

const addHistoryEntry = (original, optimized, before, after) => {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${original}</td>
    <td>${optimized}</td>
    <td>${new Date().toLocaleString()}</td>
    <td>(${before.x}, ${before.y})</td>
    <td>(${after.x}, ${after.y})</td>
  `;
  historyElement.prepend(row);
};

speedRange.addEventListener('input', () => {
  speedLabel.textContent = speedRange.value;
});

executeButton.addEventListener('click', executeCommandStepByStep);

createGrid();