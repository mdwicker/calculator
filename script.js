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