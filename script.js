let firstNumber = null;
let operator = "";
let displayValue = "";

const calcDisplay = document.querySelector(".display");
const specialOperationsContainer = document.querySelector(".special-operations");
const digitsContainer = document.querySelector(".digits");
const operatorsContainer = document.querySelector(".operator-buttons");

const MAX_DIGIT_DISPLAY_LENGTH = 10;
const specialOperationValues = ["AC", "+/-", "%"];
const keypadValues = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ".", "⌫"];
const operatorValues = ["+", "-", "*", "/"];

const add = (...numbers) => numbers.reduce((acc, num) => acc + num, 0);
const subtract = (...numbers) => numbers.reduce((acc, num) => acc - num);
const multiply = (...numbers) => numbers.reduce((acc, num) => acc * num, 1);
const divide = (...numbers) => numbers.reduce((acc, num) => (num === 0 ? "Terminated!" : acc / num));

const operate = (operator, num1, num2) => {
	switch (operator) {
		case "+": 
			return add(num1, num2);
		case "-": 
			return subtract(num1, num2);
		case "*": 
			return multiply(num1, num2);
		case "/": 
			return divide(num1, num2);
		default: 
			return "Invalid operator";
	}
};

const updateDisplay = (digit) => {
	if (digit === ".") {
		if (displayValue.includes(".")){
			return;
		} 
		displayValue += digit;
	} else if (digit === "⌫") {
		displayValue = displayValue.slice(0, -1);
	} else {
		displayValue += digit;
	}
	calcDisplay.textContent = displayValue || "0";
};

const clearDisplay = () => {
	displayValue = "";
	firstNumber = null;
	operator = "";
	calcDisplay.textContent = "0";
};

const handleMathOperators = (op) => {
	if (firstNumber === null) {
		firstNumber = parseFloat(displayValue);
	} else if (displayValue) {
		performCalculation();
	}
	operator = op;
	displayValue = "";
};

const handleSpecialOperations = (specialOp) => {
	switch (specialOp) {
		case "+/-":
			displayValue = (parseFloat(displayValue) * -1).toString();
			break;
		case "%":
			displayValue = (parseFloat(displayValue) / 100).toString();
			break;
	}
	calcDisplay.textContent = displayValue;
};

const truncateDisplay = (value) => {
	if (typeof value === "number") {
		const valueStr = value.toString();
		if (valueStr.length > MAX_DIGIT_DISPLAY_LENGTH) {
			const decimalPlaces = MAX_DIGIT_DISPLAY_LENGTH - Math.floor(value).toString().length - 1;

			return parseFloat(value.toFixed(Math.max(decimalPlaces, 0)));
		}
	}
	return value;
};

const performCalculation = () => {
	if (firstNumber !== null && operator && displayValue) {
		let result = operate(operator, firstNumber, parseFloat(displayValue));

		result = truncateDisplay(result);
		calcDisplay.textContent = result;
		displayValue = result.toString();
		firstNumber = result;
		operator = "";
	}
};

// Create calculator buttons dynamically
specialOperationValues.forEach((value) => {
	const operationButton = document.createElement("button");

	operationButton.textContent = value;
	operationButton.classList.add("special-operation-button");
	operationButton.setAttribute("aria-label", value);

	if (value === "AC") operationButton.classList.add("clear-button");
	specialOperationsContainer.appendChild(operationButton);
	operationButton.addEventListener("click", () => value === "AC" ? clearDisplay() : handleSpecialOperations(value));
});

keypadValues.forEach((value) => {
	const keypadButton = document.createElement("button");

	keypadButton.textContent = value;
	keypadButton.classList.add("digit-button");
	keypadButton.setAttribute("aria-label", value === "⌫" ? "Backspace" : value);
	digitsContainer.appendChild(keypadButton);
	keypadButton.addEventListener("click", () => updateDisplay(value));
});

operatorValues.reverse().forEach((op) => {
	const operatorButton = document.createElement("button");
	
	operatorButton.textContent = op;
	operatorButton.classList.add("operator-button");
	operatorButton.setAttribute("aria-label", op);
	operatorsContainer.appendChild(operatorButton);
	operatorButton.addEventListener("click", () => handleMathOperators(op));
});

const equalsButton = document.createElement("button");

equalsButton.textContent = "=";
equalsButton.classList.add("equals");
equalsButton.setAttribute("aria-label", "Equals");
operatorsContainer.appendChild(equalsButton);
equalsButton.addEventListener("click", performCalculation);

// Add keyboard support
document.addEventListener("keydown", (event) => {
	const key = event.key;

	if (!isNaN(key) || key === ".") {
		updateDisplay(key);
	} else if (operatorValues.includes(key)) {
		handleMathOperators(key);
	} else if (key === "Enter" || key === "=") {
		event.preventDefault(); // Prevent form submission or page reload on Enter
		performCalculation();
	} else if (key === "Backspace") {
		updateDisplay("⌫");
	} else if (key === "Escape") {
		clearDisplay();
	}
});
