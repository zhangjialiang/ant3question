/**
 * @file calculate
 * @author zhangjialiang
 * @date 2019-03-16 17:46:47
 */

let priorMap = {
    '-': 1,
    '+': 1,
    '*': 2,
    '/': 2,
    '^': 3
};
function tokenizer(expression) {
    let tokens = [];
    let preNumber = '';
    expression = expression.replace(/\s/g, '');
    for (let index = 0, len = expression.length; index < len; index++) {
        let char = expression[index];
        if (/\(|\)/.test(char)) {
            tokens.push({
                type: 'bracket',
                value: char
            });
        } else if (/\+|\-|\*|\/|\^/.test(char)) {
            tokens.push({
                type: 'operator',
                value: char,
                prior: priorMap[char]
            });
        } else if (/\d/.test(expression[index])){
            if (/\d/.test(expression[index + 1])) {
                preNumber += char;
            } else {
                tokens.push({
                    type: 'number',
                    value: preNumber + char
                });
                preNumber = '';
            }
        } else {
            throw new Error('表达式含有预期外字符');
        }
    }
    return tokens;
}

function toPost(tokens) {
    let result = [];
    let operatorStack = [];
    tokens.forEach(token => {
        switch (token.type) {
            case 'number':
                result.push(token);
                break;
            case 'operator':
                while (operatorStack.length > 0
                    && token.prior <= operatorStack[operatorStack.length - 1].prior) {
                    result.push(operatorStack.pop());
                }
                operatorStack.push(token);
                break;
            case 'bracket':
                if (token.value === '(') {
                    operatorStack.push(token);
                } else {
                    while (operatorStack.length > 0
                        && operatorStack[operatorStack.length - 1].value !== '(') {
                        result.push(operatorStack.pop());
                    }
                    if (operatorStack.length < 1) {
                        throw new Error('表达式有误，括号必须成对出现');
                    }
                    operatorStack.pop();
                }
        }
    });
    while (operatorStack.length > 0) {
        let operator = operatorStack.pop();
        if (operator.value === '(' || operator.value === ')') {
            throw new Error('表达式有误，括号必须成对出现且包含计算式');
        }
        result.push(operator);
    }
    return result;
}

function evaluate(tokens) {
    let numbers = [];
    tokens.forEach(token => {
        if (token.type === 'number') {
            numbers.push(token.value);
        } else {
            if (numbers.length < 2
                && token.value !== '-' && token.value !== '+') {
                throw new Error('表达式有误，二元表达式必须有两个值');
            } else if (numbers.length < 1) {
                throw new Error('表达式有误，一元表达式左侧必须有值');
            } 
            let rightNumber = parseFloat(numbers.pop(), 10);
            let leftNumber = parseFloat(numbers.pop() || 0, 10);
            let evalResult = 0;
            switch (token.value) {
                case '^':
                    evalResult = Math.pow(leftNumber, rightNumber);
                    break;
                case '-':
                    evalResult = leftNumber - rightNumber;
                    break;
                case '+':
                    evalResult = leftNumber + rightNumber;
                    break;
                case '*':
                    evalResult = leftNumber * rightNumber;
                    break;
                case '/':
                    if (rightNumber === 0) {
                        throw new Error('除数不能为0');
                    }
                    evalResult = leftNumber / rightNumber;
                    break;
                default:
                    break;
            }
            numbers.push(evalResult);
        }
    });
    return numbers.pop();
}

exports.calculate = expression => {
    // 将表达式字符串解成 token
    let tokens = tokenizer(expression);
    // 然后根据优先级将其转为逆波兰表达式，即后缀遍历
    tokens = toPost(tokens);
    // 然后计算各值，表达式的错误处理在此处简单处理
    return evaluate(tokens);
};
