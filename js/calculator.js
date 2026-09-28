// ============================================================
//  calculator.js — 계산기 핵심 로직
//  📝 과제: 💡 표시된 빈칸을 채워 기능을 완성하세요.
// ============================================================

const mainDisplay = document.getElementById("mainDisplay");
const subDisplay  = document.getElementById("subDisplay");

let expression     = "";    // 현재 입력 중인 수식 문자열
let justCalculated = false; // 방금 = 을 눌렀지 여부

// 디스플레이 갱신 — main.js에서도 호출합니다 (수정 금지)
export const updateDisplay = () => {
    mainDisplay.textContent = expression || "0";
    mainDisplay.style.fontSize = expression.length > 10 ? "1.8rem" : "2.6rem";
};

export const appendNumber = (num) => {
    if (justCalculated) {
        expression = "";
    }

    const lastSegment = expression.split(/[+\-*/]/).pop();

    if (num === ".") {
        if (lastSegment.includes(".")) {
            justCalculated = false;
            updateDisplay();
            return;
        }
        if (expression === "" || /[+\-*/]$/.test(expression)) {
            expression += "0.";
        } else {
            expression += ".";
        }
    } else if (expression === "0") {
        expression = num;
    } else {
        expression += num;
    }

    justCalculated = false;
    updateDisplay();
};

export const appendOperator = (op) => {
    if (!expression) {
        return;
    }

    const lastChar = expression[expression.length - 1];
    if ("+-*/".includes(lastChar)) {
        expression = expression.slice(0, -1) + op;
    } else {
        expression += op;
    }

    justCalculated = false;
    updateDisplay();
};

export const calculate = () => {
    if (!expression || "+-*/".includes(expression[expression.length - 1])) {
        return null;
    }

    if (/\/0(?!\.?\d)/.test(expression)) {
        subDisplay.textContent = "0으로 나눌 수 없습니다";
        return null;
    }

    try {
        const raw = Function('"use strict"; return (' + expression + ')')();
        if (!Number.isFinite(raw)) {
            subDisplay.textContent = "0으로 나눌 수 없습니다";
            return null;
        }

        const result = parseFloat(raw.toFixed(10)).toString();
        const originalExpression = expression;

        mainDisplay.textContent = result;
        mainDisplay.style.fontSize = result.length > 10 ? "1.8rem" : "2.6rem";
        subDisplay.textContent = originalExpression + " =";
        justCalculated = true;
        expression = result;

        return { expression: originalExpression, result };
    } catch {
        return null;
    }
};

export const deleteLast = () => {
    if (justCalculated) {
        clearAll();
        return;
    }

    expression = expression.slice(0, -1);
    updateDisplay();
};

export const appendPercent = () => {
};

export const setExpression = (value) => {
};

export const clearAll = () => {
    expression     = "";
    justCalculated = false;
    mainDisplay.textContent    = "0";
    mainDisplay.style.fontSize = "2.6rem";
    subDisplay.textContent     = "";
    document.querySelectorAll(".btn-op").forEach(b => b.classList.remove("active"));
};
