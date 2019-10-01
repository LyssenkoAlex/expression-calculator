function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {


    return  evaluate(infixToReversePolish(getTokens(expr)));

}


function isNumber(value) {
    return /[0-9.]/.test(value);
}

const getTokens = function(str) {
    const operators = ["+", "-", "*", "/", "(", ")"];
    return str
        .split("")
        .filter(token => token !== " ")
        .map(token =>
            operators.includes(token) ? "delimeter" + token + "delimeter" : token
        )
        .join("")
        .split("delimeter")
        .filter(token => token !== "");
};

function isOperator(value) {
    return (
        value === "+" ||
        value === "-" ||
        value === "*" ||
        value === "/" ||
        value === "(" ||
        value === ")"
    );
}


function evaluate(tokens) {
    const stack = [];

    while (tokens.length) {
        let token = tokens.shift();
        while (isNumber(token)) {
            stack.push(parseFloat(token));
            token = tokens.shift();
        }
        const [b, a] = [stack.pop(), stack.pop()];
        switch (token) {
            case "+":
                stack.push(a + b);
                break;
            case "-":
                stack.push(a - b);
                break;
            case "*":
                stack.push(a * b);
                break;
            case "/": {
                if (b === 0) throw new Error("TypeError: Division by zero.");
                stack.push(a / b);
                break;
            }
            case "%":
                stack.push(a % b);
                break;
        }
    }
    return stack.pop();
}


function infixToReversePolish(tokens) {
    const queue = [];
    const stack = [];
    const precedence = {
        "(": 1,
        "+": 2,
        "-": 2,
        "/": 3,
        "*": 3,
        "%": 3
    };

    while (tokens.length) {
        const token = tokens.shift();
        const tokenPrecedence = precedence[token] || 0;
        let stackPrecedence = stack.length
            ? precedence[stack[stack.length - 1]]
            : 0;
        if (isOperator(token) && token === ")") {
            let op = null;
            while ((op = stack.pop()) !== "(") {
                if (stack.length === 0) {
                    throw new Error("ExpressionError: Brackets must be paired");
                }
                queue.push(op);
            }
        } else if (isNumber(token)) {
            queue.push(token);
        } else if (
            isOperator(token) &&
            (!stack.length || token === "(" || tokenPrecedence > stackPrecedence)
        ) {
            stack.push(token);
        } else {
            while (tokenPrecedence <= stackPrecedence) {
                queue.push(stack.pop());
                stackPrecedence = stack.length
                    ? precedence[stack[stack.length - 1]]
                    : 0;
            }
            stack.push(token);
        }
    }
    while (stack.length) {
        let op = stack.pop();
        if (op === "(") throw new Error("ExpressionError: Brackets must be paired");
        queue.push(op);
    }

    return queue;
}

module.exports = {
    expressionCalculator
}
