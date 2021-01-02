// operation[0] is the first number, 
// operation [1] is the operator, 
// operator [2] is the second number
let operation = [];

// stores the current number on the screen
let displayNumber = "";

// variable to update the screen content
const screen = document.getElementById("screen");

// when a button is pressed, parse the input
const buttons = document.querySelectorAll("button");
buttons.forEach(button => {
    button.addEventListener("click", parseInput);
})

function parseInput(e) {
    // check what type of input it is
    inputType = getInputType(this);

    // get the specific calculator key
    let keyValue = this.id;

    switch(inputType) {
        case "equals" : 
            equals();
        case "number" :
            addNumber(keyValue);
        case "edit" :
            edit(keyValue);
        case "operator" :
            parseOperator(keyValue);
    }

    updateDisplay();
}

// process an equals key
function equals() {
    // add the latest number to the operation
    operation.push(displayNumber);

    // if all three arguments are present, perform the operation
}

function getInputType(key) {
    if (key.id === "equals") {
        return "equals";
    } else if (key.classList.contains("operator")) {
        return "operator";
    } else if (key.classList.contains("number")) {
        return "number";
    } else if (key.classList.contains("edit")) {
        return "edit";
    }

    return "unknown";
}

function addNumber(number) {
    if (number === "dot") {
        // only allow one decimal point
        if (displayNumber.indexOf(".") !== -1) {
            return;
        } else {
            displayNumber += displayNumber ? "." : "0."; 
        }
    } else {
        displayNumber += number;
    } 
}

function edit(editType) {
    if (editType === "clear") {
        displayNumber = ""
    }
    if (editType === "backspace") {
        displayNumber = displayNumber.slice(0,-1);
    }
}

function parseOperator(operatorType) {
    // if there is no number to operate on, operate on 0
    if (!operation[0]) {
        operation[0] = 0;
    }

    // if the operation is already ready to go, process the existing one first
    else if (operation[2]) {
        checkOperation();
    }

    else {
        operation.push(operatorType);
    }
}

function updateDisplay() {
    // don't allow more than 8 characters
    displayNumber.length >= 8 ? displayNumber = displayNumber.slice(0, 8) : "";

    // show the working number on the screen. If there is no working number, show "00"
    screen.textContent = displayNumber ? displayNumber : "00";
}

// basic math functions
function add(x, y) {
    return x + y;
}

function subtract(x, y) {
    return x - y;
}

function multiply(x, y) {
    return x * y;
}

function divide(x, y) {
    return x / y;
}

// take two numbers and an operator, return the result
function operate(x, y, operator) {
    // if only one number is passed, treat it like a number operating on itself
    if (!y) {
        y = x;
    }

    switch (operator) {
        case "add" : return add(x, y);
        case "subtract" : return subtract(x, y);
        case "multiply" : return multiply(x, y);
        case "divide" : return divide(x, y);
    }

    return 0;
}