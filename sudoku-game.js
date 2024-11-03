// Main JavaScript code

let sudokuCells; // Define globally
let selectedCell = null;
let undoStack = [];

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
  // Generate the Sudoku grid
  generateGrid();
  // Now that the grid is generated, add event listeners
  addCellEventListeners();
  // Event listener for 'Generate New Game' button
  document.getElementById('generate-btn').addEventListener('click', function() {
    const difficulty = document.getElementById('difficulty-select').value;
    generateNewGame(difficulty);
  });
  // Event listener for 'Solve Game' button
  document.getElementById('solve-btn').addEventListener('click', function() {
    solveGame();
  });
  // Event listener for 'Print' button
  document.getElementById('print-btn').addEventListener('click', () => {
    window.print();
  });
  
});

// Function to generate the Sudoku grid
function generateGrid() {
  const gridContainer = document.getElementById('sudoku-grid');
  for (let row = 0; row < 9; row++) {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('sudoku-row');
    for (let col = 0; col < 9; col++) {
      const cellInput = document.createElement('input');
      cellInput.type = 'text';
      cellInput.maxLength = '1';
      cellInput.inputMode = 'none';
      cellInput.classList.add('sudoku-cell');
      cellInput.id = 'cell-' + (row * 9 + col);
      // Allow only numbers 1-9
      cellInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^1-9]/g, '');
        // Add user-input class when user types a number
        if (!this.classList.contains('prefilled-cell')) {
          if (this.value) {
            this.classList.add('user-input');
          } else {
            this.classList.remove('user-input');
          }
        }
      });
      // Add event listener for cell selection
      cellInput.addEventListener('click', () => selectCell(cellInput));
      rowDiv.appendChild(cellInput);
    }
    gridContainer.appendChild(rowDiv);
  }
  // Update the sudokuCells NodeList after creating the cells
  sudokuCells = document.querySelectorAll('.sudoku-cell');
}

function addCellEventListeners() {
  // Event listeners for number buttons
  const numberButtons = document.querySelectorAll('.number-btn');
  numberButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (selectedCell && !selectedCell.classList.contains('prefilled-cell')) {
        const number = button.getAttribute('data-number');
        addToUndoStack(selectedCell, number);
        selectedCell.value = number;
      }
    });
  });
  // Undo the last move
  document.getElementById('undo-btn').addEventListener('click', () => {
    if (undoStack.length > 0) {
      const lastMove = undoStack.pop();
      lastMove.cell.value = lastMove.previousValue;
    }
  });
  // Reset the puzzle to its initial state
  document.getElementById('reset-btn').addEventListener('click', () => {
    sudokuCells.forEach((cell) => {
      if (!cell.classList.contains('prefilled-cell')) {
        cell.value = '';
      }
    });
    undoStack = [];
  });
}

// Function to handle cell selection
function selectCell(cell) {
  if (selectedCell) {
    selectedCell.classList.remove('selected');
  }
  selectedCell = cell;
  selectedCell.classList.add('selected');
}

// Function to add moves to the undo stack
function addToUndoStack(cell, newValue) {
  const previousValue = cell.value;
  undoStack.push({ cell: cell, previousValue: previousValue });
}

// Function to generate a new game
function generateNewGame(difficulty) {
  clearBoard();
  // Generate a new puzzle using the sudoku library
  const puzzleString = sudoku.generate(difficulty);
  const puzzleArray = convertPuzzleStringToArray(puzzleString);
  populateBoard(puzzleArray);
}

// Function to solve the game
function solveGame() {
  const board = getCurrentBoard();
  const boardString = board.map(num => (num === 0 ? '.' : num)).join('');
  const solutionString = sudoku.solve(boardString);
  if (solutionString) {
    const solutionArray = convertPuzzleStringToArray(solutionString);
    populateBoard(solutionArray, true); // Pass true to indicate solving
  } else {
    alert('No solution found for the current board.');
  }
}

// Function to clear the board
function clearBoard() {
  for (let i = 0; i < 81; i++) {
    const cell = document.getElementById('cell-' + i);
    cell.value = '';
    cell.disabled = false;
    cell.classList.remove('prefilled-cell');
    cell.classList.remove('user-input');
  }
}

// Function to populate the board with a puzzle or solution
function populateBoard(puzzleArray, isSolving = false) {
  for (let i = 0; i < 81; i++) {
    const cell = document.getElementById('cell-' + i);
    if (puzzleArray[i] !== 0) {
      cell.value = puzzleArray[i];
      if (!isSolving) {
        cell.disabled = true; // Disable cells that are part of the initial puzzle
        cell.classList.add('prefilled-cell');
        cell.classList.remove('user-input');
      } else {
        // If solving, don't disable cells, just populate
        if (!cell.classList.contains('prefilled-cell')) {
          cell.classList.add('user-input');
        }
      }
    } else {
      if (!isSolving) {
        cell.value = '';
        cell.disabled = false;
        cell.classList.remove('prefilled-cell');
        cell.classList.remove('user-input');
      }
    }
  }
  // Update the sudokuCells NodeList
  sudokuCells = document.querySelectorAll('.sudoku-cell');
  // Add 'prefilled-cell' class to prefilled cells
  sudokuCells.forEach((cell) => {
    if (cell.value !== '') {
      cell.classList.add('prefilled-cell');
    }
  });
}

// Function to get the current state of the puzzle
function getCurrentBoard() {
  const board = [];
  for (let i = 0; i < 81; i++) {
    const cell = document.getElementById('cell-' + i);
    const value = cell.value;
    board.push(value ? parseInt(value, 10) : 0);
  }
  return board;
}

// Function to convert puzzle string to array
function convertPuzzleStringToArray(puzzleString) {
  return puzzleString.split('').map(char => (char === '.' ? 0 : parseInt(char, 10)));
}

// Function to get the puzzle state as a string (used for solving)
function getPuzzleState() {
  let puzzle = [];
  sudokuCells.forEach((cell) => {
    puzzle.push(cell.value || '.');
  });
  return puzzle.join('');
}

// Function to fill the puzzle with the solution
function fillPuzzle(solution) {
  sudokuCells.forEach((cell, index) => {
    cell.value = solution[index];
  });
}
// Event listener for 'Print' button
  document.getElementById('print-btn').addEventListener('click', function() {
    window.print();
  });

                                                       


