// operation[0] is the first number, 
// operation [1] is the operator, 
// operation [2] is the second number,
// operation [3] is the equation result

let operation = ["","","",""];

// variable to update the screen content
const screen = document.getElementById("screen");

// when a button is pressed, parse the input
const buttons = document.querySelectorAll("button");
buttons.forEach(button => {
    button.addEventListener("click", parseInput);
})

function parseInput(e) {
    console.log(operation[3]);
    // check what type of input it is
    inputType = getInputType(this);

    // get the specific calculator key
    let keyValue = this.id;

    switch(inputType) {
        case "number" :
            operation = inputNumber(keyValue, operation);
            break;
        case "operator" :
            operation = inputOperator(keyValue, operation);
            break;
        case "equals" : 
            operation = inputEquals(operation);
            break;
        case "edit" :
            operation = inputEdit(keyValue, operation);
            break;
    }

    console.log(operation);
    screen.textContent = updateDisplay(operation);
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

function inputNumber(number, currentOp) {
    // if an equation just completed, start over
    if (currentOp[3]) {
        currentOp = newOp();
    }

    // if the first operation number is still active, add to that one
    // otherwise, add to the second number
    if (!currentOp[1]) {
        currentOp[0] = addNumber(currentOp[0], number);
    } else {
        currentOp[2] = addNumber(currentOp[2], number);
    }
    
    return currentOp;
}

function addNumber(workingNumber, inputNumber) {
    // only allow one decimal point
    if (inputNumber === "dot") {
        if (workingNumber.indexOf(".") !== -1) {
            return workingNumber;
        } else {
            return workingNumber += (!workingNumber) ? "0." : ".";
        }
    }
    workingNumber += inputNumber;

    // don't allow more than eight digits
    if (workingNumber.length >= 8) {
        workingNumber = workingNumber.slice(0, 8);
    }

    return workingNumber;
}

function inputOperator(operator, currentOp) {
    // if the operation is empty, make the first number 0
    if (!currentOp[0]) {
        currentOp[0] = "0";
    }
    // if an operation is ready to go, evaluate it
    if (currentOp[2] && !currentOp[3]) {
        currentOp = inputEquals(currentOp);
    }
    // if there is an evaluated operation, start again with the result of the last
    if (currentOp[3]) {
        currentOp = [currentOp[3],"","",""];
    }
    // set the operator
    currentOp[1] = operator;

    return currentOp;
}

function inputEquals(currentOp) {
    // if there is no operator, do nothing
    if (!currentOp[1]) {
        return currentOp;
    }
    // if there is no second number, set it to the same as the first number
    if (!currentOp[2]) {
        currentOp[2] = currentOp[0];
    }
    // if there is an evaluated operation, copy it with the result as the new first number
    if (currentOp[3]) {
        currentOp[0] = currentOp[3];
    }
    // evaluate!
    currentOp[3] = operate(currentOp[0], currentOp[1], currentOp[2]);
    return currentOp;
}

function inputEdit(editType, currentOp) {
    switch (editType) {
        case "clear" :
            currentOp = newOp();
            break;
        case "backspace" :
            // if an operation was just evaluated, treat the result as the new input
            if (currentOp[3]) {
                currentOp = [currentOp[3].slice(0,-1),"","",""];
            }
            // if the second number is being entered, remove it
            else if (currentOp[2]) {
                currentOp[2] = currentOp[2].slice(0,-1);
            }
            // if an operator was just input, remove it
            else if (currentOp[1]) {
                currentOp[1] = "";
            }
            // if the first number is being entered, remove the last digit
            else if (currentOp[0]) {
                currentOp[0] = currentOp[0].slice(0,-1);
            }
            break;
    }

    return currentOp;
}

function newOp() {
    return ["","","",""];
}

function updateDisplay(currentOp) {
    // if there is an error message, display it
    let display
    if (currentOp[4]) {
        display = currentOp[4];
    }
    
    // if an operation was just evaluated, display the result
    else if (currentOp[3]) {
        display = currentOp[3];
    }

    // otherwise, display the number input most recently
    else if (currentOp[2]) {
        display = currentOp[2];
    } else if (currentOp[0]) {
        display = currentOp[0];
    } else {
        display = "00";
    }

    if (display.length > 8) {
        display = eNotation(display);
    }

    return display;
}

function eNotation(inputNum) {
    let powerOfTen;
    if (inputNum.indexOf(".") !== -1) {
        powerOfTen = inputNum.indexOf(".") - 1;
    } else {
        powerOfTen = inputNum.length - 1;
    }
    return `${inputNum[0]}.${inputNum.slice(1,3)}e${powerOfTen}`;
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
function operate(x, operator, y) {
    // if there are are decimal places, multiply by a power of 10 to get a whole number before evaluating
    let decimalPlaces = maxDecimalPlaces(x, y);
    factor = Math.pow(10, decimalPlaces);

    x *= factor;
    y *= factor;

    let result;

    switch (operator) {
        case "add" : 
            result = add(x, y);
            break;
        case "subtract" : 
            result = subtract(x, y);
            break;
        case "multiply" : 
            result = multiply(x, y);
            break;
        case "divide" : 
            if (y === 0) {
                operation[4] = "nope";
            }
            else {
                result = divide(x, y);
            }
            break;
    }

    result /= factor;

    result = round(result, 3);

    if (result > Math.pow(10, 19)) {
        operation[4] = "nope";
    }

    return result.toString();
}

function getDecimalPlaces(num) {
    if (num.indexOf(".") === -1) {
        return 0;
    } else {
        return num.length-num.indexOf(".")-1
    }
}

function maxDecimalPlaces(num1, num2) {
    num1Places = getDecimalPlaces(num1);
    num2Places = getDecimalPlaces(num2);
    return (num1Places > num2Places) ? num1Places : num2Places;
}

function round(number, decimalPlaces) {
    let factor = Math.pow(10, decimalPlaces);
    return Math.round(number * factor) / factor;
}